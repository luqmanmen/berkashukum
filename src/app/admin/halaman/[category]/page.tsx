export const runtime = "edge";
"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Cropper from "react-easy-crop";
import getCroppedImg from "@/lib/cropImage";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type SiteSetting = {
  key: string;
  label: string;
  value: string;
  category: string;
  type: string;
};

const CATEGORY_LABELS: Record<string, string> = {
  HOME: "Beranda",
  ABOUT: "Tentang Kami",
  CONTACT: "Kontak",
  GENERAL: "Pengaturan Umum",
};

export default function CategoryEditorPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = typeof params.category === "string" ? params.category.toUpperCase() : "";

  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [edited, setEdited] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  // Crop modal state
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [cropKey, setCropKey] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isCropping, setIsCropping] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, [categoryId]);

  const showNotification = (type: "success" | "error", msg: string) => {
    setNotification({ type, msg });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      if (res.ok) {
        const data = await res.json();
        const catSettings = data.filter((s: SiteSetting) => s.category === categoryId);
        setSettings(catSettings);
        const initial: Record<string, string> = {};
        catSettings.forEach((s: SiteSetting) => { initial[s.key] = s.value; });
        setEdited(initial);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key: string, value: string) => {
    setEdited((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (key: string) => {
    setSaving(key);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value: edited[key] }),
      });
      if (res.ok) {
        showNotification("success", "Berhasil disimpan!");
        await fetchSettings();
      } else {
        showNotification("error", "Gagal menyimpan.");
      }
    } catch {
      showNotification("error", "Terjadi kesalahan jaringan.");
    } finally {
      setSaving(null);
    }
  };

  // Opens crop modal when user selects a file
  const handleFileSelect = (key: string, file: File) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setCropImageSrc(reader.result as string);
      setCropKey(key);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCropModalOpen(true);
    });
    reader.readAsDataURL(file);
  };

  const onCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Crops the image then uploads directly to Supabase from browser
  const handleCropAndUpload = async () => {
    if (!cropImageSrc || !cropKey || !croppedAreaPixels) return;
    setIsCropping(true);
    try {
      const croppedFile = await getCroppedImg(cropImageSrc, croppedAreaPixels);
      if (!croppedFile) throw new Error("Gagal memotong gambar");

      setCropModalOpen(false);
      setUploadingKey(cropKey);

      // Upload directly from browser to Supabase (works with anon key + public policy)
      const fileName = `settings/${cropKey}-${Date.now()}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(fileName, croppedFile, {
          contentType: "image/jpeg",
          upsert: true,
        });

      if (uploadError) {
        console.error("Supabase upload error:", uploadError);
        throw new Error(uploadError.message);
      }

      const { data: urlData } = supabase.storage
        .from("images")
        .getPublicUrl(fileName);

      const publicUrl = urlData.publicUrl;

      // Save URL to settings via API
      const saveRes = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: cropKey, value: publicUrl }),
      });

      if (saveRes.ok) {
        showNotification("success", "Foto berhasil dicrop & diupload! ✨");
        await fetchSettings();
      } else {
        showNotification("error", "Foto terupload tapi gagal disimpan.");
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      showNotification("error", `Gagal upload: ${error.message || "Unknown error"}`);
    } finally {
      setIsCropping(false);
      setUploadingKey(null);
      setCropImageSrc(null);
      setCropKey(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const pageTitle = CATEGORY_LABELS[categoryId] || categoryId;

  return (
    <div className="max-w-4xl mx-auto py-8 relative">
      {/* Notification Toast */}
      {notification && (
        <div
          className={`fixed top-6 right-6 z-50 px-6 py-3 rounded-lg shadow-lg text-white text-sm font-semibold transition-all ${
            notification.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {notification.type === "success" ? "✅ " : "❌ "}{notification.msg}
        </div>
      )}

      {/* ===== CROP MODAL ===== */}
      {cropModalOpen && cropImageSrc && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/95">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-gray-900 border-b border-gray-700 shrink-0">
            <div>
              <h2 className="text-white font-bold text-lg">✂️ Crop Foto</h2>
              <p className="text-gray-400 text-xs mt-0.5">Geser dan zoom untuk menyesuaikan foto, lalu klik "Crop & Upload".</p>
            </div>
            <button
              onClick={() => { setCropModalOpen(false); setCropImageSrc(null); }}
              className="text-gray-400 hover:text-white text-2xl font-bold leading-none transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Cropper area */}
          <div className="relative flex-1">
            <Cropper
              image={cropImageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              style={{
                containerStyle: { background: "#111" },
              }}
            />
          </div>

          {/* Controls */}
          <div className="bg-gray-900 border-t border-gray-700 px-6 py-5 shrink-0">
            <div className="flex flex-col sm:flex-row items-center gap-4 max-w-lg mx-auto">
              <div className="w-full sm:flex-1">
                <label className="text-xs text-gray-400 block mb-1.5 font-medium">🔍 Zoom</label>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.05}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full accent-yellow-500"
                />
              </div>
              <div className="flex gap-3 shrink-0">
                <button
                  onClick={() => { setCropModalOpen(false); setCropImageSrc(null); }}
                  className="px-5 py-2.5 bg-gray-700 hover:bg-gray-600 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleCropAndUpload}
                  disabled={isCropping}
                  className="px-6 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-gray-900 text-sm font-bold rounded-lg disabled:opacity-60 transition-colors"
                >
                  {isCropping ? "Memproses..." : "✂️ Crop & Upload"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="mb-8 flex items-center gap-4">
        <button
          onClick={() => router.push("/admin/halaman")}
          className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
          title="Kembali"
        >
          &larr;
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Edit Halaman: {pageTitle}</h1>
          <p className="text-gray-500 text-sm">Setiap perubahan akan langsung tampil di halaman depan website.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h2 className="text-base font-bold text-gray-900">Konten Halaman</h2>
          <Link
            href={categoryId === "HOME" ? "/" : `/${categoryId.toLowerCase()}`}
            target="_blank"
            className="text-xs font-semibold text-blue-600 hover:underline"
          >
            Lihat Halaman ↗
          </Link>
        </div>

        <div className="p-6 space-y-8">
          {settings.length === 0 ? (
            <div className="text-center py-10 text-gray-500">Tidak ada kolom yang bisa diedit.</div>
          ) : (
            settings.map((setting) => (
              <div key={setting.key} className="border-b border-gray-100 pb-8 last:border-0 last:pb-0">
                <label className="block text-sm font-bold text-gray-700 mb-3">{setting.label}</label>

                {/* TEXT */}
                {setting.type === "TEXT" && (
                  <div className="flex gap-3 items-center">
                    <input
                      type="text"
                      value={edited[setting.key] ?? setting.value}
                      onChange={(e) => handleChange(setting.key, e.target.value)}
                      className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold"
                    />
                    <button
                      onClick={() => handleSave(setting.key)}
                      disabled={saving === setting.key}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg disabled:opacity-60 whitespace-nowrap transition-colors"
                    >
                      {saving === setting.key ? "Menyimpan..." : "Simpan Perubahan"}
                    </button>
                  </div>
                )}

                {/* TEXTAREA */}
                {setting.type === "TEXTAREA" && (
                  <div className="space-y-3">
                    <textarea
                      value={edited[setting.key] ?? setting.value}
                      onChange={(e) => handleChange(setting.key, e.target.value)}
                      rows={5}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold resize-y"
                    />
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleSave(setting.key)}
                        disabled={saving === setting.key}
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg disabled:opacity-60 transition-colors"
                      >
                        {saving === setting.key ? "Menyimpan..." : "Simpan Perubahan"}
                      </button>
                    </div>
                  </div>
                )}

                {/* IMAGE */}
                {setting.type === "IMAGE" && (
                  <div className="flex flex-col sm:flex-row items-start gap-6">
                    {/* Preview */}
                    <div className="flex-shrink-0">
                      <div className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Foto Saat Ini</div>
                      {setting.value && setting.value !== "none" ? (
                        <div className="w-48 h-48 rounded-xl border-2 border-gray-200 overflow-hidden shadow-sm">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={setting.value} alt={setting.label} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-48 h-48 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                          <span className="text-4xl mb-2">🖼️</span>
                          <span className="text-sm text-center px-4">Belum ada foto</span>
                        </div>
                      )}
                    </div>

                    {/* Upload / Crop trigger */}
                    <div className="flex-1 w-full pt-6">
                      <label className="block">
                        <div
                          className={`cursor-pointer border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                            uploadingKey === setting.key
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-300 hover:border-yellow-500 hover:bg-yellow-50"
                          }`}
                        >
                          {uploadingKey === setting.key ? (
                            <>
                              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                              <p className="text-base font-semibold text-blue-600">Sedang mengupload foto...</p>
                            </>
                          ) : (
                            <>
                              <div className="text-3xl mb-3">✂️</div>
                              <p className="text-base font-bold text-gray-800">Pilih & Crop Foto</p>
                              <p className="text-sm text-gray-500 mt-2">
                                Klik untuk memilih foto. Setelah dipilih, Anda bisa <strong>memotong</strong> dan <strong>zoom</strong> sebelum diupload.
                              </p>
                              <p className="text-xs text-gray-400 mt-2 font-medium">PNG, JPG, JPEG, WEBP · Maks 10MB</p>
                            </>
                          )}
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={!!uploadingKey}
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleFileSelect(setting.key, e.target.files[0]);
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
