"use client";

import { useCart } from "@/hooks/useCart";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string | null;
}

export default function ProductBottomBar({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const router = useRouter();

  const handleAdd = () => {
    addItem({ id: product.id, name: product.name, price: product.price, image: product.image ?? undefined });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: product.name,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link disalin ke clipboard!");
    }
  };

  return (
    <div className="w-full">
      <div className="w-full">
        <div className="flex items-center justify-center gap-4 pt-4 pb-6 px-4 md:px-8">

          {/* Share */}
          <button
            onClick={handleShare}
            className="flex flex-col items-center justify-center w-12 h-12 rounded-xl hover:bg-gray-100 transition-colors shrink-0 text-gray-500"
            title="Bagikan"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <span className="text-[10px] mt-0.5">Bagikan</span>
          </button>

          {/* Cart */}
          <button
            onClick={handleAdd}
            className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all shrink-0 ${
              added ? "text-green-600 bg-green-50" : "text-gold hover:bg-amber-50"
            }`}
            title="Keranjang"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-[10px] mt-0.5">{added ? "Ditambah!" : "Keranjang"}</span>
          </button>

          {/* Divider */}
          <div className="w-px h-10 bg-gray-200 shrink-0" />

          {/* Beli Langsung - Centered Button */}
          <Link
            href={`/checkout?productId=${product.id}`}
            className="w-full max-w-[240px] bg-gold hover:bg-gold-dark text-white font-bold text-sm py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Beli Sekarang
          </Link>
        </div>
      </div>
    </div>
  );
}
