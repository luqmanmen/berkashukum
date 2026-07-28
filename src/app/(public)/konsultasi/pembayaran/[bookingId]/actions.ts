"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function uploadBookingPaymentProof(formData: FormData) {
  const bookingId = formData.get("bookingId") as string;
  const paymentMethod = formData.get("paymentMethod") as string;
  const bankName = formData.get("bankName") as string;
  const proofFile = formData.get("proof") as File;

  if (!proofFile || proofFile.size === 0) {
    throw new Error("File bukti transfer tidak ditemukan.");
  }

  const ext = proofFile.name.split('.').pop();
  const fileName = `booking-proof-${Date.now()}.${ext}`;
  
  const { supabase } = await import("@/lib/supabase");
  
  const { data, error } = await supabase.storage
    .from("images")
    .upload(`payments/${fileName}`, proofFile, {
      cacheControl: "3600",
      upsert: false
    });

  if (error) {
    console.error("Supabase upload error:", error);
    throw new Error("Gagal mengunggah bukti pembayaran.");
  }

  const { data: publicUrlData } = supabase.storage
    .from("images")
    .getPublicUrl(`payments/${fileName}`);

  await prisma.consultationBooking.update({
    where: { id: bookingId },
    data: {
      paymentProof: publicUrlData.publicUrl,
      paymentMethod,
      bankName,
    }
  });

  revalidatePath(`/konsultasi/pembayaran/${bookingId}`);
}
