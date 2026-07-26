import 'dotenv/config';
import { prisma } from './src/lib/prisma';

async function updateData() {
  await prisma.siteSetting.updateMany({
    where: { key: 'site_owner_name' },
    data: { value: 'Berkas Hukum Corporate' }
  });

  await prisma.siteSetting.updateMany({
    where: { key: 'home_hero_subtitle' },
    data: { value: 'Berkas Hukum Corporate adalah badan hukum dan konsultan legal bersertifikat yang berdiri sejak 2016, mendedikasikan keahlian dalam penyelesaian sengketa, hukum bisnis, legal audit, dan perlindungan aset perusahaan secara profesional.' }
  });

  await prisma.siteSetting.updateMany({
    where: { key: 'about_subtitle' },
    data: { value: 'BADAN HUKUM, KONSULTAN LEGAL & LEGAL AUDIT SEJAK 2016' }
  });

  await prisma.siteSetting.updateMany({
    where: { key: 'about_description' },
    data: { value: 'Sejak didirikan pada tahun 2016, Berkas Hukum Corporate telah mendedikasikan layanannya secara profesional pada penyelesaian sengketa bisnis kompleks, legal audit, restrukturisasi perusahaan, dan kepailitan.\n\nKami percaya bahwa hukum tidak hanya tentang memenangkan perdebatan di pengadilan, tetapi tentang menyusun strategi mitigasi risiko yang mengamankan masa depan bisnis Anda secara terstruktur. Karena itulah, selain menyediakan layanan konsultasi korporat premium, kami juga merancang sistem penyediaan dokumen hukum berkualitas tinggi yang dapat diakses oleh UMKM dan startup dengan efisien dan andal.' }
  });

  console.log('Update selesai!');
}

updateData().catch(console.error).finally(() => prisma.$disconnect());
