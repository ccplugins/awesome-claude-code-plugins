---
description: Local NotebookLM over a FOLDER of documents using Antigravity (agy). Sweeps each document (PDF with text, scanned PDF, image, docx) into an objective-driven Markdown summary, then builds a relevance INDEX and a cited master summary. Incremental cache (re-runs only re-summarize changed docs / changed objective) and automatic model routing (Flash for the sweep, Pro for the synthesis). Offloads all heavy reading to agy. Saves to docs/agy/notebook/.
argument-hint: "<folder> | <objective>"
context: fork
allowed-tools: Bash, Read, Write, Agent
---

Local replacement for NotebookLM. Given a **folder of documents** and an **objective**,
agy reads every document and produces one objective-driven summary per document, plus a
relevance `INDEX.md` and a cited `RESUMEN_MAESTRO.md`. The point is to **keep Claude's
context cheap**: agy does all the document reading; you only read the two small final files.

Raw user request:
$ARGUMENTS

## Phase 0 — Parse + list + classify + cache (ONE Bash call)

Parse `$ARGUMENTS`: split on the first `|`. Left side = folder, right side = objective.
If there is no `|`, the longest leading token that resolves to an existing directory is the
folder and the rest is the objective. If the folder is missing, ask once: "¿Qué carpeta querés
analizar?" and stop.

Run ONE Bash call (a Python helper). It lists supported files, classifies each as `text`
(PDF with a real text layer → pre-extract) or `vision` (scanned/image → agy OCR), and applies an
**incremental cache**: a document is marked `cached` (skipped) when its summary already exists AND
its size+mtime AND the objective are unchanged since the last run. The cache key includes a hash of
the objective, so changing the objective re-summarizes everything.

