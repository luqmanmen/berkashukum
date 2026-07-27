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

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const articles = await prisma.article.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { createdAt: "desc" },
    include: { author: true }
  });

  const categories = ["Semua", "Hukum Bisnis", "Kepailitan", "Korporasi"];

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-navy-dark overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c9a84c' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gold text-sm font-semibold tracking-widest uppercase mb-3">Edukasi Hukum</p>
          <h1 className="font-serif text-5xl sm:text-6xl font-bold text-white mb-5">Blog & Publikasi</h1>
          <div className="gold-divider mx-auto mb-5" />
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Insight, opini hukum, dan analisis studi kasus terbaru.
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="section-padding bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {articles.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <div className="text-5xl mb-4">📭</div>
              <p className="text-lg">Belum ada artikel publikasi.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <article key={article.id} className="bg-white border border-gray-100 rounded-sm shadow-sm card-hover overflow-hidden flex flex-col">
                  {/* Image placeholder with navy bg */}
                  <div className="h-48 bg-navy flex items-center justify-center relative">
                    {article.coverImage ? (
                      <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-serif text-6xl text-gold/20">SW</span>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="bg-gold text-navy-dark text-xs font-bold px-3 py-1 rounded-full">
                        {article.category || "Hukum"}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex gap-3 text-xs text-gray-400 mb-3">
                      <span>{new Date(article.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</span>
                    </div>
                    <h2 className="font-serif text-lg font-bold text-navy mb-3 leading-tight">
                      <Link href={`/blog/${article.slug}`} className="hover:text-gold transition-colors">
                        {article.title}
                      </Link>
                    </h2>
                    <p className="text-gray-500 text-sm leading-relaxed mb-5 line-clamp-3">
                      {/* Simple excerpt by stripping HTML tags if any, or just taking substring */}
                      {article.content.replace(/<[^>]*>?/gm, '').substring(0, 150)}...
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-navy flex items-center justify-center">
                          <span className="text-gold text-xs font-bold">SW</span>
                        </div>
                        <span className="text-xs text-gray-500">{article.author?.name || "Admin"}</span>
                      </div>
                      <Link href={`/blog/${article.slug}`} className="text-gold text-sm font-semibold hover:text-gold-light transition-colors">
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

      {/* CTA to Products */}
      <section className="bg-navy py-20 border-t border-white/10">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl font-bold text-white mb-4">Butuh Draft Dokumen Hukum Cepat?</h2>
          <p className="text-gray-300 mb-8">
            Selain memberikan konsultasi, saya juga menyediakan draft kontrak dan dokumen legal siap pakai.
          </p>
          <Link href="/produk" className="btn-gold px-8 py-3.5 rounded-sm font-bold text-sm tracking-wide">
            Lihat Katalog Template
          </Link>
        </div>
      </section>
    </>
  );
}
