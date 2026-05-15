const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const outDir = path.join(__dirname, '..', 'public');

/* ── PNG generation (pure Buffer) ─────────────────────────────── */
// Minimal PNG writer: IHDR -> cIDAT -> IEND
function createPng(size, drawFn) {
  // Raw RGBA pixel data
  const raw = Buffer.alloc(size * size * 4);
  drawFn(raw, size);

  // Deflate compress
  const compressed = zlib.deflateSync(raw, { level: 9 });

  // Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(25);
  ihdr.writeUInt32BE(13, 0);           // length
  ihdr.write('IHDR', 4);               // type
  ihdr.writeUInt32BE(size, 8);         // width
  ihdr.writeUInt32BE(size, 12);        // height
  ihdr[16] = 8;                        // bit depth
  ihdr[17] = 6;                        // color type (RGBA)
  ihdr[18] = 0;                        // compression
  ihdr[19] = 0;                        // filter
  ihdr[20] = 0;                        // interlace
  const ihdrCrc = crc32(Buffer.from('IHDR' + ihdr.toString('binary').slice(4, 25)));
  ihdr.writeUInt32BE(ihdrCrc, 21);

  // IDAT chunk
  const idatRaw = Buffer.concat([
    Buffer.from([0x78, 0x9c]), // zlib header (raw deflate)
    compressed,
  ]);
  // Re-wrap with proper deflate wrapper for PNG
  const idatData = zlib.deflateSync(raw, { level: 9 });
  const idat = Buffer.alloc(12 + idatData.length);
  idat.writeUInt32BE(idatData.length, 0);
  idat.write('IDAT', 4);
  idatData.copy(idat, 8);
  const idatCrc = crc32(Buffer.from('IDAT' + idatData));
  idat.writeUInt32BE(idatCrc, 8 + idatData.length);

  // IEND chunk
  const iend = Buffer.alloc(12);
  iend.writeUInt32BE(0, 0);
  iend.write('IEND', 4);
  iend.writeUInt32BE(crc32(Buffer.from('IEND')), 8);

  return Buffer.concat([signature, ihdr, idat, iend]);
}

/* ── CRC32 ─────────────────────────────────────────────────────── */
function makeCrcTable() {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    table[i] = c;
  }
  return table;
}
const crcTable = makeCrcTable();
function crc32(buf) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) crc = crcTable[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

/* ── Drawing helper ────────────────────────────────────────────── */
function roundedRect(raw, w, x, y, rw, rh, r, fill) {
  // Draw filled rounded rectangle on raw RGBA buffer
  for (let py = y; py < y + rh; py++) {
    for (let px = x; px < x + rw; px++) {
      // Check if inside rounded rect
      const dx = Math.max(0, Math.max(x - px, px - (x + rw - 1)));
      const dy = Math.max(0, Math.max(y - py, py - (y + rh - 1)));
      if (dx * dx + dy * dy > r * r) continue;
      const idx = (py * w + px) * 4;
      raw[idx]     = fill[0];
      raw[idx + 1] = fill[1];
      raw[idx + 2] = fill[2];
      raw[idx + 3] = fill[3] ?? 255;
    }
  }
}

function drawIcon(raw, size) {
  const bg = [247, 250, 248, 255]; // #F7FAF8
  const outer = [26, 107, 58];     // #1A6B3A
  const inner = [45, 138, 80];     // #2D8A50
  const codeBg = [26, 107, 58];    // #1A6B3A
  const lineColor = [234, 245, 236]; // #EAF5EC
  const accentColor = [74, 222, 128, 80]; // #4ADE80 with alpha

  const pad = Math.round(size * 0.07);
  const corner = Math.round(size * 0.11);
  const pad2 = pad + Math.round(size * 0.03);
  const corner2 = Math.round(corner * 0.8);

  // Background
  roundedRect(raw, size, 0, 0, size, size, Math.round(size * 0.13), bg);

  // Outer rounded rect
  roundedRect(raw, size, pad, pad, size - pad * 2, size - pad * 2, corner, outer);

  // Inner rounded rect
  roundedRect(raw, size, pad2, pad2, size - pad2 * 2, size - pad2 * 2, corner2, inner);

  // Code block background
  const blockX = pad2 + Math.round(size * 0.08);
  const blockY = pad2 + Math.round(size * 0.10);
  const blockW = size - pad2 * 2 - Math.round(size * 0.18);
  const blockH = size - pad2 * 2 - Math.round(size * 0.22);
  const blockR = Math.round(size * 0.04);
  roundedRect(raw, size, blockX, blockY, blockW, blockH, blockR, codeBg);

  // Code lines
  const lineH = Math.round(size * 0.045);
  const gap = Math.round(size * 0.025);
  const lines = 4;
  const startY = blockY + gap;
  const lineW1 = Math.round(blockW * 0.55);
  const lineW2 = Math.round(blockW * 0.38);
  const rightX = blockX + gap + lineW1 + gap * 2;

  for (let i = 0; i < lines; i++) {
    roundedRect(raw, size, blockX + gap, startY + i * (lineH + gap), lineW1, lineH, 2, lineColor);
    roundedRect(raw, size, rightX, startY + i * (lineH + gap), lineW2, lineH, 2, lineColor);
  }

  // Accent highlight
  roundedRect(raw, size, rightX, startY, lineW2, lineH, 2, accentColor);

  // Small terminal cursor
  const cursorX = blockX + gap + lineW1 + gap;
  const cursorY = startY + (lineH - 2) / 2;
  const cursorW = Math.round(size * 0.06);
  const cursorH = Math.round(size * 0.02);
  roundedRect(raw, size, cursorX, cursorY, cursorW, cursorH, 1, [14, 165, 94, 255]);
}

/* ── Generate PNG sizes ────────────────────────────────────────── */
const pngSizes = [
  { size: 16, name: 'favicon-16x16.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 48, name: 'favicon-48x48.png' },
  { size: 96, name: 'favicon-96x96.png' },
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 192, name: 'android-chrome-192x192.png' },
  { size: 512, name: 'android-chrome-512x512.png' },
];

pngSizes.forEach(({ size, name }) => {
  const buf = createPng(size, drawIcon);
  fs.writeFileSync(path.join(outDir, name), buf);
  console.log(`Generated ${name}`);
});

/* ── Generate ICO (simplified PNG-based ICO for max compat) ─────── */
function createIco(size) {
  const pngBuf = createPng(size, drawIcon);
  // ICO header: 6 bytes
  // + 16-byte directory per image
  // + image data (PNG stored directly)
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);   // Reserved
  header.writeUInt16LE(1, 2);   // Type = 1 (icon)
  header.writeUInt16LE(1, 4);   // Image count

  const dirEntry = Buffer.alloc(16);
  dirEntry[0] = 0;               // width 0 = 256
  dirEntry[1] = 0;               // height 0 = 256
  dirEntry[2] = 0;               // color palette
  dirEntry[3] = 0;               // reserved
  dirEntry.writeUInt16LE(1, 4);  // color planes
  dirEntry.writeUInt16LE(32, 6); // bits per pixel
  dirEntry.writeUInt32BE(pngBuf.length, 8);  // data size (big-endian for ICO)
  dirEntry.writeUInt32BE(22, 12);            // data offset

  return Buffer.concat([header, dirEntry, pngBuf]);
}

const icoBuf = createIco(32);
fs.writeFileSync(path.join(outDir, 'favicon.ico'), icoBuf);
console.log('Generated favicon.ico');

console.log('\nAll favicons generated successfully!');