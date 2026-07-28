"use client";

import Link from "next/link";
import type { Article } from "@/generated/prisma";

interface TrendingCarouselProps {
  articles: (Article & { author?: { name: string | null } })[];
}

export default function TrendingCarousel({ articles }: TrendingCarouselProps) {
  if (!articles || articles.length === 0) return null;

  return (
    <div className="w-full pb-8">
      <div className="flex overflow-x-auto gap-6 snap-x snap-mandatory hide-scrollbar pb-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {articles.map((article) => (
          <div 
            key={article.id} 
            className="snap-start shrink-0 w-[85vw] sm:w-[400px] bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden flex flex-col transition-transform hover:-translate-y-1"
          >
            {article.coverImage ? (
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={article.coverImage} 
                  alt={article.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-navy/90 backdrop-blur-sm text-white px-3 py-1 text-xs font-semibold tracking-wider rounded-sm uppercase">
                    Trending
                  </span>
                </div>
              </div>
            ) : (
              <div className="relative h-48 bg-navy-dark flex items-center justify-center p-6 text-center">
                <div className="absolute top-4 left-4">
                  <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 text-xs font-semibold tracking-wider rounded-sm uppercase border border-white/20">
                    Trending
                  </span>
                </div>
                <span className="font-serif text-white opacity-40 text-2xl font-bold">BERKAS HUKUM</span>
              </div>
            )}
            
            <div className="p-6 flex-1 flex flex-col">
              <div className="text-gold text-xs font-bold uppercase tracking-wider mb-2">
                {article.category || "Hukum Umum"}
              </div>
              <h3 className="font-serif text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-navy-dark transition-colors">
                <Link href={`/blog/${article.slug}`}>{article.title}</Link>
              </h3>
              
              <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
                <div className="text-xs text-gray-500 font-medium">
                  {new Date(article.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                  })}
                </div>
                <Link 
                  href={`/blog/${article.slug}`}
                  className="text-navy text-sm font-bold hover:text-gold transition-colors flex items-center gap-1"
                >
                  Baca Selengkapnya
                  <span className="text-lg leading-none transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
