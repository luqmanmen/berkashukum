"use client";

import { useCart } from "@/hooks/useCart";
import { useState } from "react";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string | null;
}

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem({ id: product.id, name: product.name, price: product.price, image: product.image ?? undefined });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button
      onClick={handleAdd}
      className={`flex items-center justify-center gap-2 px-5 py-4 rounded-xl font-bold text-sm transition-all border-2 min-w-[52px] ${
        added
          ? "bg-green-600 border-green-600 text-white"
          : "bg-white border-navy-dark text-navy-dark hover:bg-navy-dark hover:text-white"
      }`}
    >
      {added ? (
        <>✓ Ditambahkan</>
      ) : (
        <>
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span className="hidden sm:inline">Keranjang</span>
        </>
      )}
    </button>
  );
}
