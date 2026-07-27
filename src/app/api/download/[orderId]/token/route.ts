export const runtime = "edge";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SignJWT } from "jose";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const body = await req.json();
    const { downloadCode } = body;

    if (!downloadCode) {
      return NextResponse.json({ error: "Kode unduhan wajib diisi" }, { status: 400 });
    }

    // Cari order berdasarkan ID
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { product: true } } },
    });

    if (!order) {
      return NextResponse.json({ error: "Order tidak ditemukan" }, { status: 404 });
    }

    if (order.status !== "PAID") {
      return NextResponse.json({ error: "Order belum lunas atau sudah expired" }, { status: 403 });
    }

    if (order.downloadCode !== downloadCode) {
      return NextResponse.json({ error: "Kode unduhan tidak valid" }, { status: 401 });
    }

    // Kode benar, order PAID.
    // Buat signed JWT (10 menit) yang menyimpan informasi produk mana saja yang boleh didownload
    const secret = new TextEncoder().encode(process.env.DOWNLOAD_SECRET || "fallback_secret_only_for_dev_very_insecure");
    
    // Kita list produknya untuk dikasih link di JWT
    const products = order.items
      .filter((item) => item.product.digitalFile) // pastikan ada file digital
      .map((item) => ({
        id: item.product.id,
        name: item.product.name,
        fileUrl: item.product.digitalFile,
      }));

    if (products.length === 0) {
      return NextResponse.json({ error: "Tidak ada file digital untuk pesanan ini" }, { status: 404 });
    }

    const token = await new SignJWT({ orderId: order.id, products })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("10m") // Aktif 10 menit
      .sign(secret);

    return NextResponse.json({ token, products });
  } catch (error) {
    console.error("Generate token error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan sistem" }, { status: 500 });
  }
}
