import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminArtikelPage() {
  const articles = await prisma.article.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-serif">Kelola Artikel</h1>
          <p className="text-gray-500 text-sm mt-1">Daftar artikel blog dan publikasi berita hukum</p>
        </div>
        <Link
          href="/admin/artikel/baru"
          className="bg-[#0a1628] hover:bg-[#c9a84c] text-white hover:text-[#0a1628] px-4 py-2 rounded-sm text-sm font-semibold transition-colors flex items-center gap-2"
        >
          <span>✍️</span> Tulis Artikel Baru
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Judul Artikel</th>
                <th className="px-6 py-4 font-semibold">Kategori</th>
                <th className="px-6 py-4 font-semibold">Penulis</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm">
              {articles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                    Belum ada artikel.
                  </td>
                </tr>
              ) : (
                articles.map((article) => (
                  <tr key={article.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 line-clamp-1">{article.title}</div>
                      <div className="text-gray-400 text-xs mt-1">
                        {new Date(article.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric", month: "long", year: "numeric"
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full text-xs">
                        {article.category || "-"}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 text-sm">
                      {article.author.name}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          article.status === "PUBLISHED"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {article.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-3">
                        <button className="text-blue-600 hover:text-blue-800 font-medium text-xs">Edit</button>
                        <button className="text-red-500 hover:text-red-700 font-medium text-xs">Hapus</button>
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
