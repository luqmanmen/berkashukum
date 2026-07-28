"use client";

import { useState } from "react";
import ImageUploadWithCrop from "@/components/ui/ImageUploadWithCrop";
import ActionForm from "@/components/admin/ActionForm";
import { createLawyer, updateLawyer, deleteLawyer } from "../actions";
import type { Lawyer } from "@/generated/prisma";
import PriceInput from "@/components/admin/PriceInput";

export default function LawyerForm({ initialData }: { initialData?: Lawyer }) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(initialData?.photo || null);
  const [price, setPrice] = useState<number>(initialData?.consultationPrice || 0);

  return (
    <ActionForm 
      action={initialData ? updateLawyer : createLawyer} 
    >
      {initialData && <input type="hidden" name="id" value={initialData.id} />}
      
      <div className="bg-white shadow rounded-lg p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Foto Profil
          </label>
          <ImageUploadWithCrop
            name="photo"
            defaultValue={photoUrl || undefined}
            aspect={1}
          />
          <p className="mt-1 text-xs text-gray-500">Gunakan rasio 1:1 (persegi) untuk hasil terbaik.</p>
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama Pengacara</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            defaultValue={initialData?.name}
            placeholder="Misal: Dr. Satria Wibowo, S.H., M.H."
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-navy focus:border-navy sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="specialization" className="block text-sm font-medium text-gray-700">Spesialisasi</label>
          <input
            type="text"
            id="specialization"
            name="specialization"
            required
            defaultValue={initialData?.specialization}
            placeholder="Misal: Corporate Law & Kepailitan"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-navy focus:border-navy sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="consultationPrice" className="block text-sm font-medium text-gray-700">Tarif Konsultasi (Rp)</label>
          <PriceInput 
            name="consultationPrice"
            defaultValue={price}
          />
          <p className="mt-1 text-xs text-gray-500">Isi 0 jika gratis atau dibicarakan nanti.</p>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Deskripsi Singkat / Profil</label>
          <textarea
            id="description"
            name="description"
            rows={4}
            required
            defaultValue={initialData?.description || ""}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-navy focus:border-navy sm:text-sm"
          />
        </div>

        <div className="flex items-center">
          <input
            id="isActive"
            name="isActive"
            type="checkbox"
            defaultChecked={initialData ? initialData.isActive : true}
            className="h-4 w-4 text-navy focus:ring-navy border-gray-300 rounded"
          />
          <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
            Aktif (Tampilkan di halaman publik)
          </label>
        </div>
      </div>

      {initialData && (
        <div className="bg-red-50 p-6 rounded-lg border border-red-100 flex items-center justify-between mt-8">
          <div>
            <h3 className="text-red-800 font-medium">Hapus Data Lawyer</h3>
            <p className="text-sm text-red-600 mt-1">Data yang dihapus tidak dapat dikembalikan.</p>
          </div>
          <button
            type="button"
            onClick={async () => {
              if (confirm("Yakin ingin menghapus lawyer ini?")) {
                await deleteLawyer(initialData.id);
              }
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-medium"
          >
            Hapus Lawyer
          </button>
        </div>
      )}

      <div className="mt-8">
        <button
          type="submit"
          className="w-full bg-navy hover:bg-navy-light text-white px-6 py-3 rounded-lg text-sm font-medium shadow-sm transition-colors"
        >
          {initialData ? "Simpan Perubahan" : "Simpan Lawyer"}
        </button>
      </div>
    </ActionForm>
  );
}
