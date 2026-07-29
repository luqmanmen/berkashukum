import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const NAVY = "#12294f";
const GOLD = "#cfa740";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://www.berkashukum.com";

/**
 * Kirim email resi pembayaran
 */
export async function sendPaymentReceiptEmail(
  buyerEmail: string,
  buyerName: string,
  orderId: string,
  totalAmount: number,
  type: "Produk" | "Konsultasi"
) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log("⚠️ SMTP tidak dikonfigurasi. Mock email resi ke", buyerEmail);
    return;
  }

  const mailOptions = {
    from: `"Berkas Hukum Corporate" <${process.env.SMTP_USER}>`,
    to: buyerEmail,
    subject: `✅ Resi Pembayaran Diterima - ${type} [${orderId.slice(-8).toUpperCase()}]`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: ${NAVY}; padding: 28px 30px; text-align: center;">
          <h1 style="color: ${GOLD}; margin: 0; font-size: 22px; letter-spacing: 1px;">BERKAS HUKUM CORPORATE</h1>
          <p style="color: rgba(255,255,255,0.6); margin: 6px 0 0; font-size: 11px; letter-spacing: 2px; text-transform: uppercase;">
            Advokat &bull; Kurator &bull; Spesialis Legal Audit
          </p>
        </div>
        <div style="padding: 32px 30px;">
          <h2 style="margin-top: 0; color: ${NAVY};">Halo, ${buyerName}! 👋</h2>
          <p style="line-height: 1.6;">
            Terima kasih! Kami ingin menginformasikan bahwa pembayaran Anda untuk <strong>${type}</strong> sebesar <strong>Rp ${totalAmount.toLocaleString("id-ID")}</strong> (Order ID: #${orderId.slice(-8).toUpperCase()}) <strong>telah kami verifikasi</strong>.
          </p>
          <p style="line-height: 1.6;">
            Detail mengenai ${type === "Produk" ? "kode unduhan produk" : "jadwal konsultasi"} Anda akan dikirimkan pada email yang terpisah.
          </p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="font-size: 13px; color: #888; line-height: 1.6;">
            Jika ada kendala, silakan hubungi kami di <a href="mailto:support@berkashukum.com" style="color: ${GOLD};">support@berkashukum.com</a>.
          </p>
        </div>
        <div style="background-color: #f7f8fa; padding: 16px 30px; text-align: center; font-size: 12px; color: #aaa; border-top: 1px solid #e2e8f0;">
          © ${new Date().getFullYear()} Berkas Hukum Corporate. All rights reserved.
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email resi pembayaran terkirim ke ${buyerEmail}`);
    return true;
  } catch (error) {
    console.error("Gagal mengirim email resi:", error);
    return false;
  }
}


/**
 * Kirim email ke pembeli setelah admin approve pesanan.
 */
export async function sendDownloadCodeEmail(
  buyerEmail: string,
  buyerName: string,
  orderId: string,
  downloadCode: string,
  productNames: string[]
) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log("⚠️ SMTP tidak dikonfigurasi. Mock email ke", buyerEmail);
    console.log("  Activation URL:", `${APP_URL}/download/${orderId}`);
    console.log("  Download Code :", downloadCode);
    return;
  }

  const activationUrl = `${APP_URL}/download/${orderId}`;
  const productsHtml = productNames
    .map((n) => `<li style="margin-bottom:4px;">📄 ${n}</li>`)
    .join("");

  const mailOptions = {
    from: `"Berkas Hukum Corporate" <${process.env.SMTP_USER}>`,
    to: buyerEmail,
    subject: `📦 Kode Unduhan Produk Anda [${orderId.slice(-8).toUpperCase()}]`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        
        <div style="background-color: ${NAVY}; padding: 28px 30px; text-align: center;">
          <h1 style="color: ${GOLD}; margin: 0; font-size: 22px; letter-spacing: 1px;">BERKAS HUKUM CORPORATE</h1>
          <p style="color: rgba(255,255,255,0.6); margin: 6px 0 0; font-size: 11px; letter-spacing: 2px; text-transform: uppercase;">
            Advokat &bull; Kurator &bull; Spesialis Legal Audit
          </p>
        </div>

        <div style="padding: 32px 30px;">
          <h2 style="margin-top: 0; color: ${NAVY};">Halo, ${buyerName}! 👋</h2>
          <p style="line-height: 1.6;">
            Berikut adalah rincian produk yang Anda pesan dan kode unduhan untuk mengaksesnya:
          </p>
          <ul style="padding-left: 18px; color: #555; line-height: 1.8;">
            ${productsHtml}
          </ul>

          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />

          <p style="margin-bottom: 8px; font-weight: bold; color: ${NAVY};">🔑 Kode Unduhan Anda:</p>
          <div style="background: #f5f0e8; border: 2px dashed ${GOLD}; border-radius: 8px; padding: 16px; text-align: center; margin-bottom: 16px;">
            <span style="font-family: monospace; font-size: 28px; font-weight: bold; color: ${NAVY}; letter-spacing: 4px;">
              ${downloadCode}
            </span>
          </div>
          <p style="color: #666; font-size: 13px; line-height: 1.6;">
            ⚠️ Simpan kode ini dengan aman. Kode ini bersifat <strong>pribadi dan tidak bisa digunakan oleh orang lain</strong>.
          </p>

          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />

          <p style="font-weight: bold; color: ${NAVY};">🔗 Link Halaman Unduhan (Permanent):</p>
          <p style="color: #666; font-size: 13px; margin-bottom: 16px; line-height: 1.6;">
            Klik tombol di bawah, lalu masukkan kode di atas untuk mendapatkan file unduhan Anda.
          </p>
          <div style="text-align: center; margin: 24px 0;">
            <a href="${activationUrl}"
               style="display: inline-block; background-color: ${GOLD}; color: ${NAVY}; text-decoration: none; padding: 14px 32px; font-weight: bold; border-radius: 4px; font-size: 15px; letter-spacing: 0.5px;">
              🔓 Akses Halaman Unduhan
            </a>
          </div>

          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="font-size: 13px; color: #888; line-height: 1.6;">
            Jika ada kendala, silakan hubungi kami di 
            <a href="mailto:support@berkashukum.com" style="color: ${GOLD};">support@berkashukum.com</a>.
          </p>

        </div>

        <div style="background-color: #f7f8fa; padding: 16px 30px; text-align: center; font-size: 12px; color: #aaa; border-top: 1px solid #e2e8f0;">
          © ${new Date().getFullYear()} Berkas Hukum Corporate. All rights reserved.
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email kode download terkirim ke ${buyerEmail}: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error("Gagal mengirim email:", error);
    return false;
  }
}


/**
 * Fungsi pembantu untuk memformat tanggal ke format kalender iCal (UTC)
 */
function formatDateToICalUTC(dateStr: string, timeStr: string, addHours: number = 0): string {
  // Asumsi input dari Jakarta (WIB, UTC+7)
  const [year, month, day] = dateStr.split("-").map(Number);
  const [hour, minute] = timeStr.split(":").map(Number);
  
  // Buat objek Date dengan menganggapnya zona waktu lokal (server/WIB)
  // Untuk memastikan konversi aman, kita ubah secara eksplisit dari UTC+7
  const localDate = new Date(Date.UTC(year, month - 1, day, hour - 7 + addHours, minute, 0));
  
  const yyyy = localDate.getUTCFullYear();
  const MM = String(localDate.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(localDate.getUTCDate()).padStart(2, '0');
  const hh = String(localDate.getUTCHours()).padStart(2, '0');
  const mm = String(localDate.getUTCMinutes()).padStart(2, '0');
  const ss = String(localDate.getUTCSeconds()).padStart(2, '0');
  
  return `${yyyy}${MM}${dd}T${hh}${mm}${ss}Z`;
}

/**
 * Kirim email undangan konsultasi Lawyer (Termasuk Calendar Invite / .ics file)
 */
export async function sendConsultationInvitationEmail(
  clientEmail: string,
  clientName: string,
  lawyerName: string,
  scheduleDate: string,
  scheduleTime: string,
  caseDescription: string,
  bookingId: string
) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log("⚠️ SMTP tidak dikonfigurasi. Mock email undangan ke", clientEmail);
    return;
  }

  // Generate Date formats untuk ICS (mulai dan berakhir, durasi default 1 jam)
  const dtStart = formatDateToICalUTC(scheduleDate, scheduleTime, 0);
  const dtEnd = formatDateToICalUTC(scheduleDate, scheduleTime, 1);
  const dtStamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  
  // Isi file .ics (iCalendar)
  const icsContent = 
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Berkas Hukum Corporate//Konsultasi//ID
CALSCALE:GREGORIAN
METHOD:REQUEST
BEGIN:VEVENT
UID:booking-${bookingId}@berkashukum.com
DTSTAMP:${dtStamp}
DTSTART:${dtStart}
DTEND:${dtEnd}
SUMMARY:Konsultasi Hukum dengan ${lawyerName}
DESCRIPTION:Konsultasi Hukum Berkas Hukum Corporate.\\nNama Klien: ${clientName}\\nKasus: ${caseDescription.replace(/\n/g, "\\n")}\\n\\nAdmin akan mengirimkan link meeting via WhatsApp.
LOCATION:Online Meeting
STATUS:CONFIRMED
BEGIN:VALARM
TRIGGER:-PT15M
ACTION:DISPLAY
DESCRIPTION:Konsultasi Hukum akan dimulai dalam 15 menit
END:VALARM
END:VEVENT
END:VCALENDAR`;

  const mailOptions = {
    from: `"Berkas Hukum Corporate" <${process.env.SMTP_USER}>`,
    to: clientEmail,
    subject: `📅 Detail Jadwal Konsultasi Hukum - ${lawyerName} [${new Date(scheduleDate).toLocaleDateString("id-ID")}]`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        
        <div style="background-color: ${NAVY}; padding: 28px 30px; text-align: center;">
          <h1 style="color: ${GOLD}; margin: 0; font-size: 22px; letter-spacing: 1px;">BERKAS HUKUM CORPORATE</h1>
          <p style="color: rgba(255,255,255,0.6); margin: 6px 0 0; font-size: 11px; letter-spacing: 2px; text-transform: uppercase;">
            Advokat &bull; Kurator &bull; Spesialis Legal Audit
          </p>
        </div>

        <div style="padding: 32px 30px;">
          <h2 style="margin-top: 0; color: ${NAVY};">Halo, ${clientName}! 👋</h2>
          <p style="line-height: 1.6;">
            Jadwal Konsultasi Hukum Anda telah dikonfirmasi oleh tim kami. 
            Berikut adalah rincian jadwal Anda:
          </p>
          
          <div style="background: #f8fafc; border-left: 4px solid ${GOLD}; padding: 16px; margin: 20px 0;">
            <p style="margin: 0 0 8px;">👨‍⚖️ <strong>Lawyer:</strong> ${lawyerName}</p>
            <p style="margin: 0 0 8px;">📅 <strong>Tanggal:</strong> ${new Date(scheduleDate).toLocaleDateString("id-ID", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p style="margin: 0 0 8px;">⏰ <strong>Jam:</strong> ${scheduleTime} WIB</p>
            <p style="margin: 0;">📝 <strong>Topik:</strong> ${caseDescription}</p>
          </div>

          <p style="color: #666; font-size: 14px; line-height: 1.6;">
            Silakan buka <strong>lampiran kalender (invite.ics)</strong> pada email ini untuk menambahkan pengingat (reminder) otomatis ke Google Calendar atau Apple Calendar di perangkat Anda.
          </p>

          <p style="color: #666; font-size: 14px; line-height: 1.6; margin-top: 24px;">
            Link pertemuan online (Zoom/Google Meet) akan dikirimkan oleh admin kami melalui WhatsApp sebelum jadwal dimulai. Pastikan nomor WhatsApp Anda aktif.
          </p>

          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="font-size: 13px; color: #888; line-height: 1.6;">
            Jika ada pertanyaan atau ingin mengubah jadwal, silakan balas email ini atau hubungi admin di 
            <a href="mailto:support@berkashukum.com" style="color: ${GOLD};">support@berkashukum.com</a>.
          </p>
        </div>

        <div style="background-color: #f7f8fa; padding: 16px 30px; text-align: center; font-size: 12px; color: #aaa; border-top: 1px solid #e2e8f0;">
          © ${new Date().getFullYear()} Berkas Hukum Corporate. All rights reserved.
        </div>
      </div>
    `,
    attachments: [
      {
        filename: "undangan-konsultasi.ics",
        content: icsContent,
        contentType: 'text/calendar; method=REQUEST'
      }
    ]
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email undangan konsultasi terkirim ke ${clientEmail}: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error("Gagal mengirim email undangan:", error);
    return false;
  }
}

/**
 * Kirim email pengingat (reminder) konsultasi pada hari-H
 */
export async function sendConsultationReminderEmail(
  clientEmail: string,
  clientName: string,
  lawyerName: string,
  scheduleDate: string,
  scheduleTime: string,
  caseDescription: string,
  bookingId: string
) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log("⚠️ SMTP tidak dikonfigurasi. Mock email reminder ke", clientEmail);
    return;
  }

  const mailOptions = {
    from: `"Berkas Hukum Corporate" <${process.env.SMTP_USER}>`,
    to: clientEmail,
    subject: `⏰ Pengingat: Jadwal Konsultasi Hukum Hari Ini - ${lawyerName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: ${NAVY}; padding: 28px 30px; text-align: center;">
          <h1 style="color: ${GOLD}; margin: 0; font-size: 22px; letter-spacing: 1px;">BERKAS HUKUM CORPORATE</h1>
        </div>
        <div style="padding: 32px 30px;">
          <h2 style="margin-top: 0; color: ${NAVY};">Halo, ${clientName}! 👋</h2>
          <p style="line-height: 1.6;">
            Kami ingin mengingatkan bahwa Anda memiliki <strong>Jadwal Konsultasi Hukum pada HARI INI</strong>.
          </p>
          <div style="background: #f8fafc; border-left: 4px solid ${GOLD}; padding: 16px; margin: 20px 0;">
            <p style="margin: 0 0 8px;">👨‍⚖️ <strong>Lawyer:</strong> ${lawyerName}</p>
            <p style="margin: 0 0 8px;">📅 <strong>Tanggal:</strong> ${new Date(scheduleDate).toLocaleDateString("id-ID", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p style="margin: 0 0 8px;">⏰ <strong>Jam:</strong> ${scheduleTime} WIB</p>
            <p style="margin: 0;">📝 <strong>Topik:</strong> ${caseDescription}</p>
          </div>
          <p style="color: #666; font-size: 14px; line-height: 1.6;">
            Mohon persiapkan diri dan dokumen yang relevan. Admin kami akan segera menghubungi Anda via WhatsApp untuk memberikan link/akses pertemuan sebelum sesi dimulai.
          </p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="font-size: 13px; color: #888; line-height: 1.6;">
            Jika ada kendala, hubungi kami di <a href="mailto:support@berkashukum.com" style="color: ${GOLD};">support@berkashukum.com</a>.
          </p>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email reminder terkirim ke ${clientEmail}: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error("Gagal mengirim email reminder:", error);
    return false;
  }
}
