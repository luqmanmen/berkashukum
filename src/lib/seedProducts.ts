// Seed some demo products in the database
import { prisma } from "@/lib/prisma";

export async function seedDemoProducts() {
  const products = [
    {
      name: "Template Kontrak Kerja Karyawan",
      description: "Template kontrak kerja lengkap sesuai UU Ketenagakerjaan terbaru. Sudah direvisi pasca UU Cipta Kerja. Format Word & PDF, siap diedit.",
      price: 49000,
      category: "Template Dokumen",
      status: "PUBLISHED",
      image: null,
      digitalFile: null,
    },
    {
      name: "Template Perjanjian Jual Beli Properti",
      description: "Template AJB (Akta Jual Beli) properti yang komprehensif. Mencakup klausul perlindungan pembeli dan penjual, bebas sengketa.",
      price: 79000,
      category: "Template Dokumen",
      status: "PUBLISHED",
      image: null,
      digitalFile: null,
    },
    {
      name: "E-Book Panduan Hukum Bisnis UMKM",
      description: "Panduan lengkap aspek hukum untuk pelaku UMKM: izin usaha, kontrak, perlindungan merek, dan penyelesaian sengketa. 150+ halaman.",
      price: 99000,
      category: "E-Book",
      status: "PUBLISHED",
      image: null,
      digitalFile: null,
    },
    {
      name: "E-Book Panduan Waris & Harta Gono-Gini",
      description: "Panduan komprehensif tentang hukum waris, pembagian harta warisan, dan harta gono-gini perceraian di Indonesia.",
      price: 89000,
      category: "E-Book",
      status: "PUBLISHED",
      image: null,
      digitalFile: null,
    },
    {
      name: "Paket Konsultasi Hukum 1 Jam",
      description: "Sesi konsultasi 1-on-1 via Zoom/Google Meet dengan pengacara berpengalaman. Pilih jadwal sendiri. Rekaman tersedia.",
      price: 299000,
      category: "Konsultasi",
      status: "PUBLISHED",
      image: null,
      digitalFile: null,
    },
    {
      name: "Paket Konsultasi Hukum 3 Sesi",
      description: "Paket hemat 3 sesi konsultasi hukum masing-masing 1 jam. Hemat 25% dibanding beli satuan. Berlaku 3 bulan.",
      price: 699000,
      category: "Konsultasi",
      status: "PUBLISHED",
      image: null,
      digitalFile: null,
    },
    {
      name: "Template Perjanjian Franchise",
      description: "Template perjanjian waralaba/franchise lengkap termasuk klausul royalti, teritorial, pemutusan perjanjian, dan penyelesaian sengketa.",
      price: 149000,
      category: "Template Dokumen",
      status: "PUBLISHED",
      image: null,
      digitalFile: null,
    },
    {
      name: "Template Akta Pendirian PT",
      description: "Template akta pendirian Perseroan Terbatas sesuai UUPT terbaru. Lengkap dengan anggaran dasar standar.",
      price: 129000,
      category: "Template Dokumen",
      status: "PUBLISHED",
      image: null,
      digitalFile: null,
    },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { id: `demo-${p.name.slice(0, 10).replace(/\s/g, "-")}` },
      update: {},
      create: {
        id: `demo-${p.name.slice(0, 10).replace(/\s/g, "-")}`,
        ...p,
      },
    });
  }
}
