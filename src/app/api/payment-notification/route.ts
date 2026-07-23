import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      transaction_status,
      order_id,
      payment_type,
      fraud_status,
    } = body;

    // Map Midtrans status to our status
    let status = "PENDING";

    if (transaction_status === "capture") {
      status = fraud_status === "accept" ? "PAID" : "PENDING";
    } else if (transaction_status === "settlement") {
      status = "PAID";
    } else if (["cancel", "deny", "expire"].includes(transaction_status)) {
      status = "EXPIRED";
    } else if (transaction_status === "refund") {
      status = "REFUND";
    }

    await prisma.order.update({
      where: { id: order_id },
      data: { status },
    });

    return NextResponse.json({ status: "OK" });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
