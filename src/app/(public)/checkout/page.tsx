"use client";

import { useCart } from "@/hooks/useCart";
import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

interface ProductInfo {
  id: string;
  name: string;
  price: number;
}

function CheckoutContent() {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const directProductId = searchParams.get("productId");

  const [directProduct, setDirectProduct] = useState<ProductInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
  });

  useEffect(() => {
    if (directProductId) {
      fetch(`/api/products/${directProductId}`)
        .then((r) => r.json())
        .then((data) => setDirectProduct(data))
        .catch(() => {});
    }
  }, [directProductId]);

  // Items to checkout: direct product OR cart
  const checkoutItems = directProduct
    ? [{ id: directProduct.id, name: directProduct.name, price: directProduct.price, quantity: 1 }]
    : items;
  const checkoutTotal = directProduct ? directProduct.price : totalPrice;

  if (checkoutItems.length === 0) {
    return (
      <section className="pt-32 pb-20 min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="text-7xl mb-5">🛒</div>
          <h1 className="font-serif text-3xl font-bold text-navy mb-3">Tidak ada produk</h1>
          <Link href="/produk" className="btn-gold px-8 py-3.5 rounded-sm font-bold text-sm inline-block">
            Kembali ke Produk
          </Link>
        </div>
      </section>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: checkoutItems,
          totalAmount: checkoutTotal,
          buyerName: form.name,
          buyerEmail: form.email,
          buyerPhone: form.phone,
          notes: form.notes,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Checkout gagal");

      setSuccessData(data);
      clearCart();
    } catch (err: any) {
      alert(err.message || "Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  if (successData) {
    return (
      <section className="pt-32 pb-20 min-h-screen bg-cream flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-4 text-center">
          <div className="bg-white border border-gray-100 rounded-sm p-8 shadow-sm">
            <div className="text-5xl mb-4">✅</div>
            <h1 className="font-serif text-2xl font-bold text-navy mb-2">Pesanan Berhasil Dibuat</h1>
            <p className="text-gray-500 text-sm mb-6">Order ID: <span className="font-semibold text-navy">{successData.orderId}</span></p>

            <div className="bg-cream p-4 rounded-sm mb-6 border border-gray-200 text-left">
              <p className="text-sm text-gray-500 mb-1">Silakan transfer TEPAT sejumlah:</p>
              <div className="text-3xl font-bold text-gold mb-4">Rp {successData.finalAmount?.toLocaleString("id-ID")}</div>
              
              <div className="text-sm space-y-2">
                <p className="text-gray-500">Ke Rekening Bank:</p>
                <div className="font-semibold text-navy text-lg">BCA 1234567890</div>
                <div className="text-gray-600">a.n. Luqman Arif</div>
              </div>
            </div>

            <p className="text-xs text-red-500 font-semibold mb-6">
              PENTING: Transfer sesuai nominal di atas HINGGA 3 DIGIT TERAKHIR agar pembayaran terverifikasi otomatis.
            </p>

            <Link href="/" className="btn-gold px-8 py-3.5 rounded-sm font-bold text-sm block w-full text-center">
              Selesai & Kembali ke Beranda
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>

      <section className="pt-28 pb-16 min-h-screen bg-cream">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="font-serif text-3xl font-bold text-navy">Checkout</h1>
            <p className="text-gray-500 text-sm mt-1">Lengkapi data Anda untuk melanjutkan pembayaran</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-sm p-7 shadow-sm space-y-5">
                <h2 className="font-serif font-bold text-navy text-lg mb-2">Data Pembeli</h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="checkout-name">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="checkout-name"
                    name="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Masukkan nama lengkap Anda"
                    className="w-full px-4 py-3 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-gold text-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="checkout-email">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="checkout-email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="email@anda.com"
                    className="w-full px-4 py-3 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-gold text-gray-800"
                  />
                  <p className="text-xs text-gray-400 mt-1">Link download akan dikirim ke email ini.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="checkout-phone">
                    No. WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="checkout-phone"
                    name="phone"
                    type="tel"
                    required
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="08xx-xxxx-xxxx"
                    className="w-full px-4 py-3 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-gold text-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="checkout-notes">
                    Catatan (opsional)
                  </label>
                  <textarea
                    id="checkout-notes"
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Catatan atau pertanyaan khusus..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-gold text-gray-800 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-gold w-full py-4 rounded-sm font-bold text-sm tracking-wide disabled:opacity-60"
                >
                  {loading ? "Memproses..." : "Buat Pesanan →"}
                </button>
                <p className="text-xs text-center text-gray-400">
                  🔒 Data Anda dilindungi. Pembayaran dilakukan via transfer bank.
                </p>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-100 rounded-sm p-6 shadow-sm sticky top-24">
                <h2 className="font-serif font-bold text-navy text-lg mb-5">Ringkasan Pesanan</h2>
                <div className="space-y-3 mb-5">
                  {checkoutItems.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-gray-500 truncate mr-2">{item.name} ×{item.quantity}</span>
                      <span className="text-navy font-medium whitespace-nowrap">
                        Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-100 pt-4">
                  <div className="flex justify-between font-bold text-navy">
                    <span>Total Pembayaran</span>
                    <span className="text-gold text-lg">Rp {checkoutTotal.toLocaleString("id-ID")}</span>
                  </div>
                </div>

                <div className="mt-5 pt-5 border-t border-gray-100 space-y-2">
                  <div className="text-xs text-gray-500 font-semibold mb-2">Metode Pembayaran Tersedia:</div>
                  <div className="flex flex-wrap gap-2">
                    {["Transfer Bank BCA"].map((m) => (
                      <span key={m} className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">{m}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <section className="pt-32 pb-20 min-h-screen bg-cream flex items-center justify-center">
        <div className="text-gray-500 font-semibold">Memuat halaman checkout...</div>
      </section>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
