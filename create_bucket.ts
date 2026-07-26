import { Client } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

async function main() {
  const client = new Client({ connectionString: process.env.DIRECT_URL });
  try {
    await client.connect();
    
    console.log("Creating update & delete policy...");
    await client.query(`
      CREATE POLICY "Allow anon update" ON storage.objects FOR UPDATE TO public USING (bucket_id = 'images');
    `).catch(e => console.log(e.message));

    await client.query(`
      CREATE POLICY "Allow anon delete" ON storage.objects FOR DELETE TO public USING (bucket_id = 'images');
    `).catch(e => console.log(e.message));

    console.log("Update/Delete policy successful!");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await client.end();
  }
}

main();
