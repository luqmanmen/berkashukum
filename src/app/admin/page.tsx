import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DashboardStatsClient from "./DashboardStatsClient";

async function getStats() {
  try {
    const [totalOrders, totalProducts, totalArticles, totalUsers, recentActivities] = await Promise.all([
      prisma.order.count(),
      prisma.product.count(),
      prisma.article.count(),
      prisma.user.count(),
      prisma.activityLog.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
    ]);

    const paidOrders = await prisma.order.findMany({
      where: { status: "PAID" },
      select: { totalAmount: true, createdAt: true },
      orderBy: { createdAt: 'asc' }
    });

    const totalRevenue = paidOrders.reduce((sum, o) => sum + o.totalAmount, 0);

    // Group orders by month for the chart
    const monthlyData: Record<string, { revenue: number, orders: number }> = {};
    
    // Default to today if no data
    const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    monthlyData[today] = { revenue: 0, orders: 0 };

    // Override with real data
    paidOrders.forEach(o => {
      const date = o.createdAt.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
      if (!monthlyData[date]) monthlyData[date] = { revenue: 0, orders: 0 };
      monthlyData[date].revenue += o.totalAmount;
      monthlyData[date].orders += 1;
    });

    const chartData = Object.entries(monthlyData).map(([date, data]) => ({
      date,
      revenue: data.revenue,
      orders: data.orders
    }));

    return { totalOrders, totalProducts, totalArticles, totalUsers, totalRevenue, chartData, recentActivities };
  } catch (e) {
    console.error(e);
    return { 
      totalOrders: 0, totalProducts: 0, totalArticles: 0, totalUsers: 0, totalRevenue: 0, 
      chartData: [], recentActivities: [] 
    };
  }
}

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  const stats = await getStats();

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
        <p className="text-gray-500 text-sm mt-1">Ringkasan statistik dan aktivitas website Luckmen Developer</p>
      </div>

      {/* Interactive Stat Cards */}
      <DashboardStatsClient 
        stats={{
          totalRevenue: stats.totalRevenue,
          totalOrders: stats.totalOrders,
          totalProducts: stats.totalProducts,
          totalArticles: stats.totalArticles,
        }} 
        chartData={stats.chartData}
      />

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-bold text-gray-800 mb-4 font-serif">Aksi Cepat</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map((link, i) => (
            <a
              key={i}
              href={link.href}
              className="bg-white border border-gray-200 rounded-sm p-5 hover:border-gold hover:shadow-md transition-all group"
            >
              <div className="text-3xl mb-3">{link.icon}</div>
              <div className="font-semibold text-gray-800 text-sm mb-1 group-hover:text-navy-dark">{link.label}</div>
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
            {stats.recentActivities && stats.recentActivities.length > 0 ? (
              stats.recentActivities.map((act, i) => (
                <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                  <span className="text-xl">
                    {act.action.toLowerCase().includes('login') ? "🔐" : 
                     act.action.toLowerCase().includes('produk') ? "📦" :
                     act.action.toLowerCase().includes('artikel') ? "📝" :
                     act.action.toLowerCase().includes('pesanan') ? "🛒" : "⚡"}
                  </span>
                  <div className="flex-1">
                    <div className="text-sm text-gray-700">{act.action}</div>
                    <div className="text-xs text-gray-400">
                      {new Date(act.createdAt).toLocaleString('id-ID', {
                        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500 py-4 text-center">Belum ada aktivitas.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
