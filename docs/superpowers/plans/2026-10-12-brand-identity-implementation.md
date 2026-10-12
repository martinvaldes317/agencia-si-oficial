# Rebrand AgenciaSI — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the site's current "negro premium" blue→violet gradient identity (Poppins/Playfair Display/Oswald, text-only "Agencia SI" logo) with the new AgenciaSI brand identity (Carbón/Blanco cálido/Azul conexión/Azul niebla, flat — no gradients, Rubik/Source Code Pro, icon+text logo lockup) across every public-facing page.

**Architecture:** One new file (`client/src/theme/brand.js`) becomes the single source of truth for the 4 new colors + 4 derived panel shades. Every existing per-page color system (1 CSS token block in `home-dark.css`, 1 CSS token block in `sitio-web-dark.css`, 9 separate `DARK_T`/`LIGHT_T`-shaped JS objects spread across 9 components) gets its hex *values* repointed at `brand.js`'s exports, keeping each file's existing shape/keys/consumers untouched. A handful of standalone literal gradients and non-brand "second accent" colors (mint, cyan, gold-as-decoration) that don't route through any token object get hand-edited to flat Azul conexión / Carbón / Azul niebla per the mapping table below. Fonts: one Google Fonts `<link>` swap + one CSS var pair (`--font-heading`, `--font-mono`) + ~30 mechanical literal replacements of `font-family: 'Poppins'/'Playfair Display'/'Oswald'` → `var(--font-heading)`. Logo/favicon: the designer-supplied `isotipo.svg` gets its fill corrected to the exact brand blue, then headless Chrome + Pillow render it into a transparent favicon.png and two "icon + AgenciaSi (Rubik Bold)" lockup PNGs (dark-bg and light-bg variants), replacing `logo-dark.png`/`logo-light.png` in place — `ThemeLogo.jsx`'s logic is untouched.

**Tech Stack:** React 19 + Vite 7 (client), plain CSS custom properties + inline JSX `style={{}}` objects (no CSS-in-JS library), Google Fonts, headless Google Chrome (already installed) + Python 3 Pillow (already installed) for one-off asset rendering.

**Spec:** `docs/superpowers/specs/2026-10-12-brand-identity-design.md`

## Global Constraints

- The new palette has exactly 4 brand colors — Carbón `#171B20`, Blanco cálido `#F6F5F0`, Azul conexión `#3459ED`, Azul niebla `#E0E7FF` — and **no gradients, no second brand accent color** (confirmed with the user). Every `linear-gradient`/`conic-gradient`/`radial-gradient` whose two stops were both in the old blue/violet family becomes a **flat** fill.
- Rule for every color token being migrated, applied consistently across all 12 files in this plan:
  - A token used as a **solid fill** (button background, icon-box background, card background, border) → `AZUL_CONEXION` in **both** themes (dropping the old pattern of a separately-darkened light-mode shade — `#3459ED` has enough contrast against `#F6F5F0` on its own, verified by eye against the existing precedent of similarly-dark accent blues already used directly as body-adjacent text).
  - A token used as **small text/icon color sitting directly on the page background** (old `accent-tx`/`blueD`-style roles) → `AZUL_NIEBLA` in **dark** mode (near-white, high contrast on Carbón, mirrors the old pattern of lightening blue for dark-mode text) and `AZUL_CONEXION` in **light** mode (dark enough on Blanco cálido).
  - A token representing the **page background** → `CARBON` (dark) / `BLANCO_CALIDO` (light).
  - A token representing a **panel/card surface on top of the page background** → `CARBON_PANEL` (dark) / `BLANCO_CALIDO_PANEL` (light); a second, slightly more separated panel step (footers, nested panels) → `CARBON_PANEL_2` / `BLANCO_CALIDO_PANEL_2`.
  - Any extra "second accent" color that existed only to pair with the old blue-violet gradient (violet, cyan `#22F2D8`, mint `#A8FFEA`, the `#1a2680`/`#6a4bf5`/`#1212CC`/`#2D2BB5`/`#1A4FC4` gradient stops, navy `#0A0B2E`/`#141650`) → collapses into `AZUL_CONEXION` (if it was a fill/button role) or `CARBON` (if it was a dark fixed-surface role, e.g. the wizard's nav bar / receipt printer body).
  - Semantic status colors (`green`/`#22c55e`/`#16a34a` success, `red`/`#D9333F` error, `gold`/`#F59E0B`/`#B98900`/amber warning) are **not brand colors** and are left unchanged everywhere, per the spec.
  - `--line`/`--line-strong`/`border` (translucent black/white opacity borders) and generic gray text (`gray`/`mut*`/`grayTx`/`grayLt`) are left unchanged — they don't depend on the exact brand hue.
- Reusable RGB for rgba() literals: Azul conexión = `rgb(52, 89, 237)`. Every `rgba(93,90,254,…)`/`rgba(110,90,255,…)`/`rgba(120,90,254,…)`/`rgba(120,110,255,…)`/`rgba(130,120,255,…)`/`rgba(139,92,246,…)`/`rgba(80,70,255,…)`/`rgba(90,80,255,…)`/`rgba(61,90,254,…)` glow/shadow/tint literal becomes `rgba(52,89,237,<same alpha>)`.
- Font stack: Rubik (400/500/600/700/800) replaces Poppins/Playfair Display everywhere; Source Code Pro (400/500/600) is loaded but not force-applied anywhere yet (no current element needs a monospace/label treatment — available via `var(--font-mono)` for future use). Every `font-family: 'Poppins', …` / `"'Playfair Display', …"` / `'Playfair Display, serif'` / `"'Oswald', …"` literal becomes `var(--font-heading)`. The deliberately-different `"'Courier New', monospace"` used for the printed-receipt mockup in `ReceiptAnimation.jsx` is NOT part of this rebrand (it's a realism choice for a receipt metaphor, unrelated to the site's type system) — leave it untouched.
- Scope: public-facing pages only. `/admin/*`, `/portal/*`, and `styles/brand-dark.css` (`bd-*` prefix) are out of scope.
- `ThemeLogo.jsx`'s logic (`theme === 'light' ? '/logo-light.png' : '/logo-dark.png'`) is not touched — only the two PNG files it points to are regenerated in place.

## Review Focus

- **Degenerate same-color gradients left behind**: anywhere a `linear-gradient(…, ${T.blue}, ${T.violet})`-style template literal existed and both tokens now resolve to the same `AZUL_CONEXION` value, the gradient *function* must still be removed (not just left as a technically-harmless same-color gradient) — Task 6 (Links.jsx) and Task 5 (ReceiptAnimation.jsx) both have exactly this case; verify the `linear-gradient(` substring is actually gone from those two files after editing, not just that the colors match.
- **`.hd-glow`'s removed spin animation**: Task 2 deletes the `@keyframes hd-spin` and `@property --ang` rules along with the conic-gradient. Confirm no other selector in `home-dark.css` or `Home.jsx` still references `hd-spin` or `--ang` after the edit (a leftover `animation: hd-spin …` on `.hd-glow` with the keyframes gone would just silently no-op, but check anyway).
- **`#A8FFEA` mint badges losing contrast**: the mint→Azul-niebla swap (Task 3 and Task 4) sits on a *translucent white* pill (`rgba(255,255,255,0.15)`) over the new flat Azul-conexión hero — visually confirm via the light+dark Playwright pass that the badge text is still legible, since Azul niebla is lighter than the old mint and the pill's own translucency changes how much blue hero shows through.
- **Reused screenshot script path dependencies**: Task 1's asset-generation script hardcodes absolute paths (`PUBLIC_DIR`, the Chrome binary path). If this plan is executed on a machine without Google Chrome at `/Applications/Google Chrome.app`, or without `python3`/Pillow, Task 1 Step 2 fails outright — confirm both are present (already verified present on this machine during brainstorming) before running, rather than discovering it mid-task.
- **`isotipo.svg` in the repo root vs. `client/public/`**: the designer's file lives at the git root (`/isotipo.svg`), outside `web-express-app/`. Task 1 copies a *color-corrected* version into `client/public/isotipo.svg` as a real site asset (referenced by the favicon/logo generation) — confirm the root copy is left untouched (it's the designer's deliverable, not build output) and only the `client/public/` copy has the fill correction applied.
- **`SitioWebConfirmacion.jsx`/`SitioWebWizard.jsx` hardcode `/logo-dark.png` directly** (not via `ThemeLogo`), so they always show the dark-variant logo regardless of site theme — this is pre-existing behavior, not something this rebrand introduces or fixes. Don't "fix" it as a drive-by; both files are listed in Task 5 for font-only edits, and the logo line is explicitly left alone.

---

## Task 1: Foundation — brand.js, fonts, isotipo color fix, logo/favicon assets

**Files:**
- Create: `web-express-app/client/src/theme/brand.js`
- Modify: `web-express-app/client/index.html`
- Modify: `web-express-app/client/src/index.css`
- Modify: `isotipo.svg` (repo root) — fill color only
- Create: `web-express-app/client/public/isotipo.svg` (color-corrected copy)
- Modify (regenerate in place): `web-express-app/client/public/favicon.png`
- Modify (regenerate in place): `web-express-app/client/public/logo-dark.png`
- Modify (regenerate in place): `web-express-app/client/public/logo-light.png`

**Interfaces:**
- Produces: `CARBON`, `CARBON_PANEL`, `CARBON_PANEL_2`, `BLANCO_CALIDO`, `BLANCO_CALIDO_PANEL`, `BLANCO_CALIDO_PANEL_2`, `AZUL_CONEXION`, `AZUL_NIEBLA` (all string hex constants) from `client/src/theme/brand.js` — every later task imports from this file.
- Produces: `--font-heading` and `--font-mono` CSS custom properties, available globally (defined in `index.css`, loaded before any component renders per `main.jsx`'s import order) — every later task's font-family edits reference `var(--font-heading)`.

- [ ] **Step 1: Create `client/src/theme/brand.js`**

```js
// Fuente de verdad de la identidad visual AgenciaSI (guía de marca v06, oct. 2026).
// Los 4 colores base vienen directo de la guía; los *_PANEL/*_PANEL_2 son
// superficies derivadas (paneles/tarjetas) sobre el fondo correspondiente,
// con la misma relación de contraste que ya usaban los paneles sobre negro/
// blanco puro antes de este cambio.
export const CARBON = '#171B20'
export const CARBON_PANEL = '#1C2129'
export const CARBON_PANEL_2 = '#202631'

export const BLANCO_CALIDO = '#F6F5F0'
export const BLANCO_CALIDO_PANEL = '#EFEEE8'
export const BLANCO_CALIDO_PANEL_2 = '#E8E6DE'

export const AZUL_CONEXION = '#3459ED'
export const AZUL_NIEBLA = '#E0E7FF'
```

- [ ] **Step 2: Swap the Google Fonts `<link>` in `client/index.html`**

Old (line 50):
```html
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,400;1,700&family=Poppins:wght@300;400;500;600;700&family=Oswald:wght@500;600;700&display=swap" rel="stylesheet" />
```
New:
```html
  <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600;700;800&family=Source+Code+Pro:wght@400;500;600&display=swap" rel="stylesheet" />
```

- [ ] **Step 3: Add the font variables to `client/src/index.css`**

Add immediately after the closing `}` of the existing `@theme { … }` block (after line 45):
```css
:root {
    --font-heading: 'Rubik', sans-serif;
    --font-mono: 'Source Code Pro', monospace;
}
```

- [ ] **Step 4: Fix the isotipo's fill color and copy it into `client/public/`**

In `isotipo.svg` (repo root), change:
```xml
      .cls-1 {
        fill: #3e5aa5;
      }
```
to:
```xml
      .cls-1 {
        fill: #3459ED;
      }
```
Then copy the corrected file to `web-express-app/client/public/isotipo.svg` (same content, new location — this is the asset the site and the generation script in Step 5 will use; the repo-root copy stays as the designer's original deliverable with the color now corrected).

- [ ] **Step 5: Generate favicon.png, logo-dark.png, logo-light.png**

Both Google Chrome (`/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`) and Python 3 with Pillow are confirmed present on this machine. Write this script to the scratchpad directory as `generate-brand-assets.mjs` and run it with `node`:

```js
import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PUBLIC_DIR = '/Users/martinvaldescerna/Documents/AGENCIA SI OFICIAL/web-express-app/client/public'
const ISOTIPO_SVG = readFileSync(join(PUBLIC_DIR, 'isotipo.svg'), 'utf8')
const ISOTIPO_DATA_URI = 'data:image/svg+xml;base64,' + Buffer.from(ISOTIPO_SVG).toString('base64')

const work = mkdtempSync(join(tmpdir(), 'brand-assets-'))

function shoot(html, outRaw, w, h) {
  const htmlPath = join(work, `${outRaw}.html`)
  writeFileSync(htmlPath, html)
  execFileSync(CHROME, [
    '--headless=new', '--disable-gpu', '--hide-scrollbars',
    '--default-background-color=00000000',
    `--window-size=${w},${h}`,
    `--screenshot=${join(work, outRaw)}`,
    `file://${htmlPath}`,
  ])
}

