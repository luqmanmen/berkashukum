import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <>{children}</>;
  }

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: "📊" },
    { href: "/admin/produk", label: "Produk", icon: "📦" },
    { href: "/admin/pesanan", label: "Pesanan", icon: "🛒" },
    { href: "/admin/artikel", label: "Artikel", icon: "📝" },
    { href: "/admin/halaman", label: "Halaman", icon: "🗂️" },
    { href: "/admin/pengguna", label: "Pengguna", icon: "👥" },
    { href: "/admin/pengaturan", label: "Pengaturan", icon: "⚙️" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0a1628] text-white flex-shrink-0 flex flex-col">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#c9a84c] rounded-sm flex items-center justify-center">
              <span className="font-serif font-bold text-[#0a1628] text-base">L</span>
            </div>
            <div>
              <div className="font-serif font-bold text-sm text-white">LexNova</div>
              <div className="text-[10px] text-[#c9a84c] tracking-widest uppercase">Admin Panel</div>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors group"
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* User info */}
        <div className="px-4 py-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-[#c9a84c] flex items-center justify-center">
              <span className="text-[#0a1628] text-xs font-bold">
                {session.user?.name?.[0] ?? "A"}
              </span>
            </div>
            <div>
              <div className="text-sm font-medium text-white truncate">{session.user?.name}</div>
              <div className="text-xs text-gray-400 truncate">{session.user?.role}</div>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/" className="flex-1 text-center text-xs text-gray-400 hover:text-white py-1.5 border border-white/10 rounded-sm transition-colors">
              🌐 Lihat Site
            </Link>
            <Link href="/api/auth/signout" className="flex-1 text-center text-xs text-gray-400 hover:text-red-400 py-1.5 border border-white/10 rounded-sm transition-colors">
              🚪 Logout
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Selamat datang, <span className="font-semibold text-gray-800">{session.user?.name}</span> 👋
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-semibold px-3 py-1 rounded-full border border-green-200">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              Online
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
