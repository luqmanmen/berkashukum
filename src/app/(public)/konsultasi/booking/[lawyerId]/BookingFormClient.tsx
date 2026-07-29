"use client";

import { useState, useEffect } from "react";
import ActionForm from "@/components/admin/ActionForm";
import { BANKS } from "@/lib/banks";

export default function BookingFormClient({ 
  submitAction,
  availableTimes = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"],
  availableDays = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"]
}: { 
  submitAction: (formData: FormData) => Promise<void>,
  availableTimes?: string[],
  availableDays?: string[]
}) {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("TRANSFER");
  const [bankName, setBankName] = useState("BCA");
  const [dayError, setDayError] = useState("");
  const [form, setForm] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    caseDescription: ""
  });

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("consultation_form");
      if (saved) {
        const parsed = JSON.parse(saved);
        setForm({
          clientName: parsed.clientName || "",
          clientEmail: parsed.clientEmail || "",
          clientPhone: parsed.clientPhone || "",
          caseDescription: parsed.caseDescription || ""
        });
        if (parsed.paymentMethod) setPaymentMethod(parsed.paymentMethod);
        if (parsed.bankName) setBankName(parsed.bankName);
        if (parsed.selectedDate) setSelectedDate(parsed.selectedDate);
        if (parsed.selectedTime) setSelectedTime(parsed.selectedTime);
      }
    } catch {}
  }, []);

  useEffect(() => {
    sessionStorage.setItem("consultation_form", JSON.stringify({
      ...form,
      paymentMethod,
      bankName,
      selectedDate,
      selectedTime
    }));
  }, [form, paymentMethod, bankName, selectedDate, selectedTime]);

  const DAY_MAP: Record<number, string> = {
    0: "Minggu", 1: "Senin", 2: "Selasa", 3: "Rabu",
    4: "Kamis", 5: "Jumat", 6: "Sabtu"
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!value) {
      setSelectedDate("");
      setDayError("");
      return;
    }
    const date = new Date(value + "T00:00:00");
    const dayName = DAY_MAP[date.getDay()];
    if (!availableDays.includes(dayName)) {
      setDayError(`Lawyer tidak tersedia pada hari ${dayName}. Silakan pilih hari: ${availableDays.join(", ")}.`);
      setSelectedDate("");
    } else {
      setDayError("");
      setSelectedDate(value);
    }
  };

  return (
    <ActionForm action={submitAction}>
      <div className="space-y-5">
        <div>
          <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
          <input
            type="text"
            id="clientName"
            name="clientName"
            value={form.clientName}
            onChange={(e) => setForm({ ...form, clientName: e.target.value })}
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
              value={form.clientEmail}
              onChange={(e) => setForm({ ...form, clientEmail: e.target.value })}
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
              value={form.clientPhone}
              onChange={(e) => setForm({ ...form, clientPhone: e.target.value })}
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
            value={form.caseDescription}
            onChange={(e) => setForm({ ...form, caseDescription: e.target.value })}
            required
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-shadow"
            placeholder="Ceritakan secara ringkas masalah atau tujuan konsultasi Anda..."
          />
        </div>

        <div className="border-t border-gray-100 pt-5 mt-5">
          <h3 className="text-sm font-bold text-navy mb-2">Pilih Waktu Konsultasi</h3>
          <p className="text-xs text-gray-500 mb-4">
            Tersedia: <span className="font-medium text-navy">{availableDays.join(", ")}</span>
          </p>
          
          <div className="mb-4">
            <label htmlFor="scheduleDate" className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
            <input
              type="date"
              id="scheduleDate"
              name="scheduleDate"
              required
              min={new Date().toISOString().split('T')[0]}
              value={selectedDate}
              onChange={handleDateChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-shadow"
            />
            {dayError && (
              <p className="text-xs text-red-500 mt-2 bg-red-50 p-2 rounded-lg border border-red-100">{dayError}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Jam (WIB)</label>
            <input type="hidden" name="scheduleTime" value={selectedTime} required />
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {availableTimes.length > 0 ? availableTimes.map((time) => (
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
              )) : (
                <p className="text-sm text-gray-500 col-span-full">Tidak ada jam yang tersedia.</p>
              )}
            </div>
            {selectedTime === "" && (
              <p className="text-xs text-red-500 mt-2">Silakan pilih jam konsultasi.</p>
            )}
          </div>
        </div>

        {/* Payment Method Selector */}
        <div className="border-t border-gray-100 pt-5 mt-5">
          <h3 className="text-sm font-bold text-navy mb-4">Metode Pembayaran <span className="text-red-500">*</span></h3>
          <div className="space-y-3">
            <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
              paymentMethod === "TRANSFER" 
                ? "border-gold bg-gold/5 shadow-md shadow-gold/10 -translate-y-0.5" 
                : "border-gray-100 hover:border-gray-300 hover:bg-gray-50/80 hover:-translate-y-0.5 hover:shadow-sm bg-white"
            }`}>
              <input
                type="radio"
                name="paymentMethod"
                value="TRANSFER"
                checked={paymentMethod === "TRANSFER"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-4 h-4 text-gold border-gray-300 focus:ring-gold focus:ring-offset-2 transition-all"
              />
              <span className="ml-3 text-sm font-semibold text-gray-800 flex items-center">
                <span className="text-xl mr-2">🏦</span> Virtual Account DANA
              </span>
            </label>

            {paymentMethod === "TRANSFER" && (
              <div className="ml-7 mt-2 mb-4 p-3 border-l-2 border-gold bg-gray-50">
                <label className="block text-xs font-semibold text-gray-600 mb-3">Pilih Bank (DANA Virtual Account):</label>
                
                <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                  {BANKS.map((bank) => (
                    <label
                      key={bank.id}
                      className={`flex items-center p-2.5 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                        bankName === bank.id
                          ? "border-blue-500 bg-blue-50/80 shadow-md shadow-blue-500/10 scale-[1.02]"
                          : "border-gray-100 bg-white hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm"
                      }`}
                    >
                      <div className="w-14 h-7 flex items-center justify-center bg-white border border-gray-100 rounded-lg p-0.5 mr-3 flex-shrink-0 shadow-sm overflow-hidden">
                        <img 
                          src={bank.logo} 
                          alt={bank.name} 
                          className={`max-w-full max-h-full object-contain ${bank.scale || ""}`}
                          onError={(e) => { 
                            (e.target as HTMLImageElement).style.display = 'none';
                            (e.target as HTMLImageElement).parentElement!.style.backgroundColor = bank.bgColor;
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-semibold text-gray-800">{bank.name}</span>
                        <span className="text-[10px] text-gray-400 ml-1.5">{bank.type === "VA" ? `Prefix: ${bank.prefix}` : "No HP Langsung"}</span>
                      </div>
                      <input
                        type="radio"
                        name="bankName"
                        value={bank.id}
                        checked={bankName === bank.id}
                        onChange={(e) => setBankName(e.target.value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 flex-shrink-0"
                      />
                    </label>
                  ))}
                </div>
              </div>
            )}

            <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
              paymentMethod === "QRIS" 
                ? "border-gold bg-gold/5 shadow-md shadow-gold/10 -translate-y-0.5" 
                : "border-gray-100 hover:border-gray-300 hover:bg-gray-50/80 hover:-translate-y-0.5 hover:shadow-sm bg-white"
            }`}>
              <input
                type="radio"
                name="paymentMethod"
                value="QRIS"
                checked={paymentMethod === "QRIS"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-4 h-4 text-gold border-gray-300 focus:ring-gold focus:ring-offset-2 transition-all"
              />
              <div className="ml-3 flex items-center w-full">
                <span className="text-sm font-semibold text-gray-800">QRIS (Semua E-Wallet & M-Banking)</span>
                <img src="/images/qris.svg" alt="QRIS" className="h-5 ml-auto opacity-80" />
              </div>
            </label>
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
