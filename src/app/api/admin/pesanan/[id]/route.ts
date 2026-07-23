import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

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
