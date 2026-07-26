"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DownloadClient({ order }: { order: any }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [downloadData, setDownloadData] = useState<{ token: string; products: any[] } | null>(null);
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState<number>(0);

  // Countdown timer logic
  useEffect(() => {
    if (timeLeft <= 0) {
      if (downloadData) {
        // Token expired
        setDownloadData(null);
        setError("Sesi unduhan berakhir. Silakan masukkan kode lagi untuk mendapatkan link baru.");
      }
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, downloadData]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`/api/download/${order.id}/token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ downloadCode: code }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal verifikasi kode");
      }

      setDownloadData({ token: data.token, products: data.products });
      setTimeLeft(600); // 10 minutes (600 seconds)
      setCode(""); // Clear input

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-sm shadow-xl overflow-hidden border-t-4 border-gold">
        
        {/* Header */}
        <div className="bg-navy p-6 text-center">
          <h1 className="text-xl font-bold font-serif text-white">Akses Unduhan Produk</h1>
          <p className="text-gold-light text-xs mt-1">Order #{order.id.slice(-8).toUpperCase()}</p>
        </div>

        <div className="p-6">
          {!downloadData ? (
            // Form Input Kode
            <form onSubmit={handleVerify}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Masukkan Kode Unduhan
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="BHK-XXXX-XXXX"
                  className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy font-mono text-center text-lg tracking-widest"
                  required
                />
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Cek email Anda untuk mendapatkan kode 11 karakter ini.
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-sm text-center">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !code}
                className="w-full bg-navy text-white py-3 rounded-sm font-semibold hover:bg-navy-dark transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Memverifikasi...</span>
                  </>
                ) : (
                  "Verifikasi & Dapatkan Link"
                )}
              </button>
            </form>
          ) : (
            // Daftar Download
            <div>
              <div className="bg-green-50 border border-green-200 p-4 rounded-sm mb-6 text-center">
                <p className="text-green-800 text-sm font-medium mb-1">
                  ✅ Kode Valid! Sesi Aktif
                </p>
                <div className="text-2xl font-mono font-bold text-navy mt-2">
                  {formatTime(timeLeft)}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Waktu tersisa sebelum link unduhan kadaluarsa.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 border-b pb-2">File Tersedia:</h3>
                {downloadData.products.map((product) => (
                  <div key={product.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-gray-50 border border-gray-100 rounded-sm hover:border-gray-200 transition-colors">
                    <span className="text-sm font-medium text-gray-800 line-clamp-2">
                      📄 {product.name}
                    </span>
                    <a
                      href={`/api/download/file?token=${downloadData.token}&productId=${product.id}`}
                      target="_blank"
                      className="shrink-0 bg-gold text-white px-4 py-2 rounded-sm text-sm font-bold text-center hover:bg-gold-dark transition-colors"
                    >
                      Unduh File
                    </a>
                  </div>
                ))}
              </div>

              <div className="mt-8 text-center text-xs text-gray-400">
                <p>Link bersifat rahasia dan dilengkapi proteksi keamanan waktu.</p>
                <p>Mohon gunakan sebelum hitung mundur habis.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
