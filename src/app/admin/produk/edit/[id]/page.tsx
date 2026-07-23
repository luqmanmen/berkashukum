import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default async function EditProdukPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) notFound();

  async function updateProduct(formData: FormData) {
    "use server";

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseInt(formData.get("price") as string);
    const category = formData.get("category") as string;
    const status = formData.get("status") as string;

    const dataToUpdate: any = {
      name,
      description,
      price,
      category,
      status,
    };

    // Handle Image Upload
    const imageFile = formData.get("image") as File | null;
    if (imageFile && imageFile.size > 0) {
      const ext = imageFile.name.split('.').pop();
      const fileName = `images/${id}-${Date.now()}.${ext}`;
      
      const { data, error } = await supabase.storage
        .from("products")
        .upload(fileName, imageFile, { upsert: true });
        
      if (!error && data) {
        const { data: publicUrlData } = supabase.storage.from("products").getPublicUrl(fileName);
        dataToUpdate.image = publicUrlData.publicUrl;
      }
    }

    // Handle Digital File Upload
    const digitalFile = formData.get("digitalFile") as File | null;
    if (digitalFile && digitalFile.size > 0) {
      const ext = digitalFile.name.split('.').pop();
      const fileName = `files/${id}-${Date.now()}.${ext}`;
      
      const { data, error } = await supabase.storage
        .from("products")
        .upload(fileName, digitalFile, { upsert: true });
        
      if (!error && data) {
        const { data: publicUrlData } = supabase.storage.from("products").getPublicUrl(fileName);
        dataToUpdate.digitalFile = publicUrlData.publicUrl;
      }
    }

    await prisma.product.update({
      where: { id },
      data: dataToUpdate,
    });

    redirect("/admin/produk");
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 mb-20">
      <div className="flex items-center gap-4">
        <Link href="/admin/produk" className="text-gray-400 hover:text-navy transition-colors">
          ← Kembali
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 font-serif">Edit Produk</h1>
      </div>

      <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-6">
        <form action={updateProduct} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Produk</label>
            <input
              name="name"
              type="text"
              required
              defaultValue={product.name}
              className="w-full px-4 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-navy text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Kategori</label>
            <select
              name="category"
              required
              defaultValue={product.category || "Lainnya"}
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
              defaultValue={product.price}
              className="w-full px-4 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-navy text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Deskripsi Lengkap</label>
            <textarea
              name="description"
              required
              rows={5}
              defaultValue={product.description}
              className="w-full px-4 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-navy text-gray-900 resize-none"
            />
          </div>

          <div className="border-t border-gray-100 pt-5 mt-5">
            <h3 className="font-semibold text-gray-900 mb-4">Ganti Berkas (Opsional)</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Gambar Sampul</label>
                {product.image && (
                  <div className="mb-2 text-xs text-blue-600">
                    <a href={product.image} target="_blank" rel="noopener noreferrer">Lihat gambar saat ini</a>
                  </div>
                )}
                <input
                  name="image"
                  type="file"
                  accept="image/*"
                  className="w-full px-4 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-navy text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer"
                />
                <p className="text-xs text-gray-400 mt-1.5">Biarkan kosong jika tidak ingin mengubah gambar.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Berkas Digital (Dokumen/PDF)</label>
                {product.digitalFile && (
                  <div className="mb-2 text-xs text-blue-600">
                    <a href={product.digitalFile} target="_blank" rel="noopener noreferrer">Lihat berkas digital saat ini</a>
                  </div>
                )}
                <input
                  name="digitalFile"
                  type="file"
                  accept=".pdf,.doc,.docx,.zip"
                  className="w-full px-4 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-navy text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-sm file:font-semibold file:bg-[#0a1628] file:text-white hover:file:bg-[#112440] cursor-pointer"
                />
                <p className="text-xs text-gray-400 mt-1.5">Biarkan kosong jika tidak ingin mengubah berkas.</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-5 mt-5">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
            <select
              name="status"
              defaultValue={product.status}
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
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
