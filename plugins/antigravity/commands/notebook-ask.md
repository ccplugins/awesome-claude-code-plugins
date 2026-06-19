---
description: Ask a question over a notebook corpus you already built with /agy:notebook. agy answers from the per-document summaries (docs/agy/notebook/<folder>/*.resumen.md) with citations — the "chat" of a local NotebookLM. Cheap: reads only the small summaries, never the original documents.
argument-hint: "<folder> | <question>"
context: fork
allowed-tools: Bash, Read, Agent
---

Question-answering over a notebook corpus previously built by `/agy:notebook`. agy reads the
small per-document summaries (not the originals) and answers **with citations**. Run `/agy:notebook
<folder> | <objective>` first to build the corpus.

Raw user request:
$ARGUMENTS

## Phase 0 — Resolve corpus + answer path (ONE Bash call)

Parse `$ARGUMENTS`: split on the first `|`. Left = folder (the SAME folder used with `/agy:notebook`),
right = question. If there is no `|`, the longest leading token that resolves to an existing directory
is the folder and the rest is the question. If the question is empty, ask once and stop.

```bash
python - "$FOLDER_OR_SLUG" "$PREGUNTA" <<'PY'
import sys, os, re, glob, hashlib
folder, preg = sys.argv[1], (sys.argv[2] if len(sys.argv) > 2 else "")
def slug(s, n=60):
    return (re.sub(r"[^a-z0-9]+","-", os.path.basename(s.rstrip("/\\")).lower()).strip("-") or "x")[:n]
outdir = os.path.join("docs","agy","notebook", slug(folder))
summ = glob.glob(os.path.join(outdir, "*.resumen.md"))
if not summ:
    print(f"NO_CORPUS outdir={outdir}")           # corpus not built yet
    sys.exit(0)
ans_dir = os.path.join(outdir, "_respuestas"); os.makedirs(ans_dir, exist_ok=True)
qh = hashlib.sha1(preg.encode("utf-8")).hexdigest()[:6]
ans = os.path.join(ans_dir, f"{slug(preg, 40)}-{qh}.md")
print(f"OK SUMMARIES_DIR={os.path.abspath(outdir)} N={len(summ)} WRITE_FILE={os.path.abspath(ans)}")
PY
```

- If it prints `NO_CORPUS` → tell the user to build the corpus first with
  `/agy:notebook "<folder>" | <objective>`, and stop.
- Else capture `SUMMARIES_DIR`, `N` (number of summaries) and `WRITE_FILE`.

## Phase 1 — Answer (ONE agy subagent)

Spawn ONE `antigravity:agy-rescue` subagent in **MODE: notebook-ask**:

```
MODE: notebook-ask
CWD: <absolute current working dir>
SUMMARIES_DIR: <SUMMARIES_DIR>
PREGUNTA: <question>
WRITE_FILE: <WRITE_FILE>
USER_TEXT:
(empty)
```

## Phase 2 — Present

Read ONLY `<WRITE_FILE>` and present the answer verbatim, then note: how many summaries it drew
from (`N`), and the saved path. Do NOT read the original documents or the per-document summaries
yourself — agy already grounded the answer in them.

## Notes
- The corpus must exist (run `/agy:notebook` first). This command never re-reads the originals.
- Answers are saved under `docs/agy/notebook/<folder>/_respuestas/` so you keep a Q&A trail.
- agy `--print` writes nothing to stdout outside a TTY (issue #76) — the answer is read from the file.
