"use client";

import { useCart } from "@/hooks/useCart";
import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { BANKS } from "@/lib/banks";

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
  const [isFetchingDirectProduct, setIsFetchingDirectProduct] = useState(!!directProductId);
  const [successData, setSuccessData] = useState<any>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
    paymentMethod: "TRANSFER",
    bankName: "BCA",
  });

  // Restore saved form data (when user clicks "GANTI" from payment page)
  useEffect(() => {
    try {
      const savedForm = sessionStorage.getItem("checkout_form");
      if (savedForm) {
        setForm(JSON.parse(savedForm));
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (directProductId) {
      setIsFetchingDirectProduct(true);
      fetch(`/api/products/${directProductId}`)
        .then((r) => r.json())
        .then((data) => setDirectProduct(data))
        .catch(() => {})
        .finally(() => setIsFetchingDirectProduct(false));
    }
  }, [directProductId]);

  // Items to checkout: direct product OR cart OR saved session (for "ganti metode" flow)
  const checkoutItems = directProduct
    ? [{ id: directProduct.id, name: directProduct.name, price: directProduct.price, quantity: 1 }]
    : items.length > 0 ? items : (() => {
        try {
          if (typeof window === "undefined") return [];
          const raw = sessionStorage.getItem("checkout_items");
          return raw ? JSON.parse(raw) : [];
        } catch { return []; }
      })();
  const checkoutTotal = directProduct ? directProduct.price : items.length > 0 ? totalPrice : (() => {
    try {
      if (typeof window === "undefined") return 0;
      const raw = sessionStorage.getItem("checkout_total");
      return raw ? Number(raw) : 0;
    } catch { return 0; }
  })();

  if (isFetchingDirectProduct) {
    return (
      <section className="pt-32 pb-20 min-h-screen bg-cream flex items-center justify-center">
        <div className="text-gray-500 font-semibold flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-gold rounded-full animate-spin"></div>
          Memuat detail produk...
        </div>
      </section>
    );
  }

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
      const payload = {
        items: checkoutItems,
        totalAmount: checkoutTotal,
        buyerName: form.name,
        buyerEmail: form.email,
        buyerPhone: form.phone,
        notes: form.notes,
        paymentMethod: form.paymentMethod,
        bankName: form.paymentMethod === "TRANSFER" ? form.bankName : null,
      };

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Checkout gagal");

      // Simpan data ke sessionStorage agar bisa dikembalikan jika user klik "GANTI"
      sessionStorage.setItem("checkout_form", JSON.stringify(form));
      sessionStorage.setItem("checkout_items", JSON.stringify(checkoutItems));
      sessionStorage.setItem("checkout_total", String(checkoutTotal));

      clearCart();
      router.push(`/pembayaran/${data.orderId}`);
    } catch (err: any) {
      alert(err.message || "Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };



  return (
    <>

      <section className="pt-10 pb-16 min-h-screen bg-cream">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link href="/produk" className="inline-flex items-center text-navy hover:text-gold transition-colors font-bold text-2xl font-serif mb-2">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
              Checkout
            </Link>
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
                    className="w-full px-4 py-3.5 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-gold focus:ring-4 focus:ring-gold/20 hover:border-gray-300 transition-all duration-300 text-gray-800 bg-gray-50/50 focus:bg-white"
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
                    className="w-full px-4 py-3.5 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-gold focus:ring-4 focus:ring-gold/20 hover:border-gray-300 transition-all duration-300 text-gray-800 bg-gray-50/50 focus:bg-white resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Metode Pembayaran <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-3">
                    <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                      form.paymentMethod === "TRANSFER" 
                        ? "border-gold bg-gold/5 shadow-md shadow-gold/10 -translate-y-0.5" 
                        : "border-gray-100 hover:border-gray-300 hover:bg-gray-50/80 hover:-translate-y-0.5 hover:shadow-sm bg-white"
                    }`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="TRANSFER"
                        checked={form.paymentMethod === "TRANSFER"}
                        onChange={handleChange}
                        className="w-4 h-4 text-gold border-gray-300 focus:ring-gold focus:ring-offset-2 transition-all"
                      />
                      <span className="ml-3 text-sm font-semibold text-gray-800 flex items-center">
                        <span className="text-xl mr-2">🏦</span> Virtual Account DANA
                      </span>
                    </label>

                    {form.paymentMethod === "TRANSFER" && (
                      <div className="ml-7 mt-2 mb-4 p-3 border-l-2 border-gold bg-gray-50">
                        <label className="block text-xs font-semibold text-gray-600 mb-3">Pilih Bank (DANA Virtual Account):</label>
                        
                        <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                          {BANKS.map((bank) => (
                            <label
                              key={bank.id}
                              className={`flex items-center p-2.5 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                                form.bankName === bank.id
                                  ? "border-blue-500 bg-blue-50/80 shadow-md shadow-blue-500/10 scale-[1.02]"
                                  : "border-gray-100 bg-white hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm"
                              }`}
                            >
                              <div className="w-14 h-7 flex items-center justify-center bg-white border border-gray-100 rounded-lg p-0.5 mr-3 flex-shrink-0 shadow-sm overflow-hidden">
                                <img 
                                  src={bank.logo} 
                                  alt={bank.name} 
                                  className={`max-w-full max-h-full object-contain ${bank.scale || ""}`}
                                  onError={(e) => { 
                                    (e.target as HTMLImageElement).style.display = 'none';
                                    (e.target as HTMLImageElement).parentElement!.style.backgroundColor = bank.bgColor;
                                  }}
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className="text-sm font-semibold text-gray-800">{bank.name}</span>
                                <span className="text-[10px] text-gray-400 ml-1.5">{bank.type === "VA" ? `Prefix: ${bank.prefix}` : "No HP Langsung"}</span>
                              </div>
                              <input
                                type="radio"
                                name="bankName"
                                value={bank.id}
                                checked={form.bankName === bank.id}
                                onChange={(e) => setForm({ ...form, bankName: e.target.value })}
                                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 flex-shrink-0"
                              />
                            </label>
                          ))}
                        </div>
                        
                        <p className="text-[10px] text-gray-500 mt-3">
                          Nomor Virtual Account akan tampil di halaman pembayaran.
                        </p>
                      </div>
                    )}
                    <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                      form.paymentMethod === "QRIS" 
                        ? "border-gold bg-gold/5 shadow-md shadow-gold/10 -translate-y-0.5" 
                        : "border-gray-100 hover:border-gray-300 hover:bg-gray-50/80 hover:-translate-y-0.5 hover:shadow-sm bg-white"
                    }`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="QRIS"
                        checked={form.paymentMethod === "QRIS"}
                        onChange={handleChange}
                        className="w-4 h-4 text-gold border-gray-300 focus:ring-gold focus:ring-offset-2 transition-all"
                      />
                      <span className="ml-3 text-sm font-semibold text-gray-800 flex items-center gap-2">
                        <img src="/images/qris.svg" alt="QRIS" className="h-5 object-contain" />
                        QRIS
                      </span>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-gold w-full py-4 rounded-xl font-bold text-sm tracking-wide disabled:opacity-60 hover-glow active:scale-95 transition-all duration-300 relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? "Memproses..." : "Buat Pesanan"}
                    {!loading && <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>}
                  </span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
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
                  {checkoutItems.map((item: any, i: number) => (
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
