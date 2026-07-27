"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import ProductFilterModal, { FilterState } from "@/components/ProductFilterModal";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string | null;
  documentFormat: string | null;
  promoStatus: string | null;
  image: string | null;
  status: string;
}

export default function ProductListClient({ initialProducts }: { initialProducts: Product[] }) {
  const [showFilter, setShowFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    category: "",
    documentFormat: "",
    promoStatus: "",
  });

  const filterPills = ["Semua", "Template", "E-Book", "Konsultasi", "⚡ Promo"];

  // Apply all active filters on top of the initial products
  const filteredProducts = initialProducts.filter((p) => {
    // Search filter
    const query = searchQuery.toLowerCase();
    if (query && !p.name.toLowerCase().includes(query) && !p.description?.toLowerCase().includes(query)) {
      return false;
    }

    // Category pill filter
    if (activeCategory === "Template" && !p.category?.includes("Template")) return false;
    if (activeCategory === "E-Book" && !p.category?.includes("E-Book")) return false;
    if (activeCategory === "Konsultasi" && !p.category?.includes("Konsultasi")) return false;
    if (activeCategory === "⚡ Promo" && !p.promoStatus) return false;

    // Modal filters
    if (activeFilters.category && !p.category?.includes(activeFilters.category)) return false;
    if (activeFilters.documentFormat && p.documentFormat !== activeFilters.documentFormat) return false;
    if (activeFilters.promoStatus && p.promoStatus !== activeFilters.promoStatus) return false;

    return true;
  });

  const handleApplyFilter = useCallback((filters: FilterState) => {
    setActiveFilters(filters);
    setShowFilter(false);
  }, []);

  const handleResetFilter = useCallback(() => {
    setActiveFilters({ category: "", documentFormat: "", promoStatus: "" });
    setActiveCategory("Semua");
    setShowFilter(false);
  }, []);

  // Count active modal filters
  const activeFilterCount = Object.values(activeFilters).filter(Boolean).length;

  return (
    <div className="bg-[#f5f5f5] min-h-screen pb-20">
      {/* Top Search + Category Bar (fixed, flush to top) */}
      <div className="bg-white fixed top-0 left-0 right-0 z-50 shadow-sm" style={{willChange:'transform',transform:'translateZ(0)'}}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
          {/* Back to Home Button */}
          <Link href="/" className="flex items-center justify-center p-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
          </Link>

          <div className="flex-1 relative flex items-center">
            <div className="absolute left-3 text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <input
              type="text"
              placeholder="Cari Dokumen Hukum..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#f8f9fa] border border-gray-200 rounded-full py-2.5 pl-9 pr-4 text-sm focus:outline-none focus:border-gold text-gray-800"
            />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center overflow-x-auto no-scrollbar gap-2 border-t border-gray-100">
          {filterPills.map((pill) => (
            <button
              key={pill}
              onClick={() => setActiveCategory(pill)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-semibold transition-colors border ${
                activeCategory === pill
                  ? "bg-navy-dark text-white border-navy-dark"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gold hover:text-gold"
              }`}
            >
              {pill}
            </button>
          ))}

          <div className="w-px h-6 bg-gray-200 mx-1 flex-shrink-0"></div>

          <button
            onClick={() => setShowFilter(true)}
            className={`relative flex items-center gap-1 whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
              activeFilterCount > 0
                ? "bg-navy-dark text-white border-navy-dark"
                : "bg-white text-gold border-gold/50 hover:bg-gold/5"
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
            Filter
            {activeFilterCount > 0 && (
              <span className="bg-gold text-navy-dark text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Padding top to compensate for fixed bar height */}
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 mt-[140px]">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 text-gray-400 bg-white rounded-lg mx-2 mt-4 shadow-sm border border-gray-100">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-sm font-medium">Tidak ada produk ditemukan.</p>
            <button onClick={handleResetFilter} className="mt-4 text-xs text-gold underline">Hapus semua filter</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      <ProductFilterModal
        isOpen={showFilter}
        currentFilters={activeFilters}
        onClose={() => setShowFilter(false)}
        onApply={handleApplyFilter}
        onReset={handleResetFilter}
      />
    </div>
  );
}
