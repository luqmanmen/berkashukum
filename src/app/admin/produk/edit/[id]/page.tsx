import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import PriceInput from "@/components/admin/PriceInput";
import FeatureInput from "@/components/admin/FeatureInput";

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
    const price = parseInt((formData.get("price") as string).replace(/\D/g, ""), 10);
    const category = formData.get("category") as string;
    const documentFormat = (formData.get("documentFormat") as string) || null;
    const promoStatus = (formData.get("promoStatus") as string) || null;
    const features = formData.get("features") as string;
    const status = formData.get("status") as string;

    const dataToUpdate: any = {
      name,
      description,
      price,
      category,
      documentFormat,
      promoStatus,
      features: features || null,
      status,
    };

    // Handle Image Upload
    const imageFile = formData.get("image") as File | null;
    if (imageFile && imageFile.size > 0) {
      const ext = imageFile.name.split('.').pop();
      const fileName = `images/${id}-${Date.now()}.${ext}`;
      
      const { data, error } = await supabase.storage
        .from("images")
        .upload(fileName, imageFile, { upsert: true });
        
      if (!error && data) {
        const { data: publicUrlData } = supabase.storage.from("images").getPublicUrl(fileName);
        dataToUpdate.image = publicUrlData.publicUrl;
      }
    }

    // Handle Digital File Upload
    const digitalFile = formData.get("digitalFile") as File | null;
    if (digitalFile && digitalFile.size > 0) {
      const ext = digitalFile.name.split('.').pop();
      const fileName = `files/${id}-${Date.now()}.${ext}`;
      
      const { data, error } = await supabase.storage
        .from("images")
        .upload(fileName, digitalFile, { upsert: true });
        
      if (!error && data) {
        const { data: publicUrlData } = supabase.storage.from("images").getPublicUrl(fileName);
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Format Dokumen</label>
              <select
                name="documentFormat"
                defaultValue={product.documentFormat || ""}
                className="w-full px-4 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-navy text-gray-900"
              >
                <option value="">-- Pilih Format --</option>
                <option value="Microsoft Word (.docx)">Microsoft Word (.docx)</option>
                <option value="PDF (.pdf)">PDF (.pdf)</option>
                <option value="Microsoft Excel (.xlsx)">Microsoft Excel (.xlsx)</option>
                <option value="ZIP (Bundel)">ZIP (Bundel)</option>
                <option value="Online (Konsultasi)">Online (Konsultasi)</option>
              </select>
              <p className="text-xs text-gray-400 mt-1">Digunakan untuk filter halaman produk.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Program Promo</label>
              <select
                name="promoStatus"
                defaultValue={product.promoStatus || ""}
                className="w-full px-4 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-navy text-gray-900"
              >
                <option value="">-- Tidak Ada Promo --</option>
                <option value="Diskon 50%">Diskon 50%</option>
                <option value="Promo Bundling">Promo Bundling</option>
                <option value="Harga Spesial">Harga Spesial</option>
              </select>
              <p className="text-xs text-gray-400 mt-1">Ditampilkan sebagai label promo di kartu produk.</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Harga (Rp)</label>
            <PriceInput defaultValue={product.price} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Deskripsi Lengkap</label>
            <FeatureInput 
              name="description" 
              rows={5} 
              defaultValue={product.description}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Keunggulan Produk</label>
            <FeatureInput 
              name="features"
              rows={4}
              defaultValue={product.features || ""}
              placeholder="Pisahkan dengan baris baru (Enter)&#10;Contoh:&#10;✅ Disusun berdasarkan UU terbaru&#10;⭐ Format Word mudah diedit"
            />
          </div>

          <div className="border-t border-gray-100 pt-5 mt-5">
            <h3 className="font-semibold text-gray-900 mb-4">Ganti Berkas (Opsional)</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gambar Sampul</label>
                {product.image && (
                  <div className="mb-3 p-3 bg-blue-50 border border-blue-100 rounded-md flex items-center gap-4">
                    <img src={product.image} alt="Current" className="w-16 h-16 object-cover rounded shadow-sm border border-gray-200" />
                    <div>
                      <p className="text-sm font-semibold text-blue-800">Gambar saat ini sudah terpasang ✅</p>
                      <a href={product.image} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                        Buka gambar di tab baru ↗
                      </a>
                    </div>
                  </div>
                )}
                <input
                  name="image"
                  type="file"
                  accept="image/*"
                  className="w-full px-4 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-navy text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer"
                />
                <p className="text-xs text-gray-500 mt-2">
                  <b>Catatan:</b> Tulisan "No file chosen" di atas adalah normal. Biarkan saja kosong jika Anda <b>tidak ingin mengganti</b> gambar yang sudah ada.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Berkas Digital (Dokumen/PDF/ZIP)</label>
                {product.digitalFile && (
                  <div className="mb-3 p-3 bg-green-50 border border-green-100 rounded-md flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 text-green-600 rounded flex items-center justify-center text-xl shrink-0">
                      📄
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-green-800">Berkas digital sudah ter-upload aman ✅</p>
                      <a href={product.digitalFile} target="_blank" rel="noopener noreferrer" className="text-xs text-green-700 hover:underline">
                        Download / Cek berkas saat ini ↗
                      </a>
                    </div>
                  </div>
                )}
                <input
                  name="digitalFile"
                  type="file"
                  accept=".pdf,.doc,.docx,.zip,.rar"
                  className="w-full px-4 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-navy text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-sm file:font-semibold file:bg-[#0a1628] file:text-white hover:file:bg-[#112440] cursor-pointer"
                />
                <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                  <b>Catatan:</b> Tulisan "No file chosen" di atas adalah normal. Biarkan saja kosong jika Anda <b>tidak ingin mengganti</b> berkas yang sudah ada.<br/>
                  Jika Anda mengupload ulang (berupa folder), harap kompres menjadi format <b>.ZIP</b> atau <b>.RAR</b> terlebih dahulu.
                </p>
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
