import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Booking Diproses - Berkas Hukum Corporate",
  description: "Jadwal konsultasi Anda sedang diproses oleh admin kami.",
};

export default function KonsultasiStatusDiprosesPage() {
  return (
    <section className="pt-32 pb-20 min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center p-8 bg-white shadow-lg rounded-xl max-w-md w-full mx-4 border-t-4 border-gold">
        <div className="text-6xl mb-6">⏳</div>
        <h1 className="text-2xl font-bold font-serif text-navy mb-3">Booking Sedang Diproses</h1>
        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
          Terima kasih! Pembayaran Anda sudah kami terima informasinya dan saat ini sedang diverifikasi oleh admin kami.
          <br /><br />
          Setelah pembayaran valid, jadwal konsultasi Anda akan segera disetujui. Mohon menunggu konfirmasi dari kami melalui WhatsApp.
        </p>
        
        <div className="bg-cream rounded-lg p-4 mb-8">
          <p className="text-navy-dark font-semibold text-sm mb-2">
            Butuh bantuan lebih lanjut?
          </p>
          <p className="text-xs text-gray-500">
            Tim admin kami siap membantu Anda kapan saja.
          </p>
        </div>

        <Link href="/konsultasi" className="btn-gold px-8 py-3.5 rounded-sm font-bold text-sm block w-full hover-glow transition-all">
          Kembali ke Konsultasi
        </Link>
      </div>
    </section>
  );
}
