import Link from "next/link";
import { createServiceItem } from "../actions";
import ImageUploadWithCrop from "@/components/ui/ImageUploadWithCrop";

export default function BaruLayananPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 font-serif">Tambah Layanan Carousel</h1>
        <p className="text-gray-500 text-sm mt-1">Isi detail layanan untuk ditampilkan di carousel beranda.</p>
      </div>

      <form action={createServiceItem} className="bg-white rounded-sm shadow-sm border border-gray-200 p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Gambar Cover</label>
          <ImageUploadWithCrop
            name="imageUrl"
            required={true}
            aspect={4/5}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Judul Layanan / Keahlian</label>
          <input
            name="name"
            type="text"
            required
            maxLength={40}
            placeholder="Misal: Hukum Perusahaan (Maks: 40 karakter)"
            className="w-full px-4 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-navy text-gray-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Deskripsi Singkat</label>
          <textarea
            name="description"
            rows={3}
            required
            maxLength={150}
            placeholder="Misal: Kami membantu proses perizinan... (Maks: 150 karakter)"
            className="w-full px-4 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-navy text-gray-900 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Link URL (Opsional)</label>
          <input
            name="linkUrl"
            type="url"
            placeholder="Misal: /blog atau https://..."
            className="w-full px-4 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-navy text-gray-900"
          />
          <p className="text-xs text-gray-500 mt-1">Link tujuan jika tombol 'Lihat Detail' diklik.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Urutan (Angka)</label>
          <input
            name="order"
            type="number"
            defaultValue="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-navy text-gray-900"
          />
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
          <Link
            href="/admin/layanan"
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-sm text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            Batal
          </Link>
          <button
            type="submit"
            className="bg-navy-dark hover:bg-gold text-white hover:text-navy-dark px-6 py-2 rounded-sm text-sm font-semibold transition-colors"
          >
            Simpan Layanan
          </button>
        </div>
      </form>
    </div>
  );
}
