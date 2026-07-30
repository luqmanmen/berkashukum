import { prisma } from '../src/lib/prisma';

async function main() {
  console.log('Starting data cleanup...');
  
  // Menghapus data dengan urutan yang benar sesuai relasi
  console.log('Menghapus Activity Log...');
  await prisma.activityLog.deleteMany();
  
  console.log('Menghapus Order Items...');
  await prisma.orderItem.deleteMany();
  
  console.log('Menghapus Orders...');
  await prisma.order.deleteMany();
  
  console.log('Menghapus Products...');
  await prisma.product.deleteMany();
  
  console.log('Menghapus Articles...');
  await prisma.article.deleteMany();
  
  console.log('Menghapus Testimonials...');
  await prisma.testimonial.deleteMany();
  
  console.log('Menghapus Consultation Bookings...');
  await prisma.consultationBooking.deleteMany();
  
  console.log('Menghapus Lawyers...');
  await prisma.lawyer.deleteMany();

  console.log('✅ Semua dummy data (kecuali User dan Pengaturan) berhasil dihapus!');
}

main()
  .catch((e) => {
    console.error('Error saat menghapus data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