const lockupPage = (textColor) => `<!doctype html><html><head><meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@800&display=swap');
  html,body{margin:0;padding:0;background:transparent;}
  .lockup{display:flex;align-items:center;justify-content:center;width:100vw;height:100vh;gap:28px;}
  .lockup img{height:200px;width:auto;display:block;}
  .lockup span{font-family:'Rubik',sans-serif;font-weight:800;font-size:150px;letter-spacing:-2px;color:${textColor};}
</style></head>
<body><div class="lockup"><img src="${ISOTIPO_DATA_URI}"><span>AgenciaSi</span></div></body></html>`

shoot(
  `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;padding:0;background:transparent;}
  .wrap{display:flex;align-items:center;justify-content:center;width:100vw;height:100vh;}
  .wrap img{width:420px;height:420px;}</style></head>
  <body><div class="wrap"><img src="${ISOTIPO_DATA_URI}"></div></body></html>`,
  'favicon-raw.png', 600, 600,
)
shoot(lockupPage('#F6F5F0'), 'logo-dark-raw.png', 1600, 400)
shoot(lockupPage('#171B20'), 'logo-light-raw.png', 1600, 400)

console.log('WORKDIR=' + work)
```

Run: `node /path/to/scratchpad/generate-brand-assets.mjs` — note the printed `WORKDIR=`.

Then write and run this crop script (also to the scratchpad), passing that workdir as `argv[1]`:

```python
import sys
from PIL import Image

work = sys.argv[1]
public_dir = '/Users/martinvaldescerna/Documents/AGENCIA SI OFICIAL/web-express-app/client/public'

def crop_and_save(raw_name, out_name, pad):
    im = Image.open(f'{work}/{raw_name}')
    bbox = im.getbbox()
    l, t, r, b = bbox
    l, t = max(0, l - pad), max(0, t - pad)
    r, b = min(im.width, r + pad), min(im.height, b + pad)
    out = im.crop((l, t, r, b))
    out.save(f'{public_dir}/{out_name}')
    print(out_name, '->', out.size)

crop_and_save('favicon-raw.png', 'favicon.png', 40)
crop_and_save('logo-dark-raw.png', 'logo-dark.png', 16)
crop_and_save('logo-light-raw.png', 'logo-light.png', 16)
```

Run: `python3 /path/to/scratchpad/crop-brand-assets.py <WORKDIR>`

- [ ] **Step 6: Visually verify the generated assets**

Open `client/public/favicon.png`, `client/public/logo-dark.png`, `client/public/logo-light.png` and confirm: favicon is a clean square isotipo on transparent background; logo-dark.png shows the icon next to "AgenciaSi" in off-white Rubik Bold with no visible background box (transparent); logo-light.png is the same with dark Carbón text. If any image has a visible hard-edged background instead of transparency, the `--default-background-color=00000000` flag didn't take — re-run Step 5 and check Chrome's `--headless=new` output didn't silently fall back to a solid background.

- [ ] **Step 7: Commit**

```bash
git add isotipo.svg
cd web-express-app
git add client/index.html client/src/index.css client/src/theme/brand.js \
  client/public/isotipo.svg client/public/favicon.png \
  client/public/logo-dark.png client/public/logo-light.png
