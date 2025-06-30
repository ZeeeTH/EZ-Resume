const fs = require('fs');
const path = require('path');

const fontsDir = path.join(__dirname, '../lib/fonts/');

// Helper to convert filename to export name
function filenameToExportName(filename) {
  // Remove extension, replace - with _, and add _ttf
  return filename
    .replace(/\.ttf$/, '')
    .replace(/-/g, '_')
    + '_ttf';
}

// Helper to get output .js filename
function filenameToJs(filename) {
  return filename.replace(/\.ttf$/, '').toLowerCase() + '.js';
}

fs.readdirSync(fontsDir).forEach(file => {
  if (file.endsWith('.ttf')) {
    const ttfPath = path.join(fontsDir, file);
    const base64 = fs.readFileSync(ttfPath).toString('base64');
    const exportName = filenameToExportName(file);
    const jsFile = filenameToJs(file);
    const outPath = path.join(fontsDir, jsFile);
    fs.writeFileSync(
      outPath,
      `export const ${exportName} = "${base64}";\n`
    );
    console.log(`Wrote ${outPath}`);
  }
}); 