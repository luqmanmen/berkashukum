"use client";

import { useCart } from "@/hooks/useCart";
import Link from "next/link";
import Image from "next/image";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <section className="pt-32 pb-20 min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="text-7xl mb-5">🛒</div>
          <h1 className="font-serif text-3xl font-bold text-navy mb-3">Keranjang Kosong</h1>
          <p className="text-gray-500 mb-8">Belum ada produk di keranjang Anda.</p>
          <Link href="/produk" className="btn-gold px-8 py-3.5 rounded-sm font-bold text-sm inline-block">
            Jelajahi Produk
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-28 pb-16 min-h-screen bg-cream">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl font-bold text-navy">Keranjang Belanja</h1>
            <p className="text-gray-500 text-sm mt-1">{items.length} produk di keranjang</p>
          </div>
          <button
            onClick={clearCart}
            className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
          >
            Hapus Semua
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white border border-gray-100 rounded-sm p-5 shadow-sm flex gap-4">
                {/* Icon */}
                <div className="w-16 h-16 bg-navy rounded-sm flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">📄</span>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-navy text-sm mb-1 leading-snug">{item.name}</h3>
                  <div className="text-gold font-bold text-sm">
                    Rp {item.price.toLocaleString("id-ID")}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  {/* Quantity */}
                  <div className="flex items-center gap-2 border border-gray-200 rounded-sm">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-navy text-sm"
                    >
                      −
                    </button>
                    <span className="text-sm font-semibold text-navy w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-navy text-sm"
                    >
                      +
                    </button>
                  </div>
                  {/* Subtotal */}
                  <div className="text-navy font-bold text-sm">
                    Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-xs text-red-400 hover:text-red-600 transition-colors"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-100 rounded-sm p-6 shadow-sm sticky top-24">
              <h2 className="font-serif font-bold text-navy text-lg mb-5">Ringkasan Pesanan</h2>
              <div className="space-y-3 mb-5">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-500 truncate mr-2">{item.name} ×{item.quantity}</span>
                    <span className="text-navy font-medium whitespace-nowrap">
                      Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-4 mb-5">
                <div className="flex justify-between font-bold text-navy">
                  <span>Total</span>
                  <span className="text-gold text-lg">Rp {totalPrice.toLocaleString("id-ID")}</span>
                </div>
              </div>
              <Link
                href="/checkout"
                className="btn-gold block w-full text-center py-4 rounded-sm font-bold text-sm"
              >
                Lanjut ke Checkout →
              </Link>
              <Link
                href="/produk"
                className="block text-center text-sm text-gray-400 hover:text-navy mt-3 transition-colors"
              >
                ← Lanjut Belanja
              </Link>
              <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                <p className="text-xs text-gray-400">🔒 Pembayaran aman via Transfer Bank (Otomatis)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
