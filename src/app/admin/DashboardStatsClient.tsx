"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Brush
} from "recharts";

interface ChartDataPoint {
  date: string;
  revenue: number;
  orders: number;
}

interface DashboardStatsClientProps {
  stats: {
    totalRevenue: number;
    totalOrders: number;
    totalProducts: number;
    totalArticles: number;
  };
  chartData: ChartDataPoint[]; // this is now dailyData YYYY-MM-DD
}

export default function DashboardStatsClient({ stats, chartData }: DashboardStatsClientProps) {
  const router = useRouter();
  const [filter, setFilter] = useState<'current-month' | 'all-time'>('current-month');
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  // Process data based on filter
  const processedData = useMemo(() => {
    const today = new Date();
    const currentMonthPrefix = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    
    let filteredData = chartData;

    if (filter === 'current-month') {
      filteredData = chartData.filter(d => d.date.startsWith(currentMonthPrefix));
    } else if (filter === 'all-time' && selectedMonth) {
      filteredData = chartData.filter(d => d.date.startsWith(selectedMonth));
    }

    if (filter === 'all-time' && !selectedMonth) {
      // Group by month
      const monthly: Record<string, { revenue: number, orders: number }> = {};
      chartData.forEach(d => {
        const month = d.date.substring(0, 7); // YYYY-MM
        if (!monthly[month]) monthly[month] = { revenue: 0, orders: 0 };
        monthly[month].revenue += d.revenue;
        monthly[month].orders += d.orders;
      });
      return Object.entries(monthly).map(([date, data]) => ({
        date,
        revenue: data.revenue,
        orders: data.orders
      })).sort((a, b) => a.date.localeCompare(b.date));
    }

    return filteredData.sort((a, b) => a.date.localeCompare(b.date));
  }, [chartData, filter, selectedMonth]);

  // Compute stats for current filter
  const currentStats = useMemo(() => {
    if (filter === 'all-time' && !selectedMonth) {
      return stats; // Total overall
    }
    const filteredRevenue = processedData.reduce((sum, item) => sum + item.revenue, 0);
    const filteredOrders = processedData.reduce((sum, item) => sum + item.orders, 0);
    return {
      ...stats,
      totalRevenue: filteredRevenue,
      totalOrders: filteredOrders,
    };
  }, [processedData, stats, filter, selectedMonth]);

  // Format large numbers
  const formatYAxis = (value: number) => {
    if (value >= 1000000000) return `${(value / 1000000000).toFixed(1).replace(/\.0$/, '')}M`;
    if (value >= 1000000) return `${(value / 1000000).toFixed(1).replace(/\.0$/, '')}Jt`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
    return value.toString();
  };

  const statCards = [
    {
      id: "revenue",
      label: "Total Pendapatan",
      value: `Rp ${currentStats.totalRevenue.toLocaleString("id-ID")}`,
      icon: "💰",
      color: "bg-green-50 border-green-200",
      textColor: "text-green-700",
      onClick: () => {},
    },
    {
      id: "orders",
      label: "Total Pesanan",
      value: currentStats.totalOrders,
      icon: "🛒",
      color: "bg-blue-50 border-blue-200",
      textColor: "text-blue-700",
      onClick: () => {},
    },
    {
      id: "products",
      label: "Total Produk",
      value: stats.totalProducts,
      icon: "📦",
      color: "bg-purple-50 border-purple-200",
      textColor: "text-purple-700",
      onClick: () => router.push("/admin/produk"),
    },
    {
      id: "articles",
      label: "Total Artikel",
      value: stats.totalArticles,
      icon: "📝",
      color: "bg-orange-50 border-orange-200",
      textColor: "text-orange-700",
      onClick: () => router.push("/admin/artikel"),
    },
  ];

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-bold text-gray-800 font-serif">Statistik Dashboard</h2>
        <div className="flex gap-2 bg-white p-1 rounded-md border shadow-sm">
          <button 
            onClick={() => { setFilter('current-month'); setSelectedMonth(null); }}
            className={`px-3 py-1 text-sm font-medium rounded ${filter === 'current-month' ? 'bg-navy text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Bulan Ini
          </button>
          <button 
            onClick={() => { setFilter('all-time'); setSelectedMonth(null); }}
            className={`px-3 py-1 text-sm font-medium rounded ${filter === 'all-time' && !selectedMonth ? 'bg-navy text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            All Time
          </button>
        </div>
      </div>

      {filter === 'all-time' && !selectedMonth && (
        <div className="mb-6 bg-blue-50 text-blue-800 p-3 rounded-md text-sm border border-blue-100">
          💡 Klik pada batang bulan di grafik pesanan untuk melihat detail harian di bulan tersebut.
        </div>
      )}

      {selectedMonth && (
        <div className="mb-6 flex items-center gap-3 bg-white p-3 rounded border">
          <span className="font-semibold text-gray-700">Menampilkan detail bulan: {selectedMonth}</span>
          <button onClick={() => setSelectedMonth(null)} className="text-sm text-red-600 hover:underline">Tutup detail</button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card) => (
          <div
            key={card.id}
            onClick={card.onClick}
            className={`bg-white border rounded-sm p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${card.color}`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{card.icon}</span>
              <span className={`text-xs font-semibold ${card.textColor} bg-white px-2 py-0.5 rounded-full shadow-sm border border-transparent`}>
                {filter === 'current-month' ? 'Bulan Ini' : selectedMonth ? selectedMonth : 'All Time'}
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{card.value}</div>
            <div className="text-sm text-gray-500">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Inline Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white border rounded-sm p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-6 font-serif">Analisis Pendapatan</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={processedData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  tickFormatter={formatYAxis}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  dx={-10}
                  width={60}
                />
                <Tooltip 
                  formatter={(value) => [`Rp ${Number(value ?? 0).toLocaleString("id-ID")}`, "Pendapatan"]}
                  labelFormatter={(label) => `Tanggal/Bulan: ${label}`}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                <Brush dataKey="date" height={30} stroke="#10b981" fill="#f3f4f6" tickFormatter={() => ''} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border rounded-sm p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-6 font-serif">Analisis Pesanan</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={processedData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }} onClick={(data) => {
                if (filter === 'all-time' && !selectedMonth && data && data.activeLabel) {
                  setSelectedMonth(String(data.activeLabel));
                }
              }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  allowDecimals={false}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={formatYAxis}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  dx={-10}
                  width={50}
                />
                <Tooltip 
                  cursor={{fill: '#f3f4f6'}}
                  labelFormatter={(label) => `Tanggal/Bulan: ${label}`}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="orders" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Total Pesanan" className={filter === 'all-time' && !selectedMonth ? "cursor-pointer" : ""} />
                <Brush dataKey="date" height={30} stroke="#3b82f6" fill="#f3f4f6" tickFormatter={() => ''} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
}
