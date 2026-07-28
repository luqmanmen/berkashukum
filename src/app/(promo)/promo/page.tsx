import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import PromoCarousel from "@/components/PromoCarousel";

export const dynamic = "force-dynamic";

export default async function PromoFBAdsPage() {
  // Fetch up to 5 top/featured products for the carousel
  const products = await prisma.product.findMany({
    where: { status: "PUBLISHED" },
    take: 5,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      price: true,
      originalPrice: true,
      image: true,
      category: true,
      promoStatus: true,
    }
  });

  // Fetch dynamic hook texts (from settings if exists)
  let hookTitle = "Pusing Ngurus <span class=\"text-transparent bg-clip-text bg-gradient-to-r from-gold to-yellow-200\">Pengacara Mahal?</span>";
  
  try {
    const settings = await prisma.siteSetting.findMany({
      where: { key: { in: ["promo_hook_title"] } }
    });
    settings.forEach(s => {
      if (s.key === "promo_hook_title" && s.value) {
        const words = s.value.split(" ");
        if (words.length >= 2 && !s.value.includes("<span")) {
          const lastTwo = words.splice(-2).join(" ");
          hookTitle = `${words.join(" ")} <span class="text-transparent bg-clip-text bg-gradient-to-r from-gold to-yellow-200">${lastTwo}</span>`;
        } else {
          hookTitle = s.value;
        }
      }
    });
  } catch(e) {}

  return (
    <div className="min-h-screen bg-navy-dark text-white font-inter flex flex-col relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-30 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gold rounded-full blur-[120px]"></div>
        <div className="absolute top-1/2 -left-40 w-[600px] h-[600px] bg-blue-900 rounded-full blur-[150px]"></div>
      </div>

      {/* Simple Header */}
      <header className="relative z-10 w-full px-4 py-6 sm:px-8 flex justify-between items-center max-w-5xl mx-auto">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="bg-white p-1.5 rounded-lg shadow-sm shrink-0">
            <Image src="/images/logo-1.png" alt="Berkas Hukum" width={32} height={32} className="h-8 w-auto object-contain" />
          </div>
          <div className="font-serif text-lg font-bold text-white tracking-wide">
            Berkas Hukum
          </div>
        </Link>
        <Link href="/produk" className="text-sm font-semibold text-gold hover:text-white transition-colors border-b border-gold/50 hover:border-white pb-0.5">
          Katalog
        </Link>
      </header>

      {/* Main Content (Storytelling Hook) */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-8 py-10 lg:py-16 flex flex-col items-center text-center relative z-10">
        
        {/* Step 1: Giring Opini (The Hook) */}
        <div className="inline-block px-4 py-1.5 rounded-full border border-gold/30 bg-gold/10 text-gold text-xs font-bold tracking-widest uppercase mb-6 animate-fade-in-up">
          Waktu Anda Terlalu Berharga
        </div>
        
        <h1 
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-serif leading-[1.15] mb-6 drop-shadow-lg" 
          dangerouslySetInnerHTML={{ __html: hookTitle }}
        />
        
        <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto mb-16 font-light">
          Setiap hari Anda fokus membesarkan bisnis, tapi tahukah Anda bahwa <span className="text-white font-bold border-b border-red-500">satu kesalahan kecil di kontrak</span> bisa meruntuhkan semua yang telah Anda bangun?
        </p>

        {/* Step 2: Masalah (Pain Points - Mini Version) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl mx-auto mb-16 text-left">
          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex gap-4 items-start">
            <div className="text-2xl mt-1">📉</div>
            <div>
              <h3 className="font-bold text-white text-sm mb-1">Pakai Jasa Pengacara?</h3>
              <p className="text-xs text-gray-400">Tarifnya jutaan hingga puluhan juta hanya untuk satu *draft* kontrak.</p>
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex gap-4 items-start">
            <div className="text-2xl mt-1">🤦‍♂️</div>
            <div>
              <h3 className="font-bold text-white text-sm mb-1">Download Gratisan di Google?</h3>
              <p className="text-xs text-gray-400">Format acak-acakan, pasal ketinggalan zaman, dan seringkali tidak sah secara hukum Indonesia.</p>
            </div>
          </div>
        </div>

        {/* Step 3: Solusi (The Solution with Carousel) */}
        <div className="w-full relative mt-4">
          <div className="text-center mb-8">
            <span className="bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              Solusi Instan
            </span>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mt-4">
              Pilih Template. Edit. <span className="text-gold italic">Selesai.</span>
            </h2>
          </div>

          <div className="relative w-[110%] -ml-[5%] md:w-full md:ml-0">
            {products.length > 0 ? (
              <PromoCarousel products={products as any} />
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-400 border border-white/10 rounded-xl bg-white/5 backdrop-blur-md">
                Belum ada produk promo saat ini.
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-col items-center gap-3">
            <Link 
              href="/produk"
              className="px-10 py-4 bg-gradient-to-r from-gold to-yellow-500 text-navy-dark font-extrabold rounded-full shadow-[0_0_30px_rgba(201,168,76,0.4)] hover:scale-105 transition-all w-full max-w-sm text-lg"
            >
              Borong Semua Template &rarr;
            </Link>
            <p className="text-xs text-gray-400">✅ File format .docx siap edit &nbsp;&bull;&nbsp; ✅ Sah secara hukum</p>
          </div>
        </div>

      </main>

      {/* Simple Footer */}
      <footer className="relative z-10 py-8 text-center border-t border-white/10 mt-12">
        <p className="text-xs text-gray-500">
          &copy; {new Date().getFullYear()} Berkas Hukum Corporate. All rights reserved.<br/>
          <span className="opacity-50">Developer: luckmen org.</span>
        </p>
      </footer>
    </div>
  );
}
