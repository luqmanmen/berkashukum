import Image from "next/image";

export default function ClientLogos({ logos = [] }: { logos?: string[] }) {
  // If no logos are uploaded yet, use dummy placeholder logos
  const defaultLogos = [
    "https://placehold.co/200x80/transparent/94a3b8?text=CLIENT+1",
    "https://placehold.co/200x80/transparent/94a3b8?text=CLIENT+2",
    "https://placehold.co/200x80/transparent/94a3b8?text=CLIENT+3",
    "https://placehold.co/200x80/transparent/94a3b8?text=CLIENT+4",
    "https://placehold.co/200x80/transparent/94a3b8?text=CLIENT+5",
    "https://placehold.co/200x80/transparent/94a3b8?text=CLIENT+6",
    "https://placehold.co/200x80/transparent/94a3b8?text=CLIENT+7",
  ];

  const activeLogos = logos.length > 0 ? logos : defaultLogos;

  // The CSS animation requires duplicating the items to create a seamless infinite scroll loop.
  // We duplicate the array so we have 2 sets of logos.
  const displayLogos = [...activeLogos, ...activeLogos];

  // We need to calculate the track width dynamically based on the number of items.
  // We'll use inline styles for the width and animation duration to keep it dynamic.
  // If there are N unique logos, total is 2N. Each is 250px.
  // The animation should shift by N * 250px.
  const uniqueCount = activeLogos.length;

  return (
    <div className="bg-gray-50 relative w-full py-12">
      <div className="text-center mb-8 relative z-10">
        <p className="text-gray-400 text-sm font-semibold tracking-widest uppercase">Dipercaya Oleh Berbagai Perusahaan & Institusi</p>
      </div>

      <div className="relative mx-auto w-full max-w-7xl h-[120px] overflow-hidden bg-gray-50">
        {/* Left Gradient Cover */}
        <div className="absolute left-0 top-0 h-full w-[100px] md:w-[200px] z-10 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none"></div>
        
        {/* Right Gradient Cover */}
        <div className="absolute right-0 top-0 h-full w-[100px] md:w-[200px] z-10 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none"></div>

        <div 
          className="flex h-full items-center"
          style={{
            width: `calc(250px * ${displayLogos.length})`,
            animation: `scrollLogo ${Math.max(uniqueCount * 4, 15)}s linear infinite`
          }}
        >
          {displayLogos.map((url, index) => (
            <div key={index} className="flex h-full w-[250px] items-center justify-center flex-shrink-0 px-6">
              <div className="relative w-full h-[75px] flex items-center justify-center">
                <img 
                  src={url}
                  alt={`Client Logo ${index + 1}`}
                  className="max-w-full max-h-full object-contain filter grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
