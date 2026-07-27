import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Under Maintenance | Berkas Hukum",
  description: "Website sedang dalam pemeliharaan.",
};

export default function MaintenancePage() {
  return (
    <section className="min-h-screen bg-cream flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gold"></div>
      
      <div className="max-w-2xl w-full text-center relative z-10">
        <div className="mb-8 flex justify-center">
           <img src="/images/logo.png" alt="Berkas Hukum" className="h-16 object-contain" />
        </div>
        
        <div className="relative inline-block mb-10">
          <img 
            src="/images/maintenance.png" 
            alt="Maintenance Illustration" 
            className="h-64 object-contain animate-vibrate" 
          />
          {/* Dust animation effects */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-4 bg-black/10 blur-xl rounded-full animate-pulse"></div>
        </div>

        <h1 className="text-4xl md:text-5xl font-serif font-bold text-navy mb-6">
          Website Sedang Dalam Pemeliharaan
        </h1>
        
        <p className="text-gray-600 text-lg mb-8 leading-relaxed max-w-xl mx-auto">
          Mohon maaf atas ketidaknyamanan ini. Kami sedang melakukan peningkatan sistem untuk memberikan pelayanan hukum yang lebih optimal dan profesional untuk Anda. 
          <br /><br />
          Silakan kembali beberapa saat lagi.
        </p>

        <div className="inline-flex items-center gap-3 px-6 py-3 bg-navy-dark/5 text-navy font-semibold rounded-full border border-navy/10">
          <span className="w-3 h-3 bg-gold rounded-full animate-ping"></span>
          Sistem Sedang Diperbarui
        </div>
      </div>
    </section>
  );
}
