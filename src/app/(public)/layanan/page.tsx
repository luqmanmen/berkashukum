import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Layanan Hukum | LexNova Law Firm",
  description: "Layanan hukum komprehensif dari LexNova: hukum bisnis, keluarga, pidana, properti, tenaga kerja, dan penyelesaian sengketa.",
};

const services = [
  {
    icon: "⚖️",
    title: "Hukum Bisnis & Korporasi",
    desc: "Kami menyediakan pendampingan hukum komprehensif untuk perusahaan dari berbagai skala – mulai dari startup hingga perusahaan multinasional.",
    details: [
      "Pendirian & Pembubaran Perusahaan",
      "Merger, Akuisisi & Restrukturisasi",
      "Kontrak Bisnis & Due Diligence",
      "Kepatuhan Korporasi & GCG",
      "Perizinan Usaha & Regulasi",
      "Hukum Persaingan Usaha",
    ],
  },
  {
    icon: "🏠",
    title: "Hukum Keluarga & Waris",
    desc: "Menangani permasalahan hukum keluarga dengan pendekatan yang sensitif, profesional, dan berorientasi pada solusi terbaik.",
    details: [
      "Perceraian & Gugatan Cerai",
      "Hak Asuh Anak",
      "Pernikahan & Perjanjian Pranikah",
      "Pembagian Harta Warisan",
      "Adopsi Anak",
      "Perwalian & Kurasi",
    ],
  },
  {
    icon: "⚡",
    title: "Hukum Pidana",
    desc: "Tim pengacara pidana kami berpengalaman dalam menangani berbagai kasus mulai dari tingkat penyidikan hingga Mahkamah Agung.",
    details: [
      "Pembelaan Tersangka & Terdakwa",
      "Pendampingan Penyidikan",
      "Korupsi & Tindak Pidana Khusus",
      "Kejahatan Perbankan & Keuangan",
      "Cybercrime & Kejahatan Digital",
      "Praperadilan & Banding",
    ],
  },
  {
    icon: "🏢",
    title: "Hukum Properti & Real Estate",
    desc: "Memberikan kepastian hukum dalam setiap transaksi dan pengembangan properti Anda.",
    details: [
      "Jual Beli Properti",
      "Sertifikasi & Balik Nama",
      "Sengketa Tanah & Batas",
      "Pengembangan Real Estate",
      "KPR & Pembiayaan Properti",
      "Strata Title & Apartemen",
    ],
  },
  {
    icon: "👷",
    title: "Hukum Tenaga Kerja",
    desc: "Mengawal hubungan industrial yang harmonis antara pengusaha dan karyawan sesuai peraturan ketenagakerjaan.",
    details: [
      "Kontrak Kerja & PKWT",
      "PHK & Pesangon",
      "Perselisihan Hubungan Industrial",
      "Upah & Tunjangan",
      "K3 & Keselamatan Kerja",
      "Outsourcing & Alih Daya",
    ],
  },
  {
    icon: "🤝",
    title: "Penyelesaian Sengketa",
    desc: "Menyelesaikan sengketa bisnis dan perdata melalui jalur mediasi, arbitrase, maupun litigasi di pengadilan.",
    details: [
      "Mediasi & Negosiasi",
      "Arbitrase BANI & ICC",
      "Litigasi Perdata",
      "Class Action",
      "Eksekusi Putusan",
      "Sengketa Kontrak",
    ],
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-navy-dark overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c9a84c' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gold text-sm font-semibold tracking-widest uppercase mb-3">Bidang Praktik</p>
          <h1 className="font-serif text-5xl sm:text-6xl font-bold text-white mb-5">Layanan Hukum Kami</h1>
          <div className="gold-divider mx-auto mb-5" />
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Kami menyediakan solusi hukum lengkap dan komprehensif untuk memenuhi setiap kebutuhan hukum Anda.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {services.map((s, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-sm p-8 shadow-sm card-hover">
                <div className="flex gap-5 items-start mb-5">
                  <div className="text-4xl">{s.icon}</div>
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-navy">{s.title}</h2>
                    <p className="text-gray-500 text-sm mt-1 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
                <div className="gold-divider mb-5" style={{ marginLeft: 0 }} />
                <div className="grid grid-cols-2 gap-2">
                  {s.details.map((d, j) => (
                    <div key={j} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-gold">✓</span>
                      <span>{d}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <Link
                    href="/konsultasi"
                    className="btn-gold px-6 py-2.5 rounded-sm text-sm font-semibold inline-block"
                  >
                    Konsultasi Sekarang
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="section-padding bg-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-gold text-sm font-semibold tracking-widest uppercase mb-3">Cara Kerja</p>
            <h2 className="font-serif text-4xl font-bold text-white mb-4">Proses Kerja Kami</h2>
            <div className="gold-divider mx-auto" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Konsultasi Awal", desc: "Diskusikan masalah hukum Anda dengan tim kami secara gratis." },
              { step: "02", title: "Analisis Kasus", desc: "Kami menganalisis kasus Anda secara mendalam dan merancang strategi terbaik." },
              { step: "03", title: "Eksekusi Strategi", desc: "Tim pengacara kami bekerja keras untuk melindungi kepentingan Anda." },
              { step: "04", title: "Penyelesaian", desc: "Kami memastikan hasil terbaik dan mendampingi Anda hingga tuntas." },
            ].map((p, i) => (
              <div key={i} className="bg-navy-mid border border-gold/20 rounded-sm p-7 text-center card-hover">
                <div className="font-serif text-4xl font-bold text-gold/30 mb-3">{p.step}</div>
                <h3 className="font-serif text-lg font-bold text-white mb-3">{p.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-cream py-20 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="font-serif text-4xl font-bold text-navy mb-5">Tidak Menemukan yang Anda Cari?</h2>
          <p className="text-gray-500 text-lg mb-8">Hubungi kami dan tim kami akan membantu menemukan solusi hukum yang tepat untuk Anda.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/konsultasi" className="btn-gold px-10 py-4 rounded-sm font-bold text-sm">Konsultasi Gratis</Link>
            <Link href="/kontak" className="btn-navy px-10 py-4 rounded-sm font-bold text-sm">Hubungi Kami</Link>
          </div>
        </div>
      </section>
    </>
  );
}
