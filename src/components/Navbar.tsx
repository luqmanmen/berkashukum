"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/hooks/useCart";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Navbar({ ownerName = "Dr. Satria Wibowo" }: { ownerName?: string }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { totalItems } = useCart();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const isMinimalPage = pathname.startsWith("/checkout");
  const isPaymentPage = pathname.startsWith("/pembayaran");
  const isProductDetailPage = /^\/produk\/[^\/]+$/.test(pathname);
  const isProductListPage = pathname === "/produk";

  if (isPaymentPage || isMinimalPage || isProductListPage) {
    return null;
  }

  if (isProductDetailPage) {
    return (
      <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            {/* Back */}
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 text-navy-dark hover:text-gold transition-colors font-medium text-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden sm:inline">Kembali</span>
            </button>

            <span className="text-sm font-semibold text-navy-dark truncate max-w-[180px] mx-4">
              Detail Produk
            </span>

            <div className="flex items-center gap-1">
              {/* Share */}
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: document.title, url: window.location.href });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                  }
                }}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-navy-dark"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
              {/* Cart */}
              <Link href="/cart" className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-navy-dark">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[17px] h-[17px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-0.5">
                    {totalItems}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>
    );
  }


  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-navy/95 backdrop-blur-md shadow-lg py-3" : "bg-navy/80 py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="bg-white p-1 rounded-md shadow-sm shrink-0 flex items-center justify-center">
              <Image src="/images/logo-1.png" alt="Berkas Hukum Logo" width={44} height={44} className="h-9 sm:h-11 w-auto object-contain" priority />
            </div>
            {/* Teks Logo: 2 Baris yang Rapi */}
            <div className="font-serif text-xl font-bold text-white leading-tight">
                Berkas Hukum Corporate
              </div>
              <div className="text-[9px] text-gold-light tracking-wider uppercase mt-1">
                Advokat &bull; Kurator &bull; Spesialis Legal Audit
              </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {[
              { label: "Beranda", href: "/" },
              { label: "Tentang", href: "/tentang" },
              { label: "Artikel", href: "/blog" },
              { label: "Produk", href: "/produk" },
              { label: "Kontak", href: "/kontak" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-semibold tracking-wide transition-colors ${
                  pathname === link.href ? "text-gold" : "text-gray-300 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Cart & CTA Button */}
          <div className="hidden lg:flex items-center gap-4">
            <Link href="/keranjang" className="relative text-gray-300 hover:text-gold transition-colors mr-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-4H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold text-navy-dark text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <Link
              href="/konsultasi"
              className="btn-gold px-6 py-2.5 rounded-sm text-sm font-semibold tracking-wide"
            >
              Booking Konsultasi
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-white hover:text-gold transition-colors p-2"
          >
            <span className="sr-only">Open main menu</span>
            {isOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <div
        className={`lg:hidden absolute top-full left-0 w-full bg-navy border-t border-white/10 transition-all duration-300 ease-in-out ${
          isOpen ? "opacity-100 visible h-auto border-b" : "opacity-0 invisible h-0"
        }`}
      >
        <nav className="flex flex-col px-4 py-4 space-y-2">
          {[
            { label: "Beranda", href: "/" },
            { label: "Tentang", href: "/tentang" },
            { label: "Artikel", href: "/blog" },
            { label: "Produk", href: "/produk" },
            { label: "Keranjang", href: "/keranjang" },
            { label: "Kontak", href: "/kontak" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-4 py-3 rounded-sm text-base font-semibold ${
                pathname === link.href ? "bg-white/5 text-gold" : "text-gray-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              {link.label}
              {link.label === "Keranjang" && totalItems > 0 && ` (${totalItems})`}
            </Link>
          ))}
          <Link
            href="/konsultasi"
            className="block text-center mt-4 btn-gold px-6 py-3 rounded-sm text-sm font-semibold"
          >
            Booking Konsultasi
          </Link>
        </nav>
      </div>
    </header>
  );
}
