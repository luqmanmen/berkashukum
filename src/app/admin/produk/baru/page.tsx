import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { nanoid } from "nanoid";
import { supabase } from "@/lib/supabase";
import PriceInput from "@/components/admin/PriceInput";
import FeatureInput from "@/components/admin/FeatureInput";
import ActionForm from "@/components/admin/ActionForm";
import ImageUploadWithCrop from "@/components/ui/ImageUploadWithCrop";

export default function TambahProdukPage() {
  async function createProduct(formData: FormData) {
    "use server";
    try {

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const originalPriceStr = formData.get("originalPrice") as string;
    const originalPrice = originalPriceStr ? parseInt(originalPriceStr.replace(/\D/g, ""), 10) : 0;
    
    const discountStr = formData.get("discountPercentage") as string;
    const discountPercentage = discountStr ? parseInt(discountStr, 10) : 0;
    
    // Calculate final price based on original price and discount percentage
    const price = Math.round(originalPrice - (originalPrice * (discountPercentage / 100)));
    
    const category = formData.get("category") as string;
    const documentFormat = (formData.get("documentFormat") as string) || null;
    const promoStatus = (formData.get("promoStatus") as string) || null;
    const features = formData.get("features") as string;
    const status = formData.get("status") as string;
    
    const id = `PROD-${nanoid(8).toUpperCase()}`;

    // Handle Image Upload
    let imageUrl = null;
    const imageFile = formData.get("image") as File | null;
    if (imageFile && imageFile.size > 0) {
      const ext = imageFile.name.split('.').pop();
      const fileName = `products/images/${id}-${Date.now()}.${ext}`;
      
      const { data, error } = await supabase.storage
        .from("images")
        .upload(fileName, imageFile, { upsert: true });
        
      if (!error && data) {
        const { data: publicUrlData } = supabase.storage.from("images").getPublicUrl(fileName);
        imageUrl = publicUrlData.publicUrl;
      }
    }

    // Handle Digital File Upload (The actual document/ebook)
    let digitalFileUrl = null;
    const digitalFile = formData.get("digitalFile") as File | null;
    if (digitalFile && digitalFile.size > 0) {
      const ext = digitalFile.name.split('.').pop();
      const fileName = `products/files/${id}-${Date.now()}.${ext}`;
      
      const { data, error } = await supabase.storage
        .from("images")
        .upload(fileName, digitalFile, { upsert: true });
        
      if (!error && data) {
        // Ideally this should be signed url generated at download time, 
        // but for simplicity we store the public URL or the path. 
        // We'll store the public URL here.
        const { data: publicUrlData } = supabase.storage.from("images").getPublicUrl(fileName);
        digitalFileUrl = publicUrlData.publicUrl;
      }
    }

      await prisma.product.create({
        data: {
          id,
          name,
          description,
          price,
          originalPrice,
          category,
          documentFormat: documentFormat || null,
          promoStatus,
          features: features || null,
          status,
          image: imageUrl,
          digitalFile: digitalFileUrl,
        },
      });
      return { success: true };
    } catch (e: any) {
      console.error("Server Action Error:", e);
      return { success: false, error: e.message || "Terjadi kesalahan pada server." };
    }
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
        <ActionForm action={createProduct} successUrl="/admin/produk" className="space-y-5">
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Format Dokumen</label>
              <select
                name="documentFormat"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-navy text-gray-900"
              >
                <option value="">-- Tidak Ada Promo --</option>
                <option value="Diskon">Diskon</option>
                <option value="Promo Bundling">Promo Bundling</option>
                <option value="Harga Spesial">Harga Spesial</option>
              </select>
              <p className="text-xs text-gray-400 mt-1">Ditampilkan sebagai label promo di kartu produk.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Harga Produk (Rp) <span className="text-red-500">*</span></label>
              <PriceInput name="originalPrice" required={true} />
              <p className="text-xs text-gray-400 mt-1">Harga wajib sebelum diskon.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Diskon (%)</label>
              <div className="relative">
                <input
                  type="number"
                  name="discountPercentage"
                  min="0"
                  max="100"
                  defaultValue="0"
                  className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-navy text-gray-900"
                />
                <span className="absolute right-4 top-2.5 text-sm text-gray-500 font-medium pointer-events-none">
                  %
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1">Isi 1-100 jika sedang diskon. Sistem akan menghitung harga jual.</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Deskripsi Lengkap</label>
            <FeatureInput 
              name="description" 
              rows={5} 
              placeholder="Jelaskan fitur dan detail produk Anda..." 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Keunggulan Produk</label>
            <FeatureInput 
              name="features"
              rows={4}
              placeholder="Pisahkan dengan baris baru (Enter)&#10;Contoh:&#10;✅ Disusun berdasarkan UU terbaru&#10;⭐ Format Word mudah diedit"
            />
          </div>

          <div className="border-t border-gray-100 pt-5 mt-5">
            <h3 className="font-semibold text-gray-900 mb-4">Upload Berkas</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Gambar Sampul (Opsional)</label>
                <ImageUploadWithCrop
                  name="image"
                  required={false}
                  aspect={3/4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Berkas Digital (Dokumen/PDF)</label>
                <input
                  name="digitalFile"
                  type="file"
                  accept=".pdf,.doc,.docx,.zip"
                  className="w-full px-4 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-navy text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-sm file:font-semibold file:bg-navy-dark file:text-white hover:file:bg-navy-mid cursor-pointer"
                />
                <p className="text-xs text-gray-400 mt-1.5">
                  File ini yang akan dikirim ke pembeli setelah pesanan lunas. <br/>
                  <b>Catatan:</b> Jika berupa folder berisi banyak file, harap kompres menjadi format <b>.ZIP</b> atau <b>.RAR</b> terlebih dahulu.
                </p>
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
              className="bg-navy-dark hover:bg-navy-mid text-white px-6 py-2 rounded-sm text-sm font-semibold transition-colors"
            >
              Simpan Produk
            </button>
          </div>
        </ActionForm>
      </div>
    </div>
  );
}
