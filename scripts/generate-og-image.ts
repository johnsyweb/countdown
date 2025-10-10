import sharp from 'sharp';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const svgPath = resolve('website/public/og-image.svg');
const pngPath = resolve('website/public/og-image.png');

const svgBuffer = readFileSync(svgPath);

sharp(svgBuffer)
  .resize(1200, 630)
  .png()
  .toFile(pngPath)
  .then(() => {
    console.log('✓ Generated og-image.png');
  })
  .catch((err) => {
    console.error('Error generating og-image.png:', err);
    process.exit(1);
  });

