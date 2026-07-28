import { PrismaClient } from './src/generated/prisma';
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany();
  console.log("All Product IDs:");
  products.forEach((p: any) => console.log(p.id));
  
  const p = await prisma.product.findUnique({ where: { id: "PROD-CHJMA6R5" } });
  console.log("Found:", p?.id);
}

main().catch(console.error).finally(() => prisma.$disconnect());
