import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminLayananPage() {
  const items = await prisma.serviceCarousel.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-serif">Kelola Layanan (Carousel)</h1>
          <p className="text-gray-500 text-sm mt-1">Daftar layanan & keahlian yang muncul di beranda</p>
        </div>
        <Link
          href="/admin/layanan/baru"
          className="bg-navy-dark hover:bg-gold text-white hover:text-navy-dark px-4 py-2 rounded-sm text-sm font-semibold transition-colors flex items-center gap-2"
        >
          <span>➕</span> Tambah Layanan
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Gambar</th>
                <th className="px-6 py-4 font-semibold">Nama Layanan</th>
                <th className="px-6 py-4 font-semibold">Deskripsi</th>
                <th className="px-6 py-4 font-semibold text-center">Urutan</th>
                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                    Belum ada layanan.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-500">No Img</div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
                    <td className="px-6 py-4 text-gray-500 max-w-xs truncate">{item.description}</td>
                    <td className="px-6 py-4 text-center font-bold text-gray-700">{item.order}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-3">
                        <Link href={`/admin/layanan/${item.id}`} className="text-blue-600 hover:text-blue-800 font-medium text-xs">Edit</Link>
                      </div>
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
