import Script from "next/script";

import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const { prisma } = await import("@/lib/prisma");
  let ownerName = "Dr. Satria Wibowo";
  try {
    const setting = await prisma.siteSetting.findUnique({ where: { key: "site_owner_name" } });
    if (setting) ownerName = setting.value;
  } catch (e) {}
  
  return {
    title: `Konsultasi Hukum | ${ownerName}`,
    description: `Jadwalkan sesi konsultasi hukum 1-on-1 dengan ${ownerName}, pakar hukum bisnis dan kurator kepailitan.`,
  };
}

export const dynamic = "force-dynamic";

export default function KonsultasiPage() {
  return (
    <div className="pt-32 pb-20 bg-cream min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-10">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-navy mb-4">Konsultasi Pribadi</h1>
          <div className="gold-divider mx-auto mb-6" />
          <p className="text-gray-600 text-sm max-w-2xl mx-auto">
            Silakan pilih jadwal yang tersedia di bawah ini. Sesi konsultasi akan dilakukan secara daring (Zoom/Google Meet) selama 45 menit. Kerahasiaan data dan identitas Anda dijamin.
          </p>
        </div>

        <div className="bg-white rounded-sm shadow-xl border border-gray-100 p-2 md:p-6 mb-10">
          {/* Calendly inline widget begin */}
          <div 
            className="calendly-inline-widget" 
            data-url="https://calendly.com/satriawibowo-demo/konsultasi-hukum?hide_event_type_details=1&hide_gdpr_banner=1" 
            style={{ minWidth: "320px", height: "700px" }}
          ></div>
          <Script 
            type="text/javascript" 
            src="https://assets.calendly.com/assets/external/widget.js" 
            async
          />
          {/* Calendly inline widget end */}
        </div>
        
        <div className="text-center">
          <h3 className="font-serif text-xl font-bold text-navy mb-3">Butuh layanan Retainer (Jangka Panjang)?</h3>
          <p className="text-gray-500 text-sm mb-4">
            Untuk perusahaan yang membutuhkan legal standing rutin atau review kontrak harian, silakan hubungi asisten kami.
          </p>
          <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="inline-block btn-navy bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-sm font-semibold text-sm">
            Chat via WhatsApp
          </a>
        </div>

      </div>
    </div>
  );
}
