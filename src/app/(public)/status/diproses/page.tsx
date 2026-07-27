import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pesanan Diproses - Berkas Hukum Corporate",
  description: "Pesanan Anda sedang diproses oleh admin kami.",
};

export default function StatusDiprosesPage() {
  return (
    <section className="pt-32 pb-20 min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center p-8 bg-white shadow-lg rounded-xl max-w-md w-full mx-4 border-t-4 border-gold">
        <div className="text-6xl mb-6">⏳</div>
        <h1 className="text-2xl font-bold font-serif text-navy mb-3">Pesanan Sedang Diproses</h1>
        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
          Terima kasih! Pesanan Anda sudah masuk dan saat ini sedang diproses oleh admin kami.
          <br /><br />
          Jika pembayaran valid, link unduhan produk akan segera dikirimkan ke email Anda. Mohon cek kotak masuk atau folder spam Anda secara berkala.
        </p>
        
        <div className="bg-cream rounded-lg p-4 mb-8">
          <p className="text-navy-dark font-semibold text-sm mb-2">
            Ingin tambah template dokumen lain?
          </p>
          <p className="text-xs text-gray-500">
            Jelajahi koleksi lengkap dokumen legal kami.
          </p>
        </div>

        <Link href="/produk" className="btn-gold px-8 py-3.5 rounded-sm font-bold text-sm block w-full hover-glow transition-all">
          Lanjutkan Belanja
        </Link>
      </div>
    </section>
  );
}
