import { PrismaClient } from './src/generated/prisma';
const prisma = new PrismaClient();

async function main() {
  await prisma.siteSetting.upsert({
    where: { key: 'promo_hook_title' },
    update: {},
    create: {
      key: 'promo_hook_title',
      label: 'Judul Hook Utama (Promo FB)',
      value: 'Pusing Ngurus Pengacara Mahal?',
      category: 'PROMO',
      type: 'TEXT',
    }
  });

  await prisma.siteSetting.upsert({
    where: { key: 'promo_hook_description' },
    update: {},
    create: {
      key: 'promo_hook_description',
      label: 'Deskripsi Hook (Promo FB)',
      value: 'Kini Anda tidak perlu lagi menghabiskan puluhan juta rupiah hanya untuk mengurus dokumen legal bisnis. Berkas Hukum menghadirkan koleksi template kontrak dan akta setara kualitas firma hukum raksasa, siap pakai hanya dalam hitungan detik.',
      category: 'PROMO',
      type: 'TEXTAREA',
    }
  });

  console.log("Promo settings seeded successfully.");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
