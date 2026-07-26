import { PrismaClient } from './src/generated/prisma/index.js';
import { createClient } from '@supabase/supabase-js';

const prisma = new PrismaClient();
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function main() {
  const products = await prisma.product.findMany();
  console.log("Products in DB:", products.map(p => ({ id: p.id, name: p.name, image: p.image })));

  const { data: files } = await supabase.storage.from("products").list("images");
  console.log("Images in Supabase:", files?.map(f => f.name));

  // Auto fix: if product has no image but there is an image in storage matching its ID
  for (const product of products) {
    if (!product.image) {
      const matchingFile = files?.find(f => f.name.includes(product.id));
      if (matchingFile) {
        const { data } = supabase.storage.from("products").getPublicUrl(`images/${matchingFile.name}`);
        await prisma.product.update({
          where: { id: product.id },
          data: { image: data.publicUrl }
        });
        console.log(`Updated product ${product.id} with image ${data.publicUrl}`);
      }
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
