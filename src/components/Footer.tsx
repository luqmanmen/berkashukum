"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer({ ownerName = "Dr. Satria Wibowo" }: { ownerName?: string }) {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  const isMinimalPage = pathname.startsWith("/checkout") || pathname.startsWith("/pembayaran");
  if (isMinimalPage) return null;

  return (
    <footer className="bg-navy-dark border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <img src="/images/logo-1.png" alt="Berkas Hukum Logo" className="h-14 w-auto object-contain shrink-0" />
              <div>
                <div className="font-serif text-xl font-bold text-white leading-tight">
                  Berkas Hukum Corporate
                </div>
                <div className="text-[9px] text-gold-light tracking-wider uppercase mt-1">
                  Advokat &bull; Kurator &bull; Spesialis Legal Audit
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
          <div>
            <h3 className="font-serif font-bold text-white mb-6">Hubungi Kami</h3>
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
                <span className="text-sm text-gray-400">contact@berkashukum.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs text-center md:text-left">
            &copy; {currentYear} Luqman Arif S.I.Kom. Seluruh hak cipta dilindungi.
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
