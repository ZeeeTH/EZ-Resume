const fs = require('fs');
const path = require('path');

const fonts = [
  'Inter_24pt-Regular.ttf',
  'Inter_24pt-Bold.ttf',
  'Inter_24pt-Italic.ttf',
  'Inter_24pt-Medium.ttf',
  'georgia.ttf',
  'georgiab.ttf',
  'georgiai.ttf',
];

fonts.forEach(font => {
  const filePath = path.join(__dirname, '../lib/fonts', font);
  const base64 = fs.readFileSync(filePath).toString('base64');
  const varName = font.replace(/[-.]/g, '_');
  console.log(`// ${font}\nexport const ${varName} = "${base64}";\n`);
});