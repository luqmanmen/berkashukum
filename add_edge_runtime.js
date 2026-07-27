const fs = require('fs');
const path = require('path');

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (file === 'page.tsx' || file === 'route.ts' || file === 'layout.tsx') {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      const runtimeLine = `export const runtime = "edge";`;
      
      // Already has runtime properly - skip
      if (content.startsWith(runtimeLine)) {
        continue;
      }
      
      // Remove runtime line if it was wrongly prepended before "use client"
      if (content.startsWith(runtimeLine + '\n"use client"') || content.startsWith(runtimeLine + '\r\n"use client"')) {
        // Wrong position: runtime is before "use client". Fix: move runtime after "use client"
        content = content.replace(runtimeLine + '\n', '').replace(runtimeLine + '\r\n', '');
        // Now put runtime after "use client" line
        content = content.replace('"use client";\n', '"use client";\n' + runtimeLine + '\n')
                         .replace('"use client";\r\n', '"use client";\r\n' + runtimeLine + '\r\n');
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Fixed (moved after use client): ${fullPath}`);
      } else if (content.startsWith('"use client"')) {
        // Has "use client" first but no runtime - add runtime after "use client"
        content = content.replace('"use client";\n', '"use client";\n' + runtimeLine + '\n')
                         .replace('"use client";\r\n', '"use client";\r\n' + runtimeLine + '\r\n');
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Added runtime after use client: ${fullPath}`);
      } else if (!content.includes(runtimeLine)) {
        // No "use client", no runtime - prepend runtime
        content = runtimeLine + '\n' + content;
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Prepended runtime: ${fullPath}`);
      }
    }
  }
}

processDirectory(path.join(__dirname, 'src', 'app'));
console.log('Done!');
