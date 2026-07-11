# The Center Book — Astro Port Design

**Date:** 2026-07-11
**Status:** Approved
**Author:** Steve + Claude

## Goal

Port the existing static marketing landing page (`thecenterbook-homepage-v14.html`)
into an Astro project, publish it to a new GitHub repo, and deploy it on Vercel.
This is a **mechanical port** — the rendered result must be pixel-identical to v14.
No redesign, no copy changes, no "improvements."

## Source

- Single file: `thecenterbook-homepage-v14.html` (~2.8MB, 644 lines).
- Static marketing page. Inline `<style>` blocks, a few small `<script>` blocks
  (nav scroll state, Lucide icon init, minor interactions).
- 10 inline base64 images.
- External CDN deps: Google Fonts (Montserrat, Oooh Baby) via `<link>`;
  Lucide icons via `<script src="unpkg.com/lucide">`.
- Page sections (by `id`): `product`, `for`, `why`, `founding`, plus nav + footer.

## Stack

Astro (static output) → GitHub → Vercel.

Rationale: the page is fully static content. Astro ships zero JS by default,
keeps the existing HTML/CSS essentially intact, and deploys to Vercel with no config.

## Project layout

```
thecenterbook.com/
  src/
    pages/index.astro          # page composition — imports the section components
    layouts/Base.astro         # <head>, meta, fonts, global CSS import, Lucide script
    styles/global.css          # the inline <style> blocks, moved verbatim
    components/                # one component per section
      Nav.astro
      Product.astro            # #product
      For.astro                # #for
      Why.astro                # #why
      Founding.astro           # #founding
      Footer.astro
  public/
    images/                    # the 10 base64 images extracted to real files
  astro.config.mjs
  package.json
  .gitignore
```

## Decisions (approved)

1. **Componentize** — each section becomes its own `.astro` component; `index.astro`
   composes them. Keeps files focused and editable in isolation.
2. **Extract base64 images** to `public/images/` as real files; reference by path.
   Shrinks source from ~2.8MB to a few KB and makes images swappable.
3. **Keep CDN references** for Lucide and Google Fonts as-is. They work on a static
   page; bundling them as npm deps is more setup for little gain.

## Explicitly NOT changing

CSS, markup, design tokens, copy, colors, layout. Pixel-identical to v14.

## Small scripts

The existing inline `<script>` blocks (nav scroll class toggle, Lucide `createIcons()`,
any interactions) move into `Base.astro` (or the relevant component) as inline
`<script>` tags. Astro leaves plain inline scripts alone unless they import modules.

## Success criteria

- `npm run build` produces a static site with no errors.
- The built page renders pixel-identical to `thecenterbook-homepage-v14.html`
  (nav, all four sections, footer, fonts, icons, images, hover states, scroll behavior).
- Repo pushed to a new GitHub repo.
- Vercel deploys the repo; the preview/production URL renders correctly.

## Out of scope

Additional pages, blog, CMS, forms/backends, analytics, redesign.
```
