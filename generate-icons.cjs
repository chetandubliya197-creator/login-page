const sharp = require('sharp');
const fs = require('fs');

const svgBuffer = fs.readFileSync('public/favicon.svg');

sharp(svgBuffer)
  .resize(192, 192)
  .png()
  .toFile('public/pwa-192x192.png')
  .then(() => console.log('Generated 192x192 PNG'))
  .catch(err => console.error(err));

sharp(svgBuffer)
  .resize(512, 512)
  .png()
  .toFile('public/pwa-512x512.png')
  .then(() => console.log('Generated 512x512 PNG'))
  .catch(err => console.error(err));
