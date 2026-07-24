import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './src/generated/prisma/index.js';
import * as dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const defaultSettings = [
    {
      key: "site_owner_name",
      label: "Nama Pemilik Web",
      value: "Gatot Hadi Purwanto, S.H.,M.H",
      category: "GENERAL",
      type: "TEXT"
    },
    {
      key: "site_title",
      label: "Judul Website",
      value: "Pakar Hukum & Konsultan",
      category: "GENERAL",
      type: "TEXT"
    },
    {
      key: "site_description",
      label: "Deskripsi Website",
      value: "Layanan konsultasi hukum profesional dan terpercaya.",
      category: "GENERAL",
      type: "TEXTAREA"
    }
  ];

  for (const setting of defaultSettings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
    console.log(`Ensured setting exists: ${setting.key}`);
  }
}

main().finally(() => prisma.$disconnect());
