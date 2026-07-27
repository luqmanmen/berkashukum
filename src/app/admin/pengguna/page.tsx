export const runtime = "edge";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import PenggunaClient from "./PenggunaClient";

export default async function AdminPenggunaPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/auth/login");
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    }
  });

  return (
    <PenggunaClient 
      initialUsers={users} 
      currentUserRole={session.user.role} 
      currentUserId={session.user.id} 
    />
  );
}
