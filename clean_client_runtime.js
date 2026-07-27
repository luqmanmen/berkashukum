const fs = require('fs');
const path = require('path');

function processDirectory(dir) {
  const entries = fs.readdirSync(dir);
  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (entry.endsWith('.tsx') || entry.endsWith('.ts') || entry.endsWith('.jsx') || entry.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split(/\r?\n/);
      const hasUseClient = lines.some(l => l.trim() === '"use client";' || l.trim() === "'use client';");
      const runtimeIndex = lines.findIndex(l => l.trim() === 'export const runtime = "edge";' || l.trim() === "export const runtime = 'edge';");
      if (hasUseClient && runtimeIndex !== -1) {
        // Remove runtime line
        lines.splice(runtimeIndex, 1);
        // Ensure "use client" is first line
        const ucIndex = lines.findIndex(l => l.trim() === '"use client";' || l.trim() === "'use client';");
        if (ucIndex > 0) {
          const ucLine = lines.splice(ucIndex, 1)[0];
          lines.unshift(ucLine);
        } else if (ucIndex === -1) {
          // Should not happen since hasUseClient true, but just in case add at top
          lines.unshift('"use client";');
        }
        const newContent = lines.join('\n');
        fs.writeFileSync(fullPath, newContent, 'utf8');
        console.log(`Cleaned client runtime in: ${fullPath}`);
      }
    }
  }
}

processDirectory(path.join(__dirname, 'src', 'app'));
console.log('Done cleaning client files');
