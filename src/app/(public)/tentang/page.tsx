import Image from "next/image";
import Link from "next/link";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function TentangPage() {
  let ownerName = "Berkas Hukum Corporate";
  let ownerShortName = "Berkas Hukum Corporate";
  let heroImage: string | null = null;
  let aboutSubtitle = "BADAN HUKUM, KONSULTAN LEGAL & LEGAL AUDIT SEJAK 2016";
  let aboutDesc = "Sejak didirikan pada tahun 2016, Berkas Hukum Corporate telah mendedikasikan layanannya secara profesional pada penyelesaian sengketa bisnis kompleks, legal audit, restrukturisasi perusahaan, dan kepailitan.\n\nKami percaya bahwa hukum tidak hanya tentang memenangkan perdebatan di pengadilan, tetapi tentang menyusun strategi mitigasi risiko yang mengamankan masa depan bisnis Anda secara terstruktur. Karena itulah, selain menyediakan layanan konsultasi korporat premium, kami juga merancang sistem penyediaan dokumen hukum berkualitas tinggi yang dapat diakses oleh UMKM dan startup dengan efisien dan andal.";
  
  let educationList: {id: string, title: string, subtitle: string}[] = [];
  let certList: {id: string, title: string, subtitle: string}[] = [];

  try {
    const settings = await prisma.siteSetting.findMany({
      where: { key: { in: ["site_owner_name", "home_hero_image", "about_subtitle", "about_description", "about_education", "about_certifications"] } }
    });
    settings.forEach(s => {
      if (s.key === "site_owner_name") {
        ownerName = s.value;
        ownerShortName = ownerName.split(",")[0];
      }
      if (s.key === "home_hero_image" && s.value && s.value !== "none") {
        heroImage = s.value;
      }
      if (s.key === "about_subtitle") {
        aboutSubtitle = s.value;
      }
      if (s.key === "about_description") {
        aboutDesc = s.value;
      }
      if (s.key === "about_education" && s.value) {
        try { educationList = JSON.parse(s.value); } catch {}
      }
      if (s.key === "about_certifications" && s.value) {
        try { certList = JSON.parse(s.value); } catch {}
      }
    });
  } catch(e) {}

  // Fallback to defaults if no settings set yet (to match old UI for first load before saving)
  if (educationList.length === 0 && certList.length === 0 && aboutDesc === "Sejak didirikan pada tahun 2016, Berkas Hukum Corporate telah mendedikasikan layanannya secara profesional pada penyelesaian sengketa bisnis kompleks, legal audit, restrukturisasi perusahaan, dan kepailitan.\n\nKami percaya bahwa hukum tidak hanya tentang memenangkan perdebatan di pengadilan, tetapi tentang menyusun strategi mitigasi risiko yang mengamankan masa depan bisnis Anda secara terstruktur. Karena itulah, selain menyediakan layanan konsultasi korporat premium, kami juga merancang sistem penyediaan dokumen hukum berkualitas tinggi yang dapat diakses oleh UMKM dan startup dengan efisien dan andal.") {
    educationList = [
      { id: '1', title: "Ph.D. in Business Law", subtitle: "Universitas Indonesia (2018)" },
      { id: '2', title: "Magister Hukum (M.H.)", subtitle: "Universitas Gadjah Mada (2012)" },
      { id: '3', title: "Sarjana Hukum (S.H.)", subtitle: "Universitas Diponegoro (2008)" }
    ];
    certList = [
      { id: '1', title: "Lisensi Kurator & Pengurus", subtitle: "Asosiasi Kurator dan Pengurus Indonesia (AKPI)" },
      { id: '2', title: "Lisensi Advokat (PERADI)", subtitle: "Perhimpunan Advokat Indonesia" },
      { id: '3', title: "Certified Legal Auditor (CLA)", subtitle: "Asosiasi Auditor Hukum Indonesia (ASAHI)" }
    ];
  }


  return (
    <div className="pt-32 pb-20 bg-cream min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-navy mb-4">Profil Singkat</h1>
          <div className="gold-divider mx-auto" />
        </div>

        <div className="bg-white rounded-sm shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              
              {/* Photo Area */}
              <div className="w-full md:w-1/3 flex justify-center">
                <div className="w-56 h-56 relative flex items-center justify-center shrink-0">
                  <Image
                    src="/images/logo-3d-2.png"
                    alt={`Foto ${ownerName}`}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>


              {/* Text Content */}
              <div className="w-full md:w-2/3 space-y-6">
                <div>
                  <h2 className="font-serif text-3xl font-bold text-navy">{ownerName}</h2>
                  <p className="text-gold font-bold uppercase tracking-widest text-xs mt-2">
                    {aboutSubtitle}
                  </p>
                </div>
                
                <div className="prose prose-sm text-gray-600 whitespace-pre-wrap text-justify">
                  {aboutDesc}
                </div>

                <div className="pt-4 flex flex-wrap gap-3">
                  <Link href="/konsultasi" className="btn-navy px-6 py-2.5 text-sm font-semibold rounded-sm text-white border-2 border-navy">
                    Jadwalkan Konsultasi
                  </Link>
                  <Link href="/produk" className="btn-gold px-6 py-2.5 text-sm font-semibold rounded-sm bg-transparent border-2 border-gold text-navy hover:text-white">
                    Lihat Template Dokumen
                  </Link>
                </div>
              </div>

            </div>

            <>
              <hr className="my-10 border-gray-100" />

              {/* Lokasi Kantor */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                
                {/* Alamat */}
                <div className="flex flex-col justify-center">
                  <h3 className="font-serif text-2xl font-bold text-navy mb-6 flex items-center gap-2">
                    <span className="text-gold">📍</span> Lokasi Kantor
                  </h3>
                  <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
                    <p className="font-semibold text-lg text-navy-dark">Gedung Office 8, Lantai 15</p>
                    <p>SCBD Lot 28, Jl. Jend. Sudirman Kav. 52-53<br />Senayan, Kebayoran Baru<br />Jakarta Selatan, 12190, Indonesia</p>
                    
                    <div className="pt-4 border-t border-gray-100 mt-4">
                      <p className="flex items-center gap-2 font-medium">
                        <span className="text-gold">📞</span> +62 812-3456-7890
                      </p>
                      <p className="flex items-center gap-2 mt-2 font-medium">
                        <span className="text-gold">✉️</span> contact@berkashukum.com
                      </p>
                    </div>
                  </div>
                </div>

                {/* Maps */}
                <div className="rounded-xl overflow-hidden shadow-md border border-gray-100 h-64 md:h-[320px]">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.273629471378!2d106.80424561536965!3d-6.227607795491953!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f14371465e9b%3A0x6b4a62175c5e884e!2sOffice%208!5e0!3m2!1sen!2sid!4v1655101035622!5m2!1sen!2sid" 
                    width="100%" 
                    height="100%" 
                    style={{border:0}} 
                    allowFullScreen 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>

              </div>
            </>
          </div>
        </div>
      </div>
    </div>
  );
}
