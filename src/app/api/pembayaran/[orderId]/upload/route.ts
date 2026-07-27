import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
  try {
    const { orderId } = await params;
    const body = await req.json();
    const { proofUrl } = body;

    if (!proofUrl) {
      return NextResponse.json({ error: "Proof URL is required" }, { status: 400 });
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { 
        paymentProof: proofUrl,
      },
    });

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error("Upload proof error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
