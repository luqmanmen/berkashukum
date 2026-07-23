import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma";

const pool = new Pool({ connectionString: process.env.DIRECT_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const settings = [
  {
    key: "home_hero_title",
    label: "Judul Utama (Hero)",
    value: "Solusi Hukum Tepat untuk Masalah Kompleks.",
    category: "HOME",
    type: "TEXT"
  },
  {
    key: "home_hero_subtitle",
    label: "Deskripsi Singkat (Hero)",
    value: "Dr. Satria Wibowo, S.H., M.H., Ph.D. mendedikasikan lebih dari 15 tahun keahlian di bidang kepailitan, hukum bisnis, dan perlindungan aset perusahaan.",
    category: "HOME",
    type: "TEXTAREA"
  },
  {
    key: "home_hero_image",
    label: "Foto Profil Hero",
    value: "none",
    category: "HOME",
    type: "IMAGE"
  },
  {
    key: "about_title",
    label: "Judul Tentang Kami",
    value: "Mengenal Dr. Satria Wibowo",
    category: "ABOUT",
    type: "TEXT"
  },
  {
    key: "about_description",
    label: "Teks Profil Tentang Kami",
    value: "Dr. Satria Wibowo adalah seorang praktisi hukum...",
    category: "ABOUT",
    type: "TEXTAREA"
  }
];

async function main() {
  console.log("Seeding initial settings...");
  for (const s of settings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: {}, // Don't overwrite if exists
      create: s
    });
  }
  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
