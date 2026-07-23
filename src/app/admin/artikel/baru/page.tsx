import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export default async function TambahArtikelPage() {
  async function createArticle(formData: FormData) {
    "use server";
    
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      throw new Error("Unauthorized");
    }

    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const content = formData.get("content") as string;
    const status = formData.get("status") as string;
    const coverImage = formData.get("coverImage") as string || null;

    // Generate simple slug
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

    await prisma.article.create({
      data: {
        title,
        slug: `${slug}-${Date.now()}`, // append timestamp to ensure uniqueness
        category,
        content,
        status,
        coverImage,
        authorId: session.user.id,
      },
    });

    redirect("/admin/artikel");
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 mb-20">
      <div className="flex items-center gap-4">
        <Link href="/admin/artikel" className="text-gray-400 hover:text-navy transition-colors">
          ← Kembali
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 font-serif">Tulis Artikel Baru</h1>
      </div>

      <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-6">
        <form action={createArticle} className="space-y-5">
          
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
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Konten Artikel (HTML Supported)</label>
            <textarea
              name="content"
              required
              rows={15}
              placeholder="<p>Mulai menulis di sini...</p>"
              className="w-full px-4 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-navy text-gray-900 font-mono"
            />
            <p className="text-xs text-gray-500 mt-2">Untuk sementara, Anda bisa menggunakan tag HTML dasar seperti &lt;p&gt;, &lt;strong&gt;, &lt;h2&gt; untuk memformat teks (MVP version).</p>
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
              className="bg-[#0a1628] hover:bg-[#112440] text-white px-6 py-2 rounded-sm text-sm font-semibold transition-colors"
            >
              Simpan & Terbitkan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