```bash
python - "$FOLDER_ABS" "$OUTDIR" "$OBJETIVO" <<'PYEOF'
import sys, os, re, glob, hashlib
import fitz  # PyMuPDF
folder, outdir, objetivo = sys.argv[1], sys.argv[2], (sys.argv[3] if len(sys.argv) > 3 else "")
os.makedirs(os.path.join(outdir, "_text"), exist_ok=True)
objhash = hashlib.sha1(objetivo.strip().encode("utf-8")).hexdigest()[:8]
MAXV, CHUNK, GROUP = 20, 15, 8   # scans >MAXV pages -> CHUNK-page subs; >=3 one-page text docs -> groups of GROUP
cache_path = os.path.join(outdir, "_cache.tsv"); prev = {}
if os.path.exists(cache_path):
    for ln in open(cache_path, encoding="utf-8"):
        pp = ln.rstrip("\n").split("\t")
        if len(pp) == 2: prev[pp[0]] = pp[1]
exts = (".pdf",".docx",".doc",".png",".jpg",".jpeg",".webp",".gif")
files = sorted(f for f in glob.glob(os.path.join(folder,"*")) if f.lower().endswith(exts))
def slug(s):
    s = re.sub(r"[^a-z0-9]+","-", os.path.splitext(os.path.basename(s))[0].lower()).strip("-")
    return s[:60] or "doc"
def mkrow(nn, mode, src, tpath, summ, key):     # incremental cache per output file
    if os.path.exists(os.path.join(outdir, summ)) and prev.get(summ) == key:
        return (nn, "cached", src, "-", summ, key)
    return (nn, mode, src, tpath, summ, key)
rows=[]; small=[]   # small = (nn, txtpath, fullpath, name, key) for 1-page text docs (groupable)
for i,f in enumerate(files,1):
    nn=f"{i:03d}"; sl=slug(f); st=os.stat(f); key=f"{st.st_size}:{int(st.st_mtime)}:{objhash}"
    is_pdf=f.lower().endswith(".pdf"); mode="vision"; tpath="-"; pages=0; d=None
    if is_pdf:
        try:
            d=fitz.open(f); pages=d.page_count; txt="\n".join(p.get_text() for p in d)
            if pages and len(txt.strip())/pages >= 200:
                mode="text"; tpath=os.path.join(outdir,"_text",f"{nn}-{sl}.txt")
                open(tpath,"w",encoding="utf-8").write(txt)
        except Exception:
            mode,pages,d="vision",0,None
    if mode=="vision" and is_pdf and pages>MAXV and d is not None:
        os.makedirs(os.path.join(outdir,"_chunks"),exist_ok=True)   # oversized scan -> page-range chunks
        for ci,startp in enumerate(range(0,pages,CHUNK),1):
            endp=min(startp+CHUNK,pages)
            cpath=os.path.join(outdir,"_chunks",f"{nn}-{sl}-p{startp+1:03d}-{endp:03d}.pdf")
            sub=fitz.open(); sub.insert_pdf(d,from_page=startp,to_page=endp-1); sub.save(cpath); sub.close()
            summ=f"{nn}-{sl}-p{startp+1:03d}-{endp:03d}.resumen.md"
            rows.append(mkrow(nn,"vision",cpath,"-",summ,f"{key}:c{ci}"))
    elif mode=="text" and is_pdf and pages==1:
        small.append((nn, tpath, os.path.abspath(f), os.path.basename(f), key))   # group later
    else:
        rows.append(mkrow(nn,mode,os.path.abspath(f),tpath,f"{nn}-{sl}.resumen.md",key))
    if d is not None: d.close()
# group 1-page text docs (providencias / pases de trámite) to save agy calls
if len(small) >= 3:
    for gi in range(0, len(small), GROUP):
        batch=small[gi:gi+GROUP]; g=f"G{gi//GROUP+1:02d}"
        members="|".join(t for _,t,_,_,_ in batch); names="|".join(n for _,_,_,n,_ in batch)
        gkey=hashlib.sha1(("|".join(k for *_,k in batch)).encode()).hexdigest()[:12]
        rows.append(mkrow(g,"group",members,names,f"_grupo-{g.lower()}.resumen.md",gkey))
else:
    for nn,t,full,n,key in small:
        rows.append(mkrow(nn,"text",full,t,f"{nn}-{slug(n)}.resumen.md",key))
rows.sort(key=lambda r: r[0])
with open(os.path.join(outdir,"_manifest.tsv"),"w",encoding="utf-8") as m:
    for r in rows: m.write("\t".join(r)+"\n")
nc=sum(1 for r in rows if r[1]=="cached"); nt=sum(1 for r in rows if r[1]=="text")
nv=sum(1 for r in rows if r[1]=="vision"); ng=sum(1 for r in rows if r[1]=="group")
print(f"DOCS={len(files)} ROWS={len(rows)} CACHED={nc} TEXT={nt} VISION={nv} GROUPS={ng} OUTDIR={outdir}")
for r in rows: print("\t".join(r))
PYEOF
```

Manifest columns: `NN  mode(text|vision|cached)  source_abspath  text_path_or_dash  summary_relpath  cache_key`.
If the manifest is empty → tell the user there are no supported documents and stop. If ALL docs are
`cached` → skip Phase 1 entirely (nothing changed) and go straight to Phase 2.

**Large-corpus guard.** Count the rows to actually process this run (`text` + `vision` + `group`,
i.e. `ROWS − CACHED` from the print line). If that is **more than 30**, do NOT start the sweep
silently — tell the user the count and a rough wall-clock estimate (on a free ~10 RPM tier ≈
`ceil(N/10)` minutes plus retries; much faster on Pro/Ultra) and ask them to confirm before
continuing. They can proceed as-is, or narrow the folder/objective to cut the count. Skip this prompt
when there are ≤30 rows to process, or when the user already passed an explicit go-ahead (e.g. they
re-ran after confirming, or said "sin preguntar"/"go").

## Phase 0.5 — Model routing (ONE Bash call, best-effort, reversible)

The per-document summaries don't need deep reasoning; the final synthesis does. Save the user's
current agy model, switch to a fast one for the sweep, and **remember to restore it in Phase 3**.
agy reads its model from `settings.json` (the reliable lever — see `/agy:model`); `--model` is not.

