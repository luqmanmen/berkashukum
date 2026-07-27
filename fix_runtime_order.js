const fs = require('fs');
const path = require('path');

// Fix files where "use client" is on line 2 but runtime is on line 1 (wrong order)
// Correct order should be: "use client"; first, then export const runtime = "edge";

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (file === 'page.tsx' || file === 'route.ts' || file === 'layout.tsx') {
      let content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split('\n');
      
      const runtimeExport = `export const runtime = "edge";`;
      
      // Detect wrong order: line 0 is runtime, line 1 is "use client"
      const line0 = lines[0].trim();
      const line1 = lines[1] ? lines[1].trim() : '';
      
      if (line0 === runtimeExport && (line1 === '"use client";' || line1 === "'use client';")) {
        // Swap: put "use client" first, then runtime
        lines.splice(0, 2, line1, runtimeExport);
        const newContent = lines.join('\n');
        fs.writeFileSync(fullPath, newContent, 'utf8');
        console.log(`Fixed order in: ${fullPath}`);
      }
    }
  }
}

processDirectory(path.join(__dirname, 'src', 'app'));
console.log('Done!');
