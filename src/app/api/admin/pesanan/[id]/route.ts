import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { sendDownloadCodeEmail } from "@/lib/email";

/** Generate kode unik format: BHK-XXXX-XXXX */
function generateDownloadCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // hindari 0/O/1/I yang membingungkan
  const rand = (n: number) =>
    Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `BHK-${rand(4)}-${rand(4)}`;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    // Jika admin menandai sebagai PAID, generate kode download unik
    if (body.status === "PAID") {
      // Ambil data order lengkap untuk email
      const order = await prisma.order.findUnique({
        where: { id },
        include: { items: { include: { product: true } } },
      });

      if (!order) {
        return NextResponse.json({ error: "Order tidak ditemukan" }, { status: 404 });
      }

      // Generate kode unik (pastikan belum ada yang sama)
      let downloadCode = generateDownloadCode();
      let tries = 0;
      while (tries < 5) {
        const existing = await prisma.order.findFirst({ where: { downloadCode } });
        if (!existing) break;
        downloadCode = generateDownloadCode();
        tries++;
      }

      // Update order: set status PAID + simpan downloadCode
      await prisma.order.update({
        where: { id },
        data: { status: "PAID", downloadCode },
      });

      // Kirim email ke pembeli berisi kode & link aktivasi
      const productNames = order.items.map((item) => item.product.name);
      await sendDownloadCodeEmail(
        order.buyerEmail,
        order.buyerName,
        order.id,
        downloadCode,
        productNames
      );

      return NextResponse.json({ status: "OK", downloadCode });
    }

    // Status lain (EXPIRED, REFUND, dll) — update biasa tanpa generate kode
    await prisma.order.update({
      where: { id },
      data: { status: body.status },
    });

    return NextResponse.json({ status: "OK" });
  } catch (error: any) {
    console.error("Update order error:", error);
    return NextResponse.json({ error: "Gagal update pesanan" }, { status: 500 });
  }
}