```bash
python - <<'PY'
import json, os
sp=os.path.expanduser("~/.gemini/antigravity-cli/settings.json")
try: cfg=json.load(open(sp,encoding="utf-8"))
except Exception: cfg={}
orig=cfg.get("model","")
open(os.path.join(os.environ.get("TMPDIR","/tmp"),"agy_notebook_orig_model.txt"),"w",encoding="utf-8").write(orig)
cfg["model"]="Gemini 3.5 Flash (Low)"
json.dump(cfg,open(sp,"w",encoding="utf-8"),ensure_ascii=False,indent=2)
print(f"model: {orig or '(default)'} -> Gemini 3.5 Flash (Low) for the sweep (orig saved)")
PY
```

> Best-effort: if the account lacks a label, agy silently keeps its default — harmless. The original
> model is restored in Phase 3 regardless of outcome.

## Phase 1 — Per-document summaries (fan out agy, with rate-limit-aware retry)

Dispatch manifest rows whose mode is `text` or `vision` to **MODE: notebook** (one subagent each,
**skip `cached`**). Rows whose mode is **`group`** instead go to **MODE: notebook-group** (one
subagent summarises a whole batch of one-page providencias in a single call — see below). Pass for
MODE: notebook:

```
MODE: notebook
CWD: <absolute current working dir>
OBJETIVO: <objective>
INPUT_MODE: text|vision
SOURCE_FILE: <source_abspath>          # the original doc (vision reads this)
TEXT_FILE: <text_path or empty>        # extracted text (text mode reads this)
WRITE_FILE: <OUTDIR>/<summary_relpath>
USER_TEXT:
(empty)
```

For a **`group`** row, pass instead (field 3 = `|`-joined member text paths, field 4 = `|`-joined names):

```
MODE: notebook-group
CWD: <absolute current working dir>
OBJETIVO: <objective>
MEMBER_FILES: <pipe-joined member .txt paths>
MEMBER_NAMES: <pipe-joined member display names>
WRITE_FILE: <OUTDIR>/<summary_relpath>
USER_TEXT:
(empty)
```

**Concurrency — up to 10 per wave, with rate-limit backoff.** Each subagent runs its own `agy`
process. agy is rate-limited per minute (RPM) by the Antigravity account tier — roughly ~10 RPM on
the free tier, higher on Pro/Ultra. So fire a wave of **up to 10 Agent calls in one message**, but
treat a wide wave as "best effort": if the account is throttled, some calls come back with **no
output file** (HTTP 429) — that is **rate-limiting, not a per-document failure**. Do NOT stub those
immediately. This mirrors how batch LLM pipelines work (a concurrency cap + retry/backoff, not
blind parallelism). On a Pro/Ultra tier the retries below rarely fire; on free they smooth over the
~10 RPM ceiling.

**Drive it as retry rounds** (don't trust the subagents' self-reports; trust the files on disk):

1. **Round 1** — spawn waves of up to 10 until every non-`cached` manifest doc has been dispatched once.
2. **Check** (ONE Bash call): for every `summary_relpath`, test the file exists AND is non-empty
   (`test -s`). Collect the `missing` list.
3. **Retry rounds (up to 2)** — if `missing` is non-empty, **wait ~60s** (one `sleep 60` — lets the
   per-minute quota reset), then re-dispatch only the `missing` docs in waves of up to 10, and
   re-check. Repeat at most twice.
4. **Stub the rest** — only after the retry rounds, for any doc still missing/empty write a stub
   yourself (`Write`) to its `WRITE_FILE`:
   ```
   ---
   doc: <basename>
   estado: no_procesado
   relevancia: 0
   ---
   No se pudo procesar tras reintentos (timeout o rate-limit de agy). Reintentar con /agy:notebook.
   ```
5. **Update the cache** (ONE Bash call): rewrite `<OUTDIR>/_cache.tsv` from the manifest — one
   `summary_relpath\tcache_key` line for every doc whose summary file now exists and is non-empty
   (this records the `cached` rows plus the freshly-summarized ones; stubs/`no_procesado` are
   excluded so they retry next run):
   ```bash
   awk -F'\t' '{print $5"\t"$6}' "$OUTDIR/_manifest.tsv" | while IFS=$'\t' read -r s k; do
     [ -s "$OUTDIR/$s" ] && ! grep -q "estado: no_procesado" "$OUTDIR/$s" && printf '%s\t%s\n' "$s" "$k"
   done > "$OUTDIR/_cache.tsv"
   ```

