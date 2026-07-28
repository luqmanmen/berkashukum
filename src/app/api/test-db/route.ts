import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const users = await prisma.user.findMany();
  const session = await getServerSession(authOptions);
  return NextResponse.json({ users, session });
}
