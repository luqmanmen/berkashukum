import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hubungi Kami | LexNova Law Firm",
  description: "Hubungi LexNova Law Firm untuk konsultasi hukum, pertanyaan layanan, atau kunjungi kantor kami. Kami siap membantu 24/7.",
};

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-navy-dark overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c9a84c' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gold text-sm font-semibold tracking-widest uppercase mb-3">Kontak</p>
          <h1 className="font-serif text-5xl sm:text-6xl font-bold text-white mb-5">Hubungi Kami</h1>
          <div className="gold-divider mx-auto mb-5" />
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Kami siap menjawab setiap pertanyaan dan kebutuhan hukum Anda. Jangan ragu untuk menghubungi tim kami.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="section-padding bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-6">
              <div>
                <h2 className="font-serif text-2xl font-bold text-navy mb-6">Informasi Kontak</h2>
                <div className="space-y-5">
                  {[
                    {
                      icon: "📍",
                      label: "Alamat",
                      value: "Jl. Sudirman No. 123, Lantai 15\nJakarta Pusat, 10220\nIndonesia",
                    },
                    {
                      icon: "📞",
                      label: "Telepon",
                      value: "+62 21 234 567\n+62 812 3456 789",
                    },
                    {
                      icon: "✉️",
                      label: "Email",
                      value: "info@lexnova.co.id\nconsultation@lexnova.co.id",
                    },
                    {
                      icon: "🕒",
                      label: "Jam Operasional",
                      value: "Senin – Jumat: 08.00 – 17.00 WIB\nSabtu: 09.00 – 13.00 WIB",
                    },
                  ].map((info, i) => (
                    <div key={i} className="flex gap-4 bg-white border border-gray-100 rounded-sm p-5 shadow-sm">
                      <span className="text-2xl">{info.icon}</span>
                      <div>
                        <div className="text-xs font-semibold text-gold uppercase tracking-wide mb-1">
                          {info.label}
                        </div>
                        <div className="text-gray-600 text-sm whitespace-pre-line">{info.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* WhatsApp CTA */}
              <a
                href="https://wa.me/628123456789"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-green-600 hover:bg-green-500 text-white font-semibold px-6 py-4 rounded-sm transition-colors w-full justify-center"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.117 1.524 5.852L.057 23.43a.5.5 0 00.513.57l5.701-1.495A11.96 11.96 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.882a9.863 9.863 0 01-5.031-1.378l-.36-.213-3.728.979.995-3.632-.234-.374A9.861 9.861 0 012.118 12C2.118 6.532 6.532 2.118 12 2.118c5.467 0 9.882 4.414 9.882 9.882 0 5.467-4.415 9.882-9.882 9.882z"/>
                </svg>
                Chat via WhatsApp
              </a>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-gray-100 rounded-sm p-8 shadow-sm">
                <h2 className="font-serif text-2xl font-bold text-navy mb-6">Kirim Pesan</h2>
                <form className="space-y-5" id="contact-form">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="contact-name">
                        Nama Lengkap <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        placeholder="Nama Anda"
                        className="w-full px-4 py-3 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-gold text-gray-800"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="contact-email">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        placeholder="email@anda.com"
                        className="w-full px-4 py-3 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-gold text-gray-800"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="contact-phone">
                        No. Telepon / WhatsApp
                      </label>
                      <input
                        id="contact-phone"
                        type="tel"
                        placeholder="08xx-xxxx-xxxx"
                        className="w-full px-4 py-3 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-gold text-gray-800"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="contact-service">
                        Bidang Layanan
                      </label>
                      <select
                        id="contact-service"
                        className="w-full px-4 py-3 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-gold text-gray-800"
                      >
                        <option value="">Pilih Bidang Layanan</option>
                        <option>Hukum Bisnis & Korporasi</option>
                        <option>Hukum Keluarga & Waris</option>
                        <option>Hukum Pidana</option>
                        <option>Hukum Properti & Real Estate</option>
                        <option>Hukum Tenaga Kerja</option>
                        <option>Penyelesaian Sengketa</option>
                        <option>Lainnya</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="contact-subject">
                      Subjek <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="contact-subject"
                      type="text"
                      placeholder="Subjek pesan Anda"
                      className="w-full px-4 py-3 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-gold text-gray-800"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="contact-message">
                      Pesan <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      rows={6}
                      placeholder="Jelaskan permasalahan atau pertanyaan hukum Anda secara singkat..."
                      className="w-full px-4 py-3 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-gold text-gray-800 resize-none"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn-gold w-full py-4 rounded-sm font-bold text-sm tracking-wide"
                  >
                    Kirim Pesan Sekarang
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="h-96 bg-navy-mid flex items-center justify-center border-t border-gold/10">
        <div className="text-center">
          <div className="text-gold text-5xl mb-4">📍</div>
          <p className="text-white font-serif text-xl font-bold mb-2">LexNova Law Firm</p>
          <p className="text-gray-400 text-sm">Jl. Sudirman No. 123, Lantai 15, Jakarta Pusat</p>
          <a
            href="https://maps.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block btn-gold px-6 py-2.5 rounded-sm text-sm font-semibold"
          >
            Buka di Google Maps
          </a>
        </div>
      </section>
    </>
  );
}
