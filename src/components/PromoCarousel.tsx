"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string | null;
  category: string | null;
}

export default function PromoCarousel({ products }: { products: Product[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % products.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto h-[400px] flex items-center justify-center overflow-visible">
      {products.map((product, index) => {
        // Calculate relative position (-1, 0, 1 for prev, active, next)
        // Adjust for circular wrapping
        let relativePos = index - activeIndex;
        if (relativePos < -1) relativePos += products.length;
        if (relativePos > 1) relativePos -= products.length;

        // Base styles for all cards
        let transformStyle = "translateX(0) scale(1)";
        let opacityStyle = 1;
        let zIndex = 10;
        let blurStyle = "blur(0px)";

        if (relativePos === 0) {
          // Center active item
          transformStyle = "translateX(0) scale(1) translateZ(50px)";
          zIndex = 20;
        } else if (relativePos === -1 || (relativePos < 0 && index === products.length -1 && activeIndex === 0)) {
          // Left item
          transformStyle = "translateX(-60%) scale(0.85) translateZ(-50px) rotateY(15deg)";
          opacityStyle = 0.7;
          zIndex = 10;
          blurStyle = "blur(4px)";
        } else if (relativePos === 1 || (relativePos > 0 && index === 0 && activeIndex === products.length -1)) {
          // Right item
          transformStyle = "translateX(60%) scale(0.85) translateZ(-50px) rotateY(-15deg)";
          opacityStyle = 0.7;
          zIndex = 10;
          blurStyle = "blur(4px)";
        } else {
          // Hidden items (if more than 3)
          opacityStyle = 0;
          zIndex = 0;
        }

        return (
          <div
            key={product.id}
            className="absolute transition-all duration-500 ease-out cursor-pointer"
            style={{
              transform: transformStyle,
              opacity: opacityStyle,
              zIndex: zIndex,
              filter: blurStyle,
              perspective: "1000px"
            }}
            onClick={() => {
              if (relativePos === -1) prevSlide();
              if (relativePos === 1) nextSlide();
            }}
          >
            <div className="w-[280px] sm:w-[320px] bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col">
              <div className="relative h-48 bg-gray-50 p-6 flex items-center justify-center">
                {product.image ? (
                  <Image src={product.image} alt={product.name} fill className="object-cover" />
                ) : (
                  <div className="w-24 h-32 bg-white shadow-sm border border-gray-200 rounded-sm flex items-center justify-center relative">
                    <div className="w-16 h-4 bg-gray-100 rounded-sm absolute top-4"></div>
                    <div className="w-12 h-3 bg-gray-100 rounded-sm absolute top-10"></div>
                    <div className="w-8 h-8 bg-gold/20 rounded-full flex items-center justify-center absolute bottom-4 right-4">
                      <span className="text-gold text-xs font-serif font-bold">BH</span>
                    </div>
                  </div>
                )}
                
                {product.category === "Template" && (
                  <div className="absolute top-3 left-3 bg-navy-dark text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                    Template
                  </div>
                )}
              </div>
              
              <div className="p-5 flex flex-col items-center text-center">
                <h3 className="font-serif font-bold text-navy-dark text-lg mb-2 line-clamp-2">{product.name}</h3>
                <div className="text-gold font-bold mb-4">
                  Rp {product.price.toLocaleString("id-ID")}
                </div>
                
                <Link 
                  href={`/produk/${product.id}`}
                  className="w-full bg-navy-dark text-white font-semibold text-sm py-2.5 rounded-md hover:bg-gold transition-colors block text-center"
                >
                  Lihat Produk
                </Link>
              </div>
            </div>
          </div>
        );
      })}

      {/* Navigation Buttons */}
      <button 
        onClick={prevSlide}
        className="absolute left-0 sm:-left-12 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-navy-dark hover:text-gold transition-colors z-30 border border-gray-100"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-0 sm:-right-12 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-navy-dark hover:text-gold transition-colors z-30 border border-gray-100"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </button>
    </div>
  );
}
