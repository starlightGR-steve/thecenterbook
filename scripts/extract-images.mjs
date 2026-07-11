import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const src = readFileSync('reference/thecenterbook-homepage-v14.html', 'utf8');
mkdirSync('public/images', { recursive: true });

let i = 0;
// Match src="data:image/<type>;base64,<data>"
const out = src.replace(/data:image\/(png|jpeg|jpg|svg\+xml|webp|gif);base64,([A-Za-z0-9+/=]+)/g,
  (_m, type, b64) => {
    i += 1;
    const ext = type === 'svg+xml' ? 'svg' : (type === 'jpeg' ? 'jpg' : type);
    const name = `img-${String(i).padStart(2, '0')}.${ext}`;
    writeFileSync(`public/images/${name}`, Buffer.from(b64, 'base64'));
    return `/images/${name}`;
  });

writeFileSync('reference/index-extracted.html', out);
console.log(`Extracted ${i} images.`);
