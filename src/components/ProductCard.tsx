"use client";

import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { useState } from "react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string | null;
  documentFormat: string | null;
  promoStatus: string | null;
  image: string | null;
  status: string;
  sales?: number;
}

const categoryIcons: Record<string, string> = {
  "Template Dokumen": "📄",
  "E-Book": "📚",
  "Konsultasi": "💬",
};

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image ?? undefined,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <Link href={`/produk/${product.id}`} className="bg-white border border-gray-200 rounded-[4px] hover:shadow-md transition-shadow flex flex-col overflow-hidden group">
      {/* Image / placeholder - aspect square for marketplace feel */}
      <div className="aspect-square bg-navy-dark relative flex items-center justify-center overflow-hidden">
        {product.image ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="text-center group-hover:scale-105 transition-transform duration-300">
            <div className="text-6xl mb-2">{categoryIcons[product.category ?? ""] ?? "📁"}</div>
            <div className="text-gold/50 text-sm font-semibold uppercase tracking-wider">
              {product.category}
            </div>
          </div>
        )}
        
        {/* Marketplace-like Badge (Top Right) */}
        <div className="absolute top-0 right-0 bg-gold text-navy-dark text-[10px] font-bold px-2 py-1 rounded-bl-lg flex items-center gap-1 shadow-sm">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
          TRUSTED
        </div>
      </div>

      {/* Content */}
      <div className="p-2.5 flex flex-col flex-1 bg-white">
        {/* Title */}
        <h3 className="text-sm text-gray-800 leading-[1.3] line-clamp-2 min-h-[36px] mb-1">
          {product.name}
        </h3>
        
        {/* Price */}
        <div className="text-gold font-bold text-base mb-1.5 flex items-baseline">
          <span className="text-xs font-normal mr-0.5">Rp</span>
          {product.price.toLocaleString("id-ID")}
        </div>

        {/* Labels/Tags */}
        <div className="flex gap-1 mb-2 flex-wrap">
          {product.promoStatus ? (
            <span className="text-[9px] text-white bg-gold border border-gold px-1 py-0.5 rounded-sm whitespace-nowrap font-bold">
              🏷️ {product.promoStatus}
            </span>
          ) : (
            <span className="text-[9px] text-gold border border-gold/50 px-1 py-0.5 rounded-sm whitespace-nowrap">
              Produk Baru
            </span>
          )}
          <span className="text-[9px] text-white bg-navy-dark px-1 py-0.5 rounded-sm whitespace-nowrap">
            {product.documentFormat ? product.documentFormat.replace(/ \(.*\)/, "") : "Legalitas"}
          </span>
        </div>

        {/* Sold */}
        <div className="flex items-center gap-1 text-[10px] text-gray-500 mb-2 mt-auto font-medium">
          <span>{product.sales || 0} terjual</span>
        </div>

        {/* Delivery / Add to cart row */}
        <div className="flex items-center gap-2 pt-2 border-t border-gray-100 mt-1">
          {/* Detail Button */}
          <div className="flex-1 text-center py-1.5 rounded text-[10px] font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
            Detail
          </div>
          
          {/* Cart Button */}
          <button 
            onClick={handleAddToCart}
            className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded text-[10px] font-semibold transition-colors z-10 ${
              added ? 'bg-green-500 text-white' : 'bg-navy-dark text-white hover:bg-gold'
            }`}
          >
            {added ? (
              <>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                <span>Ditambah</span>
              </>
            ) : (
              <>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 0a2 2 0 100 4 2 2 0 000-4z" /></svg>
                <span>Keranjang</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Link>
  );
}
