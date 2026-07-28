"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function updateBookingStatus(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  const id = formData.get("id") as string;
  const status = formData.get("status") as string;

  await prisma.consultationBooking.update({
    where: { id },
    data: { status }
  });

  revalidatePath("/admin/jadwal-konsultasi");
}
