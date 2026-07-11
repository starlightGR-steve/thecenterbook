# The Center Book — Astro Port Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port the static `thecenterbook-homepage-v14.html` landing page into an Astro project (one component per section), publish to a new GitHub repo, and deploy on Vercel — rendered result pixel-identical to v14.

**Architecture:** Astro static site. A `Base.astro` layout holds `<head>` (fonts, meta), the global stylesheet, and all inline runtime scripts. Each of the ~21 page sections becomes its own `.astro` component. `index.astro` composes them in order. The 9 inline base64 images are extracted to real files under `public/images/`.

**Tech Stack:** Astro (latest), Node/npm, static output (no adapter — Vercel auto-detects Astro), git, GitHub, Vercel.

## Global Constraints

- **Mechanical port only.** Do NOT change CSS, markup, copy, colors, design tokens, or layout. Output must be pixel-identical to `thecenterbook-homepage-v14.html`. The only permitted edits are: (a) `data:image/...` srcs replaced with `/images/img-NN.png` paths, (b) `is:inline` added to scripts/nested-SVG-`<style>` where Astro requires it, (c) splitting the single file into components.
- **Node scripts, PowerShell/Windows environment.** Read files before editing. Commands shown use the Bash tool (POSIX) unless noted.
- **CDN deps stay:** Google Fonts `<link>` and Lucide `<script src="unpkg…">` remain as external references. Do NOT bundle them as npm deps.
- **No backend.** The contact modal's `/api/contact` note stays a comment; preview behavior (console.log + success screen) is unchanged. No serverless functions.
- **Astro `<style>` hazard:** Astro hoists/scopes every `<style>` in a component template. Any `<style>` we must leave verbatim (SVG `<defs><style>`, inline keyframes) is either moved to `global.css` or marked `is:inline`. See Tasks 2 and 5.
- **Astro `<script>` hazard:** The modal uses inline `onclick="submitCTA()"` handlers, so those functions must be in global scope. ALL ported `<script>` blocks use `is:inline` so Astro leaves them global and unbundled.
- **Verification is visual, not unit tests.** This is a static port; there are no unit tests. Each task verifies with `npm run build` succeeding. Final verification is a side-by-side visual comparison of the built page against the original HTML.

## Source section → component map

All line numbers refer to the ORIGINAL `thecenterbook-homepage-v14.html`. Line numbers are preserved through image extraction (Task 3 replaces srcs in place on the same lines).

| # | Component file | Source lines | Notes |
|---|---|---|---|
| 1 | `Nav.astro` | 194 | Contains SVG logo w/ nested `<defs><style>` (`.nl1`,`.nl2`) → `is:inline` |
| 2 | `Hero.astro` | 197–219 | Contains inline `<style>@keyframes pd…</style>` at line 216 → moved to global.css in Task 2 |
| 3 | `SocialProof.astro` | 220–222 | 334+ stat bar |
| 4 | `Product.astro` | 223–250 | `id="product"` |
| 5 | `TestiProduct.astro` | 251–259 | testimonial break |
| 6 | `FeatureWarm1.astro` | 260–286 | |
| 7 | `FeatureWhite1.astro` | 287–310 | |
| 8 | `For.astro` | 311–325 | `id="for"` |
| 9 | `TestiFor.astro` | 326–334 | testimonial break |
| 10 | `FeatureBlue1.astro` | 335–360 | |
| 11 | `FeatureCool1.astro` | 361–384 | |
| 12 | `FeatureWhite2.astro` | 385–401 | |
| 13 | `FeatureWarm2.astro` | 402–425 | |
| 14 | `FeatureBlue2.astro` | 426–441 | |
| 15 | `FeatureWhite3.astro` | 442–524 | largest block |
| 16 | `Why.astro` | 525–553 | `id="why"` |
| 17 | `Founding.astro` | 554–571 | `id="founding"` |
| 18 | `TestiFounding.astro` | 572–579 | testimonial break |
| 19 | `ClosingCta.astro` | 580–590 | centered CTA |
| 20 | `Footer.astro` | 591 | SVG logo w/ nested `<defs><style>` (`.fl1`) → `is:inline` |
| 21 | `ContactModal.astro` | 601–627 | includes `<!-- CONTACT MODAL -->` comment (line 601) |

