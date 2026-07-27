const fs = require('fs');

const envContent = fs.readFileSync('.env', 'utf8');
const lines = envContent.split('\n');

const secrets = {};
lines.forEach(line => {
  if (line.trim() === '' || line.startsWith('#')) return;
  
  // Basic parsing
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    let value = match[2].trim();
    
    // Remove surrounding quotes if present
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.substring(1, value.length - 1);
    } else if (value.startsWith("'") && value.endsWith("'")) {
      value = value.substring(1, value.length - 1);
    }
    
    // Ignore MIDTRANS and public variables (wait, Cloudflare needs public variables in secrets if they are used at build/runtime in Pages!)
    // Actually, in Cloudflare Pages, all env vars can be added as secrets or plaintext variables. `secret put` handles both securely.
    if (!key.includes('MIDTRANS')) {
      secrets[key] = value;
    }
  }
});

// Add the Cloudflare specific env var
secrets['NODEJS_COMPAT'] = '1';

fs.writeFileSync('cf_secrets.json', JSON.stringify(secrets, null, 2));
console.log('cf_secrets.json created successfully.');
