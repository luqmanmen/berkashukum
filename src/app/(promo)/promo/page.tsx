import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import PromoCarousel from "@/components/PromoCarousel";

export const dynamic = "force-dynamic";

export default async function PromoFBAdsPage() {
  // Fetch up to 3 top/featured products
  const products = await prisma.product.findMany({
    where: { status: "PUBLISHED" },
    take: 3,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      price: true,
      image: true,
      category: true,
    }
  });

  return (
    <div className="min-h-screen bg-navy text-white font-inter flex flex-col relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gold rounded-full blur-[100px]"></div>
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-blue-900 rounded-full blur-[120px]"></div>
      </div>

      {/* Simple Header */}
      <header className="relative z-10 w-full px-6 py-6 sm:px-12 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3">
          <div className="bg-white/95 p-1.5 rounded-md shadow-sm shrink-0">
            <Image src="/images/logo-1.png" alt="Berkas Hukum" width={40} height={40} className="h-9 w-auto object-contain" />
          </div>
          <div className="font-serif text-xl font-bold text-white tracking-wide hidden sm:block">
            Berkas Hukum
          </div>
        </Link>
        <Link href="/produk" className="text-sm font-semibold text-gold hover:text-white transition-colors border-b border-transparent hover:border-white pb-0.5">
          Lihat Katalog
        </Link>
      </header>

      {/* Main Content Split */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center justify-center relative z-10 gap-12 lg:gap-20 py-12 lg:py-0">
        
        {/* Left Side: Hook Text */}
        <div className="w-full lg:w-1/2 space-y-8 text-center lg:text-left">
          <div className="inline-block px-4 py-1.5 rounded-full border border-gold/30 bg-gold/10 text-gold text-xs font-bold tracking-widest uppercase mb-2">
            Solusi Hukum Digital
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif leading-[1.15]">
            Pusing Ngurus <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-yellow-200">Pengacara Mahal?</span>
          </h1>
          <p className="text-lg text-gray-300 leading-relaxed max-w-xl mx-auto lg:mx-0">
            Kini Anda tidak perlu lagi menghabiskan puluhan juta rupiah hanya untuk mengurus dokumen legal bisnis. Berkas Hukum menghadirkan koleksi template kontrak dan akta setara kualitas firma hukum raksasa, siap pakai hanya dalam hitungan detik.
          </p>
          
          <div className="pt-4 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
            <Link 
              href="/produk"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-gold to-yellow-500 text-navy-dark font-bold rounded-sm shadow-lg shadow-gold/20 hover:scale-105 transition-transform"
            >
              Lihat Semua Template
            </Link>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              <span>Download Instan</span>
            </div>
          </div>
        </div>

        {/* Right Side: 3D Carousel */}
        <div className="w-full lg:w-1/2 mt-12 lg:mt-0 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold/10 via-transparent to-transparent -z-10 blur-2xl"></div>
          {products.length > 0 ? (
            <PromoCarousel products={products} />
          ) : (
            <div className="h-[400px] flex items-center justify-center text-gray-400 border border-white/10 rounded-xl bg-white/5 backdrop-blur-md">
              Belum ada produk untuk ditampilkan.
            </div>
          )}
        </div>

      </main>

      {/* Simple Footer */}
      <footer className="relative z-10 py-6 text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} Berkas Hukum Corporate. All rights reserved.
      </footer>
    </div>
  );
}
