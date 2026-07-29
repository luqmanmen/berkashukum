import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, totalAmount, buyerName, buyerEmail, buyerPhone, notes, paymentMethod, bankName } = body;

    if (!items?.length || !buyerName || !buyerEmail || !buyerPhone || !paymentMethod) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    // Check if user already has a pending order
    const existingOrder = await prisma.order.findFirst({
      where: {
        status: "PENDING",
        OR: [
          { buyerEmail },
          { buyerPhone }
        ],
        expiresAt: {
          gt: new Date()
        }
      }
    });

    if (existingOrder) {
      // Batalkan otomatis pesanan yang lama agar user bisa mengganti metode pembayaran
      await prisma.order.update({
        where: { id: existingOrder.id },
        data: { status: "EXPIRED" }
      });
    }

    // Generate unique Order ID (tiket style)
    const orderId = `LX-${nanoid(8).toUpperCase()}`;

    // Generate 3 digit unique code (1-999) for Moota automatic verification
    const uniqueCode = Math.floor(Math.random() * 999) + 1;
    const finalAmount = totalAmount + uniqueCode;

    // Set expiration 24 hours from now
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    // Create order in DB
    const order = await prisma.order.create({
      data: {
        id: orderId,
        totalAmount: finalAmount,
        status: "PENDING",
        buyerName,
        buyerEmail,
        buyerPhone,
        paymentMethod,
        bankName,
        expiresAt,
        items: {
          create: items.map((item: any) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });

    return NextResponse.json({
      orderId,
      finalAmount,
      message: "Pesanan berhasil dibuat. Silakan transfer sesuai nominal unik."
    });
  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: error.message || "Terjadi kesalahan saat checkout" },
      { status: 500 }
    );
  }
}
