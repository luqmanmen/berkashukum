import { prisma } from "@/lib/prisma";
import UpdateStatusButton from "./UpdateStatusButton";

export default async function AdminPesananPage() {
  const now = new Date();
  
  const orders = await prisma.order.findMany({
    where: {
      OR: [
        { status: "PAID" },
        { paymentProof: { not: null } },
        { 
          status: "PENDING",
          OR: [
            { expiresAt: null },
            { expiresAt: { gt: now } }
          ]
        }
      ]
    },
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: { product: true }
      }
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 font-serif">Kelola Pesanan</h1>
        <p className="text-gray-500 text-sm mt-1">Daftar semua transaksi yang masuk</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Order ID</th>
                <th className="px-6 py-4 font-semibold">Pembeli</th>
                <th className="px-6 py-4 font-semibold">Produk</th>
                <th className="px-6 py-4 font-semibold">Total</th>
                <th className="px-6 py-4 font-semibold">Status & Bukti</th>
                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                    Belum ada pesanan.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono text-xs font-semibold text-gray-900">
                      {order.id}
                      <div className="text-gray-400 font-sans mt-1">
                        {new Date(order.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric", month: "short", year: "numeric"
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{order.buyerName}</div>
                      <div className="text-gray-500 text-xs mt-1">{order.buyerEmail}</div>
                      <div className="text-gray-500 text-xs">{order.buyerPhone}</div>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-600">
                      <ul className="list-disc list-inside">
                        {order.items.map((item) => (
                          <li key={item.id}>
                            {item.product.name} (x{item.quantity})
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      Rp {order.totalAmount.toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          order.status === "PAID"
                            ? "bg-green-100 text-green-700"
                            : order.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {order.status}
                      </span>
                      {order.paymentProof && (
                        <div className="mt-2">
                          <a 
                            href={order.paymentProof} 
                            target="_blank" 
                            rel="noreferrer"
                            className="text-xs text-blue-600 hover:underline font-semibold"
                          >
                            📄 Lihat Bukti
                          </a>
                        </div>
                      )}
                      {order.downloadCode && (
                        <div className="mt-2 text-[10px]">
                          <span className="text-gray-500 block">Kode Download:</span>
                          <span className="font-mono font-bold text-navy bg-navy/10 px-1 py-0.5 rounded">{order.downloadCode}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {order.status === "PENDING" && (
                        <UpdateStatusButton id={order.id} currentStatus="PENDING" targetStatus="PAID" label="Tandai Lunas" />
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
