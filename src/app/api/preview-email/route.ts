import { NextResponse } from "next/server";

export async function GET() {
  const NAVY = "#12294f";
  const GOLD = "#cfa740";
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://www.berkashukum.com";

  const html = `
    <html>
      <body style="background-color: #f0f2f5; padding: 40px; margin: 0;">
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; background: white;">
        
        <div style="padding: 32px 30px;">
          <h2 style="margin-top: 0; color: ${NAVY};">Preview Tanda Tangan Email</h2>
          <p style="color: #666; font-size: 13px; line-height: 1.6;">
            Ini adalah simulasi bagian paling bawah dari email yang akan dikirim ke klien.
          </p>

          <!-- Signature Block -->
          <table cellpadding="0" cellspacing="0" border="0" style="margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 24px; width: 100%;">
            <tr>
              <td valign="middle" style="padding-right: 20px;">
                <h3 style="margin: 0 0 4px 0; color: ${NAVY}; font-size: 16px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">Berkas Hukum Corporate</h3>
                <p style="margin: 0 0 12px 0; color: #888; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">
                  Advokat &bull; Kurator &bull; Spesialis Legal Audit
                </p>
                <table cellpadding="0" cellspacing="0" border="0" style="font-size: 11px; color: #555; line-height: 1.8;">
                  <tr>
                    <td valign="top" style="padding-right: 6px; padding-bottom: 4px;"><span style="color: ${GOLD};">📞</span></td>
                    <td valign="top" style="padding-bottom: 4px;">
                      <a href="https://wa.me/6281296393972" style="color: #555; text-decoration: none; white-space: nowrap;">+62 812-9639-3972</a><br/>
                      <a href="https://wa.me/6285771123000" style="color: #555; text-decoration: none; white-space: nowrap;">+62 857-7112-3000</a>
                    </td>
                  </tr>
                  <tr>
                    <td valign="top" style="padding-right: 6px;"><span style="color: ${GOLD};">✉️</span></td>
                    <td valign="top"><a href="mailto:support@berkashukum.com" style="color: #555; text-decoration: none; white-space: nowrap;">support@berkashukum.com</a></td>
                  </tr>
                  <tr>
                    <td valign="top" style="padding-right: 6px;"><span style="color: ${GOLD};">🌐</span></td>
                    <td valign="top"><a href="${APP_URL}" style="color: ${NAVY}; text-decoration: none; white-space: nowrap;">www.berkashukum.com</a></td>
                  </tr>
                </table>
              </td>
              <td width="90" valign="middle" style="border-left: 1px solid #e2e8f0; padding-left: 15px; text-align: center;">
                <img src="${APP_URL}/images/logo-3d-2.png" alt="Berkas Hukum Corporate" width="70" height="70" style="object-fit: contain; display: block; margin: 0 auto; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));" />
              </td>
            </tr>
          </table>
          <!-- End Signature -->

        </div>

        <div style="background-color: #f7f8fa; padding: 16px 30px; text-align: center; font-size: 12px; color: #aaa; border-top: 1px solid #e2e8f0;">
          © ${new Date().getFullYear()} Berkas Hukum Corporate. All rights reserved.
        </div>
      </div>
      </body>
    </html>
  `;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html",
    },
  });
}
