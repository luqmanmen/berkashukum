"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Lawyer } from "@/generated/prisma";

export default function KonsultasiClient({ lawyers }: { lawyers: Lawyer[] }) {
  const [selectedLawyer, setSelectedLawyer] = useState<Lawyer | null>(null);

  return (
    <div>
      <div className={`grid grid-cols-1 gap-6 mb-12 mx-auto ${
        lawyers.length === 1 ? 'max-w-sm' : 
        lawyers.length === 2 ? 'sm:grid-cols-2 max-w-2xl' : 
        'sm:grid-cols-2 lg:grid-cols-3'
      }`}>
        {lawyers.map((lawyer) => (
          <div 
            key={lawyer.id} 
            onClick={() => setSelectedLawyer(lawyer)}
            className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer text-center group"
          >
            <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden mb-4 border-4 border-gray-50 group-hover:border-gold/20 transition-colors">
              {lawyer.photo ? (
                <Image src={lawyer.photo} alt={lawyer.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                  <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                </div>
              )}
            </div>
            <h3 className="font-serif text-xl font-bold text-navy mb-1 group-hover:text-gold transition-colors">{lawyer.name}</h3>
            <p className="text-gray-500 text-sm font-medium">{lawyer.specialization}</p>
            <div className="mt-4 inline-block bg-cream text-navy-dark text-xs font-bold px-3 py-1.5 rounded-full">
              {lawyer.consultationPrice === 0 ? "Gratis" : `Rp ${lawyer.consultationPrice.toLocaleString("id-ID")}`}
            </div>
          </div>
        ))}
      </div>

      {lawyers.length === 0 && (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
          <p className="text-gray-500">Belum ada pengacara yang tersedia saat ini.</p>
        </div>
      )}

      {/* Lawyer Detail Modal */}
      {selectedLawyer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/80 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="relative h-32 bg-gradient-to-r from-navy to-navy-dark">
              <button 
                onClick={() => setSelectedLawyer(null)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="px-8 pb-8 pt-0 relative">
              <div className="relative w-28 h-28 mx-auto -mt-14 rounded-full overflow-hidden border-4 border-white shadow-md bg-white">
                {selectedLawyer.photo ? (
                  <Image src={selectedLawyer.photo} alt={selectedLawyer.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                    <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                  </div>
                )}
              </div>
              
              <div className="text-center mt-4 mb-6">
                <h3 className="font-serif text-2xl font-bold text-navy">{selectedLawyer.name}</h3>
                <p className="text-gold font-bold text-sm tracking-wide uppercase mt-1">{selectedLawyer.specialization}</p>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                  {selectedLawyer.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div>
                  <div className="text-xs text-gray-500 font-semibold mb-1 uppercase">Tarif Konsultasi</div>
                  <div className="text-xl font-bold text-navy-dark">
                    {selectedLawyer.consultationPrice === 0 ? "Gratis" : `Rp ${selectedLawyer.consultationPrice.toLocaleString("id-ID")}`}
                  </div>
                </div>
                <Link 
                  href={`/konsultasi/booking/${selectedLawyer.id}`}
                  className="bg-gold hover:bg-gold-light text-navy-dark px-6 py-3 rounded-xl font-bold text-sm shadow-md transition-all active:scale-95"
                >
                  Pilih & Booking
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
