// Generates TodoTerramar branded favicons + app icons
// Run: node scripts/generate-icons.cjs

const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const PUBLIC_DIR = path.join(__dirname, "..", "public");
const APP_DIR = path.join(__dirname, "..", "src", "app");

// Brand mark: gold gradient background, dark navy "T"
// Matches the logo in header/footer: gold box with navy T
const makeSvg = (size) => {
  const r = Math.round(size * 0.156); // corner radius ~80/512
  // T proportions scaled from 512px reference
  const px = (v) => Math.round((v / 512) * size);
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#c4922c"/>
      <stop offset="50%" stop-color="#d7a84f"/>
      <stop offset="100%" stop-color="#f0d18a"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${r}" fill="url(#gold)"/>
  <!-- Horizontal bar of T -->
  <rect x="${px(72)}" y="${px(104)}" width="${px(368)}" height="${px(86)}" rx="${Math.max(2, px(10))}" fill="#09071f"/>
  <!-- Vertical stem of T -->
  <rect x="${px(212)}" y="${px(104)}" width="${px(88)}" height="${px(316)}" rx="${Math.max(2, px(10))}" fill="#09071f"/>
</svg>`;
};

async function pngAt(size) {
  return sharp(Buffer.from(makeSvg(size)))
    .resize(size, size)
    .png({ compressionLevel: 9 })
    .toBuffer();
}

// Build a proper ICO with embedded PNG images (Vista+ ICO format)
function buildIco(images) {
  // images: [{width, height, data}]
  const count = images.length;
  const headerSize = 6;
  const dirSize = 16 * count;

  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(count, 4); // count

  const dirs = [];
  let dataOffset = headerSize + dirSize;

  for (const img of images) {
    const d = Buffer.alloc(16);
    d.writeUInt8(img.width >= 256 ? 0 : img.width, 0);
    d.writeUInt8(img.height >= 256 ? 0 : img.height, 1);
    d.writeUInt8(0, 2); // color count (0 = true color)
    d.writeUInt8(0, 3); // reserved
    d.writeUInt16LE(1, 4); // planes
    d.writeUInt16LE(32, 6); // bits per pixel
    d.writeUInt32LE(img.data.length, 8);
    d.writeUInt32LE(dataOffset, 12);
    dirs.push(d);
    dataOffset += img.data.length;
  }

  return Buffer.concat([header, ...dirs, ...images.map((i) => i.data)]);
}

async function main() {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });

  const sizes = { 16: null, 32: null, 48: null, 180: null, 192: null, 512: null };

  for (const size of Object.keys(sizes)) {
    process.stdout.write(`  Generating ${size}×${size}... `);
    sizes[size] = await pngAt(Number(size));
    console.log("done");
  }

  // favicon.ico → embed 16 + 32 + 48 as PNG inside ICO
  const icoBuffer = buildIco([
    { width: 16, height: 16, data: sizes[16] },
    { width: 32, height: 32, data: sizes[32] },
    { width: 48, height: 48, data: sizes[48] },
  ]);
  fs.writeFileSync(path.join(APP_DIR, "favicon.ico"), icoBuffer);
  fs.writeFileSync(path.join(PUBLIC_DIR, "favicon.ico"), icoBuffer);
  console.log("  favicon.ico → src/app/ + public/");

  fs.writeFileSync(path.join(PUBLIC_DIR, "favicon-16x16.png"), sizes[16]);
  fs.writeFileSync(path.join(PUBLIC_DIR, "favicon-32x32.png"), sizes[32]);
  fs.writeFileSync(path.join(PUBLIC_DIR, "apple-touch-icon.png"), sizes[180]);
  fs.writeFileSync(path.join(PUBLIC_DIR, "android-chrome-192x192.png"), sizes[192]);
  fs.writeFileSync(path.join(PUBLIC_DIR, "android-chrome-512x512.png"), sizes[512]);
  console.log("  PNG icons → public/");

  // site.webmanifest
  const manifest = JSON.stringify({
    name: "Todo Terramar",
    short_name: "TodoTerramar",
    description: "Distribuidora independiente Terramar México",
    icons: [
      { src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { src: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    theme_color: "#15104A",
    background_color: "#15104A",
    display: "standalone",
    start_url: "/",
  }, null, 2);
  fs.writeFileSync(path.join(PUBLIC_DIR, "site.webmanifest"), manifest);
  console.log("  site.webmanifest → public/");

  console.log("\nAll icons generated successfully.");
}

main().catch((err) => { console.error(err); process.exit(1); });
