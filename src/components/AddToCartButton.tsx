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
      className={`w-full py-3.5 rounded-sm font-bold text-sm transition-all ${
        added ? "bg-green-600 text-white" : "border-2 border-navy text-navy hover:bg-navy hover:text-white"
      }`}
    >
      {added ? "✓ Ditambahkan ke Keranjang" : "🛒 Tambah ke Keranjang"}
    </button>
  );
}
