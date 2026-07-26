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
  const setting = await prisma.siteSetting.upsert({
    where: { key: 'PAYMENT_DANA_PHONE' },
    update: { value: '081296393972', label: 'Nomor HP DANA' },
    create: {
      key: 'PAYMENT_DANA_PHONE',
      label: 'Nomor HP DANA',
      value: '081296393972',
      category: 'PAYMENT',
      type: 'TEXT',
    },
  });
  console.log('Saved PAYMENT_DANA_PHONE:', setting.value);
}

main().finally(() => prisma.$disconnect());
