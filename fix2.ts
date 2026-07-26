import { prisma } from './src/lib/prisma.js';

async function main() {
  await prisma.product.update({
    where: { id: 'PROD-WLVT9M98' },
    data: { image: 'https://images.unsplash.com/photo-1456406644174-8ddd4cd52a06?auto=format&fit=crop&w=800&q=80' }
  });
  console.log('Fixed');
}

main().finally(() => prisma.$disconnect());
