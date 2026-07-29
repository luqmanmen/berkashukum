"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

import { sendConsultationInvitationEmail, sendPaymentReceiptEmail } from "@/lib/email";

export async function updateBookingStatus(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  const id = formData.get("id") as string;
  const status = formData.get("status") as string;

  // Cek apakah status berubah menjadi PAID
  if (status === "PAID") {
    // Ambil data lengkap booking beserta nama lawyer
    const booking = await prisma.consultationBooking.findUnique({
      where: { id },
      include: { lawyer: true }
    });

    if (booking && booking.status !== "PAID") { // Mencegah email ganda jika sudah PAID
      // Kirim email resi pembayaran
      await sendPaymentReceiptEmail(
        booking.clientEmail,
        booking.clientName,
        booking.id,
        booking.totalAmount,
        "Konsultasi"
      );

      // Kirim email detail/undangan konsultasi
      await sendConsultationInvitationEmail(
        booking.clientEmail,
        booking.clientName,
        booking.lawyer.name,
        booking.scheduleDate, // "YYYY-MM-DD"
        booking.scheduleTime, // "HH:MM"
        booking.caseDescription || "Konsultasi Hukum",
        booking.id
      );
    }
  }

  await prisma.consultationBooking.update({
    where: { id },
    data: { status }
  });

  revalidatePath("/admin/jadwal-konsultasi");
}
