import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import PromoCarousel from "@/components/PromoCarousel";
import ClientLogos from "@/components/ClientLogos";

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
  
  // Fetch promo products
  const promoProducts = await prisma.product.findMany({
    where: { status: "PUBLISHED", promoStatus: { not: null } },
    take: 6,
    orderBy: { createdAt: "desc" },
  });

  // Parse Client Logos
  let clientLogos: string[] = [];
  try {
    clientLogos = JSON.parse(settings["home_client_logos"] || "[]").filter(Boolean);
  } catch {}

  return (
    <>
      {/* 1. Hero Section (Premium Corporate Style) */}
      <section className="relative pt-40 pb-32 lg:pt-56 lg:pb-48 xl:pt-64 min-h-screen bg-navy-dark overflow-hidden flex flex-col justify-center">
        {/* Abstract pattern / Gradients */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gold via-navy-dark to-navy-dark"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div className="order-2 lg:order-1 text-center lg:text-left">
              <div className="inline-block bg-white/10 backdrop-blur-sm text-gold text-xs font-bold px-4 py-2 rounded-full mb-6 uppercase tracking-widest border border-gold/20 shadow-[0_0_15px_rgba(201,168,76,0.15)]">
                Mitra Legalitas Perusahaan Anda
              </div>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-[1.15]">
                {heroTitle.includes("Kompleks") ? (
                  <>
                    {heroTitle.split("Kompleks")[0]}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-light to-gold">Kompleks</span>
                    {heroTitle.split("Kompleks")[1]}
                  </>
                ) : (
                  heroTitle
                )}
              </h1>
              <p className="text-gray-300 text-lg leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0 font-light">
                {heroSubtitle}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="#solusi" className="bg-gold hover:bg-gold-light text-navy-dark px-8 py-4 rounded-sm font-bold text-sm tracking-wide shadow-[0_4px_20px_rgba(201,168,76,0.3)] transition-all transform hover:-translate-y-1 text-center">
                  Temukan Solusi &rarr;
                </Link>
                <Link href="/konsultasi" className="bg-white/5 backdrop-blur-sm px-8 py-4 rounded-sm font-bold text-sm tracking-wide border border-white/10 hover:bg-white/10 hover:border-white/20 text-white transition-all text-center">
                  Konsultasi Langsung
                </Link>
              </div>
            </div>
            
            {/* Right Photo */}
            <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
              <div className="relative w-80 h-80 lg:w-[500px] lg:h-[500px] transform hover:scale-105 transition-transform duration-700">
                <div className="absolute inset-0 bg-gold/10 rounded-full blur-3xl mix-blend-screen animate-pulse"></div>
                <Image
                  src="/images/logo-3d-2.png"
                  alt="Berkas Hukum 3D"
                  fill
                  className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-10"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Client Logos (Marquee) */}
      <ClientLogos logos={clientLogos} />

      {/* 2. Storytelling / Giring Opini Section */}
      <section className="bg-gray-50 pt-20 pb-16 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-navy-dark mb-6 leading-tight">
            Di balik setiap bisnis yang <span className="text-gold italic">sukses & besar</span>,<br className="hidden md:block"/> selalu ada fondasi hukum yang <span className="underline decoration-gold decoration-4 underline-offset-8">kuat</span>.
          </h2>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed font-light">
            Membangun bisnis memang tidak mudah. Anda fokus pada penjualan, operasional, dan profit. Namun, seringkali satu hal krusial dilupakan hingga masalah besar datang menghampiri: <strong>Legalitas & Perjanjian Tertulis.</strong>
          </p>
        </div>
      </section>

      {/* 3. Permasalahan (The Pain Points) */}
      <section className="bg-gray-50 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12 overflow-hidden relative">
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-60 pointer-events-none"></div>
            
            <div className="text-center mb-12 relative z-10">
              <span className="text-red-500 font-bold tracking-widest text-sm uppercase mb-3 block">Fakta di Lapangan</span>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900">Apakah Anda Sedang Mengalami Ini?</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
              {/* Problem 1 */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center text-2xl mb-5">
                  💸
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Biaya Pengacara Terlalu Mahal</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Menyewa *law firm* atau pengacara profesional untuk membuat satu kontrak kerja saja bisa menguras kas perusahaan yang baru merintis.
                </p>
              </div>

              {/* Problem 2 */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center text-2xl mb-5">
                  🤯
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Pusing Buat Kontrak Sendiri</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Mencoba *googling* template gratisan tapi isinya berantakan, tidak sesuai hukum Indonesia, dan malah menimbulkan celah hukum yang berbahaya.
                </p>
              </div>

              {/* Problem 3 */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center text-2xl mb-5">
                  🤝
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Takut Ditipu Rekan Bisnis</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Kerjasama hanya bermodal rasa saling percaya tanpa hitam di atas putih yang mengikat secara hukum. Sangat berisiko tinggi!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Solusi & Katalog Promo (The Solution) */}
      <section id="solusi" className="py-24 bg-navy relative overflow-hidden">
        {/* Background Accents */}
        <div className="absolute left-0 top-1/4 w-96 h-96 bg-gold/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute right-0 bottom-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="text-gold font-bold tracking-widest text-sm uppercase mb-3 block">Solusi Cerdas & Praktis</span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-white mb-6">
            Lindungi Bisnis Anda<br className="hidden md:block" /> Mulai dari Sekarang.
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-16 text-lg">
            Tidak perlu pusing atau keluar biaya mahal. Berkas Hukum Corporate menyediakan koleksi dokumen legal <strong>siap pakai, sah secara hukum, dan mudah diedit</strong>.
          </p>
        </div>

        {/* The New 3D Coverflow Carousel */}
        {promoProducts.length > 0 ? (
          <div className="relative z-10 w-full overflow-hidden pb-10">
            <PromoCarousel products={promoProducts} />
            <div className="text-center mt-6">
              <Link href="/produk" className="inline-flex items-center gap-2 text-gold hover:text-white font-bold border-b border-gold hover:border-white transition-all pb-1">
                Lihat Semua Template Dokumen &rarr;
              </Link>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto text-center relative z-10 bg-white/5 border border-white/10 rounded-2xl p-10">
            <p className="text-gray-400">Belum ada promo dokumen legal saat ini.</p>
            <Link href="/produk" className="inline-block mt-4 text-gold hover:text-white transition-colors">Lihat Katalog Lengkap</Link>
          </div>
        )}
      </section>

      {/* 5. Credibility Stats */}
      <section className="bg-gold py-12 relative z-20 mx-4 sm:mx-6 lg:mx-8 rounded-xl shadow-2xl max-w-5xl xl:mx-auto -mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center px-4">
          {[
            { num: "2016", label: "Tahun Berdiri" },
            { num: "120+", label: "Kasus Diselesaikan" },
            { num: "Tim Ahli", label: "Spesialis Hukum" },
            { num: "Lisensi", label: "Badan Hukum Resmi" },
          ].map((stat, i) => (
            <div key={i} className="border-r border-navy-dark/10 last:border-0">
              <div className="font-serif text-3xl sm:text-4xl font-extrabold text-navy-dark mb-1">{stat.num}</div>
              <div className="text-navy-dark/80 text-xs sm:text-sm font-bold uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Testimonials */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-navy-dark mb-4">Apa Kata Klien Kami?</h2>
            <div className="w-24 h-1 bg-gold mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { text: `${ownerName} memberikan pandangan yang sangat jernih dalam kasus kepailitan perusahaan kami. Sangat profesional.`, author: "Bpk. Hendra", role: "CEO Perusahaan Manufaktur" },
              { text: "Template kontrak kerjanya sangat detail dan menyelamatkan bisnis startup saya dari celah hukum. Harga sangat sepadan!", author: "Andi Wijaya", role: "Founder Tech Startup" },
              { text: "Sesi konsultasinya sangat berharga. Penjelasan hukum yang rumit menjadi sangat mudah dipahami oleh awam.", author: "Ibu Ratna", role: "Pemilik Bisnis Retail" }
            ].map((t, i) => (
              <div key={i} className="bg-gray-50 border border-gray-100 p-8 rounded-2xl hover:shadow-lg transition-all transform hover:-translate-y-1">
                <div className="text-gold text-4xl mb-4 font-serif leading-none">&ldquo;</div>
                <p className="text-gray-600 text-sm leading-relaxed mb-6 italic">{t.text}</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center text-white font-bold font-serif">
                    {t.author.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-navy-dark text-sm">{t.author}</div>
                    <div className="text-xs text-gray-500">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