**Extracted to `Base.astro` (not components):**
- `<head>` contents: lines 3–7 (`<meta>`, `<title>`, fonts `<link>`), plus a `<link rel="stylesheet" href="/styles/global.css">` (or Astro import).
- Global CSS: `<style>` block lines 8–190 + the keyframes from line 216 → `src/styles/global.css`.
- Runtime scripts (all `is:inline`, placed before `</body>` in Base, in this order): line 593 (Lucide src), 594 (`createIcons`), 595–599 (nav scroll + IntersectionObserver), 628–643 (modal functions).

**Images to extract (document order → filename):** lines 211, 242, 279, 304, 353, 378, 395, 419, 436 → `img-01.png` … `img-09.png`.

---

### Task 1: Scaffold the Astro project

**Files:**
- Create: `package.json`, `astro.config.mjs`, `.gitignore`, `tsconfig.json`
- Create: `src/pages/index.astro` (temporary placeholder)
- Modify: move `thecenterbook-homepage-v14.html` → `reference/thecenterbook-homepage-v14.html`

**Interfaces:**
- Produces: a buildable empty Astro project; `npm run build` outputs to `dist/`.

The folder already contains `thecenterbook-homepage-v14.html` and `docs/`, so `npm create astro` (which wants an empty dir + is interactive) is NOT used. Scaffold manually.

- [ ] **Step 1: Preserve the original as a reference**

```bash
cd "E:/Desktop/thecenterbook.com"
mkdir -p reference
mv thecenterbook-homepage-v14.html reference/thecenterbook-homepage-v14.html
```

- [ ] **Step 2: Create `package.json`**

```json
{
  "name": "thecenterbook",
  "type": "module",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview"
  },
  "devDependencies": {
    "astro": "^4.15.0"
  }
}
```

- [ ] **Step 3: Create `astro.config.mjs`** (static output is the default; no adapter needed)

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  // Static site. Vercel auto-detects Astro and serves dist/.
});
```

- [ ] **Step 4: Create `.gitignore`**

```
node_modules/
dist/
.astro/
.DS_Store
.vercel/
*.log
```

- [ ] **Step 5: Create `tsconfig.json`** (Astro's strict base)

```json
{ "extends": "astro/tsconfigs/strict" }
```

- [ ] **Step 6: Create a temporary `src/pages/index.astro`**

```astro
<html lang="en">
  <head><meta charset="utf-8" /><title>placeholder</title></head>
  <body><h1>scaffold ok</h1></body>
</html>
```

- [ ] **Step 7: Install and build**

```bash
cd "E:/Desktop/thecenterbook.com"
npm install
npm run build
```
Expected: install completes; build prints "Complete!" and creates `dist/index.html`. No errors.

- [ ] **Step 8: Commit**

```bash
git init
git add -A
git commit -m "chore: scaffold Astro project"
```

---

### Task 2: Base layout + global CSS

**Files:**
- Create: `src/styles/global.css`
- Create: `src/layouts/Base.astro`
- Reference: `reference/thecenterbook-homepage-v14.html` (lines 3–7, 8–190, 216, 593–599, 628–643)

**Interfaces:**
- Produces: `Base.astro` — a layout that renders `<html><head>…</head><body><slot/>…scripts…</body></html>`. Consumed by `index.astro` (Task 7). It imports `../styles/global.css`.

- [ ] **Step 1: Create `src/styles/global.css`**

Copy the CSS **between** `<style>` (line 8) and `</style>` (line 190) of the reference file — verbatim, no edits. Then append the keyframes from line 216 at the end of the file:

```css
/* from original line 216 */
@keyframes pd{0%,100%{opacity:1}50%{opacity:.5}}
```

- [ ] **Step 2: Create `src/layouts/Base.astro`**

Copy the `<head>` children from reference lines 4–7 (the `<meta charset>`, `<meta viewport>`, `<title>`, and Google Fonts `<link>`) into the `<head>` verbatim. Place the four script blocks before `</body>`, each marked `is:inline`, copying the script bodies verbatim from the reference (lines 594, 596–598, 629–642).

```astro
---
import '../styles/global.css';
---
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>The Center Book - Built for Tutoring Centers</title>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Oooh+Baby&display=swap" rel="stylesheet">
</head>
<body>
<slot />

