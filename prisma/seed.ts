import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../src/generated/prisma'
import bcrypt from 'bcrypt'
import * as dotenv from 'dotenv'
dotenv.config()

const connectionString = process.env.DIRECT_URL
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const products = [
  { name: "Template Kontrak Kerja Karyawan", description: "Template kontrak kerja lengkap sesuai UU Ketenagakerjaan terbaru. Sudah direvisi pasca UU Cipta Kerja. Format Word & PDF, siap diedit.", price: 49000, category: "Template Dokumen", status: "PUBLISHED" },
  { name: "Template Perjanjian Jual Beli Properti", description: "Template AJB (Akta Jual Beli) properti yang komprehensif. Mencakup klausul perlindungan pembeli dan penjual, bebas sengketa.", price: 79000, category: "Template Dokumen", status: "PUBLISHED" },
  { name: "E-Book Panduan Hukum Bisnis UMKM", description: "Panduan lengkap aspek hukum untuk pelaku UMKM: izin usaha, kontrak, perlindungan merek, dan penyelesaian sengketa. 150+ halaman.", price: 99000, category: "E-Book", status: "PUBLISHED" },
  { name: "E-Book Panduan Waris & Harta Gono-Gini", description: "Panduan komprehensif tentang hukum waris, pembagian harta warisan, dan harta gono-gini perceraian di Indonesia.", price: 89000, category: "E-Book", status: "PUBLISHED" },
  { name: "Paket Konsultasi Hukum 1 Jam", description: "Sesi konsultasi 1-on-1 via Zoom/Google Meet dengan pengacara berpengalaman. Pilih jadwal sendiri. Rekaman tersedia.", price: 299000, category: "Konsultasi", status: "PUBLISHED" },
  { name: "Paket Konsultasi Hukum 3 Sesi", description: "Paket hemat 3 sesi konsultasi hukum masing-masing 1 jam. Hemat 25% dibanding beli satuan. Berlaku 3 bulan.", price: 699000, category: "Konsultasi", status: "PUBLISHED" },
  { name: "Template Perjanjian Franchise", description: "Template perjanjian waralaba/franchise lengkap termasuk klausul royalti, teritorial, pemutusan perjanjian, dan penyelesaian sengketa.", price: 149000, category: "Template Dokumen", status: "PUBLISHED" },
  { name: "Template Akta Pendirian PT", description: "Template akta pendirian Perseroan Terbatas sesuai UUPT terbaru. Lengkap dengan anggaran dasar standar.", price: 129000, category: "Template Dokumen", status: "PUBLISHED" },
]

async function main() {
  // Seed admin
  const hashedPassword = await bcrypt.hash('admin123', 10)
  await prisma.user.upsert({
    where: { email: 'admin@lawfirm.com' },
    update: { password: hashedPassword },
    create: { email: 'admin@lawfirm.com', name: 'Super Admin', password: hashedPassword, role: 'SUPER_ADMIN' },
  })

  // Seed products
  for (const p of products) {
    await prisma.product.create({ data: { ...p, image: null, digitalFile: null } }).catch(() => {})
  }

  const count = await prisma.product.count()
  console.log(`Seed selesai! Total produk: ${count}`)
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1) })
