import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendConsultationReminderEmail } from "@/lib/email";

export async function GET(request: Request) {
  try {
    // Keamanan dasar untuk memastikan cron job dipanggil secara resmi.
    // Jika di Vercel, cron otomatis mengirim auth header bawaan jika disetup rahasia,
    // namun untuk amannya kita tidak mewajibkan token sementara agar bisa ditest via URL.
    
    // Ambil tanggal hari ini format YYYY-MM-DD
    const today = new Date();
    // Gunakan UTC+7 (WIB)
    const jakartaTime = new Date(today.getTime() + (7 * 60 * 60 * 1000));
    const dateString = jakartaTime.toISOString().split("T")[0]; // "YYYY-MM-DD"

    console.log(`[Cron] Mencari jadwal konsultasi PAID untuk tanggal: ${dateString}`);

    // Cari booking berstatus PAID yang jadwalnya HARI INI
    const bookings = await prisma.consultationBooking.findMany({
      where: {
        status: "PAID",
        scheduleDate: dateString
      },
      include: {
        lawyer: true
      }
    });

    let successCount = 0;

    for (const booking of bookings) {
      const sent = await sendConsultationReminderEmail(
        booking.clientEmail,
        booking.clientName,
        booking.lawyer.name,
        booking.scheduleDate,
        booking.scheduleTime,
        booking.caseDescription || "Konsultasi Hukum",
        booking.id
      );
      if (sent) successCount++;
    }

    return NextResponse.json({ 
      success: true, 
      date: dateString,
      total_found: bookings.length,
      emails_sent: successCount
    });
  } catch (error: any) {
    console.error("Cron Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
