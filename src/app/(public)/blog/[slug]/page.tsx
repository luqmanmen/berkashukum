import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await prisma.article.findUnique({
    where: { slug },
    include: { author: true },
  });

  if (!article || article.status !== "PUBLISHED") {
    notFound();
  }

  return (
    <article className="pt-32 pb-20 bg-cream min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <header className="mb-10 text-center">
          <div className="mb-4">
            <span className="bg-gold text-navy-dark text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
              {article.category || "Hukum"}
            </span>
          </div>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-navy leading-tight mb-6">
            {article.title}
          </h1>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <span className="font-bold text-navy">{article.author?.name || "Dr. Satria Wibowo"}</span>
            </div>
            <span>•</span>
            <time dateTime={article.createdAt.toISOString()}>
              {new Date(article.createdAt).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric"
              })}
            </time>
          </div>
        </header>

        {/* Cover Image */}
        {article.coverImage && (
          <div className="relative w-full aspect-video rounded-sm overflow-hidden mb-10 shadow-lg">
            <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Content */}
        <div 
          className="prose prose-lg prose-navy max-w-none mb-16 bg-white p-8 md:p-12 rounded-sm shadow-sm border border-gray-100"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* CTA (Promosi Template) */}
        <div className="bg-navy rounded-sm p-8 text-center shadow-xl border border-gold/20">
          <div className="text-4xl mb-4">📄</div>
          <h3 className="font-serif text-2xl font-bold text-white mb-3">Butuh Draft Dokumen Terkait?</h3>
          <p className="text-gray-300 text-sm mb-6 max-w-lg mx-auto">
            Pastikan urusan hukum Anda aman dengan template dokumen berstandar profesional yang bisa langsung diunduh dan digunakan.
          </p>
          <Link href="/produk" className="btn-gold px-8 py-3 rounded-sm font-bold text-sm tracking-wide inline-block">
            Lihat Katalog Template
          </Link>
        </div>

      </div>
    </article>
  );
}
