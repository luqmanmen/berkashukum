"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const CATEGORY_LABELS: Record<string, string> = {
  HOME: "Beranda",
  ABOUT: "Tentang Kami",
  CONTACT: "Kontak",
  GENERAL: "Pengaturan Umum",
};

export default function HalamanListPage() {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/admin/settings");
        if (res.ok) {
          const data = await res.json();
          // Extract unique categories from settings
          const uniqueCats = Array.from(new Set(data.map((s: any) => s.category))) as string[];
          
          // Sort to ensure HOME is first, then others, then GENERAL last
          const sortOrder: Record<string, number> = { HOME: 1, ABOUT: 2, CONTACT: 3, GENERAL: 99 };
          uniqueCats.sort((a, b) => (sortOrder[a] || 50) - (sortOrder[b] || 50));
          
          setCategories(uniqueCats);
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Halaman (Pages)</h1>
          <p className="text-gray-500 text-sm">Kelola konten dan tampilan halaman website Anda.</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-4 text-sm font-semibold text-gray-700 w-1/2">Judul Halaman</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-700 w-1/4">Status</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-700 w-1/4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categories.map((cat) => (
              <tr key={cat} className="hover:bg-gray-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <span className="text-lg mr-3 text-gray-400">📄</span>
                    <Link href={`/admin/halaman/${cat}`} className="font-semibold text-navy-dark hover:text-gold transition-colors text-base">
                      {CATEGORY_LABELS[cat] || cat}
                    </Link>
                  </div>
                  {/* Actions appear on hover (WordPress style) */}
                  <div className="mt-1 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity ml-8">
                    <Link href={`/admin/halaman/${cat}`} className="text-xs font-semibold text-blue-600 hover:underline">
                      Edit
                    </Link>
                    <Link href={cat === "HOME" ? "/" : `/${cat.toLowerCase()}`} target="_blank" className="text-xs font-semibold text-gray-500 hover:underline">
                      View
                    </Link>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Published
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link href={`/admin/halaman/${cat}`} className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold transition-colors">
                    Edit Halaman
                  </Link>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                  Belum ada halaman yang terdaftar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
