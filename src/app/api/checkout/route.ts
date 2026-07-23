import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";
import MidtransClient from "midtrans-client";

const snap = new MidtransClient.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === "true",
  serverKey: process.env.MIDTRANS_SERVER_KEY || "",
  clientKey: process.env.MIDTRANS_CLIENT_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, totalAmount, buyerName, buyerEmail, buyerPhone, notes } = body;

    if (!items?.length || !buyerName || !buyerEmail || !buyerPhone) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    // Generate unique Order ID (tiket style)
    const orderId = `LX-${nanoid(8).toUpperCase()}`;

    // Create order in DB
    const order = await prisma.order.create({
      data: {
        id: orderId,
        totalAmount,
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

    // Create Midtrans transaction
    const transactionDetails = {
      transaction_details: {
        order_id: orderId,
        gross_amount: totalAmount,
      },
      item_details: items.map((item: any) => ({
        id: item.id,
        price: item.price,
        quantity: item.quantity,
        name: item.name.slice(0, 50),
      })),
      customer_details: {
        first_name: buyerName,
        email: buyerEmail,
        phone: buyerPhone,
      },
    };

    const transaction = await snap.createTransaction(transactionDetails);

    // Save payment token
    await prisma.order.update({
      where: { id: orderId },
      data: { paymentId: transaction.token },
    });

    return NextResponse.json({
      orderId,
      token: transaction.token,
      redirectUrl: transaction.redirect_url,
    });
  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: error.message || "Terjadi kesalahan saat checkout" },
      { status: 500 }
    );
  }
}
