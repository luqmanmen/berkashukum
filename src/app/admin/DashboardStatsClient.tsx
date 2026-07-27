"use client";

import { useState } from "react";
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
  chartData: ChartDataPoint[];
}

export default function DashboardStatsClient({ stats, chartData }: DashboardStatsClientProps) {
  const router = useRouter();
  const [activeModal, setActiveModal] = useState<"revenue" | "orders" | null>(null);

  const statCards = [
    {
      id: "revenue",
      label: "Total Pendapatan",
      value: `Rp ${stats.totalRevenue.toLocaleString("id-ID")}`,
      icon: "💰",
      color: "bg-green-50 border-green-200",
      textColor: "text-green-700",
      onClick: () => setActiveModal("revenue"),
    },
    {
      id: "orders",
      label: "Total Pesanan",
      value: stats.totalOrders,
      icon: "🛒",
      color: "bg-blue-50 border-blue-200",
      textColor: "text-blue-700",
      onClick: () => setActiveModal("orders"),
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card) => (
          <div
            key={card.id}
            onClick={card.onClick}
            className={`bg-white border rounded-sm p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${card.color}`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{card.icon}</span>
              <button className={`text-xs font-semibold ${card.textColor} bg-white px-2 py-0.5 rounded-full hover:bg-gray-50 transition-colors flex items-center gap-1 shadow-sm border border-transparent hover:border-gray-200`}>
                All time
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{card.value}</div>
            <div className="text-sm text-gray-500">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Chart Modals */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-md shadow-2xl w-full max-w-4xl p-6 relative overflow-hidden animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <h2 className="text-xl font-bold text-gray-900 mb-6 font-serif">
              {activeModal === "revenue" ? "Analisis Pendapatan" : "Analisis Pesanan"}
            </h2>

            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                {activeModal === "revenue" ? (
                  <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
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
                      tickFormatter={(value) => `Rp${(value / 1000).toFixed(0)}k`}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                      dx={-10}
                    />
                    <Tooltip 
                      formatter={(value) => [`Rp ${Number(value ?? 0).toLocaleString("id-ID")}`, "Pendapatan"]}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                  </AreaChart>
                ) : (
                  <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                      dx={-10}
                    />
                    <Tooltip 
                      cursor={{fill: '#f3f4f6'}}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="orders" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Total Pesanan" />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button 
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-sm hover:bg-gray-200 font-medium text-sm transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
