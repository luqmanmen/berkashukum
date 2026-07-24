import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Produk Digital Hukum | LexNova Law Firm",
  description: "Beli template dokumen hukum, e-book panduan hukum, dan paket konsultasi online dari LexNova Law Firm.",
};

const categoryIcons: Record<string, string> = {
  "Template Dokumen": "📄",
  "E-Book": "📚",
  "Konsultasi": "💬",
};

export const dynamic = "force-dynamic";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const selectedCategory = params.category || "Semua";

  let ownerName = "Dr. Satria Wibowo";
  try {
    const setting = await prisma.siteSetting.findUnique({ where: { key: "site_owner_name" } });
    if (setting) ownerName = setting.value;
  } catch(e) {}

  const products = await prisma.product.findMany({
    where: {
      status: "PUBLISHED",
      ...(selectedCategory !== "Semua" ? { category: selectedCategory } : {}),
    },
    orderBy: { createdAt: "asc" },
  });

  const categories = ["Semua", "Template Dokumen", "E-Book", "Konsultasi"];

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-navy-dark overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c9a84c' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-center mb-16">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">Template Dokumen Hukum</h1>
            <div className="gold-divider mx-auto mb-6" />
            <p className="text-gray-300 max-w-2xl mx-auto">
              Draf kontrak dan dokumen hukum berkualitas tinggi yang disusun langsung oleh {ownerName}. Solusi hemat untuk legalitas bisnis Anda.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits strip */}
      <div className="bg-gold">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-wrap items-center justify-center gap-6 text-navy-dark text-sm font-semibold">
            <span>✅ Download Instan</span>
            <span>✅ Dibuat oleh Pengacara Berlisensi</span>
            <span>✅ Pembayaran Aman via Transfer Bank</span>
            <span>✅ Garansi Kepuasan</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <section className="section-padding bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category filter */}
          <div className="flex flex-wrap gap-3 mb-10 justify-center">
            {categories.map((cat) => (
              <Link
                key={cat}
                href={cat === "Semua" ? "/produk" : `/produk?category=${encodeURIComponent(cat)}`}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  selectedCategory === cat
                    ? "bg-navy text-white shadow-md"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-gold hover:text-gold"
                }`}
              >
                {cat !== "Semua" && categoryIcons[cat]} {cat}
              </Link>
            ))}
          </div>

          {/* Product grid */}
          {products.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <div className="text-5xl mb-4">📭</div>
              <p className="text-lg">Belum ada produk di kategori ini.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Trust section */}
      <section className="bg-navy py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { num: "500+", label: "Produk Terjual" },
              { num: "98%", label: "Rating Kepuasan" },
              { num: "15+", label: "Tahun Keahlian" },
              { num: "24/7", label: "Dukungan Email" },
            ].map((s, i) => (
              <div key={i}>
                <div className="font-serif text-3xl font-bold text-gold mb-1">{s.num}</div>
                <div className="text-gray-400 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
