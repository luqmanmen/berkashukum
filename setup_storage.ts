import { PrismaClient } from './src/generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
  try {
    // Create bucket
    await prisma.$executeRawUnsafe(`
      INSERT INTO storage.buckets (id, name, public)
      VALUES ('images', 'images', true)
      ON CONFLICT (id) DO NOTHING;
    `);
    console.log("Bucket 'images' created or already exists.");

    // Create policy for INSERT
    await prisma.$executeRawUnsafe(`
      CREATE POLICY "Allow anon uploads" ON storage.objects FOR INSERT TO public WITH CHECK (bucket_id = 'images');
    `).catch(e => console.log("Insert Policy might already exist", e.message));

    // Create policy for SELECT
    await prisma.$executeRawUnsafe(`
      CREATE POLICY "Allow public read" ON storage.objects FOR SELECT TO public USING (bucket_id = 'images');
    `).catch(e => console.log("Select Policy might already exist", e.message));

    // Create policy for UPDATE
    await prisma.$executeRawUnsafe(`
      CREATE POLICY "Allow anon update" ON storage.objects FOR UPDATE TO public USING (bucket_id = 'images');
    `).catch(e => console.log("Update Policy might already exist", e.message));

    console.log("Storage setup complete.");
  } catch (error) {
    console.error("Setup failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
