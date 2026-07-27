import { prisma } from "@/lib/prisma";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pembayaran Berhasil | LexNova Law Firm",
};

export default async function SuksesPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string; status?: string }>;
}) {
  const params = await searchParams;
  const orderId = params.orderId;
  const status = params.status;

  let order = null;
  if (orderId) {
    order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { product: true } } },
    });
  }

  const isPending = status === "pending" || order?.status === "PENDING";

  return (
    <section className="pt-32 pb-20 min-h-screen bg-cream flex items-center justify-center">
      <div className="max-w-lg mx-auto px-4 text-center">
        {/* Status Icon */}
        <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${isPending ? "bg-yellow-100" : "bg-green-100"}`}>
          <span className="text-5xl">{isPending ? "⏳" : "✅"}</span>
        </div>

        <h1 className="font-serif text-4xl font-bold text-navy mb-3">
          {isPending ? "Menunggu Pembayaran" : "Pembayaran Berhasil!"}
        </h1>
        <p className="text-gray-500 mb-6">
          {isPending
            ? "Pesanan Anda telah dibuat. Selesaikan pembayaran untuk mendapatkan akses produk."
            : "Terima kasih! Pesanan Anda telah berhasil diproses. Link download akan dikirim ke email Anda."}
        </p>

        {/* Order Details */}
        {order && (
          <div className="bg-white border border-gray-100 rounded-sm p-6 shadow-sm mb-6 text-left">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-serif font-bold text-navy">Detail Pesanan</h2>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                order.status === "PAID" ? "bg-green-100 text-green-700" :
                order.status === "PENDING" ? "bg-yellow-100 text-yellow-700" :
                "bg-gray-100 text-gray-600"
              }`}>
                {order.status}
              </span>
            </div>

            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-gray-500">Order ID</span>
                <span className="font-mono font-bold text-navy">{order.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Nama</span>
                <span className="font-medium text-navy">{order.buyerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Email</span>
                <span className="font-medium text-navy">{order.buyerEmail}</span>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-2">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-gray-600">{item.product.name} ×{item.quantity}</span>
                  <span className="font-medium text-navy">Rp {(item.price * item.quantity).toLocaleString("id-ID")}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold pt-2 border-t border-gray-100">
                <span className="text-navy">Total</span>
                <span className="text-gold">Rp {order.totalAmount.toLocaleString("id-ID")}</span>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          {!isPending && (
            <div className="bg-navy text-white rounded-sm p-4 text-sm">
              📧 Link download telah dikirim ke <strong>{order?.buyerEmail}</strong>
            </div>
          )}
          <Link href="/produk" className="btn-gold block py-3.5 rounded-sm font-bold text-sm">
            Kembali ke Produk
          </Link>
          <Link href="/" className="block text-sm text-gray-400 hover:text-navy transition-colors">
            Ke Halaman Utama
          </Link>
        </div>

        {/* Contact if issue */}
        <div className="mt-8 p-4 border border-gold/20 rounded-sm text-sm text-gray-500">
          Ada masalah? Hubungi kami di{" "}
          <a href="mailto:info@lexnova.co.id" className="text-gold hover:text-gold-light transition-colors font-medium">
            info@lexnova.co.id
          </a>{" "}
          atau{" "}
          <a href="https://wa.me/628123456789" className="text-green-600 hover:text-green-700 transition-colors font-medium">
            WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
