import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, totalAmount, buyerName, buyerEmail, buyerPhone, notes } = body;

    if (!items?.length || !buyerName || !buyerEmail || !buyerPhone) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    // Generate unique Order ID (tiket style)
    const orderId = `LX-${nanoid(8).toUpperCase()}`;

    // Generate 3 digit unique code (1-999) for Moota automatic verification
    const uniqueCode = Math.floor(Math.random() * 999) + 1;
    const finalAmount = totalAmount + uniqueCode;

    // Create order in DB
    const order = await prisma.order.create({
      data: {
        id: orderId,
        totalAmount: finalAmount,
        status: "PENDING",
        buyerName,
        buyerEmail,
        buyerPhone,
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
