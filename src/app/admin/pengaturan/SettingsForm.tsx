"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function SettingsForm({ initialData }: { initialData: Record<string, string> }) {
  const router = useRouter();
  const [danaPhone, setDanaPhone] = useState(initialData["PAYMENT_DANA_PHONE"] || "");
  const [qrisImage, setQrisImage] = useState(initialData["PAYMENT_QRIS_IMAGE"] || "");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      // Upsert DANA Phone
      await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "PAYMENT_DANA_PHONE",
          label: "Nomor HP DANA / VA",
          value: danaPhone,
          category: "PAYMENT",
          type: "TEXT"
        }),
      });

      // Upsert QRIS image
      await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "PAYMENT_QRIS_IMAGE",
          label: "QRIS Image",
          value: qrisImage,
          category: "PAYMENT",
          type: "IMAGE"
        }),
      });

      alert("Pengaturan berhasil disimpan");
      router.refresh();
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `qris-${Math.random()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('images')
        .upload(`settings/${fileName}`, file, { cacheControl: '3600', upsert: false });

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from('images')
        .getPublicUrl(`settings/${fileName}`);

      setQrisImage(publicUrlData.publicUrl);
    } catch (err: any) {
      alert("Error upload: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-800 font-serif border-b pb-2 mb-4">Pengaturan Pembayaran</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nomor HP DANA / Admin (Format lengkap dengan 0, misal: 081296393972)
            </label>
            <input
              type="text"
              value={danaPhone}
              onChange={(e) => setDanaPhone(e.target.value)}
              placeholder="Contoh: 081296393972"
              className="w-full px-4 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-gold"
            />
            <p className="text-xs text-gray-400 mt-1">
              Akan digunakan sebagai akhiran nomor Virtual Account (misal BCA: 3901 + 081296393972)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gambar QRIS
            </label>
            {qrisImage && (
              <div className="mb-2">
                <img src={qrisImage} alt="QRIS" className="w-48 h-auto object-contain border border-gray-200 rounded" />
              </div>
            )}
            <input 
              type="file" 
              accept="image/*"
              onChange={handleFileUpload}
              disabled={uploading}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
            />
            {uploading && <p className="text-xs text-blue-500 mt-1">Mengunggah gambar...</p>}
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <button
          onClick={handleSave}
          disabled={loading || uploading}
          className="bg-navy-dark text-white px-6 py-2 rounded-sm text-sm font-semibold hover:bg-opacity-90 disabled:opacity-50"
        >
          {loading ? "Menyimpan..." : "Simpan Pengaturan"}
        </button>
      </div>
    </div>
  );
}
