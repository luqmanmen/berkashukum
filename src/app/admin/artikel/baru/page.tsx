import Link from "next/link";
import ArticleFormClient from "./ArticleFormClient";

export default function TambahArtikelPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 mb-20">
      <div className="flex items-center gap-4">
        <Link href="/admin/artikel" className="text-gray-400 hover:text-navy transition-colors">
          ← Kembali
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 font-serif">Tulis Artikel Baru</h1>
      </div>

      <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-6">
        <ArticleFormClient />
      </div>
    </div>
  );
}
