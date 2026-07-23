import Image from "next/image";
import Link from "next/link";

export default function TentangPage() {
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
                <div className="w-48 h-48 bg-navy-mid rounded-full overflow-hidden border-4 border-gold shadow-lg flex items-end justify-center shrink-0">
                  <div className="text-6xl text-white/20 mb-4">👤</div>
                  {/* Gunakan next/image jika foto asli tersedia */}
                </div>
              </div>

              {/* Text Content */}
              <div className="w-full md:w-2/3 space-y-6">
                <div>
                  <h2 className="font-serif text-3xl font-bold text-navy">Dr. Satria Wibowo, S.H., M.H., Ph.D.</h2>
                  <p className="text-gold font-bold uppercase tracking-widest text-xs mt-2">
                    Kurator Kepailitan & Konsultan Hukum Bisnis
                  </p>
                </div>
                
                <div className="prose prose-sm text-gray-600">
                  <p>
                    Dengan pengalaman praktis dan akademis lebih dari 15 tahun, Dr. Satria mendedikasikan karirnya pada penyelesaian sengketa bisnis kompleks, restrukturisasi perusahaan, dan kepailitan.
                  </p>
                  <p>
                    Beliau percaya bahwa hukum tidak hanya tentang memenangkan perdebatan di pengadilan, tetapi tentang menyusun strategi mitigasi risiko yang mengamankan masa depan bisnis Anda. Karena itulah, selain menjadi konsultan pribadi, beliau merancang template dokumen hukum yang bisa diakses oleh UMKM dan startup dengan budget minim.
                  </p>
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
