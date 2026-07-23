import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendOrderSuccessEmail(
  buyerEmail: string,
  buyerName: string,
  orderId: string,
  items: Array<{ name: string; url: string }>
) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log("⚠️ SMTP tidak dikonfigurasi. Abaikan pengiriman email ke", buyerEmail);
    console.log("Mock Links:", items);
    return;
  }

  const itemsHtml = items
    .map(
      (item) => `
    <div style="margin-bottom: 15px; padding: 15px; border: 1px solid #e2e8f0; border-radius: 5px;">
      <h3 style="margin-top: 0; color: #0a1628;">${item.name}</h3>
      <a href="${item.url}" style="display: inline-block; background-color: #c9a84c; color: #0a1628; text-decoration: none; padding: 10px 20px; font-weight: bold; border-radius: 3px;">
        📥 Download File
      </a>
    </div>
  `
    )
    .join("");

  const mailOptions = {
    from: `"LexNova Law Firm" <${process.env.SMTP_USER}>`,
    to: buyerEmail,
    subject: `Pesanan Berhasil [${orderId}] - Download Produk Anda`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <div style="background-color: #0a1628; padding: 20px; text-align: center;">
          <h1 style="color: #c9a84c; margin: 0;">LexNova</h1>
        </div>
        <div style="padding: 30px; border: 1px solid #e2e8f0; border-top: none;">
          <h2>Halo, ${buyerName}!</h2>
          <p>Terima kasih telah berbelanja di LexNova Law Firm. Pembayaran Anda untuk pesanan <strong>${orderId}</strong> telah berhasil kami terima.</p>
          <p>Berikut adalah tautan untuk mengunduh produk digital Anda:</p>
          
          <div style="margin: 30px 0;">
            ${itemsHtml}
          </div>
          
          <p><em>* Tautan di atas adalah tautan aman. Harap tidak membagikannya ke pihak lain tanpa izin.</em></p>
          <p>Jika ada pertanyaan atau kendala, silakan hubungi tim dukungan kami di info@lexnova.co.id</p>
        </div>
        <div style="text-align: center; padding: 20px; font-size: 12px; color: #666;">
          © ${new Date().getFullYear()} LexNova Law Firm. Semua Hak Dilindungi.
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email terkirim ke ${buyerEmail}: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error("Gagal mengirim email:", error);
    return false;
  }
}