<script is:inline src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>
<script is:inline>lucide.createIcons();</script>
<script is:inline>
/* PASTE reference lines 596–598 verbatim here */
</script>
<script is:inline>
/* PASTE reference lines 629–642 verbatim here */
</script>
</body>
</html>
```

Fill the two `/* PASTE … */` placeholders with the exact bytes from the reference file. Do not reformat.

- [ ] **Step 3: Build**

```bash
cd "E:/Desktop/thecenterbook.com" && npm run build
```
Expected: "Complete!", no errors. (`index.astro` is still the placeholder; Base isn't used yet — this only confirms Base compiles once imported in Task 7. If nothing imports Base, Astro won't compile it; that's fine — proceed.)

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: add Base layout and global stylesheet"
```

---

### Task 3: Extract base64 images

**Files:**
- Create: `scripts/extract-images.mjs` (throwaway build tool, kept in repo)
- Create: `public/images/img-01.png` … `img-09.png` (generated)
- Create: `reference/index-extracted.html` (generated — the source with image srcs rewritten; components are sliced from THIS file)

**Interfaces:**
- Produces: `reference/index-extracted.html` with every `data:image/...;base64,…` replaced by `/images/img-NN.png`, on the same lines. All later component tasks copy from this file so srcs are already correct.

- [ ] **Step 1: Write `scripts/extract-images.mjs`**

```js
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
```

- [ ] **Step 2: Run it**

```bash
cd "E:/Desktop/thecenterbook.com" && node scripts/extract-images.mjs
```
Expected: prints `Extracted 9 images.` and creates `public/images/img-01.png` … `img-09.png`.

- [ ] **Step 3: Verify extraction**

```bash
ls -la "E:/Desktop/thecenterbook.com/public/images"
grep -c "data:image" "E:/Desktop/thecenterbook.com/reference/index-extracted.html"
```
Expected: 9 image files present; `grep -c` prints `0` (no base64 left) — OR the count of any `data:image` still embedded in non-`src` contexts (there should be none). If nonzero, inspect which lines and adjust the regex.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: extract inline base64 images to public/images"
```

---

### Task 4: Top-of-page components (Nav, Hero, SocialProof)

**Files:**
- Create: `src/components/Nav.astro`, `src/components/Hero.astro`, `src/components/SocialProof.astro`
- Reference: `reference/index-extracted.html` lines 194, 197–219, 220–222

**Interfaces:**
- Produces: three components with no props, rendering their section markup. Consumed by `index.astro` (Task 7).

- [ ] **Step 1: `Nav.astro`** — paste reference line 194 verbatim as the component body. Then, in the SVG logo, add `is:inline` to the nested `<style>` inside `<defs>` so Astro leaves it untouched:

`<defs> <style>` → `<defs> <style is:inline>`

- [ ] **Step 2: `Hero.astro`** — paste reference lines 197–219 verbatim, EXCEPT delete line 216 (`<style>@keyframes pd…</style>`) — it was already moved to `global.css` in Task 2.

- [ ] **Step 3: `SocialProof.astro`** — paste reference lines 220–222 verbatim.

- [ ] **Step 4: Temporarily wire into `index.astro` to build-test** (will be replaced in Task 7)

```astro
---
import Base from '../layouts/Base.astro';
import Nav from '../components/Nav.astro';
import Hero from '../components/Hero.astro';
import SocialProof from '../components/SocialProof.astro';
---
<Base>
  <Nav /><Hero /><SocialProof />
