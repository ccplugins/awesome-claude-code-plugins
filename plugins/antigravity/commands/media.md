---
description: Ask a question about an AUDIO, VIDEO or IMAGE file (or a YouTube/remote URL) with Antigravity (agy / Gemini 3.x multimodal). Beyond transcription — "what decisions were made in this meeting?", "what happens at 2:30 in the video?", "what's the tone of this voice note?". Claude Code can't see/hear media; agy can.
argument-hint: "<audio|video|image file | URL> | <question>"
context: fork
allowed-tools: Bash, Read, Agent
---

Multimodal Q&A over a media file. Give `agy` an audio/video/image (or a YouTube/remote URL) and a
question; it answers grounded in what it heard/saw, with time references for audio/video.

Raw user request:
$ARGUMENTS

## Phase 0 — Resolve source + question (ONE Bash call)

Parse `$ARGUMENTS`: split on the first `|` → left = source (a URL or an existing file), right =
question. If there is no `|`, the leading URL/existing-file token is the source and the rest is the
question. If the question is empty, ask once and stop.

```bash
python - "$SOURCE" "$PREGUNTA" <<'PYEOF'
import sys, os, re, hashlib
src = sys.argv[1].strip().strip('"'); preg = (sys.argv[2] if len(sys.argv) > 2 else "").strip()
AUD=(".ogg",".mp3",".wav",".m4a",".aac",".flac",".opus",".aiff"); VID=(".mp4",".mov",".webm",".mkv",".avi",".m4v")
IMG=(".png",".jpg",".jpeg",".webp",".gif")
low=src.lower()
if low.startswith("http"): kind="url"; addir=""
elif low.endswith(VID): kind="video"; addir=os.path.dirname(os.path.abspath(src))
elif low.endswith(AUD): kind="audio"; addir=os.path.dirname(os.path.abspath(src))
elif low.endswith(IMG): kind="image"; addir=os.path.dirname(os.path.abspath(src))
else: kind="file"; addir=os.path.dirname(os.path.abspath(src))
base=re.sub(r"[^a-z0-9]+","-", (re.sub(r"^https?://(www\.)?","",low) if kind=="url" else os.path.splitext(os.path.basename(src))[0]).lower()).strip("-")[:40] or "media"
qh=hashlib.sha1(preg.encode()).hexdigest()[:6]
out=os.path.join("docs","agy","media", f"{base}-{qh}.md"); os.makedirs(os.path.dirname(out), exist_ok=True)
print(f"KIND={kind}\nADD_DIR={addir}\nWRITE_FILE={os.path.abspath(out)}\nSOURCE={src}")
PYEOF
```

## Phase 1 — Answer (ONE agy subagent)

Spawn ONE `antigravity:agy-rescue` subagent in **MODE: media**:

```
MODE: media
CWD: <absolute current working dir>
KIND: audio|video|image|url|file
SOURCE: <file path or URL>
ADD_DIR: <dir of the source file, or empty for a URL>
PREGUNTA: <question>
WRITE_FILE: <WRITE_FILE>
USER_TEXT:
(empty)
```

## Phase 2 — Present

Read ONLY `<WRITE_FILE>` and present the answer verbatim, then the saved path. Don't re-process the
media yourself.

## Notes
- For audio/video the answer cites **time references** (e.g. "around 02:30") when relevant.
- Need a full transcript instead of a targeted answer? Use `/agy:transcribe`.
- agy `--print` writes nothing to stdout outside a TTY (issue #76); the answer is read from the file.
