import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import KonsultasiClient from "./KonsultasiClient";

export async function generateMetadata(): Promise<Metadata> {
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

export default async function KonsultasiPage() {
  const lawyers = await prisma.lawyer.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "asc" }
  });

  return (
    <div className="pt-32 pb-20 bg-cream min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-10">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-navy mb-4">Pilih Lawyer</h1>
          <div className="gold-divider mx-auto mb-6" />
          <p className="text-gray-600 text-sm max-w-2xl mx-auto">
            Silakan pilih pakar hukum yang paling sesuai dengan kebutuhan Anda. Jadwal konsultasi akan disepakati bersama setelah Anda melakukan booking.
          </p>
        </div>

        <KonsultasiClient lawyers={lawyers} />
        
        <div className="text-center mt-12">
          <h3 className="font-serif text-xl font-bold text-navy mb-3">Butuh layanan Retainer (Jangka Panjang)?</h3>
          <p className="text-gray-500 text-sm mb-4">
            Untuk perusahaan yang membutuhkan legal standing rutin atau review kontrak harian, silakan hubungi asisten kami.
          </p>
          <a href="https://wa.me/6281296393972" target="_blank" rel="noopener noreferrer" className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-sm font-semibold text-sm mr-2 mb-2 transition-colors">
            WhatsApp Admin 1
          </a>
          <a href="https://wa.me/6285771123000" target="_blank" rel="noopener noreferrer" className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-sm font-semibold text-sm mb-2 transition-colors">
            WhatsApp Admin 2
          </a>
        </div>

      </div>
    </div>
  );
}
