"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@prisma/client";

export default function PromoCarousel({ products }: { products: Product[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-play
  useEffect(() => {
    if (!products || products.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev === products.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, [products]);

  if (!products || products.length === 0) return null;

  const goNext = () => setActiveIndex((prev) => (prev === products.length - 1 ? 0 : prev + 1));
  const goPrev = () => setActiveIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));

  return (
    <div className="relative w-full max-w-5xl mx-auto py-10 px-4 overflow-hidden">
      {/* Navigation Buttons */}
      <button 
        onClick={goPrev} 
        className="absolute left-2 md:left-10 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-12 bg-navy-dark text-white rounded-full flex items-center justify-center opacity-80 hover:opacity-100 hover:scale-110 transition-all shadow-lg"
        aria-label="Previous"
      >
        <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
      </button>
      <button 
        onClick={goNext} 
        className="absolute right-2 md:right-10 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-12 bg-navy-dark text-white rounded-full flex items-center justify-center opacity-80 hover:opacity-100 hover:scale-110 transition-all shadow-lg"
        aria-label="Next"
      >
        <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
      </button>
      
      {/* Carousel Track */}
      <div className="relative h-[420px] md:h-[480px] w-full flex items-center justify-center perspective-[1000px]">
        {products.map((p, i) => {
          // Calculate shortest distance for infinite looping effect
          let dist = i - activeIndex;
          if (dist > products.length / 2) dist -= products.length;
          if (dist < -products.length / 2) dist += products.length;
          
          const isActive = dist === 0;
          
          // Hide items that are too far away for performance and visual clarity
          const isVisible = Math.abs(dist) <= 2;
          if (!isVisible) return null; 

          // Calculate styles based on distance
          let translateX = 0;
          let scale = 1;
          let zIndex = 20 - Math.abs(dist);
          let opacity = 1;
          let blur = 0;
          
          if (dist === 0) {
            translateX = 0;
            scale = 1;
            opacity = 1;
            blur = 0;
          } else if (dist === -1) {
            translateX = -95; 
            scale = 0.75;
            opacity = 0.5;
            blur = 4;
          } else if (dist === 1) {
            translateX = 95;
            scale = 0.75;
            opacity = 0.5;
            blur = 4;
          } else if (dist === -2) {
            translateX = -150;
            scale = 0.6;
            opacity = 0;
            blur = 8;
          } else if (dist === 2) {
            translateX = 150;
            scale = 0.6;
            opacity = 0;
            blur = 8;
          }

          return (
            <div 
              key={p.id}
              onClick={() => setActiveIndex(i)}
              className={`absolute transition-all duration-500 ease-out cursor-pointer flex flex-col items-center w-[240px] md:w-[280px]
                ${isActive ? 'pointer-events-auto' : 'pointer-events-auto hover:opacity-80'}
              `}
              style={{
                transform: `translateX(${translateX}%) scale(${scale}) translateZ(0)`,
                zIndex,
                opacity,
                filter: blur > 0 ? `blur(${blur}px)` : 'none',
                WebkitFontSmoothing: 'antialiased',
                backfaceVisibility: 'hidden',
              }}
            >
              {/* Image Card */}
              <div className={`w-full aspect-[3/4] relative rounded-2xl overflow-hidden bg-white shadow-2xl ${isActive ? 'ring-4 ring-gold ring-offset-4' : ''}`}>
                {p.image ? (
                  <Image src={p.image} alt={p.name} fill className="object-cover" sizes="(max-width: 768px) 240px, 280px" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center p-4 text-center">
                    <svg className="w-16 h-16 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    <span className="text-gray-400 font-medium text-xs">Dokumen Digital</span>
                  </div>
                )}
                
                {/* Promo Badge */}
                {p.promoStatus && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md transform rotate-3">
                    {p.promoStatus}
                  </div>
                )}
              </div>
              
              {/* Content Card (Overlapping the image slightly) */}
              <div className={`mt-4 text-center px-4 bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-xl -mt-12 relative z-10 w-[95%] border border-gray-100 transition-all duration-300 ${isActive ? 'translate-y-0' : 'translate-y-4'}`}>
                <h3 className="font-serif font-bold text-navy-dark text-[15px] line-clamp-1 mb-1">{p.name}</h3>
                
                {/* Price and Discount */}
                <div className="flex flex-col items-center mb-2">
                  {p.originalPrice && p.originalPrice > p.price ? (
                    <div className="flex items-center justify-center gap-1.5 mb-0.5">
                      <span className="text-gray-400 line-through text-[11px] font-medium">
                        Rp {p.originalPrice.toLocaleString("id-ID")}
                      </span>
                      <span className="text-red-500 text-[10px] font-bold bg-red-50 border border-red-200 px-1.5 py-0.5 rounded">
                        -{Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)}%
                      </span>
                    </div>
                  ) : <div className="h-4" />}
                  <div className="text-gold font-bold text-base">
                    Rp {p.price.toLocaleString("id-ID")}
                  </div>
                </div>

                {/* Call to Action Button */}
                <Link 
                  href={`/produk/${p.id}`} 
                  className={`block w-full bg-navy-dark text-white text-xs font-bold py-2 rounded-full hover:bg-gold transition-all duration-300 ${isActive ? 'opacity-100 transform scale-100' : 'opacity-0 transform scale-90 pointer-events-none absolute inset-x-0 bottom-0'}`}
                >
                  Lihat Detail &rarr;
                </Link>
              </div>
            </div>
          )
        })}
      </div>
      
      {/* Pagination Dots */}
      <div className="flex justify-center gap-2.5 mt-8">
        {products.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              activeIndex === i ? 'bg-gold scale-125 w-6' : 'bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