</Base>
```

- [ ] **Step 5: Build**

```bash
cd "E:/Desktop/thecenterbook.com" && npm run build
```
Expected: "Complete!", no errors. If Astro errors on the SVG `<style>`, confirm `is:inline` was added; fallback: convert `.nl1`/`.nl2` rules to inline `fill="#f49a4d"`/`fill="#233a67"` attributes on the paths and delete the `<defs><style>`.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: add Nav, Hero, SocialProof components"
```

---

### Task 5: Product region components

**Files:**
- Create: `src/components/Product.astro` (223–250), `TestiProduct.astro` (251–259), `FeatureWarm1.astro` (260–286), `FeatureWhite1.astro` (287–310)
- Reference: `reference/index-extracted.html`

**Interfaces:**
- Produces: four prop-less section components. Consumed by `index.astro` (Task 7).

- [ ] **Step 1** — Create each file by pasting its line range from `reference/index-extracted.html` verbatim (image srcs already rewritten). One file per row in the map above.

- [ ] **Step 2** — Add each to the temporary `index.astro` import list + render in order after `SocialProof`.

- [ ] **Step 3: Build**

```bash
cd "E:/Desktop/thecenterbook.com" && npm run build
```
Expected: "Complete!", no errors.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: add Product region components"
```

---

### Task 6: For / feature / Why / Founding / footer components

**Files:**
- Create (paste verbatim line ranges from `reference/index-extracted.html`):
  - `For.astro` (311–325), `TestiFor.astro` (326–334)
  - `FeatureBlue1.astro` (335–360), `FeatureCool1.astro` (361–384), `FeatureWhite2.astro` (385–401), `FeatureWarm2.astro` (402–425), `FeatureBlue2.astro` (426–441), `FeatureWhite3.astro` (442–524)
  - `Why.astro` (525–553), `Founding.astro` (554–571), `TestiFounding.astro` (572–579), `ClosingCta.astro` (580–590)
  - `Footer.astro` (591) — add `is:inline` to the SVG's nested `<defs> <style>` (`.fl1`), same as Nav
  - `ContactModal.astro` (601–627) — include the `<!-- CONTACT MODAL -->` comment
- Reference: `reference/index-extracted.html`

**Interfaces:**
- Produces: the remaining prop-less section components. Consumed by `index.astro` (Task 7).

- [ ] **Step 1** — Create each file by pasting its line range verbatim.

- [ ] **Step 2** — Add each to the temporary `index.astro` in document order.

- [ ] **Step 3: Build**

```bash
cd "E:/Desktop/thecenterbook.com" && npm run build
```
Expected: "Complete!", no errors. If `Footer.astro` errors on the SVG `<style>`, apply the same `is:inline` / inline-`fill` fallback as Nav.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: add remaining section components, footer, contact modal"
```

---

### Task 7: Compose the final page

**Files:**
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `Base.astro` + all 21 components.
- Produces: the complete home page.

- [ ] **Step 1: Write the final `index.astro`** — import Base + all 21 components; render them inside `<Base>` in exact document order:

```astro
---
import Base from '../layouts/Base.astro';
import Nav from '../components/Nav.astro';
import Hero from '../components/Hero.astro';
import SocialProof from '../components/SocialProof.astro';
import Product from '../components/Product.astro';
import TestiProduct from '../components/TestiProduct.astro';
import FeatureWarm1 from '../components/FeatureWarm1.astro';
import FeatureWhite1 from '../components/FeatureWhite1.astro';
import For from '../components/For.astro';
import TestiFor from '../components/TestiFor.astro';
import FeatureBlue1 from '../components/FeatureBlue1.astro';
import FeatureCool1 from '../components/FeatureCool1.astro';
import FeatureWhite2 from '../components/FeatureWhite2.astro';
import FeatureWarm2 from '../components/FeatureWarm2.astro';
import FeatureBlue2 from '../components/FeatureBlue2.astro';
import FeatureWhite3 from '../components/FeatureWhite3.astro';
import Why from '../components/Why.astro';
import Founding from '../components/Founding.astro';
import TestiFounding from '../components/TestiFounding.astro';
import ClosingCta from '../components/ClosingCta.astro';
import Footer from '../components/Footer.astro';
import ContactModal from '../components/ContactModal.astro';
---
<Base>
  <Nav />
  <Hero />
  <SocialProof />
  <Product />
  <TestiProduct />
  <FeatureWarm1 />
  <FeatureWhite1 />
  <For />
  <TestiFor />
  <FeatureBlue1 />
  <FeatureCool1 />
  <FeatureWhite2 />
  <FeatureWarm2 />
  <FeatureBlue2 />
  <FeatureWhite3 />
  <Why />
  <Founding />
  <TestiFounding />
  <ClosingCta />
  <Footer />
  <ContactModal />
</Base>
```

