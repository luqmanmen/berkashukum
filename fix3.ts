import { prisma } from './src/lib/prisma.js';

async function main() {
  await prisma.product.update({
    where: { id: 'PROD-WLVT9M98' },
    data: { image: null }
  });
  console.log('Fixed back to null');
}

main().finally(() => prisma.$disconnect());
