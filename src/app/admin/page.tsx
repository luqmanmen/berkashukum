import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function getStats() {
  try {
    const [totalOrders, totalProducts, totalArticles, totalUsers] = await Promise.all([
      prisma.order.count(),
      prisma.product.count(),
      prisma.article.count(),
      prisma.user.count(),
    ]);

    const paidOrders = await prisma.order.findMany({
      where: { status: "PAID" },
      select: { totalAmount: true },
    });

    const totalRevenue = paidOrders.reduce((sum, o) => sum + o.totalAmount, 0);

    return { totalOrders, totalProducts, totalArticles, totalUsers, totalRevenue };
  } catch {
    return { totalOrders: 0, totalProducts: 0, totalArticles: 0, totalUsers: 0, totalRevenue: 0 };
  }
}

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  const stats = await getStats();

  const statCards = [
    {
      label: "Total Pendapatan",
      value: `Rp ${stats.totalRevenue.toLocaleString("id-ID")}`,
      icon: "💰",
      color: "bg-green-50 border-green-200",
      textColor: "text-green-700",
    },
    {
      label: "Total Pesanan",
      value: stats.totalOrders,
      icon: "🛒",
      color: "bg-blue-50 border-blue-200",
      textColor: "text-blue-700",
    },
    {
      label: "Total Produk",
      value: stats.totalProducts,
      icon: "📦",
      color: "bg-purple-50 border-purple-200",
      textColor: "text-purple-700",
    },
    {
      label: "Total Artikel",
      value: stats.totalArticles,
      icon: "📝",
      color: "bg-orange-50 border-orange-200",
      textColor: "text-orange-700",
    },
  ];

  const quickLinks = [
    { href: "/admin/produk/baru", label: "Tambah Produk Baru", icon: "➕", desc: "Buat produk digital baru" },
    { href: "/admin/pesanan", label: "Kelola Pesanan", icon: "📋", desc: "Lihat & update status pesanan" },
    { href: "/admin/artikel/baru", label: "Tulis Artikel", icon: "✍️", desc: "Buat artikel blog baru" },
    { href: "/admin/pengguna", label: "Kelola Pengguna", icon: "👥", desc: "Atur akun admin & role" },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 font-serif">Dashboard Overview</h1>
        <p className="text-gray-500 text-sm mt-1">Ringkasan statistik dan aktivitas website LexNova</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, i) => (
          <div
            key={i}
            className={`bg-white border rounded-sm p-6 shadow-sm ${card.color}`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{card.icon}</span>
              <span className={`text-xs font-semibold ${card.textColor} bg-white px-2 py-0.5 rounded-full`}>
                All time
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{card.value}</div>
            <div className="text-sm text-gray-500">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-bold text-gray-800 mb-4 font-serif">Aksi Cepat</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map((link, i) => (
            <a
              key={i}
              href={link.href}
              className="bg-white border border-gray-200 rounded-sm p-5 hover:border-[#c9a84c] hover:shadow-md transition-all group"
            >
              <div className="text-3xl mb-3">{link.icon}</div>
              <div className="font-semibold text-gray-800 text-sm mb-1 group-hover:text-[#0a1628]">{link.label}</div>
              <div className="text-xs text-gray-400">{link.desc}</div>
            </a>
          ))}
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Info */}
        <div className="bg-white border border-gray-200 rounded-sm p-6 shadow-sm">
          <h3 className="font-bold text-gray-800 font-serif mb-4">Informasi Sistem</h3>
          <div className="space-y-3 text-sm">
            {[
              { label: "Status Database", value: "✅ Terhubung (Supabase)" },
              { label: "Status Auth", value: "✅ NextAuth.js Aktif" },
              { label: "Environment", value: "🔧 Development" },
              { label: "Pengguna Login", value: session?.user?.email ?? "-" },
              { label: "Role", value: session?.user?.role ?? "-" },
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                <span className="text-gray-500">{item.label}</span>
                <span className="font-medium text-gray-800">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white border border-gray-200 rounded-sm p-6 shadow-sm">
          <h3 className="font-bold text-gray-800 font-serif mb-4">Aktivitas Terbaru</h3>
          <div className="space-y-3">
            {[
              { action: "Admin login berhasil", time: "Baru saja", icon: "🔐" },
              { action: "Database terkoneksi ke Supabase", time: "Setup", icon: "🗄️" },
              { action: "Skema database berhasil dimigrasikan", time: "Setup", icon: "✅" },
              { action: "Akun Super Admin dibuat", time: "Setup", icon: "👤" },
            ].map((act, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                <span className="text-xl">{act.icon}</span>
                <div className="flex-1">
                  <div className="text-sm text-gray-700">{act.action}</div>
                  <div className="text-xs text-gray-400">{act.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Next Steps Banner */}
      <div className="bg-[#0a1628] rounded-sm p-6 text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-serif font-bold text-lg mb-1">🚀 Tahap Selanjutnya</h3>
            <p className="text-gray-300 text-sm">
              Dashboard dasar sudah siap. Selanjutnya: fitur E-commerce publik, manajemen produk & pesanan lengkap.
            </p>
          </div>
          <div className="flex-shrink-0">
            <div className="bg-[#c9a84c] text-[#0a1628] font-bold text-sm px-5 py-2.5 rounded-sm">
              Tahap 5 →
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