- [ ] **Step 2: Build**

```bash
cd "E:/Desktop/thecenterbook.com" && npm run build
```
Expected: "Complete!", no errors. `dist/index.html` generated.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: compose full home page from section components"
```

---

### Task 8: Visual verification against the original

**Files:** none (verification only)

**Interfaces:**
- Consumes: `dist/` (built site) and `reference/thecenterbook-homepage-v14.html`.

- [ ] **Step 1: Serve the build**

```bash
cd "E:/Desktop/thecenterbook.com" && npm run preview
```
(Astro preview serves `dist/` at a localhost URL.)

- [ ] **Step 2: Compare** — open the preview URL and the original `reference/thecenterbook-homepage-v14.html` side by side. Confirm, top to bottom:
  - Nav renders with the SVG logo; scroll adds the `.scrolled` shadow.
  - Hero, social-proof stat bar (334+), all four anchor sections (#product, #for, #why, #founding), every feature/testimonial block, closing CTA, footer.
  - Fonts (Montserrat, Oooh Baby script), Lucide icons all present.
  - All 9 images load (no broken images).
  - Hover states on buttons; fade-in-on-scroll animation.
  - "Book a Demo" opens the contact modal; Escape/overlay closes it; empty-field validation shows `.field-err`; submit shows the success screen.

- [ ] **Step 3:** If any discrepancy, fix the offending component (re-copy the exact source lines) and rebuild. Do not proceed until pixel-identical.

- [ ] **Step 4: Commit** any fixes.

```bash
git add -A && git commit -m "fix: visual parity corrections"
```

---

### Task 9: Publish to GitHub and deploy to Vercel

**Files:** none (external services)

**Interfaces:** none.

> **Approval gate:** This task pushes to a remote and deploys publicly. Do NOT run it without Steve's explicit go-ahead, and confirm the GitHub account/repo name and Vercel account/team first.

- [ ] **Step 1: Confirm** with Steve: GitHub owner + repo name (e.g. `starlightgr/thecenterbook.com` or personal), public vs private, and which Vercel team/account.

- [ ] **Step 2: Create the GitHub repo and push** (using `gh`, once repo name confirmed)

```bash
cd "E:/Desktop/thecenterbook.com"
gh repo create <owner>/<name> --private --source=. --remote=origin --push
```
Expected: repo created, `main` pushed.

- [ ] **Step 3: Deploy to Vercel** — import the GitHub repo in Vercel (framework preset auto-detects **Astro**; build `astro build`, output `dist/`). Alternatively use the Vercel MCP `deploy_to_vercel` tool against the connected repo. Confirm the production URL renders identically to Task 8.

- [ ] **Step 4:** Report the GitHub URL and Vercel production URL to Steve.

---

## Notes for the implementer

- The reference file lives at `reference/thecenterbook-homepage-v14.html` (original, with base64) and `reference/index-extracted.html` (srcs rewritten — slice components from this one).
- When "paste verbatim," copy the exact bytes for the given line range. Do not reindent, reformat, or "tidy." Every changed byte must trace to the Global Constraints allow-list.
- If a build error mentions a `<style>` or `<script>`, it is almost always the `is:inline` hazard from Global Constraints — apply `is:inline`.
```
