import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import DownloadClient from "./DownloadClient";

export default async function DownloadPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  // Jika order belum lunas atau tidak ada download code (berarti belum diapprove)
  if (order.status !== "PAID" || !order.downloadCode) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full rounded-sm shadow-xl p-8 text-center border-t-4 border-gold">
          <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
            ⏳
          </div>
          <h1 className="text-xl font-bold font-serif text-navy-dark mb-3">
            Pesanan Sedang Diproses
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            Admin sedang memverifikasi pembayaran Anda untuk Order ID <strong>{order.id}</strong>. Kode unduhan akan dikirimkan ke email <strong>{order.buyerEmail}</strong> setelah pembayaran disetujui.
          </p>
          <a href="/" className="inline-block px-6 py-2.5 bg-navy text-white text-sm font-semibold rounded-sm hover:bg-navy-dark transition-colors">
            Kembali ke Beranda
          </a>
        </div>
      </div>
    );
  }

  return <DownloadClient order={order} />;
}
