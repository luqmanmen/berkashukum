import Link from "next/link";

export default function Footer({ ownerName = "Dr. Satria Wibowo" }: { ownerName?: string }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy-dark border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gold rounded-sm flex items-center justify-center">
                <span className="text-navy-dark font-serif font-bold text-lg">S</span>
              </div>
              <div>
                <div className="font-serif text-xl font-bold text-white leading-tight">
                  {ownerName}
                </div>
                <div className="text-[10px] text-gold-light tracking-widest uppercase">
                  Pakar Hukum & Kurator
                </div>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Mendedikasikan ilmu dan pengalaman untuk memberikan solusi hukum terbaik bagi individu dan perusahaan di Indonesia.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-gold hover:text-navy-dark transition-all">
                <span className="sr-only">LinkedIn</span>
                in
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-gold hover:text-navy-dark transition-all">
                <span className="sr-only">Instagram</span>
                ig
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif font-bold text-white mb-6">Navigasi</h3>
            <ul className="space-y-3">
              {[
                { label: "Beranda", href: "/" },
                { label: "Tentang Saya", href: "/tentang" },
                { label: "Blog & Artikel", href: "/blog" },
                { label: "Katalog Template", href: "/produk" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-gold transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-2">
            <h3 className="font-serif font-bold text-white mb-6">Hubungi Saya</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="text-gold mt-0.5">📍</span>
                <span className="text-sm text-gray-400">
                  Gedung Office 8, Lantai 15, SCBD<br />
                  Jakarta Selatan, Indonesia
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-gold">📞</span>
                <span className="text-sm text-gray-400">+62 812-3456-7890 (WhatsApp)</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-gold">✉️</span>
                <span className="text-sm text-gray-400">contact@satriawibowo.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs text-center md:text-left">
            &copy; {currentYear} {ownerName} Seluruh Hak Dilindungi.
          </p>
          <div className="flex gap-6 text-xs text-gray-500">
            <Link href="#" className="hover:text-gold transition-colors">Kebijakan Privasi</Link>
            <Link href="#" className="hover:text-gold transition-colors">Syarat & Ketentuan</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
