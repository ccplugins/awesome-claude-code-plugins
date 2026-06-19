---
description: Show or set the agy (Antigravity / Gemini) model by writing ~/.gemini/antigravity-cli/settings.json — the reliable way to switch models (the unreliable --model flag silently falls back to the default). No agy call; takes effect immediately, no plugin reinstall.
argument-hint: "[alias|\"exact label\"]   e.g. flash-low · pro · \"Gemini 3.1 Pro (High)\""
context: fork
allowed-tools: Bash
---

Show or change which model `agy --print` uses. agy reads the active model from
`~/.gemini/antigravity-cli/settings.json` (`"model": "<label>"`); the TUI's "Switch Model"
just writes that key. The `--model` CLI flag is **unreliable** (an unknown id silently falls
back to the default), so this command edits `settings.json` directly. The change is immediate —
no plugin reinstall.

Raw user request:
$ARGUMENTS

## Alias table (canonical copy: `config/model-map.json` — keep in sync)

| Alias | Label written to settings.json |
|---|---|
| `flash-low` | `Gemini 3.5 Flash (Low)` |
| `flash` / `flash-medium` | `Gemini 3.5 Flash (Medium)` |
| `flash-high` | `Gemini 3.5 Flash (High)` |
| `pro` / `pro-low` | `Gemini 3.1 Pro (Low)` |
| `pro-high` | `Gemini 3.1 Pro (High)` |
| `sonnet` | `Claude Sonnet 4.6 (Thinking)` |
| `opus` | `Claude Opus 4.6 (Thinking)` |
| `gpt-oss` | `GPT-OSS 120B` |

`(Low/Medium/High)` is the thinking-effort level. Model availability depends on the account
tier (free = Flash / Flash-Lite only). For `/agy:notebook` sweeps, `flash-low` is fastest/cheapest;
use `pro` for higher-quality synthesis.

## What to do (ONE Bash call)

Run this, substituting the requested alias/label (trim `$ARGUMENTS`; empty = show only). It accepts
an alias OR a full quoted label verbatim (so you can paste an exact string from the TUI when an
alias is stale):

```bash
ARG="$ARGUMENTS"   # the alias or exact label, or empty
python - "$ARG" <<'PY'
import json, os, sys, shutil
arg = (sys.argv[1] if len(sys.argv) > 1 else "").strip().strip('"').strip("'")
sp = os.path.expanduser("~/.gemini/antigravity-cli/settings.json")
ALIASES = {
    "flash-low":"Gemini 3.5 Flash (Low)", "flash":"Gemini 3.5 Flash (Medium)",
    "flash-medium":"Gemini 3.5 Flash (Medium)", "flash-high":"Gemini 3.5 Flash (High)",
    "pro":"Gemini 3.1 Pro (Low)", "pro-low":"Gemini 3.1 Pro (Low)",
    "pro-high":"Gemini 3.1 Pro (High)", "sonnet":"Claude Sonnet 4.6 (Thinking)",
    "opus":"Claude Opus 4.6 (Thinking)", "gpt-oss":"GPT-OSS 120B",
}
try:
    cfg = json.load(open(sp, encoding="utf-8"))
except FileNotFoundError:
    cfg = {}
cur = cfg.get("model", "(unset — agy uses its default)")
if not arg:
    print("Modelo actual:", cur)
    print("\nAlias disponibles:")
    for a, lbl in ALIASES.items(): print(f"  {a:13} → {lbl}")
    print("\nUso: /agy:model <alias>   o   /agy:model \"Gemini 3.1 Pro (High)\"")
    sys.exit(0)
label = ALIASES.get(arg.lower(), arg)   # alias → label, else use verbatim
shutil.copyfile(sp, sp + ".bak") if os.path.exists(sp) else None
cfg["model"] = label
json.dump(cfg, open(sp, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
print(f"Modelo: {cur}  →  {label}")
if arg.lower() not in ALIASES and arg != label:
    print("(usaste un label literal; verificá que coincida exacto con la lista del TUI)")
print("⚠️  Si agy sigue en el modelo anterior, el label no coincide con tu cuenta: abrí el TUI"
      " `agy` → Switch Model, copiá el string exacto y reintentá con /agy:model \"<label>\".")
PY
```

Report the before→after model and the warning verbatim. Do not call agy.
