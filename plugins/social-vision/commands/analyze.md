---
description: Watch & analyze a social video/post — Instagram, TikTok, YouTube (Shorts), or X/Twitter URL, or a local video file
argument-hint: <url-or-file>
---

Analyze the social video/post at: $ARGUMENTS

Follow the `analyze-social` skill workflow:

1. Run `python3 "${CLAUDE_PLUGIN_ROOT}/scripts/analyze.py" "$ARGUMENTS"` (warn the user the first run auto-installs tools and may take a few minutes).
2. Handle any `ERROR_CODE` (e.g. `NEEDS_LOGIN` → ask which browser they're logged into, re-run with `--cookies-from-browser <browser>`).
3. Read `manifest.json`, `meta.txt`, `transcript.txt`, and view the frames from the bundle.
4. Produce the thorough breakdown defined in the skill's output template (header, TL;DR, full verbatim transcript with timestamps, on-screen text & visuals, verbatim caption, beat-by-beat, takeaway & intent, notable details), then stay open for follow-ups.

If `$ARGUMENTS` is empty, ask the user for a link or file path.
