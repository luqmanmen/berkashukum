import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { updateServiceItem, deleteServiceItem } from "../actions";
import ImageUploadWithCrop from "@/components/ui/ImageUploadWithCrop";

export default async function EditLayananPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await prisma.serviceCarousel.findUnique({
    where: { id },
  });

  if (!item) {
    notFound();
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-serif">Edit Layanan</h1>
          <p className="text-gray-500 text-sm mt-1">Ubah detail layanan untuk carousel beranda.</p>
        </div>
        <form action={async () => {
          "use server";
          await deleteServiceItem(id);
        }}>
          <button
            type="submit"
            className="text-red-600 hover:text-red-800 text-sm font-semibold transition-colors"
          >
            🗑️ Hapus Layanan
          </button>
        </form>
      </div>

      <form action={updateServiceItem} className="bg-white rounded-sm shadow-sm border border-gray-200 p-6 space-y-6">
        <input type="hidden" name="id" value={item.id} />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Gambar Cover (Opsional)</label>
          <ImageUploadWithCrop
            name="imageUrl"
            required={false}
            aspect={4/5}
            defaultValue={item.imageUrl || undefined}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Judul Layanan / Keahlian</label>
          <input
            name="name"
            type="text"
            defaultValue={item.name}
            required
            maxLength={40}
            className="w-full px-4 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-navy text-gray-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Deskripsi Singkat</label>
          <textarea
            name="description"
            rows={3}
            defaultValue={item.description}
            required
            maxLength={150}
            className="w-full px-4 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-navy text-gray-900 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Link URL (Opsional)</label>
          <input
            name="linkUrl"
            type="url"
            defaultValue={item.linkUrl || ""}
            className="w-full px-4 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-navy text-gray-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Urutan (Angka)</label>
          <input
            name="order"
            type="number"
            defaultValue={item.order}
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
            Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  );
}
