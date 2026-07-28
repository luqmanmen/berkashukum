import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export async function generateMetadata(): Promise<Metadata> {
  let ownerName = "Dr. Satria Wibowo";
  try {
    const setting = await prisma.siteSetting.findUnique({ where: { key: "site_owner_name" } });
    if (setting) ownerName = setting.value;
  } catch (e) {}
  
  return {
    title: `Blog & Publikasi | ${ownerName}`,
    description: `Artikel dan edukasi hukum terkini dari ${ownerName}. Dapatkan insight seputar hukum bisnis, kepailitan, dan korporasi.`,
  };
}

import Image from "next/image";
import CustomTrendingCarousel from "@/components/CustomTrendingCarousel";

export const dynamic = "force-dynamic";

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const currentCategory = resolvedSearchParams.category || "Semua";

  // Fetch all published articles to extract unique categories and trending items
  const allArticles = await prisma.article.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { createdAt: "desc" },
    include: { author: true }
  });

  const trendingArticles = allArticles.filter(a => a.isTrending);

  // Extract unique categories dynamically from the articles
  const uniqueCategories = Array.from(
    new Set(allArticles.map(a => a.category).filter(Boolean))
  ) as string[];
  const categories = ["Semua", ...uniqueCategories];

  // Filter articles for the grid based on selected category
  const displayArticles = currentCategory === "Semua" 
    ? allArticles 
    : allArticles.filter(a => a.category === currentCategory);

  const footerSetting = await prisma.siteSetting.findUnique({
    where: { key: "blog_footer_text" }
  });
  const blogFooterText = footerSetting?.value || "";

  const definitionSetting = await prisma.siteSetting.findUnique({
    where: { key: "blog_definition_text" }
  });
  const blogDefinitionText = definitionSetting?.value || "";

  return (
    <>
      {/* 1. Carousel 1 (Trending / Custom CSS Carousel) */}
      <section className="bg-black">
        <CustomTrendingCarousel articles={trendingArticles.length > 0 ? trendingArticles : allArticles.slice(0, 5)} />
      </section>

      {/* 2. Text (Definisi Artikel) */}
      {blogDefinitionText && (
        <section className="pt-16 pb-4 bg-cream">
          <div className="max-w-4xl mx-auto px-4 text-center prose prose-base md:prose-lg prose-headings:font-serif prose-headings:text-navy-dark text-gray-700">
            <div dangerouslySetInnerHTML={{ __html: blogDefinitionText }} />
          </div>
        </section>
      )}

      {/* 3. All Artikel Box (dengan efek 3D shadow) */}
      <section className={`bg-cream relative z-20 ${blogDefinitionText ? 'pt-4 pb-20 md:pb-24' : 'section-padding'}`} id="artikel-list">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 md:mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-navy-dark">Semua Artikel</h2>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <Link 
                  key={cat}
                  href={cat === "Semua" ? "/blog#artikel-list" : `/blog?category=${encodeURIComponent(cat)}#artikel-list`}
                  scroll={false}
                  className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold transition-all inline-block ${
                    currentCategory === cat 
                      ? "bg-navy text-white shadow-[3px_3px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_rgba(0,0,0,1)] border-2 border-black" 
                      : "bg-white text-gray-600 border-2 border-black hover:bg-gold hover:text-black hover:shadow-[3px_3px_0px_rgba(0,0,0,1)] md:hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5"
                  }`}
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>

          {displayArticles.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
              <p className="text-gray-500 font-medium">Belum ada artikel yang dipublikasikan.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
              {displayArticles.map((article) => (
                <article 
                  key={article.id} 
                  className="bg-white rounded-md border-2 border-black overflow-hidden shadow-[4px_4px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-1 hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] md:hover:shadow-[12px_12px_0px_rgba(0,0,0,1)] group flex flex-col"
                >
                  {article.coverImage ? (
                    <div className="relative h-32 md:h-56 overflow-hidden border-b-2 border-black">
                      <Image 
                        src={article.coverImage} 
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute top-2 left-2 md:top-4 md:left-4">
                        <span className="bg-white border-2 border-black px-2 py-0.5 md:px-3 md:py-1 text-[9px] md:text-xs font-bold uppercase tracking-wider text-black shadow-[2px_2px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                          {article.category || "Hukum Umum"}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="relative h-32 md:h-56 bg-navy flex items-center justify-center p-4 md:p-6 border-b-2 border-black">
                      <div className="absolute top-2 left-2 md:top-4 md:left-4">
                        <span className="bg-white border-2 border-black px-2 py-0.5 md:px-3 md:py-1 text-[9px] md:text-xs font-bold uppercase tracking-wider text-black shadow-[2px_2px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                          {article.category || "Hukum Umum"}
                        </span>
                      </div>
                      <span className="font-serif text-white opacity-40 text-xl md:text-3xl font-bold text-center">BERKAS<br className="md:hidden"/>HUKUM</span>
                    </div>
                  )}
                  
                  <div className="p-3 md:p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-sm text-gray-500 mb-2 md:mb-3 font-medium flex-wrap">
                      <span>{new Date(article.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      })}</span>
                      <span className="hidden sm:inline">•</span>
                      <div className="flex items-center gap-1.5 bg-gray-100 rounded-full pr-2">
                        <div className="bg-white p-0.5 rounded-full border border-gray-200">
                          <Image src="/images/logo-1.png" alt="Berkas Hukum" width={16} height={16} className="object-contain w-4 h-4" />
                        </div>
                        <span className="truncate max-w-[80px] sm:max-w-[120px]">{(article as any).authorName || article.author?.name || "Tim Berkas Hukum"}</span>
                      </div>
                    </div>
                    
                    <h3 className="font-serif text-sm md:text-2xl font-bold text-gray-900 mb-2 md:mb-4 line-clamp-2 md:line-clamp-2 leading-tight md:leading-snug">
                      <Link href={`/blog/${article.slug}`} className="hover:text-gold transition-colors">
                        {article.title}
                      </Link>
                    </h3>
                    
                    <p className="text-gray-600 mb-3 md:mb-6 line-clamp-2 md:line-clamp-3 text-xs md:text-base leading-snug md:leading-relaxed">
                      {article.content.replace(/<[^>]*>?/gm, '')}
                    </p>
                    
                    <div className="mt-auto pt-2 md:pt-4 border-t-2 border-black flex items-center justify-between">
                      <Link 
                        href={`/blog/${article.slug}`}
                        className="text-black font-bold uppercase tracking-wide text-[10px] md:text-sm hover:text-gold transition-colors flex items-center gap-1 md:gap-2 group-hover:gap-2 md:group-hover:gap-3"
                      >
                        Baca →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4 & 5. Teks Khusus & CTA Induk */}
      <section className="bg-navy py-20 border-t-4 border-black text-white relative">
        <div className="max-w-4xl mx-auto px-4 text-center">
          {/* Custom Footer Teks (Optional) */}
          {blogFooterText && (
            <div className="prose prose-invert prose-lg mx-auto mb-16 pb-16 border-b border-white/20">
              <div dangerouslySetInnerHTML={{ __html: blogFooterText }} />
            </div>
          )}

          {/* CTA Induk */}
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-6">Butuh Draft Dokumen Hukum Cepat?</h2>
          <p className="text-gray-300 mb-10 text-lg max-w-2xl mx-auto">
            Selain memberikan insight hukum, saya juga menyediakan draft kontrak dan dokumen legal siap pakai untuk kebutuhan bisnis Anda.
          </p>
          <Link href="/produk" className="inline-block bg-gold hover:bg-gold-light text-navy-dark border-2 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all px-8 py-4 font-bold text-lg tracking-wide">
            Lihat Katalog Template
          </Link>
        </div>
      </section>
    </>
  );
}