> The per-minute ceiling is the real limiter, not local CPU — pushing concurrency far past ~10 just
> produces more 429s, not more throughput. 10-per-wave + the 60s backoff between retry rounds is the
> sweet spot on the free tier. (A paid Antigravity tier with higher RPM could raise the wave size.)

## Phase 2 — Index + master synthesis (switch model, then ONE agy subagent)

First switch agy to a higher-quality model for the synthesis (ONE Bash call, best-effort):

```bash
python - <<'PY'
import json, os
sp=os.path.expanduser("~/.gemini/antigravity-cli/settings.json")
try: cfg=json.load(open(sp,encoding="utf-8"))
except Exception: cfg={}
cfg["model"]="Gemini 3.1 Pro (Low)"
json.dump(cfg,open(sp,"w",encoding="utf-8"),ensure_ascii=False,indent=2)
print("model -> Gemini 3.1 Pro (Low) for the synthesis")
PY
```

Then spawn ONE `antigravity:agy-rescue` subagent in **MODE: notebook-index**:

```
MODE: notebook-index
CWD: <absolute current working dir>
OBJETIVO: <objective>
SUMMARIES_DIR: <OUTDIR>               # contains the *.resumen.md files
INDEX_FILE: <OUTDIR>/INDEX.md
MASTER_FILE: <OUTDIR>/RESUMEN_MAESTRO.md
TIMELINE_FILE: <OUTDIR>/TIMELINE.md
ENTIDADES_FILE: <OUTDIR>/ENTIDADES.md
USER_TEXT:
(empty)
```

## Phase 3 — Restore model + report

First restore the user's original model (ONE Bash call — do this even if earlier phases failed):

```bash
python - <<'PY'
import json, os
sp=os.path.expanduser("~/.gemini/antigravity-cli/settings.json")
mp=os.path.join(os.environ.get("TMPDIR","/tmp"),"agy_notebook_orig_model.txt")
try: orig=open(mp,encoding="utf-8").read().strip()
except Exception: orig=""
try: cfg=json.load(open(sp,encoding="utf-8"))
except Exception: cfg={}
if orig: cfg["model"]=orig; json.dump(cfg,open(sp,"w",encoding="utf-8"),ensure_ascii=False,indent=2)
print(f"model restored -> {orig or '(unchanged)'}")
PY
```

Then read ONLY `<OUTDIR>/INDEX.md` and `<OUTDIR>/RESUMEN_MAESTRO.md` (they are small) and present:
1. The objective and the doc counts (total / cached / text / vision / no_procesado).
2. The TOP relevant documents from `INDEX.md`.
3. The master summary's conclusion.
4. The path to `<OUTDIR>` for the full per-document summaries, plus `TIMELINE.md` and `ENTIDADES.md`.
5. Tip: ask follow-up questions over this corpus with `/agy:notebook-ask <folder> | <pregunta>`.

Do NOT read the original documents or the per-document summaries yourself — that's the whole
point (agy already did the reading). Only the two final files.

## Notes
- agy `--print` writes nothing to stdout outside a TTY (issue #76) — every agy call writes to a
  file; the subagent verifies the file exists. This command never relies on agy stdout.
- 1 document per agy call (large multimodal batches time out), up to 10 calls per wave (see Phase 1).
- **Large scanned PDFs are chunked**: a scanned/vision PDF over ~20 pages is split into 15-page
  sub-PDFs (in `_chunks/`), each summarized separately as `NN-<slug>-pSTART-END` — avoids the
  single-call timeout on big scans. Text-layer PDFs are not chunked (compact enough for one call).
- **Incremental**: re-running the same folder + objective only re-summarizes new/changed documents
  (cache in `_cache.tsv`, keyed by size+mtime+objective hash). Change the objective → full re-sweep.
- **Model routing** is automatic (Flash Low for the per-doc sweep, 3.1 Pro Low for the synthesis,
  original restored after) and best-effort — see `/agy:model` to inspect/override the active model.
- The `_text/`, `_manifest.tsv` and `_cache.tsv` are intermediate artifacts; keep `_cache.tsv` to
  preserve the incremental cache, the rest can be deleted.
