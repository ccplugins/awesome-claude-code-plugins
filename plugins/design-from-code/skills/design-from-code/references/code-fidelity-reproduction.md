# Faithfully Reproducing Real Components (Code-Fidelity Reproduction)

> The heart of this skill. Accuracy "matching the current design" comes from **reading the actual source code, not from Playwright captures**.
> Goal: make the mockup HTML **look identical to the real component — down to the icons, labels, spacing, and colors**.

---

## 0. Why read the code (not Playwright)

- A screenshot only gives you "the visible result." **Class names, conditional rendering, per-state branches, and exact labels** live only in the code.
- Live-app captures (Playwright) depend on the environment (server boot, login, viewport), so they break often. In fact, on this task Playwright failed entirely with timeouts, and the **pixel-matching mockup was built from source reading alone**.
- Conclusion: **Priority #1 = reading the source.** A real Playwright capture is a supplementary aid for *verification/comparison* (nice to have, but optional).

---

## 1. Procedure (5 steps)

### STEP 1 — Find the component file
```bash
find app/src -iname "*BrandStudio*"            # candidate files
grep -rln "하단바\|BottomBar\|StudioBar" app/src
```

### STEP 2 — Grasp the render function / structural skeleton
A component usually draws repeated UI through small `renderXxx` helpers. Find these first.
```bash
grep -n "renderSeg\|renderProfile\|leftSegs\|rightSegs\|ModuleCard\|return (" \
  app/src/components/mobile/MobileBottomBar.tsx | head
```
→ You get a skeleton like "peek is `leftSegs.map(renderSeg)` + ＋FAB + `rightSegs.map(renderSeg)`."

### STEP 3 — Read the render function body closely (★core)
Use `sed` to read the function body verbatim and extract its **Tailwind classes, icons, labels, and conditional styles**.
```bash
sed -n '/const renderSeg/,/^  );$/p' \
  app/src/components/mobile/MobileBottomBar.tsx
```
What this actually yields:
```tsx
const renderSeg = (s) => (
  <button className={cn(
    'flex flex-1 flex-col items-center gap-0.5 rounded-xl py-1.5 text-[10px]',
    s.active ? 'font-bold text-foreground' : 'font-medium text-muted-foreground'  // ← active = weight, not color
  )}>
    <s.icon className="h-5 w-5" strokeWidth={s.active ? 2.5 : 2} />               // ← icon size/weight
    <span className="truncate">{s.label}</span>
  </button>
);
```
→ **Facts read off**: vertical layout (icon on top, label below), icon `h-5 w-5`, text `text-[10px]`, **no background/color — only active gets `font-bold text-foreground`** (monotone), rounded `rounded-xl`.

### STEP 4 — Confirm exact labels, icons, and defaults
If labels are i18n, get the actual strings from the locale; if they're slot defaults, confirm them in the constants.
```bash
grep -n "DEFAULT_PEEK_SLOTS\|EDITABLE_KEYS" .../MobileBottomBar.tsx
sed -n '52,60p' app/src/locales/ko/bottomBar.json    # actual labels
```
→ peek defaults = `글·캘린더·＋·통계·프로필` (Posts · Calendar · ＋ · Stats · Profile), module titles = "최근 글" (Recent posts) · "이번 주" (This week), footer = `ABOUT|PRIVACY|TERMS`.
**Never invent labels here.** Use only the actual strings.

### STEP 5 — Translate 1:1 into HTML/CSS
Map Tailwind classes to CSS of the same meaning. Use the **class → CSS mapping cheat sheet** (§2 below).
```html
<!-- renderSeg → HTML -->
<div class="seg on"><svg .../>글</div>
<style>
  .seg{flex:1;display:flex;flex-direction:column;align-items:center;gap:2px;
       border-radius:12px;padding:5px 0;font-size:10px;font-weight:500;color:var(--muted-foreground)}
  .seg.on{font-weight:800;color:var(--foreground)}   /* active = weight, not color — straight from the code */
  .seg svg{width:20px;height:20px;stroke:currentColor;fill:none;stroke-width:2}
</style>
```

