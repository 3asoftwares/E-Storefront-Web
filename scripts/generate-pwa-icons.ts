/**
 * PWA Icon Generator Script
 *
 * This script generates all required PWA icons from a source image.
 *
 * Usage:
 *   1. Place your source logo (at least 512x512px) as 'logo-source.png' in the public folder
 *   2. Run: npx ts-node scripts/generate-pwa-icons.ts
 *   OR if using Node.js directly:
 *   3. Run: node scripts/generate-pwa-icons.js
 *
 * Requirements:
 *   npm install sharp --save-dev
 */

// @ts-ignore - sharp types may not be installed
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Icon sizes for regular icons
const ICON_SIZES = [72, 96, 128, 144, 152, 167, 180, 192, 384, 512];

// Maskable icon sizes (with safe zone padding)
const MASKABLE_SIZES = [192, 512];

// Splash screen sizes for iOS
const SPLASH_SCREENS = [
  { width: 2048, height: 2732, name: 'apple-splash-2048-2732' }, // 12.9" iPad Pro
  { width: 1668, height: 2388, name: 'apple-splash-1668-2388' }, // 11" iPad Pro
  { width: 1536, height: 2048, name: 'apple-splash-1536-2048' }, // 9.7" iPad
  { width: 1125, height: 2436, name: 'apple-splash-1125-2436' }, // iPhone X/XS
  { width: 1242, height: 2208, name: 'apple-splash-1242-2208' }, // iPhone 8 Plus
  { width: 750, height: 1334, name: 'apple-splash-750-1334' }, // iPhone 8
  { width: 640, height: 1136, name: 'apple-splash-640-1136' }, // iPhone SE
];

const SOURCE_IMAGE = path.join(__dirname, '../public/3A.png');
const ICONS_DIR = path.join(__dirname, '../public/icons');
const SPLASH_DIR = path.join(__dirname, '../public/splash');

async function ensureDirectoryExists(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function generateIcons() {
  console.log('🎨 Starting PWA icon generation...\n');

  // Check if source image exists
  if (!fs.existsSync(SOURCE_IMAGE)) {
    console.error('❌ Source image not found!');
    console.log('   Please place your logo as "logo-source.png" in the public folder.');
    console.log('   The image should be at least 512x512 pixels for best results.\n');

    // Create placeholder SVG icons instead
    console.log('📝 Creating placeholder SVG icons instead...\n');
    await generatePlaceholderIcons();
    return;
  }

  await ensureDirectoryExists(ICONS_DIR);
  await ensureDirectoryExists(SPLASH_DIR);

  // Generate regular icons
  console.log('📱 Generating regular icons...');
  for (const size of ICON_SIZES) {
    const outputPath = path.join(ICONS_DIR, `icon-${size}x${size}.png`);
    await sharp(SOURCE_IMAGE)
      .resize(size, size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .png()
      .toFile(outputPath);
    console.log(`   ✓ icon-${size}x${size}.png`);
  }

  // Generate maskable icons (with padding for safe zone)
  console.log('\n😷 Generating maskable icons...');
  for (const size of MASKABLE_SIZES) {
    const outputPath = path.join(ICONS_DIR, `maskable-icon-${size}x${size}.png`);
    const padding = Math.floor(size * 0.1); // 10% padding for safe zone
    const innerSize = size - padding * 2;

    await sharp(SOURCE_IMAGE)
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
      .toFile(outputPath);
    console.log(`   ✓ maskable-icon-${size}x${size}.png`);
  }

  // Generate splash screens
  console.log('\n🌊 Generating splash screens...');
  for (const splash of SPLASH_SCREENS) {
    const outputPath = path.join(SPLASH_DIR, `${splash.name}.png`);
    const logoSize = Math.min(splash.width, splash.height) * 0.3;

    // Create splash screen with centered logo
    const logo = await sharp(SOURCE_IMAGE)
      .resize(Math.floor(logoSize), Math.floor(logoSize), { fit: 'contain' })
      .toBuffer();

    await sharp({
      create: {
        width: splash.width,
        height: splash.height,
        channels: 4,
        background: { r: 31, g: 41, b: 55, alpha: 1 }, // gray-800 color
      },
    })
      .composite([
        {
          input: logo,
          gravity: 'center',
        },
      ])
      .png()
      .toFile(outputPath);
    console.log(`   ✓ ${splash.name}.png`);
  }

  console.log('\n✅ PWA icon generation complete!');
  console.log('   Icons saved to: public/icons/');
  console.log('   Splash screens saved to: public/splash/\n');
}

async function generatePlaceholderIcons() {
  await ensureDirectoryExists(ICONS_DIR);

  // Create SVG placeholder for each size
  for (const size of ICON_SIZES) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <rect width="${size}" height="${size}" fill="#1f2937"/>
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="white" font-family="system-ui" font-size="${size * 0.3}" font-weight="bold">3A</text>
    </svg>`;

    const outputPath = path.join(ICONS_DIR, `icon-${size}x${size}.png`);
    await sharp(Buffer.from(svg)).png().toFile(outputPath);
    console.log(`   ✓ icon-${size}x${size}.png (placeholder)`);
  }

  // Create maskable placeholders
  for (const size of MASKABLE_SIZES) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <rect width="${size}" height="${size}" fill="#ffffff"/>
      <rect x="${size * 0.1}" y="${size * 0.1}" width="${size * 0.8}" height="${size * 0.8}" rx="${size * 0.1}" fill="#1f2937"/>
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="white" font-family="system-ui" font-size="${size * 0.25}" font-weight="bold">3A</text>
    </svg>`;

    const outputPath = path.join(ICONS_DIR, `maskable-icon-${size}x${size}.png`);
    await sharp(Buffer.from(svg)).png().toFile(outputPath);
    console.log(`   ✓ maskable-icon-${size}x${size}.png (placeholder)`);
  }

  console.log('\n⚠️  Placeholder icons created. Replace with actual logo for production!');
}

generateIcons().catch(console.error);
