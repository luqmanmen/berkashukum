export const metadata = {
  title: "Kebijakan Privasi | Berkas Hukum Corporate",
  description: "Kebijakan Privasi layanan Berkas Hukum Corporate.",
};

export default function KebijakanPrivasiPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 md:p-12">
          <h1 className="text-3xl font-serif font-bold text-navy-dark mb-4">Kebijakan Privasi</h1>
          <p className="text-sm text-gray-500 mb-8 pb-8 border-b border-gray-100">
            Terakhir diperbarui: 28 Juli 2026
          </p>

          <div className="prose prose-gray max-w-none text-gray-600 leading-relaxed space-y-6">
            <p>
              Selamat datang di <strong>Berkas Hukum Corporate</strong>. Kami sangat menghargai privasi Anda dan berkomitmen untuk melindungi data pribadi yang Anda bagikan kepada kami. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, mengungkapkan, dan mengamankan informasi Anda ketika Anda mengunjungi website kami atau menggunakan layanan konsultasi hukum kami.
            </p>

            <h2 className="text-xl font-bold text-gray-800 mt-8 mb-4">1. Informasi yang Kami Kumpulkan</h2>
            <p>
              Kami hanya mengumpulkan informasi yang relevan dan diperlukan untuk memberikan layanan terbaik kepada Anda. Informasi yang mungkin kami kumpulkan meliputi:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Informasi Identitas Personal:</strong> Nama lengkap, alamat email, nomor telepon, dan informasi kontak lainnya ketika Anda mengisi formulir konsultasi atau menghubungi kami.</li>
              <li><strong>Informasi Dokumen Hukum:</strong> Detail terkait masalah hukum yang Anda sampaikan secara sukarela kepada kami untuk tujuan konsultasi awal. (Harap dicatat bahwa informasi mendalam yang dilindungi oleh hak istimewa pengacara-klien akan diatur dalam perjanjian terpisah).</li>
              <li><strong>Informasi Teknis:</strong> Alamat IP, jenis browser, sistem operasi, dan data analitik kunjungan website (seperti halaman yang dilihat dan durasi kunjungan) untuk meningkatkan pengalaman pengguna.</li>
            </ul>

            <h2 className="text-xl font-bold text-gray-800 mt-8 mb-4">2. Bagaimana Kami Menggunakan Informasi Anda</h2>
            <p>Data pribadi yang kami kumpulkan digunakan untuk tujuan berikut:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Merespons permintaan konsultasi atau pertanyaan Anda.</li>
              <li>Memberikan saran hukum, layanan legal audit, atau penyelesaian sengketa sesuai permintaan.</li>
              <li>Mengirimkan email administratif, jadwal janji temu, atau pembaruan terkait layanan kami.</li>
              <li>Menganalisis penggunaan website untuk perbaikan antarmuka (UI/UX) dan kinerja sistem.</li>
            </ul>

            <h2 className="text-xl font-bold text-gray-800 mt-8 mb-4">3. Perlindungan & Kerahasiaan Data (Client-Attorney Privilege)</h2>
            <p>
              Sebagai lembaga hukum profesional, kami terikat oleh kode etik advokat dan prinsip kerahasiaan klien (Client-Attorney Privilege). Segala bentuk informasi, dokumen, atau kronologi kasus yang Anda sampaikan kepada kami akan dijaga kerahasiaannya dengan tingkat keamanan tertinggi dan tidak akan dibagikan kepada pihak ketiga manapun tanpa persetujuan tertulis dari Anda, kecuali diwajibkan oleh undang-undang atau perintah pengadilan.
            </p>

            <h2 className="text-xl font-bold text-gray-800 mt-8 mb-4">4. Penggunaan Cookies</h2>
            <p>
              Website ini menggunakan <em>cookies</em> untuk melacak preferensi pengunjung dan meningkatkan fungsionalitas situs. Anda memiliki kontrol penuh untuk menerima atau menolak cookies melalui pengaturan browser Anda, namun menolak cookies dapat membatasi beberapa fitur website.
            </p>

            <h2 className="text-xl font-bold text-gray-800 mt-8 mb-4">5. Perubahan pada Kebijakan Privasi</h2>
            <p>
              Kami berhak untuk memperbarui Kebijakan Privasi ini dari waktu ke waktu agar selaras dengan perubahan regulasi hukum di Indonesia atau penyesuaian layanan kami. Kami menganjurkan Anda untuk meninjau halaman ini secara berkala.
            </p>

            <h2 className="text-xl font-bold text-gray-800 mt-8 mb-4">6. Hubungi Kami</h2>
            <p>
              Jika Anda memiliki pertanyaan mengenai Kebijakan Privasi ini atau ingin meminta penghapusan data pribadi Anda dari sistem kami, silakan hubungi kami melalui:
            </p>
            <ul className="list-none space-y-2 font-medium">
              <li>Email: support@berkashukum.com</li>
              <li>Telepon: +62 812-9639-3972</li>
              <li>Alamat: JL Bogen Krajan No 33, Ploso, Tambaksari, 60133 Surabaya, Indonesia</li>
            </ul>
          </div>
        </div>
        
      </div>
    </div>
  );
}
