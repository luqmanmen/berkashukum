import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ProductBottomBar from "@/components/ProductBottomBar";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });

  let ownerName = "Berkas Hukum Corporate";

  if (!product || product.status !== "PUBLISHED") {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.image || "",
    description: product.description,
    offers: {
      "@type": "Offer",
      url: `https://example.com/produk/${product.id}`,
      priceCurrency: "IDR",
      price: product.price,
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Main Container */}
      <div className="pt-14 pb-8 bg-white min-h-screen flex flex-col">
        <div className="max-w-5xl mx-auto w-full flex-grow">

          <div className="grid grid-cols-1 md:grid-cols-2">

              {/* LEFT: Image */}
              <div className="relative bg-gray-50">
                {product.image ? (
                  <div className="relative aspect-square w-full overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                ) : (
                  <div className="aspect-square flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                    <svg className="w-24 h-24 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-sm text-gray-400 font-medium">Dokumen Digital</span>
                  </div>
                )}
                {/* Category Badge */}
                {product.category && (
                  <div className="absolute top-3 left-3 bg-navy-dark text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm">
                    {product.category}
                  </div>
                )}
                {/* Promo Badge */}
                {product.promoStatus && (
                  <div className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow">
                    {product.promoStatus}
                  </div>
                )}
              </div>

              {/* RIGHT: Info */}
              <div className="p-6 md:p-8 flex flex-col gap-4 bg-white">

                {/* Format Tag */}
                {product.documentFormat && (
                  <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-blue-100 self-start">
                    📄 {product.documentFormat}
                  </span>
                )}

                {/* Title */}
                <h1 className="font-serif text-2xl md:text-3xl font-bold text-navy-dark leading-snug">
                  {product.name}
                </h1>

                {/* Price */}
                <div className="text-3xl font-bold text-gold">
                  Rp {product.price.toLocaleString("id-ID")}
                </div>

                {/* Divider */}
                <div className="border-t border-gray-100" />

                {/* Description */}
                <div className="text-sm text-gray-600 leading-relaxed">
                  {product.description.split("\n").map((line, i) => (
                    <p key={i} className="mb-1">{line || "\u00A0"}</p>
                  ))}
                </div>

                {/* Features */}
                {product.features && (
                  <div className="bg-[#faf7f0] border border-[#e8dfc8] rounded-xl p-4">
                    <div className="text-xs font-bold text-navy-dark uppercase tracking-wider mb-3">✨ Keunggulan Template</div>
                    <ul className="space-y-2">
                      {product.features.split("\n").filter((f: string) => f.trim().length > 0).map((feature: string, i: number) => {
                        const chars = Array.from(feature.trim());
                        const firstChar = chars[0];
                        const isAlphanumeric = /^[a-zA-Z0-9\s"'\(\)\[\]]/.test(firstChar);
                        const icon = isAlphanumeric ? "✓" : firstChar;
                        const text = isAlphanumeric ? feature.trim() : chars.slice(1).join("").trim();
                        return (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                            <span className={`mt-0.5 shrink-0 ${icon === "✓" ? "text-gold font-bold" : ""}`}>{icon}</span>
                            <span>{text}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                {/* Author / Brand Logo */}
                <div className="pt-3 border-t border-gray-100 flex flex-col gap-1.5">
                  <img src="/images/logo-2.png" alt="Berkas Hukum Corporate" className="h-16 w-auto object-contain self-start" />
                  <div className="text-[10px] text-gray-500 font-bold tracking-wider uppercase ml-2">
                    Advokat &bull; Kurator &bull; Spesialis Legal Audit
                  </div>
                </div>

                {/* Trust Badge - desktop only (mobile ada di bottom bar) */}
                <div className="hidden md:flex items-center justify-between pt-2 border-t border-gray-100 text-xs text-gray-400">
                  <span className="flex items-center gap-1">🔒 Pembayaran Aman</span>
                  <span className="flex items-center gap-1">⚡ Kirim via Email</span>
                  <span className="flex items-center gap-1">✅ Produk Legal</span>
                </div>
              </div>

              {/* Action Bar (now in document flow instead of fixed at bottom) */}
              <div className="mt-auto pt-4 border-t border-gray-100 bg-white">
                <ProductBottomBar
                  product={{
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                  }}
                />
              </div>
          </div>

        </div>
      </div>
    </>
  );
}
