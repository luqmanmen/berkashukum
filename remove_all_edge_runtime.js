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
      const runtimeLine = 'export const runtime = "edge";';
      const runtimeLine2 = "export const runtime = 'edge';";
      
      if (content.includes(runtimeLine) || content.includes(runtimeLine2)) {
        content = content.replace(runtimeLine + '\n', '').replace(runtimeLine + '\r\n', '');
        content = content.replace(runtimeLine2 + '\n', '').replace(runtimeLine2 + '\r\n', '');
        // Also remove if it's at the end of the file or something without newline
        content = content.replace(runtimeLine, '').replace(runtimeLine2, '');
        
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Removed edge runtime from: ${fullPath}`);
      }
    }
  }
}

processDirectory(path.join(__dirname, 'src', 'app'));
console.log('Done removing all edge runtime exports');
