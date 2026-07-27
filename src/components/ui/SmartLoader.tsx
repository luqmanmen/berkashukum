'use client';

import { useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import LogoLoader from './LogoLoader';

export default function SmartLoader() {
  const [isOffline, setIsOffline] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isRouteLoading, setIsRouteLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 1. Deteksi Sinyal Hilang (Offline)
  useEffect(() => {
    // Set awal
    setIsOffline(!navigator.onLine);

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // 2. Opener (Layar Pembuka) pas pertama kali website dibuka
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 2500); // Tampil 2.5 detik saat pertama kali buka web
    
    return () => clearTimeout(timer);
  }, []);

  // 3. Loading khusus halaman tertentu (Beranda dan Pembayaran)
  useEffect(() => {
    if (isInitialLoading) return; // Jangan bentrok dengan opener

    // Cek apakah halaman yang dituju adalah Beranda atau Pembayaran
    if (pathname === '/' || pathname.startsWith('/pembayaran')) {
      setIsRouteLoading(true);
      // Tampilkan animasi loading selama 1.5 detik
      const timer = setTimeout(() => {
        setIsRouteLoading(false);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams]); // Trigger setiap kali URL / halaman berubah

  // Tampilkan loader jika: Offline ATAU sedang Initial Load ATAU sedang Route Loading
  if (isOffline || isInitialLoading || isRouteLoading) {
    return <LogoLoader />;
  }

  return null;
}
