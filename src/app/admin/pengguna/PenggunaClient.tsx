"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PenggunaClient({ 
  initialUsers, 
  currentUserRole,
  currentUserId
}: { 
  initialUsers: any[];
  currentUserRole: string;
  currentUserId: string;
}) {
  const router = useRouter();
  const [users, setUsers] = useState(initialUsers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "ADMIN"
  });
  const [error, setError] = useState("");

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Yakin ingin menghapus akses untuk ${name}?`)) return;
    
    try {
      const res = await fetch(`/api/admin/pengguna/${id}`, { method: "DELETE" });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Gagal menghapus");
      
      setUsers(users.filter(u => u.id !== id));
      alert("Pengguna berhasil dihapus.");
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/pengguna", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Gagal menambah pengguna");
      
      // Update tabel langsung
      setUsers([data.user, ...users]);
      setIsModalOpen(false);
      setFormData({ name: "", email: "", password: "", role: "ADMIN" });
      router.refresh(); // Untuk update RSC jika perlu
      alert("Pengguna baru berhasil ditambahkan!");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-serif">Kelola Pengguna</h1>
          <p className="text-gray-500 text-sm mt-1">Daftar admin dan pengguna terdaftar</p>
        </div>
        {currentUserRole === "SUPER_ADMIN" && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#0a1628] hover:bg-[#c9a84c] text-white hover:text-[#0a1628] px-4 py-2 rounded-sm text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm"
          >
            <span>👤</span> Tambah Admin Baru
          </button>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Nama</th>
                <th className="px-6 py-4 font-semibold">Email</th>
                <th className="px-6 py-4 font-semibold">Peran (Role)</th>
                <th className="px-6 py-4 font-semibold">Terdaftar</th>
                {currentUserRole === "SUPER_ADMIN" && (
                  <th className="px-6 py-4 font-semibold text-right">Aksi</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {user.name || "-"} {user.id === currentUserId && <span className="text-xs text-[#c9a84c] ml-2 font-bold">(Anda)</span>}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {user.email}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        user.role === "SUPER_ADMIN"
                          ? "bg-purple-100 text-purple-700"
                          : user.role === "ADMIN"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-xs">
                    {new Date(user.createdAt).toLocaleDateString("id-ID")}
                  </td>
                  
                  {currentUserRole === "SUPER_ADMIN" && (
                    <td className="px-6 py-4 text-right">
                      {user.id !== currentUserId && (
                        <button 
                          onClick={() => handleDelete(user.id, user.name || user.email)}
                          className="text-red-500 hover:text-red-700 font-medium text-xs border border-red-200 hover:bg-red-50 px-3 py-1.5 rounded-sm transition-colors"
                        >
                          Hapus Akses
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                    Belum ada pengguna.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah Pengguna */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-md shadow-2xl w-full max-w-md overflow-hidden border-t-4 border-[#0a1628]">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900 font-serif">Tambah Anggota Tim</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold"
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={handleCreate} className="p-6">
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-sm">
                  {error}
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#0a1628]"
                    placeholder="Contoh: Budi Santoso"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Alamat Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#0a1628]"
                    placeholder="budi@berkashukum.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#0a1628]"
                    placeholder="Minimal 6 karakter"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Hak Akses (Role)</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#0a1628] bg-white"
                  >
                    <option value="ADMIN">Admin (Kelola Pesanan & Produk)</option>
                    <option value="SUPER_ADMIN">Super Admin (Akses Penuh)</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-sm hover:bg-gray-50 text-sm font-semibold transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-[#0a1628] text-white rounded-sm hover:bg-[#c9a84c] text-sm font-semibold transition-colors shadow-sm disabled:opacity-50"
                >
                  {loading ? "Menyimpan..." : "Simpan Anggota"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
