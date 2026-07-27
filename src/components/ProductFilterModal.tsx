"use client";

import { useState, useEffect } from "react";

export interface FilterState {
  category: string;
  documentFormat: string;
  promoStatus: string;
}

interface ProductFilterModalProps {
  isOpen: boolean;
  currentFilters: FilterState;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  onReset: () => void;
}

const TABS = ["Kategori", "Format Dokumen", "Program Promo", "Batas Harga", "Penilaian"];

const OPTIONS: Record<string, { label: string; field: keyof FilterState; choices: string[] }> = {
  "Kategori": {
    label: "Kategori Produk",
    field: "category",
    choices: ["Template Dokumen", "E-Book", "Konsultasi", "Lainnya"],
  },
  "Format Dokumen": {
    label: "Format Dokumen",
    field: "documentFormat",
    choices: ["Microsoft Word (.docx)", "PDF (.pdf)", "Microsoft Excel (.xlsx)", "ZIP (Bundel)", "Online (Konsultasi)"],
  },
  "Program Promo": {
    label: "Program Promo",
    field: "promoStatus",
    choices: ["Diskon 50%", "Promo Bundling", "Harga Spesial"],
  },
};

export default function ProductFilterModal({ isOpen, currentFilters, onClose, onApply, onReset }: ProductFilterModalProps) {
  const [activeTab, setActiveTab] = useState("Kategori");
  const [localFilters, setLocalFilters] = useState<FilterState>(currentFilters);

  // Sync local state when modal opens
  useEffect(() => {
    if (isOpen) setLocalFilters(currentFilters);
  }, [isOpen, currentFilters]);

  if (!isOpen) return null;

  const toggleChoice = (field: keyof FilterState, value: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      [field]: prev[field] === value ? "" : value, // toggle
    }));
  };

  const activeTabConfig = OPTIONS[activeTab];

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 transition-opacity" onClick={onClose} />

      {/* Slide-up Modal */}
      <div className="relative bg-white w-full max-h-[90vh] rounded-t-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100">
          <div className="w-6" />
          <h2 className="text-navy-dark font-bold text-base">Pilih Preferensi</h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Content Split */}
        <div className="flex flex-1 overflow-hidden min-h-0">
          {/* Left Sidebar */}
          <div className="w-28 bg-[#f8f9fa] border-r border-gray-100 overflow-y-auto flex-shrink-0">
            {TABS.map((tab) => {
              const config = OPTIONS[tab];
              const isActive = activeTab === tab;
              const hasValue = config && localFilters[config.field];
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`w-full text-left px-3 py-4 text-xs font-medium border-l-2 transition-colors relative ${
                    isActive
                      ? "border-navy-dark bg-white text-navy-dark font-semibold"
                      : "border-transparent text-gray-500 hover:bg-white hover:text-gray-700"
                  }`}
                >
                  {tab}
                  {hasValue && (
                    <span className="absolute top-3 right-2 w-1.5 h-1.5 bg-gold rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Content */}
          <div className="flex-1 p-4 overflow-y-auto bg-white">
            {activeTabConfig ? (
              <>
                <h3 className="font-bold text-sm text-navy-dark mb-3">{activeTabConfig.label}</h3>
                <div className="flex flex-wrap gap-2">
                  {activeTabConfig.choices.map((choice) => {
                    const isSelected = localFilters[activeTabConfig.field] === choice;
                    return (
                      <button
                        key={choice}
                        onClick={() => toggleChoice(activeTabConfig.field, choice)}
                        className={`px-3 py-2 rounded text-xs transition-colors border ${
                          isSelected
                            ? "bg-navy-dark text-white border-navy-dark"
                            : "bg-gray-100 text-gray-700 border-gray-100 hover:border-navy-dark/30"
                        }`}
                      >
                        {choice}
                      </button>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="text-sm text-gray-400 text-center py-10">
                Filter ini belum tersedia.
              </div>
            )}
          </div>
        </div>

        {/* Action Bar */}
        <div className="p-3 border-t border-gray-100 bg-white flex gap-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <button
            onClick={onReset}
            className="flex-1 py-3 border border-gold text-gold-dark font-bold text-sm rounded-md hover:bg-gold/10 transition-colors"
          >
            Atur Ulang
          </button>
          <button
            onClick={() => onApply(localFilters)}
            className="flex-1 py-3 bg-navy-dark text-white font-bold text-sm rounded-md hover:bg-navy-dark/90 shadow-md transition-colors"
          >
            Terapkan
          </button>
        </div>
      </div>
    </div>
  );
}
