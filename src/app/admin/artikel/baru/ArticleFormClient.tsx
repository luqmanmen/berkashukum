"use client";

import { useState } from "react";
import Link from "next/link";
import RichTextEditor from "@/components/RichTextEditor";
import { createArticle } from "./actions";

export default function ArticleFormClient() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      formData.append("content", content);
      await createArticle(formData);
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat menyimpan artikel.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Judul Artikel</label>
          <input
            name="title"
            type="text"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-navy text-gray-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Kategori</label>
          <input
            name="category"
            type="text"
            placeholder="Misal: Hukum Bisnis"
            className="w-full px-4 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-navy text-gray-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
          <select
            name="status"
            className="w-full px-4 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-navy text-gray-900"
          >
            <option value="PUBLISHED">PUBLISHED (Langsung Tampil)</option>
            <option value="DRAFT">DRAFT (Simpan Sementara)</option>
          </select>
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">URL Gambar Cover (Opsional)</label>
          <input
            name="coverImage"
            type="url"
            placeholder="https://..."
            className="w-full px-4 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-navy text-gray-900"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Konten Artikel</label>
        <div className="border border-gray-300 rounded-sm overflow-hidden">
          <RichTextEditor value={content} onChange={setContent} />
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
        <Link
          href="/admin/artikel"
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-sm text-sm font-semibold hover:bg-gray-50 transition-colors"
        >
          Batal
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="bg-navy-dark hover:bg-navy-mid text-white px-6 py-2 rounded-sm text-sm font-semibold transition-colors disabled:opacity-50"
        >
          {loading ? "Menyimpan..." : "Simpan & Terbitkan"}
        </button>
      </div>
    </form>
  );
}
