import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function testUpload() {
  const buffer = Buffer.from('test image content');
  const { data, error } = await supabase.storage
    .from('images')
    .upload('test.txt', buffer, {
      contentType: 'text/plain',
      upsert: true,
    });
  
  if (error) {
    console.error('Upload Error:', error);
  } else {
    console.log('Upload Success:', data);
  }
}

testUpload();
