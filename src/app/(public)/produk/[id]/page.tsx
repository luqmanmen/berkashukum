import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import AddToCartButton from "@/components/AddToCartButton";
import Link from "next/link";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });

  if (!product || product.status !== "PUBLISHED") {
    notFound();
  }

  // Schema markup untuk SEO (Product)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.image || "https://example.com/default-product.jpg",
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
      <div className="pt-32 pb-20 bg-cream min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb */}
          <nav className="flex text-sm text-gray-500 mb-8" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link href="/" className="hover:text-gold transition-colors">Beranda</Link>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2">/</span>
                  <Link href="/produk" className="hover:text-gold transition-colors">Produk</Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <span className="mx-2">/</span>
                  <span className="text-gray-900 font-semibold truncate max-w-[200px] sm:max-w-none">
                    {product.name}
                  </span>
                </div>
              </li>
            </ol>
          </nav>

          <div className="bg-white rounded-sm shadow-xl border border-gray-100 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8 lg:gap-12 p-6 md:p-10">
              
              {/* Product Image */}
              <div className="relative aspect-square md:aspect-[4/5] bg-gray-50 rounded-sm border border-gray-100 flex items-center justify-center overflow-hidden group">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="text-center p-6">
                    <div className="text-6xl mb-4">📄</div>
                    <div className="text-sm font-semibold text-gray-400">Preview Berkas</div>
                  </div>
                )}
                {product.category && (
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-bold uppercase tracking-wider text-navy rounded-sm shadow-sm">
                    {product.category}
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="flex flex-col justify-center py-6 md:py-0">
                <h1 className="font-serif text-3xl md:text-4xl font-bold text-navy mb-4 leading-tight">
                  {product.name}
                </h1>
                
                <div className="text-2xl md:text-3xl font-bold text-gold mb-6">
                  Rp {product.price.toLocaleString("id-ID")}
                </div>

                <div className="prose prose-sm text-gray-600 mb-8">
                  {/* Split deskripsi sederhana per baris */}
                  {product.description.split("\n").map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>

                <div className="bg-gray-50 border border-gray-100 rounded-sm p-5 mb-8">
                  <h3 className="text-sm font-bold text-navy mb-3">Keunggulan Template Ini:</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="text-gold mt-0.5">✓</span>
                      <span className="text-sm text-gray-600">Disusun berdasarkan UU terbaru di Indonesia.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-gold mt-0.5">✓</span>
                      <span className="text-sm text-gray-600">Mudah disesuaikan (format Word .docx editable).</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-gold mt-0.5">✓</span>
                      <span className="text-sm text-gray-600">Klausul perlindungan aset & mitigasi sengketa tingkat lanjut.</span>
                    </li>
                  </ul>
                </div>

                {/* Author Info */}
                <div className="flex items-center gap-3 mb-8 pt-6 border-t border-gray-100">
                  <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center text-navy font-bold text-sm">
                    SW
                  </div>
                  <div>
                    <div className="text-sm font-bold text-navy">Dr. Satria Wibowo</div>
                    <div className="text-xs text-gray-500">Pakar Hukum & Kurator Kepailitan</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                  <AddToCartButton 
                    product={{
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      image: product.image || "",
                    }}
                  />
                  <Link
                    href={`/checkout?buy_now=${product.id}`}
                    className="flex-1 bg-white border-2 border-navy text-navy hover:bg-navy hover:text-white transition-colors py-3.5 rounded-sm font-bold text-sm tracking-wide text-center"
                  >
                    Beli Langsung
                  </Link>
                </div>
                <p className="text-xs text-gray-400 text-center mt-4 flex justify-center items-center gap-1.5">
                  <span>🔒</span> Pembayaran aman via Transfer Bank
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
