import { defineConfig } from 'astro/config';

export default defineConfig({
  // Static site. Vercel auto-detects Astro and serves dist/.
  // The contact form endpoint lives in /api/contact.ts, which Vercel deploys
  // as a standalone function alongside the static build.
});
