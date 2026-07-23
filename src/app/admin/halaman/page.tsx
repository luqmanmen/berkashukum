"use client";

import { useState, useEffect, useRef } from "react";

type SiteSetting = {
  key: string;
  label: string;
  value: string;
  category: string;
  type: string;
};

const CATEGORY_LABELS: Record<string, string> = {
  HOME: "🏠 Halaman Utama (Home)",
  ABOUT: "👤 Halaman Tentang Kami",
  CONTACT: "📞 Halaman Kontak",
  GENERAL: "⚙️ Pengaturan Umum",
};

export default function HalamanPage() {
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [edited, setEdited] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const showNotification = (type: "success" | "error", msg: string) => {
    setNotification({ type, msg });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
        // Initialize edited state with current values
        const initial: Record<string, string> = {};
        data.forEach((s: SiteSetting) => { initial[s.key] = s.value; });
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
    } catch (error) {
      showNotification("error", "Terjadi kesalahan jaringan.");
    } finally {
      setSaving(null);
    }
  };

  const handleImageUpload = async (key: string, file: File) => {
    setUploadingKey(key);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("key", key);

      const res = await fetch("/api/admin/upload-setting-image", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const { url } = await res.json();

      // Save the URL to the settings
      const saveRes = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value: url }),
      });

      if (saveRes.ok) {
        showNotification("success", "Foto berhasil diupload dan disimpan!");
        await fetchSettings();
      } else {
        showNotification("error", "Foto terupload tapi gagal disimpan.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      showNotification("error", "Gagal mengupload foto.");
    } finally {
      setUploadingKey(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Memuat pengaturan...</p>
        </div>
      </div>
    );
  }

  const categories = Array.from(new Set(settings.map((s) => s.category)));

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

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Kelola Konten Halaman</h1>
        <p className="text-gray-500 text-sm">Ubah teks dan foto yang tampil di halaman publik website Anda. Klik tombol Simpan setelah mengubah.</p>
      </div>

      <div className="space-y-8">
        {categories.map((category) => (
          <div key={category} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Category Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <h2 className="text-base font-bold text-gray-900">
                {CATEGORY_LABELS[category] ?? category}
              </h2>
            </div>

            <div className="p-6 space-y-6">
              {settings
                .filter((s) => s.category === category)
                .map((setting) => (
                  <div key={setting.key} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {setting.label}
                    </label>

                    {/* TEXT input */}
                    {setting.type === "TEXT" && (
                      <div className="flex gap-3 items-center">
                        <input
                          type="text"
                          value={edited[setting.key] ?? setting.value}
                          onChange={(e) => handleChange(setting.key, e.target.value)}
                          className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold"
                        />
                        <button
                          onClick={() => handleSave(setting.key)}
                          disabled={saving === setting.key}
                          className="px-4 py-2.5 bg-[#c9a84c] hover:bg-[#b8933f] text-white text-sm font-semibold rounded-lg disabled:opacity-60 whitespace-nowrap transition-colors"
                        >
                          {saving === setting.key ? "Menyimpan..." : "Simpan"}
                        </button>
                      </div>
                    )}

                    {/* TEXTAREA input */}
                    {setting.type === "TEXTAREA" && (
                      <div className="space-y-3">
                        <textarea
                          value={edited[setting.key] ?? setting.value}
                          onChange={(e) => handleChange(setting.key, e.target.value)}
                          rows={4}
                          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold resize-none"
                        />
                        <div className="flex justify-end">
                          <button
                            onClick={() => handleSave(setting.key)}
                            disabled={saving === setting.key}
                            className="px-5 py-2 bg-[#c9a84c] hover:bg-[#b8933f] text-white text-sm font-semibold rounded-lg disabled:opacity-60 transition-colors"
                          >
                            {saving === setting.key ? "Menyimpan..." : "💾 Simpan"}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* IMAGE upload */}
                    {setting.type === "IMAGE" && (
                      <div className="flex items-start gap-6">
                        {/* Preview */}
                        <div className="flex-shrink-0">
                          {setting.value && setting.value !== "none" ? (
                            <div className="w-36 h-36 rounded-xl border-2 border-gray-200 overflow-hidden shadow-sm">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={setting.value}
                                alt={setting.label}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-36 h-36 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                              <span className="text-3xl mb-1">🖼️</span>
                              <span className="text-xs text-center">Belum ada foto</span>
                            </div>
                          )}
                        </div>

                        {/* Upload area */}
                        <div className="flex-1 pt-2">
                          <label className="block">
                            <div className={`cursor-pointer border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                              uploadingKey === setting.key
                                ? "border-gold bg-gold/5"
                                : "border-gray-300 hover:border-gold hover:bg-gold/5"
                            }`}>
                              {uploadingKey === setting.key ? (
                                <>
                                  <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                                  <p className="text-sm text-gold font-medium">Sedang mengupload...</p>
                                </>
                              ) : (
                                <>
                                  <div className="text-2xl mb-2">📤</div>
                                  <p className="text-sm font-semibold text-gray-700">Klik untuk pilih foto baru</p>
                                  <p className="text-xs text-gray-400 mt-1">PNG, JPG, atau WEBP. Maks 5MB.</p>
                                </>
                              )}
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              disabled={uploadingKey === setting.key}
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  handleImageUpload(setting.key, e.target.files[0]);
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        ))}

        {categories.length === 0 && (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
            <div className="text-5xl mb-4">📋</div>
            <p className="text-gray-500 font-medium">Belum ada pengaturan konten yang terdaftar.</p>
          </div>
        )}
      </div>
    </div>
  );
}
