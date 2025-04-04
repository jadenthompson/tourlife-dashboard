// fix-react-imports.js
const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'src');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(filePath));
    } else if (/\.(jsx?|tsx?)$/.test(file) && !file.includes('.test')) {
      results.push(filePath);
    }
  });
  return results;
}

function needsReactImport(content) {
  const usesJSX = /<[^>]+>/.test(content);
  const hasReactImport = /import\s+React\s+from\s+['"]react['"]/.test(content);
  return usesJSX && !hasReactImport;
}

function fixFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  if (needsReactImport(content)) {
    const newContent = `import React from 'react';\n${content}`;
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`✅ Fixed: ${filePath}`);
  }
}

const allFiles = walk(targetDir);
allFiles.forEach(fixFile);

console.log(`\n✅ Done. All necessary files now have React imports.`);
