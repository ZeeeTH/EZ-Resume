const fs = require('fs');
const path = require('path');

const base64Path = path.join(__dirname, '../lib/fonts/base64.js');
const outputDir = path.join(__dirname, '../lib/fonts/');

const rl = require('readline').createInterface({
  input: fs.createReadStream(base64Path),
  crlfDelay: Infinity,
});

const exportRegex = /^export const (\w+) = "([^"]+)";$/;

rl.on('line', (line) => {
  const match = exportRegex.exec(line);
  if (match) {
    const varName = match[1];
    const base64 = match[2];
    // Map variable names to file names
    let fileName = varName
      .replace('Inter_24pt_Regular_ttf', 'inter-regular.js')
      .replace('Inter_24pt_Bold_ttf', 'inter-bold.js')
      .replace('Inter_24pt_Italic_ttf', 'inter-italic.js')
      .replace('Inter_24pt_Medium_ttf', 'inter-medium.js')
      .replace('georgia_ttf', 'georgia-regular.js')
      .replace('georgiab_ttf', 'georgia-bold.js')
      .replace('georgiai_ttf', 'georgia-italic.js');
    // Fallback: use variable name as file name
    if (fileName === varName) fileName = varName + '.js';
    const outPath = path.join(outputDir, fileName);
    fs.writeFileSync(
      outPath,
      `export const ${varName} = "${base64}";\n`
    );
    console.log(`Wrote ${outPath}`);
  }
});

rl.on('close', () => {
  console.log('Done splitting base64.js');
});