"use client";

import { useState } from "react";
import Link from "next/link";
import RichTextEditor from "@/components/RichTextEditor";
import ImageUploadWithCrop from "@/components/ui/ImageUploadWithCrop";
import ActionForm from "@/components/admin/ActionForm";
import { updateArticle } from "./actions";
import type { Article } from "@/generated/prisma";

export default function EditArticleForm({ initialData }: { initialData: Article }) {
  const [sourceType, setSourceType] = useState<"MANUAL" | "EXTERNAL">(
    initialData.externalUrl ? "EXTERNAL" : "MANUAL"
  );
  const [content, setContent] = useState(initialData.content || "");
  const [externalUrl, setExternalUrl] = useState(initialData.externalUrl || "");

  // Update wrapper that passes id
  const handleUpdate = async (formData: FormData) => {
    formData.append("id", initialData.id);
    return await updateArticle(formData);
  };

  return (
    <ActionForm action={handleUpdate} successUrl="/admin/artikel" className="space-y-6">
      <input type="hidden" name="sourceType" value={sourceType} />
      {sourceType === "MANUAL" ? (
        <input type="hidden" name="content" value={content} />
      ) : (
        <>
          <input type="hidden" name="content" value="" />
          <input type="hidden" name="externalUrl" value={externalUrl} />
        </>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Judul Artikel</label>
          <input
            name="title"
            type="text"
            required
            defaultValue={initialData.title}
            className="w-full px-4 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-navy text-gray-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Kategori</label>
          <input
            name="category"
            type="text"
            defaultValue={initialData.category || ""}
            placeholder="Misal: Hukum Bisnis"
            className="w-full px-4 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-navy text-gray-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
          <select
            name="status"
            defaultValue={initialData.status}
            className="w-full px-4 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-navy text-gray-900"
          >
            <option value="PUBLISHED">PUBLISHED (Langsung Tampil)</option>
            <option value="DRAFT">DRAFT (Simpan Sementara)</option>
          </select>
        </div>
        
        <div className="flex items-end mb-1">
          <label className="flex items-center gap-2 cursor-pointer p-2 border border-gray-200 rounded-sm hover:bg-gray-50 w-full transition-colors">
            <input 
              type="checkbox" 
              name="isTrending"
              defaultChecked={initialData.isTrending}
              className="w-4 h-4 text-navy rounded border-gray-300 focus:ring-navy" 
            />
            <span className="text-sm font-semibold text-gray-800">⭐ Jadikan Artikel Trending</span>
          </label>
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Gambar Cover (Opsional)</label>
          <ImageUploadWithCrop
            name="coverImage"
            required={false}
            aspect={16/9}
            defaultValue={initialData.coverImage || undefined}
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Penulis Artikel (Opsional)</label>
          <input
            name="authorName"
            type="text"
            defaultValue={(initialData as any).authorName || ""}
            placeholder="Misal: Tim Berkas Hukum"
            className="w-full px-4 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-navy text-gray-900"
          />
          <p className="text-xs text-gray-500 mt-1">Kosongkan jika ingin menggunakan nama Anda (Super Admin).</p>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100">
        <label className="block text-sm font-medium text-gray-700 mb-3">Sumber Artikel</label>
        <div className="flex gap-4 mb-5">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="radio" 
              name="sourceType" 
              checked={sourceType === "MANUAL"} 
              onChange={() => setSourceType("MANUAL")}
              className="text-navy focus:ring-navy"
            />
            <span className="text-sm text-gray-800">Tulis Sendiri</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="radio" 
              name="sourceType" 
              checked={sourceType === "EXTERNAL"} 
              onChange={() => setSourceType("EXTERNAL")}
              className="text-navy focus:ring-navy"
            />
            <span className="text-sm text-gray-800">Link Eksternal (Add URL)</span>
          </label>
        </div>

        {sourceType === "MANUAL" ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Konten Artikel</label>
            <div className="border border-gray-300 rounded-sm overflow-hidden">
              <RichTextEditor value={content} onChange={setContent} />
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">URL Berita / Artikel Eksternal</label>
            <input
              type="url"
              value={externalUrl}
              onChange={(e) => setExternalUrl(e.target.value)}
              required={sourceType === "EXTERNAL"}
              placeholder="https://detik.com/berita-..."
              className="w-full px-4 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-navy text-gray-900"
            />
            <p className="text-xs text-gray-500 mt-2">Jika Anda memasukkan link di sini, pengunjung yang mengklik artikel ini akan langsung diarahkan ke link tersebut.</p>
          </div>
        )}
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
          className="bg-navy-dark hover:bg-navy-mid text-white px-6 py-2 rounded-sm text-sm font-semibold transition-colors disabled:opacity-50"
        >
          Simpan Perubahan
        </button>
      </div>
    </ActionForm>
  );
}
