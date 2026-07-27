"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

type AboutListItem = { id: string; title: string; subtitle: string };

export default function SettingsForm({ initialData }: { initialData: Record<string, string> }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"pembayaran" | "tentang" | "sistem">("sistem");
  
  // System States
  const [maintenanceMode, setMaintenanceMode] = useState(initialData["maintenance_mode"] === "true");
  
  // Payment States
  const [danaPhone, setDanaPhone] = useState(initialData["PAYMENT_DANA_PHONE"] || "");
  const [qrisImage, setQrisImage] = useState(initialData["PAYMENT_QRIS_IMAGE"] || "");
  
  // About Page States
  const [ownerName, setOwnerName] = useState(initialData["site_owner_name"] || "Berkas Hukum Corporate");
  const [aboutSubtitle, setAboutSubtitle] = useState(initialData["about_subtitle"] || "BADAN HUKUM, KONSULTAN LEGAL & LEGAL AUDIT SEJAK 2016");
  const [aboutDesc, setAboutDesc] = useState(initialData["about_description"] || "");
  const [aboutImage, setAboutImage] = useState(initialData["home_hero_image"] || "");
  
  // Lists
  const [educationList, setEducationList] = useState<AboutListItem[]>(() => {
    try { return JSON.parse(initialData["about_education"] || "[]"); } catch { return []; }
  });
  const [certList, setCertList] = useState<AboutListItem[]>(() => {
    try { return JSON.parse(initialData["about_certifications"] || "[]"); } catch { return []; }
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const saveSetting = async (key: string, label: string, value: string, category: string, type: string) => {
    await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, label, value, category, type }),
    });
  };

  const handleSavePayment = async () => {
    setLoading(true);
    try {
      await saveSetting("PAYMENT_DANA_PHONE", "Nomor HP DANA / VA", danaPhone, "PAYMENT", "TEXT");
      await saveSetting("PAYMENT_QRIS_IMAGE", "QRIS Image", qrisImage, "PAYMENT", "IMAGE");
      alert("Pengaturan Pembayaran berhasil disimpan");
      router.refresh();
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAbout = async () => {
    setLoading(true);
    try {
      await saveSetting("site_owner_name", "Nama Profil", ownerName, "GENERAL", "TEXT");
      await saveSetting("about_subtitle", "Sub-judul Tentang", aboutSubtitle, "ABOUT", "TEXT");
      await saveSetting("about_description", "Deskripsi Tentang", aboutDesc, "ABOUT", "TEXTAREA");
      await saveSetting("home_hero_image", "Foto Profil", aboutImage, "GENERAL", "IMAGE");
      await saveSetting("about_education", "Riwayat Pendidikan", JSON.stringify(educationList), "ABOUT", "JSON");
      await saveSetting("about_certifications", "Sertifikasi Resmi", JSON.stringify(certList), "ABOUT", "JSON");
      
      alert("Pengaturan Halaman Tentang berhasil disimpan");
      router.refresh();
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSystem = async () => {
    setLoading(true);
    try {
      await saveSetting("maintenance_mode", "Mode Pemeliharaan", maintenanceMode ? "true" : "false", "SYSTEM", "BOOLEAN");
      alert("Pengaturan Sistem berhasil disimpan");
      router.refresh();
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `upload-${Math.random()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('images')
        .upload(`settings/${fileName}`, file, { cacheControl: '3600', upsert: false });

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from('images')
        .getPublicUrl(`settings/${fileName}`);

      setter(publicUrlData.publicUrl);
    } catch (err: any) {
      alert("Error upload: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const addListItem = (setter: React.Dispatch<React.SetStateAction<AboutListItem[]>>) => {
    setter(prev => [...prev, { id: Math.random().toString(), title: "", subtitle: "" }]);
  };
  
  const updateListItem = (setter: React.Dispatch<React.SetStateAction<AboutListItem[]>>, id: string, field: "title" | "subtitle", val: string) => {
    setter(prev => prev.map(item => item.id === id ? { ...item, [field]: val } : item));
  };
  
  const removeListItem = (setter: React.Dispatch<React.SetStateAction<AboutListItem[]>>, id: string) => {
    setter(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab("pembayaran")}
          className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === "pembayaran" ? "border-navy-dark text-navy-dark" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          💳 Pembayaran
        </button>
        <button
          onClick={() => setActiveTab("tentang")}
          className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === "tentang" ? "border-navy-dark text-navy-dark" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          📄 Halaman Tentang
        </button>
        <button
          onClick={() => setActiveTab("sistem")}
          className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === "sistem" ? "border-navy-dark text-navy-dark" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          ⚙️ Sistem
        </button>
      </div>

      {activeTab === "pembayaran" && (
        <div className="space-y-6 animate-in fade-in duration-200">
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
                Akan digunakan sebagai akhiran nomor Virtual Account
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
                onChange={(e) => handleFileUpload(e, setQrisImage)}
                disabled={uploading}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
              />
              {uploading && <p className="text-xs text-blue-500 mt-1">Mengunggah gambar...</p>}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={handleSavePayment}
              disabled={loading || uploading}
              className="bg-navy-dark text-white px-6 py-2 rounded-sm text-sm font-semibold hover:bg-opacity-90 disabled:opacity-50"
            >
              {loading ? "Menyimpan..." : "Simpan Pengaturan Pembayaran"}
            </button>
          </div>
        </div>
      )}

      {activeTab === "tentang" && (
        <div className="space-y-8 animate-in fade-in duration-200">
          
          {/* Teks Utama */}
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-lg text-gray-800 border-b pb-2">Informasi Profil</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Profil Utama</label>
                <input
                  type="text"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sub-judul / Jabatan</label>
                <input
                  type="text"
                  value={aboutSubtitle}
                  onChange={(e) => setAboutSubtitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-gold"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Panjang</label>
              <textarea
                value={aboutDesc}
                onChange={(e) => setAboutDesc(e.target.value)}
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Foto Profil (Halaman Tentang & Beranda)</label>
              {aboutImage && (
                <div className="mb-2">
                  <img src={aboutImage} alt="Profile" className="w-32 h-32 object-cover border border-gray-200 rounded-full shadow-sm" />
                </div>
              )}
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => handleFileUpload(e, setAboutImage)}
                disabled={uploading}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
              />
            </div>
          </div>

          {/* Pendidikan */}
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-serif font-bold text-lg text-gray-800">🎓 Riwayat Pendidikan</h3>
              <button onClick={() => addListItem(setEducationList)} className="text-xs bg-navy text-white px-3 py-1 rounded-sm">+ Tambah Baru</button>
            </div>
            
            {educationList.length === 0 && <p className="text-sm text-gray-400 italic">Tidak ada data. Bagian ini tidak akan ditampilkan.</p>}
            
            <div className="space-y-3">
              {educationList.map(item => (
                <div key={item.id} className="flex gap-3 bg-gray-50 p-3 rounded-sm border border-gray-200 items-start">
                  <div className="flex-1 space-y-2">
                    <input type="text" value={item.title} onChange={e => updateListItem(setEducationList, item.id, "title", e.target.value)} placeholder="Gelar (Cth: Ph.D. in Business Law)" className="w-full px-3 py-1.5 text-sm border rounded-sm focus:outline-none focus:border-gold"/>
                    <input type="text" value={item.subtitle} onChange={e => updateListItem(setEducationList, item.id, "subtitle", e.target.value)} placeholder="Institusi & Tahun (Cth: Universitas Indonesia, 2018)" className="w-full px-3 py-1.5 text-sm border rounded-sm focus:outline-none focus:border-gold"/>
                  </div>
                  <button onClick={() => removeListItem(setEducationList, item.id)} className="text-red-500 hover:text-red-700 p-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Sertifikasi */}
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-serif font-bold text-lg text-gray-800">📜 Sertifikasi Resmi</h3>
              <button onClick={() => addListItem(setCertList)} className="text-xs bg-navy text-white px-3 py-1 rounded-sm">+ Tambah Baru</button>
            </div>

            {certList.length === 0 && <p className="text-sm text-gray-400 italic">Tidak ada data. Bagian ini tidak akan ditampilkan.</p>}
            
            <div className="space-y-3">
              {certList.map(item => (
                <div key={item.id} className="flex gap-3 bg-gray-50 p-3 rounded-sm border border-gray-200 items-start">
                  <div className="flex-1 space-y-2">
                    <input type="text" value={item.title} onChange={e => updateListItem(setCertList, item.id, "title", e.target.value)} placeholder="Nama Lisensi (Cth: Lisensi Advokat PERADI)" className="w-full px-3 py-1.5 text-sm border rounded-sm focus:outline-none focus:border-gold"/>
                    <input type="text" value={item.subtitle} onChange={e => updateListItem(setCertList, item.id, "subtitle", e.target.value)} placeholder="Penerbit (Cth: Perhimpunan Advokat Indonesia)" className="w-full px-3 py-1.5 text-sm border rounded-sm focus:outline-none focus:border-gold"/>
                  </div>
                  <button onClick={() => removeListItem(setCertList, item.id)} className="text-red-500 hover:text-red-700 p-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 sticky bottom-0 bg-white/90 backdrop-blur py-4">
            <button
              onClick={handleSaveAbout}
              disabled={loading || uploading}
              className="bg-navy-dark text-white px-6 py-2 rounded-sm text-sm font-semibold hover:bg-opacity-90 disabled:opacity-50 w-full md:w-auto"
            >
              {loading ? "Menyimpan..." : "Simpan Pengaturan Halaman Tentang"}
            </button>
          </div>
        </div>
      )}

      {activeTab === "sistem" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-5 border border-gray-200 rounded-sm bg-gray-50">
              <div>
                <h3 className="text-base font-bold text-gray-900 font-serif">Mode Pemeliharaan (Maintenance)</h3>
                <p className="text-sm text-gray-500 mt-1 max-w-md">
                  Aktifkan ini untuk memblokir semua akses publik ke website dan mengarahkannya ke halaman pemeliharaan. Anda tetap dapat mengakses panel admin ini.
                </p>
              </div>
              
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={maintenanceMode}
                  onChange={(e) => setMaintenanceMode(e.target.checked)}
                />
                <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-red-500 shadow-inner"></div>
                <span className={`ml-3 text-sm font-bold ${maintenanceMode ? 'text-red-500' : 'text-gray-500'}`}>
                  {maintenanceMode ? 'AKTIF' : 'NONAKTIF'}
                </span>
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={handleSaveSystem}
              disabled={loading}
              className="bg-navy-dark text-white px-6 py-2 rounded-sm text-sm font-semibold hover:bg-opacity-90 disabled:opacity-50"
            >
              {loading ? "Menyimpan..." : "Simpan Pengaturan Sistem"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
