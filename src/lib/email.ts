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
 * Kirim email ke pembeli setelah admin approve pesanan.
 * Email berisi:
 *  - Kode unik (downloadCode) yang harus dimasukkan di halaman aktivasi
 *  - Link permanen ke halaman aktivasi (/download/[orderId])
 *  - Penjelasan bahwa link download aktif hanya 10 menit setelah input kode
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
    subject: `✅ Pesanan Disetujui — Kode Unduhan Anda [${orderId.slice(-8).toUpperCase()}]`,
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
            Pembayaran Anda untuk pesanan <strong>#${orderId.slice(-8).toUpperCase()}</strong> telah kami konfirmasi.
            Berikut adalah produk yang Anda beli:
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
            Klik tombol di bawah, lalu masukkan kode di atas untuk mendapatkan link unduhan.
            <strong>Link unduhan berlaku 10 menit</strong> — tidak bisa disalin atau dibagikan.
          </p>
          <div style="text-align: center; margin: 24px 0;">
            <a href="${activationUrl}"
               style="display: inline-block; background-color: ${GOLD}; color: ${NAVY}; text-decoration: none; padding: 14px 32px; font-weight: bold; border-radius: 4px; font-size: 15px; letter-spacing: 0.5px;">
              🔓 Akses Halaman Unduhan
            </a>
          </div>
          <p style="text-align: center; font-size: 11px; color: #bbb; word-break: break-all;">
            ${activationUrl}
          </p>

          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="font-size: 13px; color: #888; line-height: 1.6;">
            Jika ada kendala, silakan hubungi kami di 
            <a href="mailto:luqmanarifsby@gmail.com" style="color: ${GOLD};">luqmanarifsby@gmail.com</a>.
          </p>

          <!-- Signature Block -->
          <table cellpadding="0" cellspacing="0" border="0" style="margin-top: 40px; border-top: 1px dashed #e2e8f0; padding-top: 24px; width: 100%;">
            <tr>
              <td width="80" valign="top" style="padding-right: 16px;">
                <img src="${APP_URL}/images/logo2.png" alt="Luqman Arif" width="80" height="80" style="border-radius: 50%; object-fit: cover; border: 2px solid ${GOLD}; display: block;" />
              </td>
              <td valign="top">
                <h3 style="margin: 0 0 4px 0; color: ${NAVY}; font-size: 18px; letter-spacing: 0.5px;">Luqman Arif S.I.Kom</h3>
                <p style="margin: 0 0 8px 0; color: ${GOLD}; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">
                  Advokat &bull; Kurator &bull; Spesialis Legal Audit
                </p>
                <table cellpadding="0" cellspacing="0" border="0" style="font-size: 12px; color: #555; line-height: 1.6;">
                  <tr>
                    <td width="20" style="color: ${NAVY}; font-weight: bold;">WA</td>
                    <td>: <a href="https://wa.me/6282334196500" style="color: #555; text-decoration: none;">+62 823-3419-6500</a></td>
                  </tr>
                  <tr>
                    <td style="color: ${NAVY}; font-weight: bold;">EM</td>
                    <td>: <a href="mailto:luqmanarifsby@gmail.com" style="color: #555; text-decoration: none;">luqmanarifsby@gmail.com</a></td>
                  </tr>
                  <tr>
                    <td style="color: ${NAVY}; font-weight: bold;">WEB</td>
                    <td>: <a href="${APP_URL}" style="color: ${GOLD}; text-decoration: none;">www.berkashukum.com</a></td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          <!-- End Signature -->

        </div>

        <div style="background-color: #f7f8fa; padding: 16px 30px; text-align: center; font-size: 12px; color: #aaa; border-top: 1px solid #e2e8f0;">
          © ${new Date().getFullYear()} Luqman Arif S.I.Kom. Seluruh hak cipta dilindungi.
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
