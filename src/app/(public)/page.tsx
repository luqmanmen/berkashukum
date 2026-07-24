import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

async function getSiteSettings() {
  try {
    const settings = await prisma.siteSetting.findMany();
    const map: Record<string, string> = {};
    settings.forEach((s) => { map[s.key] = s.value; });
    return map;
  } catch {
    return {};
  }
}

export const dynamic = "force-dynamic";

export default async function Home() {
  const settings = await getSiteSettings();

  const heroTitle = settings["home_hero_title"] || "Solusi Hukum Tepat untuk Masalah Kompleks.";
  const ownerName = settings["site_owner_name"] || "Dr. Satria Wibowo, S.H., M.H., Ph.D.";
  const heroSubtitle = settings["home_hero_subtitle"] || `${ownerName} mendedikasikan lebih dari 15 tahun keahlian di bidang kepailitan, hukum bisnis, dan perlindungan aset perusahaan.`;
  const heroImage = settings["home_hero_image"] && settings["home_hero_image"] !== "none" ? settings["home_hero_image"] : null;

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-navy-dark overflow-hidden">
        {/* Abstract pattern */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c9a84c' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div className="order-2 lg:order-1 text-center lg:text-left">
              <div className="inline-block bg-white/10 text-gold text-xs font-bold px-3 py-1.5 rounded-full mb-6 uppercase tracking-widest border border-white/10">
                Pakar Hukum &amp; Kurator Kepailitan
              </div>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                {heroTitle.includes("Kompleks") ? (
                  <>
                    {heroTitle.split("Kompleks")[0]}
                    <span className="text-gold">Kompleks</span>
                    {heroTitle.split("Kompleks")[1]}
                  </>
                ) : (
                  heroTitle
                )}
              </h1>
              <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
                {heroSubtitle}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/konsultasi" className="btn-gold px-8 py-3.5 rounded-sm font-bold text-sm tracking-wide">
                  Booking Konsultasi
                </Link>
                <Link href="/produk" className="btn-navy px-8 py-3.5 rounded-sm font-bold text-sm tracking-wide bg-transparent border-2 border-white/20 hover:border-gold hover:text-gold text-white">
                  Katalog Template
                </Link>
              </div>
            </div>
            
            {/* Right Photo */}
            <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
              <div className="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
                {/* Decorative border */}
                <div className="absolute inset-0 border-2 border-gold rounded-full translate-x-4 translate-y-4 opacity-50"></div>
                {/* Photo container */}
                <div className="absolute inset-0 bg-navy-mid rounded-full overflow-hidden border-4 border-navy-dark shadow-2xl flex items-end justify-center">
                  {heroImage ? (
                    <Image
                      src={heroImage}
                      alt="Foto Profil"
                      fill
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <div className="text-8xl text-gold/20 mb-8">👤</div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Credibility Stats */}
      <section className="bg-gold py-10 relative z-20 -mt-10 mx-4 sm:mx-6 lg:mx-8 rounded-sm shadow-xl max-w-5xl xl:mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center px-4">
          {[
            { num: "15+", label: "Tahun Pengalaman" },
            { num: "120+", label: "Kasus Diselesaikan" },
            { num: "S3", label: "Doktor Ilmu Hukum" },
            { num: "Lisensi", label: "Kurator Resmi" },
          ].map((stat, i) => (
            <div key={i} className="border-r border-navy-dark/10 last:border-0">
              <div className="font-serif text-3xl sm:text-4xl font-bold text-navy-dark mb-1">{stat.num}</div>
              <div className="text-navy-dark/70 text-xs sm:text-sm font-semibold uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 3 Main CTAs Section */}
      <section className="section-padding bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-navy mb-4">Layanan &amp; Keahlian</h2>
          <div className="gold-divider mx-auto mb-6" />
          <p className="text-gray-600 max-w-2xl mx-auto mb-16">
            Pendekatan profesional yang disesuaikan dengan kebutuhan Anda, baik untuk individu maupun perusahaan.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* CTA 1: Konsultasi */}
            <div className="bg-white border border-gray-100 rounded-sm p-8 shadow-sm card-hover text-left flex flex-col">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="font-serif text-xl font-bold text-navy mb-3">Konsultasi Pribadi</h3>
              <p className="text-gray-500 text-sm mb-6 flex-1">
                Sesi konsultasi 1-on-1 untuk membahas masalah hukum Anda secara mendalam dengan kerahasiaan terjamin.
              </p>
              <Link href="/konsultasi" className="text-gold font-bold text-sm hover:text-navy transition-colors inline-flex items-center gap-2">
                Booking Jadwal &rarr;
              </Link>
            </div>

            {/* CTA 2: Produk/Template */}
            <div className="bg-white border border-gray-100 rounded-sm p-8 shadow-sm card-hover text-left flex flex-col">
              <div className="text-4xl mb-4">📄</div>
              <h3 className="font-serif text-xl font-bold text-navy mb-3">Template Dokumen</h3>
              <p className="text-gray-500 text-sm mb-6 flex-1">
                Koleksi draft kontrak dan dokumen hukum yang disusun langsung oleh ahlinya. Siap unduh dan pakai.
              </p>
              <Link href="/produk" className="text-gold font-bold text-sm hover:text-navy transition-colors inline-flex items-center gap-2">
                Lihat Katalog &rarr;
              </Link>
            </div>

            {/* CTA 3: Artikel/Edukasi */}
            <div className="bg-white border border-gray-100 rounded-sm p-8 shadow-sm card-hover text-left flex flex-col">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="font-serif text-xl font-bold text-navy mb-3">Edukasi &amp; Publikasi</h3>
              <p className="text-gray-500 text-sm mb-6 flex-1">
                Artikel analitis, opini hukum, dan studi kasus terbaru seputar hukum bisnis dan kepailitan.
              </p>
              <Link href="/blog" className="text-gold font-bold text-sm hover:text-navy transition-colors inline-flex items-center gap-2">
                Baca Artikel &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Apa Kata Klien</h2>
            <div className="gold-divider mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { text: `${ownerName} memberikan pandangan yang sangat jernih dalam kasus kepailitan perusahaan kami. Sangat profesional.`, author: "Bpk. Hendra", role: "CEO Perusahaan Manufaktur" },
              { text: "Template kontrak kerjanya sangat detail dan menyelamatkan bisnis startup saya dari celah hukum.", author: "Andi Wijaya", role: "Founder Tech Startup" },
              { text: "Sesi konsultasinya sangat berharga. Penjelasan hukum yang rumit menjadi sangat mudah dipahami.", author: "Ibu Ratna", role: "Pemilik Bisnis Retail" }
            ].map((t, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-sm">
                <div className="text-gold text-2xl mb-4">&ldquo;</div>
                <p className="text-gray-300 text-sm leading-relaxed mb-6 italic">&ldquo;{t.text}&rdquo;</p>
                <div>
                  <div className="font-bold text-white text-sm">{t.author}</div>
                  <div className="text-xs text-gray-400">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