---

## 2. Tailwind → CSS mapping cheat sheet

| Tailwind | CSS |
|---|---|
| `flex flex-col items-center` | `display:flex;flex-direction:column;align-items:center` |
| `gap-0.5` / `gap-2` | `gap:2px` / `gap:8px` (×4px) |
| `h-5 w-5` / `h-12 w-12` | `height/width:20px` / `48px` (×4px) |
| `text-[10px]` / `text-sm` / `text-xl` | `font-size:10px` / `14px` / `20px` |
| `font-medium/bold/extrabold` | `font-weight:500/700/800` |
| `rounded-xl` / `rounded-2xl` / `rounded-full` | `border-radius:12px / 16px / 50%` |
| `p-3` / `px-4 py-1.5` | `padding:12px` / `padding:6px 16px` |
| `bg-primary text-primary-foreground` | `background:var(--primary);color:#fff` |
| `text-foreground` / `text-muted-foreground` | `color:var(--foreground)` / `var(--muted-foreground)` |
| `border border-border` | `border:1px solid var(--border)` |
| `bg-muted/60` | `background:rgba(244,244,245,.6)` (theme muted + alpha) |
| `tabular-nums` | `font-variant-numeric:tabular-nums` |
| `shadow-md` | `box-shadow:0 4px 10px rgba(0,0,0,.15)` |

> For design tokens (`--foreground`, `--primary`, etc.), check the real values in the project's theme CSS and put approximations into `:root`. If the project is monotone, keep it monotone.

---

## 3. Handling icons

- The real component typically uses an icon library (lucide, etc.). In the mockup, **a simple inline SVG** that mimics the same silhouette is enough.
- The key is to match the **size, weight, and monotone-or-not** exactly as read from the code (`h-5 w-5` → `width:20px`, `strokeWidth=2`).
```html
<svg viewBox="0 0 24 24" style="width:20px;height:20px;stroke:currentColor;fill:none;stroke-width:2">
  <path d="M4 20h16M6 16l9-9 3 3-9 9H6z"/>  <!-- pen (post) icon approximation -->
</svg>
```

---

## 4. AS-IS / TO-BE two-column layout

- **AS-IS** = the *current state as-is*, reproduced via STEP 1–5.
- **TO-BE** = clone AS-IS, then swap **only the parts that change**. Prove with code that everything else is left untouched.
- Tag each block with a color: 🟦 unchanged (no `outline`) / 🟩 new (`outline:2px solid #86efac`) / 🟨 changed (`outline:2px solid #fcd34d`).
- **Placement constraints** are also drawn as a separate diagram box (top→bottom stack) to reach agreement. (e.g., "the menu is pinned to the top of the sheet, new items go below it" — on this task the user corrected this top/bottom ordering.)

---

## 5. Common mistakes

- ❌ Inventing labels ("대시보드" (Dashboard), "내 정보" (My info)) → ✅ Only the actual i18n strings.
- ❌ Painting the active state in color (blue) → ✅ If the code says `font-bold text-foreground`, use **weight/brightness** (preserve monotone).
- ❌ Making the ＋ button a rounded square → ✅ If the code says `rounded-full`, make it **circular**.
- ❌ Reordering modules arbitrarily → ✅ Keep the order as it appears in the JSX (Recent posts → This week → metrics → footer).
- ❌ Dropping conditional UI (e.g., the music-player row) → ✅ Reflect branches like `musicActive &&` in the mockup, at least as a comment.

---

## 6. (Optional) Verify against a real Playwright capture

Overlaying your source-built mockup **against an actual app screenshot** is the surest validation. But it's heavily environment-dependent.
```bash
# After booting the dev server, capture the real component in a mobile viewport → pixel-compare against the mockup
```
- On this task, Playwright failed entirely — `file://` blocking, frame detached, timeouts — so **source reading alone was sufficient**.
- In other words, Playwright is **a supplement when available, skippable when not**. Priority #1 is always reading the source.
