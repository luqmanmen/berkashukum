import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function GET() {
  const host = process.env.SMTP_HOST || "kosong";
  const port = process.env.SMTP_PORT || "kosong";
  const user = process.env.SMTP_USER || "kosong";
  // Jangan tampilkan password utuh demi keamanan
  const pass = process.env.SMTP_PASS ? "***" + process.env.SMTP_PASS.slice(-3) : "kosong";

  if (host === "kosong" || user === "kosong") {
    return NextResponse.json({
      sukses: false,
      pesan: "Environment variables untuk SMTP belum terbaca oleh server.",
      config: { host, port, user, pass }
    });
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    // Tambahkan timeout agar tidak hang jika server salah
    connectionTimeout: 10000, 
  });

  try {
    // Coba verifikasi koneksi ke Titan (login)
    await transporter.verify();
    
    // Jika lolos verify, coba kirim email ke diri sendiri
    const info = await transporter.sendMail({
      from: `"Test Berkas Hukum" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER, // Kirim ke diri sendiri
      subject: "Test Koneksi SMTP Titan Mail",
      text: "Jika email ini masuk, berarti koneksi SMTP dari Netlify ke Titan Mail sudah 100% SUKSES!",
    });

    return NextResponse.json({
      sukses: true,
      pesan: "Koneksi SMTP berhasil! Email test telah dikirim.",
      messageId: info.messageId,
      config: { host, port, user, pass }
    });

  } catch (error: any) {
    return NextResponse.json({
      sukses: false,
      pesan: "Gagal terhubung ke server Titan Mail. Lihat detail error di bawah.",
      errorDetail: error.message || error.toString(),
      config: { host, port, user, pass }
    });
  }
}
