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
MAXV, CHUNK, GROUP_MAX, CHAR_BUDGET = 20, 15, 4, 24000   # scans >MAXV pages -> CHUNK-page subs; uncached text docs -> groups of <=GROUP_MAX docs and <=CHAR_BUDGET chars (1 agy call -> many summaries)
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
rows=[]; small=[]   # small = UNCACHED text docs to pack into groups: (nn, sl, tpath, srcabs, key, nchars)
for i,f in enumerate(files,1):
    nn=f"{i:03d}"; sl=slug(f); st=os.stat(f); key=f"{st.st_size}:{int(st.st_mtime)}:{objhash}"
    is_pdf=f.lower().endswith(".pdf"); mode="vision"; tpath="-"; pages=0; d=None; nchars=0
    if is_pdf:
        try:
            d=fitz.open(f); pages=d.page_count; txt="\n".join(p.get_text() for p in d)
            if pages and len(txt.strip())/pages >= 200:
                mode="text"; nchars=len(txt.strip()); tpath=os.path.join(outdir,"_text",f"{nn}-{sl}.txt")
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
    elif mode=="text":
        summ=f"{nn}-{sl}.resumen.md"
        if os.path.exists(os.path.join(outdir,summ)) and prev.get(summ)==key:
            rows.append((nn,"cached",os.path.abspath(f),tpath,summ,key))     # already summarized -> skip
        else:
            small.append((nn, sl, tpath, os.path.abspath(f), key, nchars))   # pack into a group below
    else:
        rows.append(mkrow(nn,mode,os.path.abspath(f),tpath,f"{nn}-{sl}.resumen.md",key))
    if d is not None: d.close()
# greedy-pack UNCACHED text docs into groups (<=GROUP_MAX docs, <=CHAR_BUDGET chars) to cut agy calls.
# Each group = ONE agy call that writes one summary file PER member (see Mode: notebook-group).
batches=[]; cur=[]; cc=0
for it in small:                                    # it = (nn, sl, tpath, srcabs, key, nchars)
    if cur and (len(cur)>=GROUP_MAX or cc+it[5]>CHAR_BUDGET):
        batches.append(cur); cur=[]; cc=0
    cur.append(it); cc+=it[5]
if cur: batches.append(cur)
for gi,b in enumerate(batches,1):
    if len(b)==1:                                   # lone text doc -> 1-per-call (no group overhead)
        nn,sl,tpath,srcabs,key,_=b[0]
        rows.append((nn,"text",srcabs,tpath,f"{nn}-{sl}.resumen.md",key)); continue
    g=f"G{gi:02d}"
    texts="|".join(x[2] for x in b)                 # member text paths
    names="|".join(f"{x[0]}-{x[1]}" for x in b)     # member display names
    summs="|".join(f"{x[0]}-{x[1]}.resumen.md" for x in b)  # one output file PER member
    gkey="|".join(x[4] for x in b)                  # per-member cache keys (pipe-joined)
    rows.append((g,"group",texts,names,summs,gkey))
rows.sort(key=lambda r: r[0])
with open(os.path.join(outdir,"_manifest.tsv"),"w",encoding="utf-8") as m:
    for r in rows: m.write("\t".join(r)+"\n")
