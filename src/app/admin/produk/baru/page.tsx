import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { nanoid } from "nanoid";
import { supabase } from "@/lib/supabase";

export default function TambahProdukPage() {
  async function createProduct(formData: FormData) {
    "use server";

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseInt(formData.get("price") as string);
    const category = formData.get("category") as string;
    const status = formData.get("status") as string;

    const id = `PROD-${nanoid(8).toUpperCase()}`;

    // Handle Image Upload
    let imageUrl = null;
    const imageFile = formData.get("image") as File | null;
    if (imageFile && imageFile.size > 0) {
      const ext = imageFile.name.split('.').pop();
      const fileName = `images/${id}.${ext}`;
      
      const { data, error } = await supabase.storage
        .from("products")
        .upload(fileName, imageFile, { upsert: true });
        
      if (!error && data) {
        const { data: publicUrlData } = supabase.storage.from("products").getPublicUrl(fileName);
        imageUrl = publicUrlData.publicUrl;
      }
    }

    // Handle Digital File Upload (The actual document/ebook)
    let digitalFileUrl = null;
    const digitalFile = formData.get("digitalFile") as File | null;
    if (digitalFile && digitalFile.size > 0) {
      const ext = digitalFile.name.split('.').pop();
      const fileName = `files/${id}.${ext}`;
      
      const { data, error } = await supabase.storage
        .from("products")
        .upload(fileName, digitalFile, { upsert: true });
        
      if (!error && data) {
        // Ideally this should be signed url generated at download time, 
        // but for simplicity we store the public URL or the path. 
        // We'll store the public URL here.
        const { data: publicUrlData } = supabase.storage.from("products").getPublicUrl(fileName);
        digitalFileUrl = publicUrlData.publicUrl;
      }
    }

    await prisma.product.create({
      data: {
        id,
        name,
        description,
        price,
        category,
        status,
        image: imageUrl,
        digitalFile: digitalFileUrl,
      },
    });

    redirect("/admin/produk");
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 mb-20">
      <div className="flex items-center gap-4">
        <Link href="/admin/produk" className="text-gray-400 hover:text-navy transition-colors">
          ← Kembali
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 font-serif">Tambah Produk Baru</h1>
      </div>

      <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-6">
        <form action={createProduct} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Produk</label>
            <input
              name="name"
              type="text"
              required
              placeholder="Contoh: Template Kontrak Kerja"
              className="w-full px-4 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-navy text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Kategori</label>
            <select
              name="category"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-navy text-gray-900"
            >
              <option value="Template Dokumen">Template Dokumen</option>
              <option value="E-Book">E-Book</option>
              <option value="Konsultasi">Konsultasi</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Harga (Rp)</label>
            <input
              name="price"
              type="number"
              required
              min="0"
              placeholder="Contoh: 50000"
              className="w-full px-4 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-navy text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Deskripsi Lengkap</label>
            <textarea
              name="description"
              required
              rows={5}
              placeholder="Jelaskan fitur dan detail produk Anda..."
              className="w-full px-4 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-navy text-gray-900 resize-none"
            />
          </div>

          <div className="border-t border-gray-100 pt-5 mt-5">
            <h3 className="font-semibold text-gray-900 mb-4">Upload Berkas</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Gambar Sampul (Opsional)</label>
                <input
                  name="image"
                  type="file"
                  accept="image/*"
                  className="w-full px-4 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-navy text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Berkas Digital (Dokumen/PDF)</label>
                <input
                  name="digitalFile"
                  type="file"
                  accept=".pdf,.doc,.docx,.zip"
                  className="w-full px-4 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-navy text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-sm file:font-semibold file:bg-[#0a1628] file:text-white hover:file:bg-[#112440] cursor-pointer"
                />
                <p className="text-xs text-gray-500 mt-1.5">File ini yang akan dikirim ke pembeli setelah pesanan lunas.</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-5 mt-5">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
            <select
              name="status"
              className="w-full px-4 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-navy text-gray-900"
            >
              <option value="PUBLISHED">PUBLISHED (Tampil)</option>
              <option value="DRAFT">DRAFT (Sembunyikan)</option>
            </select>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
            <Link
              href="/admin/produk"
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-sm text-sm font-semibold hover:bg-gray-50 transition-colors"
            >
              Batal
            </Link>
            <button
              type="submit"
              className="bg-[#0a1628] hover:bg-[#112440] text-white px-6 py-2 rounded-sm text-sm font-semibold transition-colors"
            >
              Simpan Produk
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
