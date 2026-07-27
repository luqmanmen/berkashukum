const fs = require('fs');
const { execSync } = require('child_process');

const envContent = fs.readFileSync('.env', 'utf8');
const lines = envContent.split('\n');

for (const line of lines) {
  if (line.trim() === '' || line.startsWith('#')) continue;
  
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    let value = match[2].trim();
    
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.substring(1, value.length - 1);
    } else if (value.startsWith("'") && value.endsWith("'")) {
      value = value.substring(1, value.length - 1);
    }
    
    if (!key.includes('MIDTRANS')) {
      console.log(`Setting secret: ${key}...`);
      try {
        // Passing value via stdin to wrangler secret put
        execSync(`npx wrangler secret put ${key}`, { input: value, stdio: ['pipe', 'ignore', 'ignore'] });
        console.log(`✅ Success for ${key}`);
      } catch (err) {
        console.log(`❌ Failed for ${key}`);
      }
    }
  }
}
console.log('Done uploading secrets!');