nc=sum(1 for r in rows if r[1]=="cached"); nt=sum(1 for r in rows if r[1]=="text")
nv=sum(1 for r in rows if r[1]=="vision"); ng=sum(1 for r in rows if r[1]=="group")
print(f"DOCS={len(files)} ROWS={len(rows)} CACHED={nc} TEXT={nt} VISION={nv} GROUPS={ng} OUTDIR={outdir}")
for r in rows: print("\t".join(r))
PYEOF
```

Manifest columns: `NN  mode(text|vision|cached|group)  source_abspath  text_path_or_dash  summary_relpath  cache_key`.
For **`group`** rows, columns 3/4/5/6 are PIPE-joined lists (member text paths · member names ·
member summary files · member cache keys), all in the same order — one entry per document in the batch.
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

Dispatch manifest rows by mode (**skip `cached`**). A `text` or `vision` row → **MODE: notebook**
(one doc per call). A **`group`** row → **MODE: notebook-group** (ONE call summarises up to 4 text
docs and writes one summary file PER member — this is the main throughput win, fewer agy
invocations). Pass for MODE: notebook:

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

For a **`group`** row, split columns 3/5/4 on `|` and pass the matching PIPE-joined lists (same
order; prefix each summary with `<OUTDIR>/` to make `WRITE_FILES` absolute):

```
MODE: notebook-group
CWD: <absolute current working dir>
OBJETIVO: <objective>
MEMBER_FILES: <pipe-joined member text paths (column 3)>
MEMBER_NAMES: <pipe-joined member names (column 4)>
WRITE_FILES: <OUTDIR>/<m1.resumen.md>|<OUTDIR>/<m2.resumen.md>|…  (column 5, each made absolute)
USER_TEXT:
(empty)
```

**Concurrency — RPM-bounded waves, two separate queues.** Each subagent runs its own `agy` process;
agy is rate-limited per minute (RPM) by the account tier — `RPM = 10` on free, higher on Pro/Ultra
(if the user says they're on Pro, you may raise it to ~30). The binding limit is **invocations per
minute**, which is exactly why text docs are batched (one `group` call covers up to 4 docs). To avoid
a slow OCR/vision doc gating a wave of fast text batches (head-of-line blocking), run **two queues**:

- **Text/group queue** — all `group` and lone-`text` rows, in waves of up to `RPM` Agent calls per message.
- **Vision queue** — all `vision` rows (scans/OCR, slower), in waves of up to 4.

Fire each wave as multiple Agent calls in ONE message. A throttled call comes back with **no output
file** (HTTP 429) — that is **rate-limiting, not a per-document failure**; do NOT stub it immediately.

**Drive it as retry rounds** (don't trust the subagents' self-reports; trust the files on disk). Note
a `group` row covers several summary files — expand its column-5 pipe list when checking:

1. **Round 1** — dispatch both queues (text/group first, then vision) until every non-`cached` row
   has been sent once.
2. **Check** (ONE Bash call): split each manifest row's column 5 on `|` and `test -s` **every** member
   summary file. Collect the `missing` summary files (and which row/group they belong to).
3. **Retry rounds (up to 2)** — if `missing` is non-empty, **wait ~60s** (one `sleep 60` — lets the
   per-minute quota reset), then re-dispatch only the rows that own a missing member (for a `group`,
   re-send the whole batch; the call rewrites all its members) in waves of up to `RPM`, and re-check.
4. **Stub the rest** — only after the retry rounds, for any summary file still missing/empty write a
   stub yourself (`Write`) to that `<OUTDIR>/<summary>`:
   ```
   ---
   doc: <basename>
   estado: no_procesado
   relevancia: 0
   ---
   No se pudo procesar tras reintentos (timeout o rate-limit de agy). Reintentar con /agy:notebook.
   ```
5. **Update the cache** (ONE Bash call): rewrite `<OUTDIR>/_cache.tsv` with one
   `summary\tcache_key` line per member whose summary now exists and is non-empty (covers `cached`
   rows + freshly-summarized ones; `group` rows are expanded; `no_procesado` stubs excluded so they
   retry next run):
   ```bash
   python - "$OUTDIR" <<'PY'
   import os, sys
   od = sys.argv[1]; out = []
   for ln in open(os.path.join(od, "_manifest.tsv"), encoding="utf-8"):
       c = ln.rstrip("\n").split("\t")
       if len(c) < 6: continue
       for s, k in zip(c[4].split("|"), c[5].split("|")):   # group rows carry pipe-lists; singles split to 1
           p = os.path.join(od, s)
           if os.path.exists(p) and os.path.getsize(p) > 0:
               if "estado: no_procesado" not in open(p, encoding="utf-8", errors="ignore").read(200):
                   out.append(f"{s}\t{k}")
   open(os.path.join(od, "_cache.tsv"), "w", encoding="utf-8").write("\n".join(out) + ("\n" if out else ""))
   print(f"cache: {len(out)} member summaries recorded")
   PY
   ```

> The per-minute ceiling is the real limiter, not local CPU. Batching text docs (≤4/call) is what
> actually cuts wall-clock at scale — it lowers the invocation count the RPM ceiling applies to.
> Pushing raw concurrency past `RPM` just produces more 429s, not more throughput.

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
