import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const SOURCE_IMAGE = path.join(__dirname, '../public/3A.png');
const PUBLIC_DIR = path.join(__dirname, '../public');
const ICONS_DIR = path.join(PUBLIC_DIR, 'icons');

// Icon sizes needed for PWA and favicons
const ICON_SIZES = [72, 96, 128, 144, 152, 167, 180, 192, 384, 512];
const MASKABLE_SIZES = [192, 512];

async function generateFavicons() {
  if (!fs.existsSync(ICONS_DIR)) {
    fs.mkdirSync(ICONS_DIR, { recursive: true });
  }

  // Read the source image
  const sourceBuffer = fs.readFileSync(SOURCE_IMAGE);

  await sharp(sourceBuffer)
    .resize(32, 32, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toFile(path.join(PUBLIC_DIR, 'favicon.ico'));

  await sharp(sourceBuffer)
    .resize(16, 16, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toFile(path.join(PUBLIC_DIR, 'favicon-16x16.png'));

  await sharp(sourceBuffer)
    .resize(32, 32, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toFile(path.join(PUBLIC_DIR, 'favicon-32x32.png'));

  await sharp(sourceBuffer)
    .resize(180, 180, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .png()
    .toFile(path.join(PUBLIC_DIR, 'apple-touch-icon.png'));

  // Generate regular icons
  for (const size of ICON_SIZES) {
    await sharp(sourceBuffer)
      .resize(size, size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .png()
      .toFile(path.join(ICONS_DIR, `icon-${size}x${size}.png`));
  }

  // Generate maskable icons (with padding for safe zone)
  for (const size of MASKABLE_SIZES) {
    const padding = Math.floor(size * 0.1); // 10% padding for safe zone
    const innerSize = size - padding * 2;

    await sharp(sourceBuffer)
      .resize(innerSize, innerSize, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      })
      .extend({
        top: padding,
        bottom: padding,
        left: padding,
        right: padding,
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      })
      .png()
      .toFile(path.join(ICONS_DIR, `maskable-icon-${size}x${size}.png`));
  }
}

generateFavicons().catch(console.error);
