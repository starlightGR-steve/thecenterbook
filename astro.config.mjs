import { defineConfig } from 'astro/config';

export default defineConfig({
  // Static site. Vercel auto-detects Astro and serves dist/.
  // The contact form posts to /api/contact, a Vercel function in the root api/ dir.
});
