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
  image: string | null;
  status: string;
}

const categoryIcons: Record<string, string> = {
  "Template Dokumen": "📄",
  "E-Book": "📚",
  "Konsultasi": "💬",
};

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
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
    <div className="bg-white border border-gray-100 rounded-sm shadow-sm card-hover flex flex-col overflow-hidden">
      {/* Image / placeholder */}
      <div className="h-44 bg-navy relative flex items-center justify-center overflow-hidden">
        {product.image ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="text-center">
            <div className="text-5xl mb-2">{categoryIcons[product.category ?? ""] ?? "📁"}</div>
            <div className="text-gold/50 text-xs font-semibold uppercase tracking-wider">
              {product.category}
            </div>
          </div>
        )}
        {/* Category badge */}
        <div className="absolute top-3 left-3 bg-gold text-navy-dark text-[10px] font-bold px-2.5 py-1 rounded-full">
          {product.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-serif font-bold text-navy text-base mb-2 leading-snug line-clamp-2">
          <Link href={`/produk/${product.id}`} className="hover:text-gold transition-colors">
            {product.name}
          </Link>
        </h3>
        <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-2 flex-1">
          {product.description}
        </p>

        {/* Price */}
        <div className="text-gold font-bold text-lg mb-4">
          Rp {product.price.toLocaleString("id-ID")}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            href={`/produk/${product.id}`}
            className="flex-1 btn-navy text-center py-2 rounded-sm text-xs font-semibold"
          >
            Detail
          </Link>
          <button
            onClick={handleAddToCart}
            className={`flex-1 py-2 rounded-sm text-xs font-bold transition-all ${
              added
                ? "bg-green-600 text-white"
                : "btn-gold"
            }`}
          >
            {added ? "✓ Ditambahkan" : "+ Keranjang"}
          </button>
        </div>
      </div>
    </div>
  );
}
