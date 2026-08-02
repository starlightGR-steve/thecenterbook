// Extract the base64-embedded images out of the design mockup into optimized
// WebP files under public/images/.
//
// The mockup ships every image as an inline data URI so it can travel as a
// single file. That is fine for a mockup and bad for the live site, so this
// script writes real files and the components reference them by URL.
//
// Framing is never touched here: images are transcoded at their original pixel
// dimensions, with no resize and no crop. Crop and framing are controlled by the
// object-fit / object-position / aspect-ratio rules in src/styles/global.css and
// the per-image object-position on the photo beats.
//
// Usage: node scripts/extract-images.mjs

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import sharp from 'sharp';

const SRC = 'design-reference/thecenterbook-homepage-v59-mockup.html';
const OUT = 'public/images';

// Mockup image order -> stable filename. Index is 1-based, matching the order
// the data URIs appear in the document.
const NAMES = {
  1: 'attendance-board',        // hero iPad
  2: 'attendance-board',        // hero iPad reflection (byte-identical to #1)
  3: 'bincy-portrait',
  4: 'multi-device',
  5: 'beat-family-outdoors',
  6: 'center-public-page',
  7: 'lead-pipeline',
  8: 'amy-avatar',
  9: 'beat-students-families',
  10: 'live-class-session',
  11: 'parent-portal',
  12: 'sms-inbox',
  13: 'pickup-text',
  14: 'insights',
  15: 'grade-chart',
  16: 'beat-center-running',
  17: 'live-class-whole',
  18: 'student-profile',
  19: 'staff-coverage',
  20: 'beat-hours-back',
  21: 'automated-tasks',
  22: 'nicole-avatar',
  23: 'bincy-award',
  24: 'students-center',
};

// Screenshots (PNG sources) carry UI text and need a higher quality floor than
// the photography (JPEG sources), which compresses cleanly.
const QUALITY = { png: 90, jpeg: 80 };

if (!existsSync(SRC)) {
  console.error(`Missing ${SRC}. The mockup is gitignored - drop it back in design-reference/ before running.`);
  process.exit(1);
}

const html = readFileSync(SRC, 'utf8');
mkdirSync(OUT, { recursive: true });

const matches = [...html.matchAll(/data:image\/(png|jpeg|jpg|webp|gif);base64,([A-Za-z0-9+/=]+)/g)];
console.log(`Found ${matches.length} embedded images.\n`);

const written = new Map(); // sha -> filename, so identical images are encoded once
let totalIn = 0;
let totalOut = 0;

for (const [i, m] of matches.entries()) {
  const n = i + 1;
  const type = m[1] === 'jpg' ? 'jpeg' : m[1];
  const buf = Buffer.from(m[2], 'base64');
  const sha = createHash('sha256').update(buf).digest('hex');
  const name = NAMES[n];

  if (!name) {
    console.error(`  !! image ${n} has no filename mapping - add it to NAMES`);
    process.exitCode = 1;
    continue;
  }

  if (written.has(sha)) {
    console.log(`${String(n).padStart(2)}  ${name}.webp  (duplicate of image ${written.get(sha)}, skipped)`);
    continue;
  }
  written.set(sha, n);

  const meta = await sharp(buf).metadata();
  // No resize, no extract: same pixel dimensions in, same out.
  const out = await sharp(buf).webp({ quality: QUALITY[type] ?? 82, effort: 6 }).toBuffer();

  let ext = 'webp';
  let final = out;
  // Prefer WebP, fall back to the original encoding if WebP somehow loses.
  if (out.length >= buf.length) {
    ext = type === 'png' ? 'png' : 'jpg';
    final = buf;
    console.log(`${String(n).padStart(2)}  ${name}.${ext}  WebP was larger, kept original`);
  }

  writeFileSync(`${OUT}/${name}.${ext}`, final);
  totalIn += buf.length;
  totalOut += final.length;

  const kb = (b) => (b / 1024).toFixed(0).padStart(4);
  console.log(
    `${String(n).padStart(2)}  ${(name + '.' + ext).padEnd(30)} ${String(meta.width).padStart(5)}x${String(meta.height).padEnd(5)} ` +
    `${kb(buf.length)}KB ${type} -> ${kb(final.length)}KB ${ext}  (-${(100 - (final.length / buf.length) * 100).toFixed(0)}%)`
  );
}

console.log(
  `\n${written.size} files written to ${OUT}/  ` +
  `${(totalIn / 1048576).toFixed(2)}MB -> ${(totalOut / 1048576).toFixed(2)}MB ` +
  `(-${(100 - (totalOut / totalIn) * 100).toFixed(0)}%)`
);
