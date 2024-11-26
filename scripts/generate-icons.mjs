import sharp from 'sharp';
import { readFileSync } from 'fs';

const sizes = [
  { width: 192, height: 192, name: 'icon-192.png' },
  { width: 512, height: 512, name: 'icon-512.png' },
  { width: 180, height: 180, name: 'apple-touch-icon.png' },
];

const svgBuffer = readFileSync('./public/icon.svg');

async function generateIcons() {
  for (const size of sizes) {
    await sharp(svgBuffer)
      .resize(size.width, size.height)
      .png()
      .toFile(`./public/${size.name}`);
    console.log(`Generated ${size.name}`);
  }
}

generateIcons().catch(console.error);
