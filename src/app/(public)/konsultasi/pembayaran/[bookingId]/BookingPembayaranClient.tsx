"use client";

import { useState } from "react";
import Image from "next/image";
import { uploadBookingPaymentProof } from "./actions";
import ActionForm from "@/components/admin/ActionForm";
import Link from "next/link";

export default function BookingPembayaranClient({ 
  booking, 
  qrisImage, 
  danaPhone, 
  bankAccounts,
  contactWa = "081296393972"
}: { 
  booking: any;
  qrisImage: string;
  danaPhone: string;
  bankAccounts: any[];
  contactWa?: string;
}) {
  const [method, setMethod] = useState<"QRIS" | "TRANSFER">("QRIS");
  const [bankName, setBankName] = useState<string>(bankAccounts.length > 0 ? bankAccounts[0].bank : "");

  if (booking.paymentProof || booking.status !== "PENDING") {
    // Buat pesan WhatsApp yang sudah terisi otomatis
    const waMessage = encodeURIComponent(
      `Halo Admin Berkas Hukum,\n\nSaya sudah melakukan pembayaran untuk Jadwal Konsultasi Hukum.\n\n*Nama:* ${booking.clientName}\n*Lawyer:* ${booking.lawyer.name}\n*Jadwal:* ${booking.scheduleDate} - ${booking.scheduleTime}\n*Status:* Menunggu Konfirmasi\n\nMohon segera diproses ya.`
    );
    const waLink = `https://wa.me/${contactWa.replace(/^0/, "62")}?text=${waMessage}`;

    return (
      <div className="max-w-2xl mx-auto px-4 text-center">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 border border-gray-100">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h2 className="text-3xl font-bold text-navy mb-4">Sedang Diproses oleh Admin</h2>
          <p className="text-gray-600 mb-8">
            Terima kasih, pembayaran untuk jadwal konsultasi Anda dengan <strong>{booking.lawyer.name}</strong> telah kami terima dan sedang diverifikasi oleh tim kami.
            Silakan klik tombol di bawah untuk konfirmasi ke admin via WhatsApp agar bisa segera mendapatkan link Zoom/Meet.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href={waLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
              </svg>
              Konfirmasi ke WhatsApp
            </a>
            <Link href="/" className="inline-flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-navy px-8 py-3 rounded-full font-bold transition-all">
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Jika harga 0 (Gratis)
  if (booking.totalAmount === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 text-center">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 border border-gray-100">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-3xl font-bold text-navy mb-4">Booking Berhasil!</h2>
          <p className="text-gray-600 mb-8">
            Terima kasih, jadwal konsultasi Anda dengan {booking.lawyer.name} telah tercatat.
            Admin kami akan segera menghubungi Anda via WhatsApp.
          </p>
          <Link href="/" className="inline-block bg-gold hover:bg-gold-light text-navy-dark px-8 py-3 rounded-full font-bold transition-all">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-navy mb-4">Selesaikan Pembayaran</h1>
        <p className="text-gray-600">Selesaikan pembayaran untuk mengamankan jadwal Anda.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Payment Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 md:p-8">
              <h2 className="text-xl font-bold text-navy mb-6">Pilih Metode Pembayaran</h2>
              
              <div className="flex gap-4 mb-6">
                <button 
                  onClick={() => setMethod("QRIS")}
                  className={`flex-1 py-3 px-4 rounded-xl border text-sm font-bold transition-all ${method === "QRIS" ? "bg-navy/5 border-navy text-navy" : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"}`}
                >
                  QRIS / E-Wallet
                </button>
                <button 
                  onClick={() => setMethod("TRANSFER")}
                  className={`flex-1 py-3 px-4 rounded-xl border text-sm font-bold transition-all ${method === "TRANSFER" ? "bg-navy/5 border-navy text-navy" : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"}`}
                >
                  Transfer Bank
                </button>
              </div>

              {method === "QRIS" && (
                <div className="text-center bg-gray-50 rounded-xl p-8 border border-gray-100">
                  {qrisImage ? (
                    <div className="mb-4">
                      <Image src={qrisImage} alt="QRIS" width={250} height={250} className="mx-auto border-4 border-white shadow-md rounded-lg" />
                    </div>
                  ) : (
                    <div className="bg-gray-200 w-64 h-64 mx-auto mb-4 flex items-center justify-center text-gray-400">QRIS Tidak Tersedia</div>
                  )}
                  <p className="text-sm text-gray-600">Scan QR Code di atas menggunakan aplikasi m-banking atau e-wallet (Ovo, Gopay, Dana, dll).</p>
                  
                  {danaPhone && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600 mb-2">Atau transfer ke nomor Dana:</p>
                      <div className="font-bold text-lg text-navy">{danaPhone}</div>
                    </div>
                  )}
                </div>
              )}

              {method === "TRANSFER" && (
                <div className="space-y-4">
                  {bankAccounts.length > 0 ? (
                    bankAccounts.map((b: any, idx: number) => (
                      <div key={idx} className="bg-gray-50 rounded-xl p-6 border border-gray-100 flex items-center justify-between">
                        <div>
                          <div className="text-sm font-bold text-gray-500 mb-1">{b.bank}</div>
                          <div className="text-xl font-mono text-navy font-bold tracking-wider">{b.account}</div>
                          <div className="text-sm text-gray-600 mt-1">a.n {b.name}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">Belum ada data rekening.</p>
                  )}
                </div>
              )}

            </div>
          </div>

          {/* Upload Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 md:p-8">
              <h2 className="text-xl font-bold text-navy mb-4">Konfirmasi Pembayaran</h2>
              <p className="text-gray-600 text-sm mb-6">Silakan unggah bukti transfer / resi / screenshot keberhasilan pembayaran Anda.</p>
              
              <ActionForm action={uploadBookingPaymentProof}>
                <input type="hidden" name="bookingId" value={booking.id} />
                <input type="hidden" name="paymentMethod" value={method} />
                <input type="hidden" name="bankName" value={method === "TRANSFER" ? bankName : "QRIS"} />
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">File Bukti Transfer (JPG/PNG/PDF)</label>
                  <input
                    type="file"
                    name="proof"
                    required
                    accept="image/*,.pdf"
                    className="w-full text-sm text-gray-500
                      file:mr-4 file:py-2.5 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-navy/10 file:text-navy
                      hover:file:bg-navy/20 cursor-pointer"
                  />
                </div>
                
                <button type="submit" className="w-full bg-gold hover:bg-gold-light text-navy-dark px-6 py-3 rounded-xl font-bold transition-colors">
                  Kirim Bukti Pembayaran
                </button>
              </ActionForm>
            </div>
          </div>
        </div>

        {/* Right: Booking Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Ringkasan Jadwal</h3>
            
            <div className="mb-4">
              <div className="text-xs text-gray-500 mb-1">Lawyer</div>
              <div className="font-bold text-navy">{booking.lawyer.name}</div>
            </div>

            <div className="mb-4">
              <div className="text-xs text-gray-500 mb-1">Jadwal</div>
              <div className="font-bold text-navy">
                {new Date(booking.scheduleDate).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}<br />
                Pukul {booking.scheduleTime} WIB
              </div>
            </div>

            <div className="mb-6">
              <div className="text-xs text-gray-500 mb-1">Kasus / Topik</div>
              <div className="text-sm text-gray-700 line-clamp-2">{booking.caseDescription}</div>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <div className="flex justify-between items-center">
                <span className="font-bold text-navy">Total Bayar</span>
                <span className="text-xl font-bold text-gold">Rp {booking.totalAmount.toLocaleString("id-ID")}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