git commit -m "Brand: nueva identidad visual — paleta, tipografía y logo (fundación)"
```

---

## Task 2: Home (`home-dark.css`)

**Files:**
- Modify: `web-express-app/client/src/components/home-dark.css`

**Interfaces:**
- Consumes: nothing imported (plain CSS file — the hex values below are written as literals, matching this file's existing style of not importing JS constants into CSS).

- [ ] **Step 1: Replace the dark-mode `:root { .hd { … } }` token block (lines 2–29)**

Old:
```css
.hd {
  --bg: #000000;
  --panel: #07070c;
  --panel-2: #0c0c14;
  --line: rgba(255, 255, 255, 0.09);
  --line-strong: rgba(255, 255, 255, 0.16);
  --text: #f5f5fa;
  --mut: #9a9ab0;
  --blue: #3d5afe;
  --violet: #8b5cf6;
  --grad: linear-gradient(120deg, #3d5afe 0%, #8b5cf6 100%);
  /* Tokens de soporte: tintes translúcidos, texto de acento y superficies que
     cambian de intención entre temas (no son solo un alias de --text/--bg) */
  --tint: rgba(255,255,255,.03);
  --tint-strong: rgba(255,255,255,.08);
  --accent-tx: #a9b7ff;
  --nav-glass: rgba(0,0,0,.72);
  --badge-filter: brightness(0) invert(1);
  --form-grad: linear-gradient(170deg, rgba(20, 20, 40, .7), rgba(6, 6, 12, .85));
  --card-grad: linear-gradient(170deg, rgba(255,255,255,.035), rgba(255,255,255,.008));
  --ok-tx: #7dffb0;
  --err-tx: #ff9b9b;
  background: var(--bg);
  color: var(--text);
  font-family: 'Poppins', system-ui, sans-serif;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}
```
New:
```css
.hd {
  --bg: #171B20;
  --panel: #1C2129;
  --panel-2: #202631;
  --line: rgba(255, 255, 255, 0.09);
  --line-strong: rgba(255, 255, 255, 0.16);
  --text: #f5f5fa;
  --mut: #9a9ab0;
  --blue: #3459ED;
  --violet: #3459ED;
  --grad: #3459ED;
  /* Tokens de soporte: tintes translúcidos, texto de acento y superficies que
     cambian de intención entre temas (no son solo un alias de --text/--bg) */
  --tint: rgba(255,255,255,.03);
  --tint-strong: rgba(255,255,255,.08);
  --accent-tx: #E0E7FF;
  --nav-glass: rgba(0,0,0,.72);
  --badge-filter: brightness(0) invert(1);
  --form-grad: linear-gradient(170deg, rgba(20, 20, 40, .7), rgba(6, 6, 12, .85));
  --card-grad: linear-gradient(170deg, rgba(255,255,255,.035), rgba(255,255,255,.008));
  --ok-tx: #7dffb0;
  --err-tx: #ff9b9b;
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-heading);
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}
```

- [ ] **Step 2: Replace the light-mode `:root[data-theme="light"] .hd { … }` block (lines 32–52)**

Old:
```css
:root[data-theme="light"] .hd {
  --bg: #ffffff;
  --panel: #f7f8fb;
  --panel-2: #eef0f6;
  --line: rgba(15, 23, 42, 0.10);
  --line-strong: rgba(15, 23, 42, 0.16);
  --text: #14141f;
  --mut: #55586b;
  --blue: #2451c4;
  --violet: #7c3aed;
  --grad: linear-gradient(120deg, #2451c4 0%, #7c3aed 100%);
  --tint: rgba(15, 23, 42, .035);
  --tint-strong: rgba(15, 23, 42, .06);
  --accent-tx: #3348b0;
  --nav-glass: rgba(255,255,255,.82);
  --badge-filter: none;
  --form-grad: linear-gradient(170deg, #fbfbfe, #f2f3f9);
  --card-grad: linear-gradient(170deg, rgba(15,23,42,.025), rgba(15,23,42,.006));
  --ok-tx: #15803d;
  --err-tx: #b91c1c;
}
```
New:
```css
:root[data-theme="light"] .hd {
  --bg: #F6F5F0;
  --panel: #EFEEE8;
  --panel-2: #E8E6DE;
  --line: rgba(15, 23, 42, 0.10);
  --line-strong: rgba(15, 23, 42, 0.16);
  --text: #14141f;
  --mut: #55586b;
  --blue: #3459ED;
  --violet: #3459ED;
  --grad: #3459ED;
  --tint: rgba(15, 23, 42, .035);
  --tint-strong: rgba(15, 23, 42, .06);
  --accent-tx: #3459ED;
  --nav-glass: rgba(255,255,255,.82);
  --badge-filter: none;
  --form-grad: linear-gradient(170deg, #fbfbfe, #f2f3f9);
  --card-grad: linear-gradient(170deg, rgba(15,23,42,.025), rgba(15,23,42,.006));
  --ok-tx: #15803d;
  --err-tx: #b91c1c;
}
```

- [ ] **Step 3: Replace every other literal blue/violet occurrence in the file**

Make each of these edits (exact old → new substring; use `replace_all: true` where noted since the same literal appears more than once):

| Old substring | New substring | Notes |
|---|---|---|
| `outline: 2px solid #a9b7ff;` | `outline: 2px solid #3459ED;` | line 69 |
| `box-shadow: 0 10px 40px -10px rgba(93, 90, 254, 0.7);` | `box-shadow: 0 10px 40px -10px rgba(52, 89, 237, 0.7);` | line 73 |
| `box-shadow: 0 16px 50px -8px rgba(120, 90, 254, 0.85);` | `box-shadow: 0 16px 50px -8px rgba(52, 89, 237, 0.85);` | line 75 |
| `.hd-aurora.a1 { width: 620px; height: 620px; background: #3d5afe;` | `.hd-aurora.a1 { width: 620px; height: 620px; background: #3459ED;` | line 100 |
| `.hd-aurora.a2 { width: 520px; height: 520px; background: #8b5cf6;` | `.hd-aurora.a2 { width: 520px; height: 520px; background: #3459ED;` | line 101 |
| `.hd-aurora.a3 { width: 460px; height: 460px; background: #2a3cc4;` | `.hd-aurora.a3 { width: 460px; height: 460px; background: #3459ED;` | line 102 |
| `rgba(80, 70, 255, .55)` | `rgba(52, 89, 237, .55)` | line 124 |
| `box-shadow: 0 0 20px rgba(120, 90, 254, .6);` | `box-shadow: 0 0 20px rgba(52, 89, 237, .6);` | line 132 |
| `background: linear-gradient(180deg, #8b5cf6, #3d5afe);` | `background: #3459ED;` | line 141 — gradient removed |
| `background: rgba(139, 92, 246, .55);` | `background: rgba(52, 89, 237, .55);` | line 151 |
| `rgba(110, 90, 255, .22)` | `rgba(52, 89, 237, .22)` | line 171 |
| `rgba(110, 90, 255, .28)` | `rgba(52, 89, 237, .28)` | line 187 |
| `rgba(93, 90, 254, .12)` | `rgba(52, 89, 237, .12)` | lines 208 & 253 (identical) — `replace_all: true` |
| `border: 1px solid rgba(120, 110, 255, .25);` | `border: 1px solid rgba(52, 89, 237, .25);` | line 208 |
| `rgba(120, 90, 254, .55)` | `rgba(52, 89, 237, .55)` | line 238 |
| `rgba(110, 90, 255, .2)` | `rgba(52, 89, 237, .2)` | line 249 |
| `border: 1px solid rgba(120, 110, 255, .28);` | `border: 1px solid rgba(52, 89, 237, .28);` | line 253 |
| `background: radial-gradient(120% 120% at 0% 0%, rgba(93, 90, 254, .32), rgba(139, 92, 246, .08) 45%, rgba(255,255,255,.01)); border-color: rgba(130, 120, 255, .35);` | `background: radial-gradient(120% 120% at 0% 0%, rgba(52, 89, 237, .32), rgba(52, 89, 237, .08) 45%, rgba(255,255,255,.01)); border-color: rgba(52, 89, 237, .35);` | line 260 |
| `border-color: rgba(130, 120, 255, .45); background: rgba(93, 90, 254, .07);` | `border-color: rgba(52, 89, 237, .45); background: rgba(52, 89, 237, .07);` | line 283 |
| `background: rgba(93, 90, 254, .14);` | `background: rgba(52, 89, 237, .14);` | line 284 |
| `box-shadow: 0 40px 100px -40px rgba(90, 80, 255, .35);` | `box-shadow: 0 40px 100px -40px rgba(52, 89, 237, .35);` | line 288 |
| `border-bottom-color: #8b7bff;` | `border-bottom-color: #3459ED;` | line 296 |

- [ ] **Step 4: Remove `.hd-glow`'s spinning conic-gradient (no gradients, per brand)**

Old (lines 211–213):
```css
.hd-glow { position: relative; border-radius: 26px; padding: 1px; background: conic-gradient(from var(--ang, 0deg), #3d5afe, #8b5cf6, #1a1a2e 40%, #3d5afe); animation: hd-spin 9s linear infinite; }
@property --ang { syntax: '<angle>'; inherits: false; initial-value: 0deg; }
@keyframes hd-spin { to { --ang: 360deg; } }
```
New:
```css
.hd-glow { position: relative; border-radius: 26px; padding: 1px; background: #3459ED; }
```
(`@property --ang` and `@keyframes hd-spin` are deleted entirely — confirm nothing else in the file references `hd-spin` or `--ang` before deleting; per Review Focus, double-check `Home.jsx` doesn't reference either name either.)

- [ ] **Step 5: Replace every font-family literal**

| Old substring | New substring | Occurrences |
|---|---|---|
| `font-family: 'Playfair Display', Georgia, serif;` | `font-family: var(--font-heading);` | 3× (`.hd-serif`, `.hd-h2`, `.hd-h1`) — `replace_all: true` |
| `font-family: 'Playfair Display', serif;` | `font-family: var(--font-heading);` | 9× (`.hd-mobile a.hd-m-link`, `.hd-row-name`, `.hd-stat-n`, `.hd-hash strong`, `.hd-glow h3`, `.hd-mini b`, `.hd-step h3`, `.hd-feat h3`, `.hd-quad b`, `.hd-form h3` — count carefully, there are 10 total since `.hd-form h3` also matches) — `replace_all: true` |
| `font-family: 'Poppins', sans-serif;` | `font-family: var(--font-heading);` | 1× (`.hd-row-tag`) |

(The base `.hd` rule's `font-family` was already handled in Step 1.)

- [ ] **Step 6: Build and smoke-check**

```bash
cd web-express-app && npm run build
```
Expect a clean build with no CSS/JS errors.

- [ ] **Step 7: Visual check — Home, both themes**

Start the dev server (`npm run dev` from `web-express-app/client`, or serve the build), open `/`, and visually confirm: hero, aurora blobs, "código propio" glow card, timeline, stat numbers, buttons all render in flat Azul conexión (no gradient banding), headings render in Rubik (not serif), and toggling day/night shows Carbón (dark) / Blanco cálido (light) backgrounds. Check both themes — this is the file every later task's visual pattern is modeled on.

- [ ] **Step 8: Commit**

```bash
git add client/src/components/home-dark.css
git commit -m "Brand: aplica la nueva paleta y tipografía a Home"
```

---

## Task 3: `/web` (`LandingWebSistemas.jsx`)

**Files:**
- Modify: `web-express-app/client/src/components/LandingWebSistemas.jsx`

**Interfaces:**
- Consumes: `CARBON`, `CARBON_PANEL`, `BLANCO_CALIDO`, `BLANCO_CALIDO_PANEL`, `AZUL_CONEXION`, `AZUL_NIEBLA` from `../theme/brand`.

- [ ] **Step 1: Add the import**

After the existing `import ThemeLogo from '../theme/ThemeLogo'` line, add:
```js
import { CARBON, CARBON_PANEL, BLANCO_CALIDO, BLANCO_CALIDO_PANEL, AZUL_CONEXION, AZUL_NIEBLA } from '../theme/brand'
```

- [ ] **Step 2: Replace `DARK_T`/`LIGHT_T`**

Old:
```js
const DARK_T = {
    blue:   '#3d5afe',
    blueD:  '#2a3cc4',
    blueL:  'rgba(61,90,254,0.14)',
    black:  '#f5f5fa',
    dark:   '#d8d8e6',
    gray:   '#9a9ab0',
    muted:  '#75758c',
    light:  '#07070c',
    panel:  '#0c0c14',
    border: 'rgba(255,255,255,0.09)',
    white:  '#FFFFFF',
    green:  '#22c55e',
    greenL: 'rgba(34,197,94,0.12)',
    gold:   '#F59E0B',
}
const LIGHT_T = {
    blue:   '#2451c4',
    blueD:  '#1a3a8f',
    blueL:  'rgba(36,81,196,0.08)',
    black:  '#14141f',
    dark:   '#3a3a4a',
    gray:   '#5c5c72',
    muted:  '#6b6b80',
    light:  '#ffffff',
    panel:  '#f7f8fb',
    border: 'rgba(15,23,42,0.10)',
    white:  '#FFFFFF',
    green:  '#16a34a',
    greenL: 'rgba(22,163,74,0.10)',
    gold:   '#B45309',
}
```
New:
```js
const DARK_T = {
    blue:   AZUL_CONEXION,
    blueD:  AZUL_CONEXION,
    blueL:  'rgba(52,89,237,0.14)',
    black:  '#f5f5fa',
    dark:   '#d8d8e6',
    gray:   '#9a9ab0',
    muted:  '#75758c',
    light:  CARBON,
    panel:  CARBON_PANEL,
    border: 'rgba(255,255,255,0.09)',
    white:  '#FFFFFF',
    green:  '#22c55e',
    greenL: 'rgba(34,197,94,0.12)',
    gold:   '#F59E0B',
}
const LIGHT_T = {
    blue:   AZUL_CONEXION,
    blueD:  AZUL_CONEXION,
    blueL:  'rgba(52,89,237,0.08)',
    black:  '#14141f',
    dark:   '#3a3a4a',
    gray:   '#5c5c72',
    muted:  '#6b6b80',
    light:  BLANCO_CALIDO,
    panel:  BLANCO_CALIDO_PANEL,
    border: 'rgba(15,23,42,0.10)',
    white:  '#FFFFFF',
    green:  '#16a34a',
    greenL: 'rgba(22,163,74,0.10)',
    gold:   '#B45309',
}
```

- [ ] **Step 3: Flatten the 3 standalone gradients and 1 flat literal**

| Old substring | New substring |
|---|---|
| `background: 'linear-gradient(135deg, #1a2680 0%, #3d5afe 55%, #6a4bf5 100%)', padding: '68px 20px 80px'` | `background: AZUL_CONEXION, padding: '68px 20px 80px'` |
| `background: 'linear-gradient(135deg, #1a2680 0%, #3d5afe 55%, #6a4bf5 100%)', padding: '64px 20px'` | `background: AZUL_CONEXION, padding: '64px 20px'` |
| `background: 'linear-gradient(135deg, #07070c 0%, #14142a 100%)'` | `background: CARBON` |

(The first two rows disambiguate the HERO section, line 167, from the `#DigitalizandoChile` section, line 269 — both share the identical gradient string but different surrounding `padding`, which keeps each `old_string` unique.)

- [ ] **Step 4: Fix the mint `#A8FFEA` accent (3 occurrences)**

| Old | New |
|---|---|
| `<MapPin size={13} color="#A8FFEA" />` | `<MapPin size={13} color={AZUL_NIEBLA} />` |
| `<span style={{ fontSize: 12, fontWeight: 700, color: '#A8FFEA', letterSpacing: .5 }}>Para Pymes y Profesionales · Chile</span>` | `<span style={{ fontSize: 12, fontWeight: 700, color: AZUL_NIEBLA, letterSpacing: .5 }}>Para Pymes y Profesionales · Chile</span>` |
| `style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: '#A8FFEA', color: '#2a3cc4', fontWeight: 800, fontSize: 15, padding: '14px 32px', borderRadius: 40, textDecoration: 'none', boxShadow: '0 8px 24px rgba(0,0,0,.25)' }} className="wa-btn">` | `style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: '#FFFFFF', color: AZUL_CONEXION, fontWeight: 800, fontSize: 15, padding: '14px 32px', borderRadius: 40, textDecoration: 'none', boxShadow: '0 8px 24px rgba(0,0,0,.25)' }} className="wa-btn">` |

- [ ] **Step 5: Font-family**

| Old | New |
|---|---|
| `style={{ fontFamily: "'Poppins', system-ui, sans-serif", background: T.light, color: T.dark, overflowX: 'hidden' }}` | `style={{ fontFamily: 'var(--font-heading)', background: T.light, color: T.dark, overflowX: 'hidden' }}` |

- [ ] **Step 6: Build and visual check**

```bash
cd web-express-app && npm run build
```
Open `/web`, both themes — confirm hero and "digitalizando Chile" sections are flat blue (no gradient), CTA final section is flat Carbón, "Para Pymes y Profesionales" badge and kicker text read clearly in Azul niebla against the translucent pill.

- [ ] **Step 7: Commit**

```bash
git add client/src/components/LandingWebSistemas.jsx
git commit -m "Brand: aplica la nueva paleta y tipografía a /web"
```

---

## Task 4: Bloque SEO (`HomeSEOLocal.jsx`, `LandingSEOLocal.jsx`, `ServicioSEOLocal.jsx`)

**Files:**
- Modify: `web-express-app/client/src/components/seo/HomeSEOLocal.jsx`
- Modify: `web-express-app/client/src/components/seo/LandingSEOLocal.jsx`
- Modify: `web-express-app/client/src/components/seo/ServicioSEOLocal.jsx`

**Interfaces:**
- Consumes: `CARBON`, `CARBON_PANEL`, `BLANCO_CALIDO`, `BLANCO_CALIDO_PANEL`, `AZUL_CONEXION`, `AZUL_NIEBLA` from `../../theme/brand` (all 3 files, same relative path).

These 3 files are near-identical templates (each renders one city/service page; `HomeSEOLocal`→`/agencia/:ciudad` ×29, `LandingSEOLocal`→`/web/:ciudad` ×29, `ServicioSEOLocal`→`/servicios/*` ×3 — editing the one template file updates every page it renders).

- [ ] **Step 1: `HomeSEOLocal.jsx` — add import and replace `DARK_T`/`LIGHT_T`**

Add after `import ThemeLogo from '../../theme/ThemeLogo'`:
```js
import { CARBON, CARBON_PANEL, BLANCO_CALIDO, BLANCO_CALIDO_PANEL, AZUL_CONEXION } from '../../theme/brand'
```
Old:
```js
const DARK_T = {
  blue:  '#3d5afe',
  black: '#f5f5fa',
  gray:  '#9a9ab0',
  light: '#07070c',
  panel: '#0c0c14',
  white: '#FFFFFF',
  border:'rgba(255,255,255,0.09)',
}
const LIGHT_T = {
  blue:  '#2451c4',
  black: '#14141f',
  gray:  '#5c5c72',
  light: '#ffffff',
  panel: '#f7f8fb',
  white: '#FFFFFF',
  border:'rgba(15,23,42,0.10)',
}
```
New:
```js
const DARK_T = {
  blue:  AZUL_CONEXION,
  black: '#f5f5fa',
  gray:  '#9a9ab0',
  light: CARBON,
  panel: CARBON_PANEL,
  white: '#FFFFFF',
  border:'rgba(255,255,255,0.09)',
}
const LIGHT_T = {
  blue:  AZUL_CONEXION,
  black: '#14141f',
  gray:  '#5c5c72',
  light: BLANCO_CALIDO,
  panel: BLANCO_CALIDO_PANEL,
  white: '#FFFFFF',
  border:'rgba(15,23,42,0.10)',
}
```

- [ ] **Step 2: `HomeSEOLocal.jsx` — standalone literals**

This file has no `MapPin`+badge pattern (unlike `LandingSEOLocal.jsx`/`ServicioSEOLocal.jsx`) — just two section backgrounds and the CTA button:

| Old | New |
|---|---|
| `background: 'linear-gradient(135deg, #1212CC 0%, #2D2BB5 50%, #1A4FC4 100%)', padding: '60px 24px', textAlign: 'center'` | `background: AZUL_CONEXION, padding: '60px 24px', textAlign: 'center'` |
| `background: '#07070c', padding: '88px 24px', textAlign: 'center'` | `background: CARBON, padding: '88px 24px', textAlign: 'center'` |
| `style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: '#A8FFEA', color: '#1212CC', fontWeight: 800, fontSize: 15, padding: '14px 32px', borderRadius: 40, textDecoration: 'none', boxShadow: '0 8px 24px rgba(0,0,0,.25)' }}>` | `style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: '#FFFFFF', color: AZUL_CONEXION, fontWeight: 800, fontSize: 15, padding: '14px 32px', borderRadius: 40, textDecoration: 'none', boxShadow: '0 8px 24px rgba(0,0,0,.25)' }}>` |

- [ ] **Step 3: `HomeSEOLocal.jsx` — font-family**

| Old | New | Occurrences |
|---|---|---|
| `fontFamily: "'Poppins', system-ui, sans-serif"` | `fontFamily: 'var(--font-heading)'` | 1× |
| `fontFamily: 'Playfair Display, serif'` | `fontFamily: 'var(--font-heading)'` | 9× — `replace_all: true` |

- [ ] **Step 4: `LandingSEOLocal.jsx` — add import and replace `DARK_T`/`LIGHT_T`**

Add after `import ThemeLogo from '../../theme/ThemeLogo'`:
```js
import { CARBON, CARBON_PANEL, BLANCO_CALIDO, BLANCO_CALIDO_PANEL, AZUL_CONEXION, AZUL_NIEBLA } from '../../theme/brand'
```
Old:
```js
const DARK_T = {
  blue:  '#3d5afe',
  blueD: '#2a3cc4',
  blueL: 'rgba(61,90,254,0.14)',
  black: '#f5f5fa',
  gray:  '#9a9ab0',
  muted: '#75758c',
  light: '#07070c',
  panel: '#0c0c14',
  white: '#FFFFFF',
  border:'rgba(255,255,255,0.09)',
  green: '#22c55e',
}
const LIGHT_T = {
  blue:  '#2451c4',
  blueD: '#1a3a8f',
  blueL: 'rgba(36,81,196,0.08)',
  black: '#14141f',
  gray:  '#5c5c72',
  muted: '#6b6b80',
  light: '#ffffff',
  panel: '#f7f8fb',
  white: '#FFFFFF',
  border:'rgba(15,23,42,0.10)',
  green: '#16a34a',
}
```
New:
```js
const DARK_T = {
  blue:  AZUL_CONEXION,
  blueD: AZUL_CONEXION,
  blueL: 'rgba(52,89,237,0.14)',
  black: '#f5f5fa',
  gray:  '#9a9ab0',
  muted: '#75758c',
  light: CARBON,
  panel: CARBON_PANEL,
  white: '#FFFFFF',
  border:'rgba(255,255,255,0.09)',
  green: '#22c55e',
}
const LIGHT_T = {
  blue:  AZUL_CONEXION,
  blueD: AZUL_CONEXION,
  blueL: 'rgba(52,89,237,0.08)',
  black: '#14141f',
  gray:  '#5c5c72',
  muted: '#6b6b80',
  light: BLANCO_CALIDO,
  panel: BLANCO_CALIDO_PANEL,
  white: '#FFFFFF',
  border:'rgba(15,23,42,0.10)',
  green: '#16a34a',
}
```

- [ ] **Step 5: `LandingSEOLocal.jsx` — standalone literals and font**

| Old | New |
|---|---|
| `background: 'linear-gradient(135deg, #1212CC 0%, #2D2BB5 45%, #1A4FC4 100%)', padding: '72px 20px 88px'` | `background: AZUL_CONEXION, padding: '72px 20px 88px'` |
| `background: \`linear-gradient(135deg, #0A0A14 0%, #0F0F30 100%)\`` | `background: CARBON` |
| `<MapPin size={13} color="#A8FFEA" />` | `<MapPin size={13} color={AZUL_NIEBLA} />` |
| `<span style={{ fontSize: 12, fontWeight: 700, color: '#A8FFEA', letterSpacing: .5 }}>Desarrollo Web en {city.name} · {city.region}</span>` | same line with `color: AZUL_NIEBLA` |
| `fontFamily: "'Poppins', system-ui, sans-serif"` | `fontFamily: 'var(--font-heading)'` |

(No Playfair Display usage in this file, per the earlier audit.)

- [ ] **Step 6: `ServicioSEOLocal.jsx` — add import and replace `DARK_T`/`LIGHT_T`**

Add after `import ThemeLogo from '../../theme/ThemeLogo'`:
```js
import { CARBON, CARBON_PANEL, BLANCO_CALIDO, BLANCO_CALIDO_PANEL, AZUL_CONEXION, AZUL_NIEBLA } from '../../theme/brand'
```
Old:
```js
const DARK_T = {
  blue:  '#3d5afe',
  blueD: '#2a3cc4',
  blueL: 'rgba(61,90,254,0.14)',
  black: '#f5f5fa',
  gray:  '#9a9ab0',
  muted: '#75758c',
  light: '#07070c',
  panel: '#0c0c14',
  white: '#FFFFFF',
  border:'rgba(255,255,255,0.09)',
  green: '#22c55e',
}
const LIGHT_T = {
  blue:  '#2451c4',
  blueD: '#1a3a8f',
  blueL: 'rgba(36,81,196,0.08)',
  black: '#14141f',
  gray:  '#5c5c72',
  muted: '#6b6b80',
  light: '#ffffff',
  panel: '#f7f8fb',
  white: '#FFFFFF',
  border:'rgba(15,23,42,0.10)',
  green: '#16a34a',
}
```
New: identical to `LandingSEOLocal.jsx`'s new block in Step 4 (same old shape, same new mapping) — apply the same replacement.

- [ ] **Step 7: `ServicioSEOLocal.jsx` — standalone literals and font**

| Old | New |
|---|---|
| `background: 'linear-gradient(135deg, #1212CC 0%, #2D2BB5 45%, #1A4FC4 100%)', padding: '72px 20px 88px'` | `background: AZUL_CONEXION, padding: '72px 20px 88px'` |
| `background: \`linear-gradient(135deg, #0A0A14 0%, #0F0F30 100%)\`` | `background: CARBON` |
| `<span style={{ fontSize: 12, fontWeight: 700, color: '#A8FFEA', letterSpacing: .5 }}>{service.kicker} · Empresas en todo Chile</span>` | same line with `color: AZUL_NIEBLA` |
| `fontFamily: "'Poppins', system-ui, sans-serif"` | `fontFamily: 'var(--font-heading)'` |

(No `MapPin` icon with `#A8FFEA` in this file — only the span. No Playfair Display usage.)

- [ ] **Step 8: Build and visual check**

```bash
cd web-express-app && npm run build
```
Open one page from each family — e.g. `/agencia/talca`, `/web/talca`, `/servicios/sistemas-de-gestion` — in both themes. Confirm hero/CTA-final flat colors, badge legibility, and Rubik headings.

- [ ] **Step 9: Commit**

```bash
git add client/src/components/seo/HomeSEOLocal.jsx client/src/components/seo/LandingSEOLocal.jsx client/src/components/seo/ServicioSEOLocal.jsx
git commit -m "Brand: aplica la nueva paleta y tipografía al bloque SEO (agencia/:ciudad, web/:ciudad, servicios/*)"
```

---

## Task 5: Embudo `/sitio-web`

**Files:**
- Modify: `web-express-app/client/src/components/landing/palette.js`
- Modify: `web-express-app/client/src/components/landing/sitio-web-dark.css`
- Modify: `web-express-app/client/src/components/landing/SitioWebLanding.jsx`
- Modify: `web-express-app/client/src/components/landing/ReceiptAnimation.jsx`
- Modify: `web-express-app/client/src/components/landing/SitioWebConfirmacion.jsx`
- Modify: `web-express-app/client/src/components/landing/SitioWebWizard.jsx`

**Interfaces:**
- Consumes: `CARBON`, `CARBON_PANEL`, `CARBON_PANEL_2`, `BLANCO_CALIDO`, `BLANCO_CALIDO_PANEL`, `BLANCO_CALIDO_PANEL_2`, `AZUL_CONEXION`, `AZUL_NIEBLA` from `../../theme/brand` (all 4 `.jsx` files here are 2 levels deep, same relative path).
- `ReceiptAnimation.jsx`, `SitioWebConfirmacion.jsx`, `SitioWebWizard.jsx` import `DARK_T`/`LIGHT_T` (and other constants) from `SitioWebLanding.jsx` directly — editing `SitioWebLanding.jsx`'s `DARK_T`/`LIGHT_T` in Step 3 automatically cascades to all three without touching their own color code.

- [ ] **Step 1: `palette.js` — add import and replace `DARK_FP`/`LIGHT_FP`**

Add as the first line of the file:
```js
import { CARBON, CARBON_PANEL, CARBON_PANEL_2, BLANCO_CALIDO, BLANCO_CALIDO_PANEL, BLANCO_CALIDO_PANEL_2, AZUL_CONEXION, AZUL_NIEBLA } from '../../theme/brand'
```
Old:
```js
export const DARK_FP = {
  red:    '#C8302A',
  redD:   '#9E241F',
  blue:   '#2451C4',
  blueD:  '#7d93ff',
  cream:  '#000000',
  panel:  '#0c0c14',
  ink:    '#191A22',
  text:   '#f5f5fa',
  grayTx: '#9a9ab0',
  grayLt: '#6e6e85',
  border: 'rgba(255,255,255,0.09)',
  tint:   'rgba(255,255,255,0.05)',
}

export const LIGHT_FP = {
  red:    '#C8302A',
  redD:   '#9E241F',
  blue:   '#2451C4',
  blueD:  '#1a3a8f',
  cream:  '#ffffff',
  panel:  '#f7f8fb',
  ink:    '#eef0f6',
  text:   '#14141f',
  grayTx: '#5c5c72',
  grayLt: '#6b6b80',
  border: 'rgba(15,23,42,0.10)',
  tint:   'rgba(15,23,42,0.035)',
}
```
New:
```js
export const DARK_FP = {
  red:    '#C8302A',
  redD:   '#9E241F',
  blue:   AZUL_CONEXION,
  blueD:  AZUL_NIEBLA,
  cream:  CARBON,
  panel:  CARBON_PANEL,
  ink:    CARBON_PANEL_2,
  text:   '#f5f5fa',
  grayTx: '#9a9ab0',
  grayLt: '#6e6e85',
  border: 'rgba(255,255,255,0.09)',
  tint:   'rgba(255,255,255,0.05)',
}

export const LIGHT_FP = {
  red:    '#C8302A',
  redD:   '#9E241F',
  blue:   AZUL_CONEXION,
  blueD:  AZUL_CONEXION,
  cream:  BLANCO_CALIDO,
  panel:  BLANCO_CALIDO_PANEL,
  ink:    BLANCO_CALIDO_PANEL_2,
  text:   '#14141f',
  grayTx: '#5c5c72',
  grayLt: '#6b6b80',
  border: 'rgba(15,23,42,0.10)',
  tint:   'rgba(15,23,42,0.035)',
}
```

- [ ] **Step 2: `sitio-web-dark.css` — flatten blue/violet literals**

| Old | New |
|---|---|
| `.swl {\n  --grad: linear-gradient(120deg, #3d5afe 0%, #8b5cf6 100%);\n}` | `.swl {\n  --grad: #3459ED;\n}` |
| `.swl-aurora.a1 { width: 520px; height: 520px; background: #3d5afe;` | `.swl-aurora.a1 { width: 520px; height: 520px; background: #3459ED;` |
| `.swl-aurora.a2 { width: 420px; height: 420px; background: #8b5cf6;` | `.swl-aurora.a2 { width: 420px; height: 420px; background: #3459ED;` |
| `rgba(61,90,254,.16)` | `rgba(52,89,237,.16)` |

- [ ] **Step 3: `SitioWebLanding.jsx` — flatten the 2 standalone gradients and replace fonts**

| Old | New |
|---|---|
| `` `linear-gradient(135deg, ${FP.blueD} 0%, ${FP.blue} 100%)` `` (upsell section, `Section style={{ background: ... }}`) | `FP.blue` |
| `` `linear-gradient(150deg, ${FP.blueD} 0%, ${FP.blue} 100%)` `` (CTA final section) | `FP.blue` |
| `fontFamily: "'Oswald', sans-serif"` | `fontFamily: 'var(--font-heading)'` — appears 12×, `replace_all: true` |
| `fontFamily: "'Poppins', system-ui, sans-serif"` | `fontFamily: 'var(--font-heading)'` — 1× (root div) |

(Double-check the two gradient lines use different `deg` values — `135deg` for upsell, `150deg` for CTA final — so each `old_string` above is unique as written.)

- [ ] **Step 4: `ReceiptAnimation.jsx` — flatten the navy gradient**

Old:
```js
position: 'relative', zIndex: 2, background: `linear-gradient(180deg, ${T.navy2 || '#12134A'} 0%, ${T.navy} 100%)`,
```
New:
```js
position: 'relative', zIndex: 2, background: T.navy,
```
No other edits needed in this file — `T.violet`, `T.cyan`, `T.navy` used elsewhere in the file all cascade automatically from Step 1's `DARK_T`/`LIGHT_T` change... wait, this file imports from `SitioWebLanding.jsx`, not `palette.js` — confirm the import line still reads `import { DARK_T, LIGHT_T, fmt } from './SitioWebLanding'` (unchanged) and that `SitioWebLanding.jsx`'s own separate `DARK_T`/`LIGHT_T` export (not `DARK_FP`/`LIGHT_FP` from `palette.js`) is the one edited in Step 5 below.

- [ ] **Step 5: `SitioWebLanding.jsx` — replace its OWN separate `DARK_T`/`LIGHT_T` export (distinct from `palette.js`'s `DARK_FP`/`LIGHT_FP`)**

Add after the existing `import { DARK_FP, LIGHT_FP } from './palette'` line:
```js
import { CARBON, CARBON_PANEL, BLANCO_CALIDO, BLANCO_CALIDO_PANEL, AZUL_CONEXION } from '../../theme/brand'
```
Old:
```js
export const DARK_T = {
  navy:   '#0A0B2E',
  navy2:  '#141650',
  violet: '#6C2BD9',
  violetD:'#4B1D9E',
  cyan:   '#22F2D8',
  white:  '#FFFFFF',
  black:  '#f5f5fa',
  ink:    '#f5f5fa',
  gray:   '#9a9ab0',
  grayLt: '#75758c',
  light:  '#000000',
  panel:  '#0c0c14',
  border: 'rgba(255,255,255,0.09)',
}
export const LIGHT_T = {
  navy:   '#0A0B2E',
  navy2:  '#141650',
  violet: '#6C2BD9',
  violetD:'#4B1D9E',
  cyan:   '#22F2D8',
  white:  '#FFFFFF',
  black:  '#14141f',
  ink:    '#14141f',
  gray:   '#5c5c72',
  grayLt: '#6b6b80',
  light:  '#ffffff',
  panel:  '#f7f8fb',
  border: 'rgba(15,23,42,0.10)',
}
```
New:
```js
export const DARK_T = {
  navy:   CARBON,
  navy2:  CARBON,
  violet: AZUL_CONEXION,
  violetD:AZUL_CONEXION,
  cyan:   AZUL_CONEXION,
  white:  '#FFFFFF',
  black:  '#f5f5fa',
  ink:    '#f5f5fa',
  gray:   '#9a9ab0',
  grayLt: '#75758c',
  light:  CARBON,
  panel:  CARBON_PANEL,
  border: 'rgba(255,255,255,0.09)',
}
export const LIGHT_T = {
  navy:   CARBON,
  navy2:  CARBON,
  violet: AZUL_CONEXION,
  violetD:AZUL_CONEXION,
  cyan:   AZUL_CONEXION,
  white:  '#FFFFFF',
  black:  '#14141f',
  ink:    '#14141f',
  gray:   '#5c5c72',
  grayLt: '#6b6b80',
  light:  BLANCO_CALIDO,
  panel:  BLANCO_CALIDO_PANEL,
  border: 'rgba(15,23,42,0.10)',
}
```
(Note `navy`/`navy2` are now both `CARBON` — intentional, since the gradient that differentiated them in `ReceiptAnimation.jsx` was flattened in Step 4. `light`/`panel` *do* still vary by theme, unlike `navy`/`navy2`/`violet`/`cyan`, which stay literal across both themes exactly as they did before.)

- [ ] **Step 6: `SitioWebConfirmacion.jsx` — font-family only**

| Old | New | Occurrences |
|---|---|---|
| `fontFamily: "'Poppins', system-ui, sans-serif"` | `fontFamily: 'var(--font-heading)'` | 1× |
| `fontFamily: "'Playfair Display', serif"` | `fontFamily: 'var(--font-heading)'` | 4× — `replace_all: true` |

Leave the hardcoded `<img src="/logo-dark.png" .../>` on line 105 untouched (pre-existing behavior, out of scope — see Review Focus).

- [ ] **Step 7: `SitioWebWizard.jsx` — font-family only**

| Old | New | Occurrences |
|---|---|---|
| `fontFamily: "'Poppins', system-ui, sans-serif"` | `fontFamily: 'var(--font-heading)'` | 1× |
| `fontFamily: "'Playfair Display', serif"` | `fontFamily: 'var(--font-heading)'` | 2× — `replace_all: true` |

Leave the hardcoded `<img src="/logo-dark.png" .../>` on line 430 untouched (same reason as Step 6).

- [ ] **Step 8: Build and visual check**

```bash
cd web-express-app && npm run build
```
Walk `/sitio-web` end to end in both themes: hero, price card, upsell section, CTA final (all flat blue, not gradient), then open `/sitio-web/formulario` (wizard — all 7 steps use flat Azul conexión for buttons/accents, no cyan/violet left), and finally check the receipt animation either by completing a test submission or by temporarily visiting `/sitio-web/confirmacion?status=approved&orderId=test` if that route renders without a real backend order (otherwise, visually inspect `ReceiptAnimation.jsx`'s rendered output via the wizard flow) — confirm the printer body is flat Carbón (no navy gradient) and the "Total" amount uses flat Azul conexión instead of cyan.

- [ ] **Step 9: Commit**

```bash
git add client/src/components/landing/palette.js client/src/components/landing/sitio-web-dark.css \
  client/src/components/landing/SitioWebLanding.jsx client/src/components/landing/ReceiptAnimation.jsx \
  client/src/components/landing/SitioWebConfirmacion.jsx client/src/components/landing/SitioWebWizard.jsx
git commit -m "Brand: aplica la nueva paleta y tipografía al embudo /sitio-web"
```

---

## Task 6: Sueltos (`Links.jsx`, `LegalPage.jsx`, `CookieConsent.jsx`, `AccessibilityWidget.jsx`)

**Files:**
- Modify: `web-express-app/client/src/components/Links.jsx`
- Modify: `web-express-app/client/src/components/legal/LegalPage.jsx`
- Modify: `web-express-app/client/src/components/legal/CookieConsent.jsx`
- Modify: `web-express-app/client/src/a11y/AccessibilityWidget.jsx`
- Modify: `web-express-app/client/src/a11y/accessibility.css`

**Interfaces:**
- Consumes: `CARBON`, `BLANCO_CALIDO`, `AZUL_CONEXION` from `../theme/brand` (`Links.jsx`, `AccessibilityWidget.jsx` — 1 level deep) or `../../theme/brand` (`LegalPage.jsx`, `CookieConsent.jsx` — 2 levels deep). `AZUL_NIEBLA` additionally needed in `CookieConsent.jsx`.

- [ ] **Step 1: `Links.jsx` — add import and replace `DARK_T`/`LIGHT_T`**

Add after `import ThemeLogo from '../theme/ThemeLogo'`:
```js
import { CARBON, BLANCO_CALIDO, AZUL_CONEXION } from '../theme/brand'
```
Old:
```js
const DARK_T = {
    blue:   '#3d5afe',
    violet: '#8b5cf6',
    yellow: '#FACC15',
    black:  '#0A0A0A',
    white:  '#FFFFFF',
    ink:        '#FFFFFF',
    mut1:       'rgba(255,255,255,0.45)',
    mut2:       'rgba(255,255,255,0.3)',
    mut3:       'rgba(255,255,255,0.2)',
    pageBg:     '#000000',
    cardBg:     'rgba(255,255,255,0.05)',
    cardBorder: 'rgba(255,255,255,0.08)',
    outlineBg:     'rgba(255,255,255,0.06)',
    outlineBorder: 'rgba(255,255,255,0.12)',
    iconBgOutline: 'rgba(255,255,255,0.1)',
}
const LIGHT_T = {
    blue:   '#2451c4',
    violet: '#7c3aed',
    yellow: '#B45309',
    black:  '#0A0A0A',
    white:  '#FFFFFF',
    ink:        '#14141f',
    mut1:       'rgba(15,15,30,0.55)',
    mut2:       'rgba(15,15,30,0.4)',
    mut3:       'rgba(15,15,30,0.32)',
    pageBg:     '#ffffff',
    cardBg:     'rgba(15,15,30,0.035)',
    cardBorder: 'rgba(15,15,30,0.1)',
    outlineBg:     'rgba(15,15,30,0.035)',
    outlineBorder: 'rgba(15,15,30,0.12)',
    iconBgOutline: 'rgba(15,15,30,0.06)',
}
```
New:
```js
const DARK_T = {
    blue:   AZUL_CONEXION,
    violet: AZUL_CONEXION,
    yellow: '#FFFFFF',
    black:  '#0A0A0A',
    white:  '#FFFFFF',
    ink:        '#FFFFFF',
    mut1:       'rgba(255,255,255,0.45)',
    mut2:       'rgba(255,255,255,0.3)',
    mut3:       'rgba(255,255,255,0.2)',
    pageBg:     CARBON,
    cardBg:     'rgba(255,255,255,0.05)',
    cardBorder: 'rgba(255,255,255,0.08)',
    outlineBg:     'rgba(255,255,255,0.06)',
    outlineBorder: 'rgba(255,255,255,0.12)',
    iconBgOutline: 'rgba(255,255,255,0.1)',
}
const LIGHT_T = {
    blue:   AZUL_CONEXION,
    violet: AZUL_CONEXION,
    yellow: '#FFFFFF',
    black:  '#0A0A0A',
    white:  '#FFFFFF',
    ink:        '#14141f',
    mut1:       'rgba(15,15,30,0.55)',
    mut2:       'rgba(15,15,30,0.4)',
    mut3:       'rgba(15,15,30,0.32)',
    pageBg:     BLANCO_CALIDO,
    cardBg:     'rgba(15,15,30,0.035)',
    cardBorder: 'rgba(15,15,30,0.1)',
    outlineBg:     'rgba(15,15,30,0.035)',
    outlineBorder: 'rgba(15,15,30,0.12)',
    iconBgOutline: 'rgba(15,15,30,0.06)',
}
```

- [ ] **Step 2: `Links.jsx` — remove the 2 now-degenerate gradients**

| Old | New |
|---|---|
| `primary: { ...base, background: \`linear-gradient(120deg, ${T.blue}, ${T.violet})\`, color: T.white, border: 'none' },` | `primary: { ...base, background: T.blue, color: T.white, border: 'none' },` |
| `background: \`linear-gradient(135deg, ${T.blue}, ${T.violet})\`,\n                    border: \`1px solid ${T.blue}50\`,` | `background: T.blue,\n                    border: \`1px solid ${T.blue}50\`,` |

- [ ] **Step 3: `Links.jsx` — font-family**

| Old | New | Occurrences |
|---|---|---|
| `fontFamily: 'Poppins, sans-serif',` | `fontFamily: 'var(--font-heading)',` | 2× — `replace_all: true` |

- [ ] **Step 4: `LegalPage.jsx` — add import and replace token object**

Add after `import { ArrowLeft } from 'lucide-react'`:
```js
import { CARBON, CARBON_PANEL, AZUL_CONEXION } from '../../theme/brand'
```
Old:
```js
const C = {
  blue: '#3d5afe',
  black: '#f5f5fa',
  gray: '#9a9ab0',
  light: '#000000',
  panel: '#0c0c14',
  border: 'rgba(255,255,255,0.09)',
}
```
New:
```js
const C = {
  blue: AZUL_CONEXION,
  black: '#f5f5fa',
  gray: '#9a9ab0',
  light: CARBON,
  panel: CARBON_PANEL,
  border: 'rgba(255,255,255,0.09)',
}
```

- [ ] **Step 5: `LegalPage.jsx` — font-family**

| Old | New |
|---|---|
| `fontFamily: "'Poppins', system-ui, sans-serif"` | `fontFamily: 'var(--font-heading)'` |
| `fontFamily: "'Playfair Display', serif"` | `fontFamily: 'var(--font-heading)'` |

- [ ] **Step 6: `CookieConsent.jsx` — add import and replace all literals**

Add after `import { Link } from 'react-router-dom'`:
```js
import { CARBON, AZUL_CONEXION, AZUL_NIEBLA } from '../../theme/brand'
```
Old:
```js
      background: '#0A0A0A', color: '#EDEDED', borderRadius: 14,
```
New:
```js
      background: CARBON, color: '#EDEDED', borderRadius: 14,
```
Old:
```js
        <Link to="/politica-privacidad" style={{ color: '#8FD9FF', textDecoration: 'underline' }}>Política de Privacidad</Link>.
```
New:
```js
        <Link to="/politica-privacidad" style={{ color: AZUL_NIEBLA, textDecoration: 'underline' }}>Política de Privacidad</Link>.
```
Old:
```js
      <button onClick={accept} style={{
        flexShrink: 0, background: '#22F2D8', color: '#0A0A0A', fontWeight: 800, fontSize: 13,
```
New:
```js
      <button onClick={accept} style={{
        flexShrink: 0, background: AZUL_CONEXION, color: '#F6F5F0', fontWeight: 800, fontSize: 13,
```

- [ ] **Step 7: `CookieConsent.jsx` — font-family**

| Old | New |
|---|---|
| `fontFamily: "'Poppins', system-ui, sans-serif",` | `fontFamily: 'var(--font-heading)',` |

- [ ] **Step 8: `AccessibilityWidget.jsx` — add import and replace `PANEL`**

Add after `import { useAccessibility } from './AccessibilityContext'`:
```js
import { BLANCO_CALIDO, AZUL_CONEXION } from '../theme/brand'
```
Old:
```js
const PANEL = {
  bg: '#ffffff',
  ink: '#14141f',
  mut: '#6b6b80',
  border: '#e4e5ec',
  blue: '#2451c4',
  blueL: 'rgba(36,81,196,0.08)',
}
```
New:
```js
const PANEL = {
  bg: BLANCO_CALIDO,
  ink: '#14141f',
  mut: '#6b6b80',
  border: '#e4e5ec',
  blue: AZUL_CONEXION,
  blueL: 'rgba(52,89,237,0.08)',
}
```

- [ ] **Step 9: `AccessibilityWidget.jsx` — flatten the 2 gradients**

| Old | New |
|---|---|
| `background: 'linear-gradient(135deg, #3d5afe, #2451c4)', color: '#fff',` | `background: AZUL_CONEXION, color: '#fff',` |
| `<div style={{ background: 'linear-gradient(135deg, #3d5afe, #2451c4)', padding: '16px 20px', borderRadius: '20px 20px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>` | `<div style={{ background: AZUL_CONEXION, padding: '16px 20px', borderRadius: '20px 20px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>` |

(Two distinct lines — the button and the panel header — both currently share the identical gradient string; the surrounding context in each `old_string` above keeps them unique.)

- [ ] **Step 10: `accessibility.css` — font-family**

Old:
```css
#agenciasi-a11y-widget,
#agenciasi-a11y-widget * {
  font-family: 'Poppins', system-ui, sans-serif !important;
```
New:
```css
#agenciasi-a11y-widget,
#agenciasi-a11y-widget * {
  font-family: var(--font-heading) !important;
```

- [ ] **Step 11: Build and visual check**

```bash
cd web-express-app && npm run build
```
Check `/links` (both themes — note the page bg itself now reads Carbón/Blanco-cálido instead of pure black/white), one `/legal/*` page, the cookie consent banner (first visit, or clear `localStorage.agenciasi_cookie_consent`), and the accessibility widget (bottom-right floating icon — button and panel header should be flat Azul conexión, not a blue→darker-blue gradient).

- [ ] **Step 12: Commit**

```bash
git add client/src/components/Links.jsx client/src/components/legal/LegalPage.jsx \
  client/src/components/legal/CookieConsent.jsx client/src/a11y/AccessibilityWidget.jsx \
  client/src/a11y/accessibility.css
git commit -m "Brand: aplica la nueva paleta y tipografía a Links, legal, cookies y accesibilidad"
```

---

## Task 7: Build, limpieza de dist/, despliegue y verificación final

**Files:**
- Modify: `web-express-app/dist/**` (rebuilt output, committed separately per this repo's established deploy pattern)

- [ ] **Step 1: Full production build**

```bash
cd web-express-app && npm run build
```
Expect a clean build. If it fails, fix the reported file before continuing — do not proceed with a broken build.

- [ ] **Step 2: Clean stray iCloud sync-conflict files from `dist/`**

```bash
find web-express-app/dist -depth \( -iname "* 2" -o -iname "* 2.*" \) -exec rm -rf {} \;
```

- [ ] **Step 3: Commit the rebuilt `dist/`**

```bash
git add web-express-app/dist
git commit -m "Build: rebuild dist con la nueva línea gráfica (paleta, tipografía, logo)"
```

- [ ] **Step 4: Push**

```bash
git push origin main
```

- [ ] **Step 5: Wait for Hostinger to serve the new build, then verify live**

Poll the live site for the new JS asset hash (same pattern used in prior deploys this session), then use Playwright to check, in both light and dark mode: `/` (Home), `/web`, one `/web/:ciudad` page, one `/agencia/:ciudad` page, one `/servicios/*` page, `/sitio-web`, `/links`, one `/legal/*` page. Confirm: no leftover `#3d5afe`/`#8b5cf6`-family blue or any gradient background anywhere, the favicon tab icon shows the new isotipo, the header/footer logo shows the icon+"AgenciaSi" lockup, and all headings render in Rubik.

- [ ] **Step 6: Report back**

Summarize what shipped, any visual issues found and fixed during verification, and confirm the deploy is live.
