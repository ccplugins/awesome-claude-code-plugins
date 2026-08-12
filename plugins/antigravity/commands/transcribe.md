---
description: Transcribe and summarize an AUDIO or VIDEO file (or a YouTube/remote URL) with Antigravity (agy / Gemini 3.x multimodal) — something Claude can't do natively. Voice notes, meetings, calls, screencasts. Faithful transcript + summary; timestamps for video/URLs. Saves to docs/agy/transcripts/.
argument-hint: "<audio|video file | YouTube/URL> [focus]"
context: fork
allowed-tools: Bash, Read, Agent
---

Offload audio/video understanding to `agy` (Gemini is natively multimodal in audio + video; Claude
Code is not). Give it a local audio/video file or a YouTube/remote URL; get a faithful transcript
and a summary back, written to a file (cheap on Claude's context).

Raw user request:
$ARGUMENTS

## Phase 0 — Resolve source + kind (ONE Bash call)

Parse `$ARGUMENTS`: the first token that is a URL (`http://`/`https://`) OR an existing file
(`test -f`) is the **source**; everything else is an optional **focus**. If nothing resolves, ask
once: "¿Qué audio/video/URL transcribo?" and stop.

```bash
python - "$SOURCE" <<'PYEOF'
import sys, os, re, datetime
src = sys.argv[1].strip().strip('"')
AUD = (".ogg",".mp3",".wav",".m4a",".aac",".flac",".opus",".aiff")
VID = (".mp4",".mov",".webm",".mkv",".avi",".m4v")
low = src.lower()
if low.startswith("http"):
    kind = "url"; addir = ""
    base = re.sub(r"[^a-z0-9]+","-", re.sub(r"^https?://(www\.)?","",low)).strip("-")[:50] or "url"
else:
    kind = "video" if low.endswith(VID) else "audio"
    addir = os.path.dirname(os.path.abspath(src))
    base = re.sub(r"[^a-z0-9]+","-", os.path.splitext(os.path.basename(src))[0].lower()).strip("-")[:50] or "media"
out = os.path.join("docs","agy","transcripts", f"{base}.md")
os.makedirs(os.path.dirname(out), exist_ok=True)
print(f"KIND={kind}\nADD_DIR={addir}\nWRITE_FILE={os.path.abspath(out)}\nSOURCE={src}")
PYEOF
```

## Phase 1 — Transcribe (ONE agy subagent)

Spawn ONE `antigravity:agy-rescue` subagent in **MODE: transcribe**:

```
MODE: transcribe
CWD: <absolute current working dir>
KIND: audio|video|url
SOURCE: <file path or URL>
ADD_DIR: <dir of the source file, or empty for a URL>
FOCUS: <focus text or empty>
WRITE_FILE: <WRITE_FILE>
USER_TEXT:
(empty)
```

## Phase 2 — Present

Read ONLY `<WRITE_FILE>` and present: the summary first, then the transcript path. Don't re-process
the media yourself.

## Notes
- Gemini handles common audio (ogg/opus/mp3/wav/m4a/flac) and video (mp4/mov/webm/…); YouTube and
  other public URLs work without downloading.
- Long files (>~30 min) can hit the timeout — split with `ffmpeg` first if needed (the subagent
  raises the timeout for video/URL automatically).
- agy `--print` writes nothing to stdout outside a TTY (issue #76); the transcript is read from the file.
