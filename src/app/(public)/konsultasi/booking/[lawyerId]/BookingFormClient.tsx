"use client";

import { useState } from "react";
import ActionForm from "@/components/admin/ActionForm";

export default function BookingFormClient({ submitAction }: { submitAction: (formData: FormData) => Promise<void> }) {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const timeSlots = [
    "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"
  ];

  return (
    <ActionForm action={submitAction}>
      <div className="space-y-5">
        <div>
          <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
          <input
            type="text"
            id="clientName"
            name="clientName"
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-shadow"
            placeholder="Sesuai KTP"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="clientEmail" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              id="clientEmail"
              name="clientEmail"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-shadow"
              placeholder="email@contoh.com"
            />
          </div>
          <div>
            <label htmlFor="clientPhone" className="block text-sm font-medium text-gray-700 mb-1">Nomor WhatsApp</label>
            <input
              type="tel"
              id="clientPhone"
              name="clientPhone"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-shadow"
              placeholder="081234567890"
            />
          </div>
        </div>

        <div>
          <label htmlFor="caseDescription" className="block text-sm font-medium text-gray-700 mb-1">Topik Konsultasi (Singkat)</label>
          <textarea
            id="caseDescription"
            name="caseDescription"
            required
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-shadow"
            placeholder="Ceritakan secara ringkas masalah atau tujuan konsultasi Anda..."
          />
        </div>

        <div className="border-t border-gray-100 pt-5 mt-5">
          <h3 className="text-sm font-bold text-navy mb-4">Pilih Waktu Konsultasi</h3>
          
          <div className="mb-4">
            <label htmlFor="scheduleDate" className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
            <input
              type="date"
              id="scheduleDate"
              name="scheduleDate"
              required
              min={new Date().toISOString().split('T')[0]}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-shadow"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Jam (WIB)</label>
            <input type="hidden" name="scheduleTime" value={selectedTime} required />
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => setSelectedTime(time)}
                  className={`py-2 text-sm font-medium rounded-lg border transition-colors ${
                    selectedTime === time 
                      ? 'bg-navy text-white border-navy' 
                      : 'bg-white text-gray-700 border-gray-200 hover:border-gold hover:text-gold'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
            {selectedTime === "" && (
              <p className="text-xs text-red-500 mt-2">Silakan pilih jam konsultasi.</p>
            )}
          </div>
        </div>
      </div>
      <div className="mt-8">
        <button type="submit" className="w-full bg-gold hover:bg-gold-light text-navy-dark px-6 py-4 rounded-lg font-bold text-lg shadow-md transition-colors">
          Lanjutkan ke Pembayaran
        </button>
      </div>
    </ActionForm>
  );
}
