"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BANKS, getVaNumber } from "@/lib/banks";

export default function PembayaranClient({ order, qrisImage, danaPhone }: { order: any, qrisImage: string, danaPhone: string }) {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState("");
  const [isExpired, setIsExpired] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedTotal, setCopiedTotal] = useState(false);
  const [waSent, setWaSent] = useState(false);

  const bankInfo = BANKS.find((b) => b.id === order.bankName);
  const vaNumber = getVaNumber(order.bankName, danaPhone);
  // Nomor WA Admin (format internasional tanpa +)
  const adminWa = "6282334196500";

  useEffect(() => {
    if (order.status === "EXPIRED" || order.status === "PAID") {
      setIsExpired(order.status === "EXPIRED");
      // Clear active_order block if order is already resolved (Paid/Expired)
      if (typeof window !== "undefined") {
        localStorage.removeItem("active_order");
      }
      return;
    }

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const expiresAt = new Date(order.expiresAt).getTime();
      const distance = expiresAt - now;

      if (distance < 0) {
        clearInterval(interval);
        setIsExpired(true);
        setTimeLeft("EXPIRED");
      } else {
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft(`${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [order.expiresAt, order.status]);

  const bankLabel = bankInfo ? bankInfo.fullName : (order.bankName || "QRIS");
  const paymentMethod = order.paymentMethod === "QRIS" ? "QRIS" : `Virtual Account ${bankLabel}`;
  const waMessage = encodeURIComponent(
    `Halo Admin, saya sudah melakukan pembayaran.\n\n` +
    `🧾 *Order ID:* ${order.id}\n` +
    `💳 *Metode:* ${paymentMethod}\n` +
    `💰 *Total:* Rp${order.totalAmount.toLocaleString("id-ID")}\n\n` +
    `Mohon dicek dan dikonfirmasi. Terima kasih!`
  );
  const waUrl = `https://wa.me/${adminWa}?text=${waMessage}`;

  const handleSendWa = () => {
    setWaSent(true);
    window.open(waUrl, "_blank");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(vaNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyTotal = () => {
    navigator.clipboard.writeText(order.totalAmount.toString());
    setCopiedTotal(true);
    setTimeout(() => setCopiedTotal(false), 2000);
  };

  const formattedDate = order.expiresAt
    ? new Date(order.expiresAt).toLocaleString("id-ID", {
        year: "numeric", month: "2-digit", day: "2-digit",
        hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false
      })
    : "";

  if (order.status === "PAID") {
    return (
      <section className="pt-32 pb-20 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white shadow-lg rounded-xl max-w-md w-full mx-4">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Pembayaran Berhasil</h1>
          <p className="text-gray-500 text-sm mb-6">Pesanan Anda telah diverifikasi. Link produk dikirim ke email Anda.</p>
          <Link href="/" className="bg-[#0ea5e9] text-white px-8 py-3 rounded-lg font-bold text-sm block w-full hover:bg-sky-600 transition-colors text-center">
            Kembali ke Beranda
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#faf7f2] font-sans relative pb-16">
      {/* Background Top Navy Area */}
      <div className="absolute top-0 left-0 right-0 h-44 bg-navy-dark"></div>
      
      {/* Content Container */}
      <div className="max-w-[420px] mx-auto px-4 relative pt-6">
        
        {/* Header */}
        <div className="flex items-center mb-6 text-gold cursor-pointer" onClick={() => router.back()}>
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          <span className="font-semibold text-lg text-white">Pembayaran</span>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-md border border-gold/20 overflow-hidden mb-4 p-5">
          {/* Top Row: Logo & Button Ganti */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              {order.paymentMethod === "QRIS" ? (
                <>
                  <div className="w-8 h-8 flex items-center justify-center">
                    <img src="/images/qris.svg" alt="QRIS" className="max-w-full max-h-full object-contain" />
                  </div>
                  <span className="font-bold text-navy-dark text-sm">QRIS</span>
                </>
              ) : (
                <>
                  {bankInfo?.logo && (
                    <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                      <img
                        src={bankInfo.logo}
                        alt={bankInfo.name}
                        className={`max-w-full max-h-full object-contain ${bankInfo.scale || ""}`}
                      />
                    </div>
                  )}
                  <span className="font-bold text-navy-dark text-sm">{bankInfo?.fullName ?? order.bankName}</span>
                </>
              )}
            </div>
            
            {!isExpired && (
              <button 
                onClick={() => {
                  if (typeof window !== "undefined") {
                    localStorage.removeItem("active_order");
                  }
                  router.push("/checkout");
                }} 
                className="px-4 py-1.5 border border-gold text-gold-dark rounded-full text-xs font-bold hover:bg-gold/10 transition-colors active:scale-95"
              >
                GANTI
              </button>
            )}
          </div>

          {/* Middle: VA/QRIS Data */}
          <div className="text-center mb-5">
            <p className="text-gray-500 font-medium text-xs mb-3 uppercase tracking-wider">
              {order.paymentMethod === "QRIS" ? `Invoice: ${order.id}` : "Nomor Akun Virtual"}
            </p>
            
            {order.paymentMethod === "QRIS" ? (
               <div className="bg-[#faf7f2] rounded-xl p-4 flex flex-col items-center justify-center mb-2 border border-gold/20">
                 {qrisImage ? (
                   <>
                     <img src={qrisImage} alt="QRIS Code" className="w-48 h-48 object-contain mb-3" />
                     <a href={qrisImage} download="QRIS-Payment.png" className="text-gold-dark font-bold text-sm flex items-center gap-2 hover:text-gold transition-colors">
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                       Simpan QR Code
                     </a>
                   </>
                 ) : (
                   <span className="text-gray-400 text-sm">QRIS belum tersedia</span>
                 )}
               </div>
            ) : (
              <div 
                className="bg-[#faf7f2] rounded-xl py-4 px-3 flex items-center justify-center gap-3 cursor-pointer hover:bg-[#f0ebe2] transition-colors border border-gold/20" 
                onClick={handleCopy}
              >
                <span className="font-mono text-xl font-semibold text-navy-dark tracking-widest">
                  {vaNumber.match(/.{1,4}/g)?.join(' ') || vaNumber}
                </span>
                <span className="text-gold">
                  {copied ? (
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                  )}
                </span>
              </div>
            )}
          </div>
          
          <div className="border-t border-gold/15 pt-5 mt-2">
            <p className="text-gray-500 font-medium text-xs mb-3 uppercase tracking-wider text-center">
              Total Tagihan
            </p>
            <div 
              className="bg-[#faf7f2] rounded-xl py-3 px-3 flex items-center justify-center gap-3 cursor-pointer hover:bg-[#f0ebe2] transition-colors border border-gold/20 mb-4" 
              onClick={handleCopyTotal}
            >
              <span className="font-mono text-xl font-semibold text-navy-dark tracking-widest">
                Rp {order.totalAmount.toLocaleString("id-ID")}
              </span>
              <span className="text-gold">
                {copiedTotal ? (
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                )}
              </span>
            </div>

            {/* Rincian Pembayaran */}
            <div className="bg-[#faf7f2]/50 rounded-xl p-4 border border-gold/10 text-sm">
              <p className="font-semibold text-navy-dark mb-2 border-b border-gold/10 pb-2">Rincian Pesanan</p>
              
              {order.items && order.items.map((item: any) => (
                <div key={item.id} className="flex justify-between items-start py-1.5">
                  <span className="text-gray-600 truncate mr-2">{item.product?.name || "Produk"} <span className="text-xs text-gray-400">x{item.quantity}</span></span>
                  <span className="text-navy-dark font-medium whitespace-nowrap">Rp {(item.price * item.quantity).toLocaleString("id-ID")}</span>
                </div>
              ))}
              
              {(() => {
                const subtotal = order.items?.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0) || order.totalAmount;
                const adminOrUniqueCode = order.totalAmount - subtotal;
                
                if (adminOrUniqueCode > 0) {
                  return (
                    <div className="flex justify-between items-start py-1.5 border-t border-dashed border-gold/20 mt-1 pt-2">
                      <span className="text-gray-600">Biaya Penanganan</span>
                      <span className="text-gold-dark font-medium whitespace-nowrap">+ Rp {adminOrUniqueCode.toLocaleString("id-ID")}</span>
                    </div>
                  );
                }
                return null;
              })()}
            </div>
          </div>
          
          {isExpired && (
             <div className="mt-4 p-3 bg-red-50 text-red-600 text-xs text-center rounded-lg border border-red-100">
               Waktu pembayaran telah habis.
             </div>
          )}
        </div>

        {/* Countdown Timer */}
        {!isExpired && !waSent && timeLeft && (
          <div className="mb-4 flex items-center justify-center gap-2 bg-navy-dark/5 border border-navy-dark/10 rounded-xl px-4 py-2.5">
            <span className="text-gold-dark text-xs font-medium">⏱ Selesaikan dalam</span>
            <span className="text-navy-dark font-mono font-bold text-base">{timeLeft}</span>
          </div>
        )}

        {/* Action Button */}
        {!isExpired && !waSent && (
          <button
            onClick={handleSendWa}
            className="w-full bg-[#25D366] text-white py-3.5 rounded-xl font-bold text-sm hover:bg-green-600 transition-all duration-300 flex items-center justify-center gap-2 mb-5 shadow-sm active:scale-95"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Konfirmasi Pembayaran (Wajib)
          </button>
        )}

        {waSent && (
           <div className="mt-4 mb-5 p-3 bg-green-50 text-green-700 text-sm font-semibold text-center rounded-xl border border-green-200">
             ✅ Pesan WA Terkirim — Menunggu Konfirmasi Admin
           </div>
        )}

        {/* Accordions */}
        <div className="bg-white rounded-xl shadow-sm border border-gold/20 overflow-hidden divide-y divide-gold/10">
          <details className="group">
            <summary className="flex justify-between items-center font-semibold text-sm cursor-pointer list-none p-4 hover:bg-[#faf7f2] transition-colors [&::-webkit-details-marker]:hidden text-navy-dark">
              <span>ATM {bankLabel}</span>
              <span className="transition-transform duration-300 group-open:-rotate-180 text-gold">
                <svg fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="20"><path d="M6 9l6 6 6-6"></path></svg>
              </span>
            </summary>
            <div className="text-gray-500 text-sm px-4 pb-4 leading-relaxed bg-[#faf7f2]/50">
              <ol className="list-decimal list-inside space-y-2">
                <li>Masukkan kartu ATM dan PIN Anda.</li>
                <li>Pilih menu <b>Transaksi Lainnya</b> {'>'} <b>Transfer</b>.</li>
                <li>Pilih <b>Ke Rekening Virtual Account</b>.</li>
                <li>Masukkan nomor <b className="text-navy-dark">{vaNumber}</b>.</li>
                <li>Periksa detail dan konfirmasi pembayaran.</li>
              </ol>
            </div>
          </details>

          <details className="group">
            <summary className="flex justify-between items-center font-semibold text-sm cursor-pointer list-none p-4 hover:bg-[#faf7f2] transition-colors [&::-webkit-details-marker]:hidden text-navy-dark">
              <span>m-Banking {bankLabel}</span>
              <span className="transition-transform duration-300 group-open:-rotate-180 text-gold">
                <svg fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="20"><path d="M6 9l6 6 6-6"></path></svg>
              </span>
            </summary>
            <div className="text-gray-500 text-sm px-4 pb-4 leading-relaxed bg-[#faf7f2]/50">
              <ol className="list-decimal list-inside space-y-2">
                <li>Buka aplikasi m-Banking Anda.</li>
                <li>Pilih menu <b>Transfer</b> {'>'} <b>Virtual Account</b>.</li>
                <li>Masukkan nomor <b className="text-navy-dark">{vaNumber}</b>.</li>
                <li>Konfirmasi nominal tagihan.</li>
                <li>Masukkan PIN untuk menyelesaikan transaksi.</li>
              </ol>
            </div>
          </details>
          
          <details className="group">
            <summary className="flex justify-between items-center font-semibold text-sm cursor-pointer list-none p-4 hover:bg-[#faf7f2] transition-colors [&::-webkit-details-marker]:hidden text-navy-dark">
              <span>Syarat dan Ketentuan Biaya</span>
              <span className="transition-transform duration-300 group-open:-rotate-180 text-gold">
                <svg fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="20"><path d="M6 9l6 6 6-6"></path></svg>
              </span>
            </summary>
            <div className="text-gray-500 text-xs px-4 pb-4 leading-relaxed bg-[#faf7f2]/50">
              Biaya Transfer dan Top Up DANA:
              <ul className="list-disc list-inside mt-2 space-y-2">
                <li>Top up DANA melalui Virtual Account (BCA, Mandiri, BNI, BRI, Permata, CIMB) di bawah Rp 50.000 mungkin dikenakan biaya admin oleh bank (umumnya Rp 500 - Rp 1.000).</li>
                <li>Top up DANA di atas Rp 50.000 umumnya <b>bebas biaya admin</b> dari DANA maupun bank asal, tergantung promo atau limit bulanan akun Anda.</li>
                <li>Jika transfer menggunakan bank lain yang tidak menyediakan menu top up DANA langsung, biaya transfer antar bank (BI-FAST / Online) berlaku sesuai ketentuan bank Anda (berkisar Rp 2.500 hingga Rp 6.500).</li>
                <li>Pastikan nominal yang ditransfer <b>persis sama</b> dengan total tagihan, minimum nominal top up DANA adalah Rp 10.000.</li>
              </ul>
            </div>
          </details>
        </div>

      </div>
    </section>
  );
}

