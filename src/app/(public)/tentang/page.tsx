export const runtime = "edge";
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

  try {
    const settings = await prisma.siteSetting.findMany({
      where: { key: { in: ["site_owner_name", "home_hero_image", "about_subtitle", "about_description"] } }
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
    });
  } catch(e) {}


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
                <div className="w-48 h-48 bg-navy-mid rounded-full overflow-hidden border-4 border-gold shadow-lg flex items-end justify-center shrink-0 relative">
                  {heroImage ? (
                    <Image
                      src={heroImage}
                      alt={`Foto ${ownerName}`}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="text-6xl text-white/20 mb-4">👤</div>
                  )}
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
                
                <div className="prose prose-sm text-gray-600">
                  {aboutDesc.split('\n').map((paragraph, i) => (
                    paragraph.trim() ? <p key={i}>{paragraph}</p> : <br key={i} />
                  ))}
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

            <hr className="my-10 border-gray-100" />

            {/* Resume Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              
              {/* Education */}
              <div>
                <h3 className="font-serif text-xl font-bold text-navy mb-6 flex items-center gap-2">
                  <span className="text-gold">🎓</span> Riwayat Pendidikan
                </h3>
                <ul className="space-y-4">
                  <li className="relative pl-6 before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:bg-gold before:rounded-full">
                    <div className="font-bold text-navy text-sm">Ph.D. in Business Law</div>
                    <div className="text-gray-500 text-xs mt-1">Universitas Indonesia (2018)</div>
                  </li>
                  <li className="relative pl-6 before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:bg-gold before:rounded-full">
                    <div className="font-bold text-navy text-sm">Magister Hukum (M.H.)</div>
                    <div className="text-gray-500 text-xs mt-1">Universitas Gadjah Mada (2012)</div>
                  </li>
                  <li className="relative pl-6 before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:bg-gold before:rounded-full">
                    <div className="font-bold text-navy text-sm">Sarjana Hukum (S.H.)</div>
                    <div className="text-gray-500 text-xs mt-1">Universitas Diponegoro (2008)</div>
                  </li>
                </ul>
              </div>

              {/* Certifications & Affiliations */}
              <div>
                <h3 className="font-serif text-xl font-bold text-navy mb-6 flex items-center gap-2">
                  <span className="text-gold">📜</span> Sertifikasi Resmi
                </h3>
                <ul className="space-y-4">
                  <li className="relative pl-6 before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:bg-gold before:rounded-full">
                    <div className="font-bold text-navy text-sm">Lisensi Kurator & Pengurus</div>
                    <div className="text-gray-500 text-xs mt-1">Asosiasi Kurator dan Pengurus Indonesia (AKPI)</div>
                  </li>
                  <li className="relative pl-6 before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:bg-gold before:rounded-full">
                    <div className="font-bold text-navy text-sm">Lisensi Advokat (PERADI)</div>
                    <div className="text-gray-500 text-xs mt-1">Perhimpunan Advokat Indonesia</div>
                  </li>
                  <li className="relative pl-6 before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:bg-gold before:rounded-full">
                    <div className="font-bold text-navy text-sm">Certified Legal Auditor (CLA)</div>
                    <div className="text-gray-500 text-xs mt-1">Asosiasi Auditor Hukum Indonesia (ASAHI)</div>
                  </li>
                </ul>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
