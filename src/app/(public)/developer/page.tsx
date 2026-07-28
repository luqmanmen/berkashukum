import Image from "next/image";

export const metadata = {
  title: "Developer | Luckmen.org",
  description: "Profil pengembang website Berkas Hukum Corporate.",
};

export default function DeveloperPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="md:flex">
            {/* Foto Profile */}
            <div className="md:w-2/5 bg-navy-dark relative">
              <div className="aspect-w-3 aspect-h-4 md:h-full min-h-[400px] relative">
                <Image 
                  src="/images/luqman-arif.jpg" 
                  alt="Luqman Arif - Developer" 
                  fill
                  className="object-cover object-top"
                />
                {/* Gradient overlay for text readability if needed */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              </div>
            </div>
            
            {/* Informasi Developer */}
            <div className="md:w-3/5 p-8 md:p-12 flex flex-col justify-center">
              <div className="inline-block px-3 py-1 bg-gold/10 text-gold-dark rounded-full text-xs font-bold tracking-wider uppercase mb-4 w-fit">
                Website Developer
              </div>
              
              <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
                Luqman Arif
              </h1>
              <p className="text-lg text-gray-500 mb-6">Founder of luckmen.org</p>
              
              <div className="w-16 h-1 bg-gold mb-8"></div>
              
              <div className="space-y-4 text-gray-600 leading-relaxed mb-8">
                <p>
                  Website <strong>Berkas Hukum Corporate</strong> ini dikembangkan dan dikelola secara profesional oleh <a href="https://luckmen.org" target="_blank" rel="noopener noreferrer" className="text-gold-dark font-semibold hover:underline">luckmen.org</a>.
                </p>
                <p>
                  Kami berdedikasi untuk menciptakan solusi digital yang elegan, fungsional, dan berwibawa, selaras dengan citra profesional firma hukum modern di Indonesia. Dari perancangan antarmuka (UI/UX) hingga optimalisasi performa *backend*, kami memastikan pengalaman pengguna yang maksimal.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Hubungi Developer</h3>
                <div className="flex items-center gap-3 text-gray-700">
                  <svg className="w-5 h-5 text-gold shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  <a href="https://wa.me/6281296393972" target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-gold transition-colors">
                    +62 812-9639-3972
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
