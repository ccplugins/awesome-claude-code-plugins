# Self-Contained HTML Mockup Recipe

> Zero external dependencies, inline CSS/SVG only. Just open it in a browser and it renders. Build with `Write`, deliver with `SendUserFile`.

---

## 1. Skeleton (copy-paste starting point)

```html
<!doctype html>
<html lang="en"><head><meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>Issue #NNN · Mockup</title>
<style>
  :root{
    /* Approximate project theme tokens — confirm against the real themes.css values and fill in */
    --background:#fff; --card:#fff; --muted:#f4f4f5;
    --foreground:#0a0a0b; --muted-foreground:#71717a; --border:#e9e9ec;
    --primary:#2563eb;   /* primary action only */
  }
  *{box-sizing:border-box}
  body{margin:0;background:#ececed;color:var(--foreground);
    font-family:-apple-system,BlinkMacSystemFont,"Pretendard","Segoe UI",Roboto,sans-serif}
  .num{font-variant-numeric:tabular-nums;letter-spacing:-.02em}  /* always for numbers */
</style></head>
<body><!-- content --></body></html>
```

---

## 2. Phone Frame (mobile mockup)

```css
.phone{width:300px;aspect-ratio:300/640;background:var(--background);
  border-radius:40px;border:1px solid var(--border);overflow:hidden;position:relative;
  display:flex;flex-direction:column;box-shadow:0 10px 30px rgba(0,0,0,.07)}
.statusbar{height:30px;display:flex;justify-content:space-between;align-items:center;
  padding:0 18px;font-size:11px;font-weight:700}
.sheet{position:absolute;left:0;right:0;bottom:0;background:var(--card);
  border-radius:24px 24px 0 0;border-top:1px solid var(--border);
  box-shadow:0 -8px 30px -12px rgba(0,0,0,.18);padding:0 16px}     /* floating layer */
.grip{height:6px;width:48px;border-radius:999px;background:rgba(113,113,122,.4);margin:8px auto}
```
- Place **multiple phones side by side, one per state** (collapsed/expanded, etc.).
- Lay the background content as a blurred placeholder (`opacity:.4` gray blocks) to sell the "sheet floating above" effect.

---

## 3. Inline SVG Charts (no chart libraries)

**Sparkline (line)**:
```html
<svg viewBox="0 0 120 32" preserveAspectRatio="none" style="width:120px;height:32px">
  <polyline points="0,28 24,24 48,16 72,18 96,9 120,4"
    fill="none" stroke="#0a0a0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="120" cy="4" r="2.6" fill="#0a0a0b"/>
</svg>
```
**Area (gradient fill)**:
```html
<svg viewBox="0 0 240 56" preserveAspectRatio="none">
  <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#0a0a0b" stop-opacity=".14"/>
    <stop offset="1" stop-color="#0a0a0b" stop-opacity="0"/></linearGradient></defs>
  <path d="M0,42 L40,37 L120,23 L240,7 L240,56 L0,56 Z" fill="url(#g)"/>
  <polyline points="0,42 40,37 120,23 240,7" fill="none" stroke="#0a0a0b" stroke-width="2"/>
</svg>
```
**Bars**: use `flex` + height %. Emphasize today only with `background:var(--foreground)`.

> Real implementations also often use inline SVG components (e.g. `Sparkline.tsx`) instead of a chart library, so the mockup's SVG doubles as an implementation hint.

---

## 4. Big Number + Change Rate (monotone emphasis)

```html
<div class="c" style="text-align:center">
  <div class="num" style="font-size:30px;font-weight:850;line-height:1">1,284</div>
  <div style="font-size:10.5px;color:var(--muted-foreground);font-weight:700">Visitors</div>
  <div class="num" style="font-size:10px;font-weight:800;color:var(--foreground)">▲24%</div>
</div>
```
- Emphasis = **size and weight** (not color). Reserve blue for the primary action button.
- Change rate = `▲`/`▼` glyphs. Increases bold (`text-foreground`), decreases dimmed (`muted`). (Or, if the user prefers, a soft green/red.)

---

## 5. Comparing Variants (A/B) + Empty State

- Put **2–3 layout variants** side by side on one page, with 2 lines of rationale under each.
- Include the **empty/initial state** as a separate phone (a new user with zero data). Use an action-driving CTA like "Waiting for your first ~ · Share".

---

## 6. Keep/New/Changed Color Tags (AS-IS/TO-BE)

```css
.hl-new{outline:2px solid #86efac;outline-offset:3px;border-radius:14px}  /* new */
.hl-chg{outline:2px solid #fcd34d;outline-offset:3px;border-radius:14px}  /* changed */
/* keep: no outline */
```
Show the legend as chips at the top of the page.

---

## 7. Preview (optional) & Delivery

- If possible, screenshot via a local server:
  ```bash
  cd {folder} && (python3 -m http.server 8777 &)   # http://localhost:8777/file.html
  ```
  Note that browser automation frequently blocks or times out on `file://` → **if it doesn't work, just deliver the file**.
- **Delivery**: send the `.html` file with `SendUserFile` (the user opens it directly in a browser).

---

## 8. Versioning

- Version in the filename: `mobile-bottom-...-v2.html`, `-v3.html`, …
- New version per round of feedback. The bigger the directional shift (layout correction, etc.), the more reason to keep the previous version for comparison.
