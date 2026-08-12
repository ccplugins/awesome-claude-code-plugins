---
description: Record a browser walkthrough of a URL using Antigravity (agy). Generates .webm video, screenshots, and a report. Auto-converts to MP4 if ffmpeg is available.
argument-hint: "<url> [steps in natural language]"
context: fork
allowed-tools: Bash, Write
---

Route this to the `antigravity:agy-rescue` subagent in MODE: record.

Raw user request:
$ARGUMENTS

## Routing rules

1. **Parse the URL**: the first whitespace-separated token of `$ARGUMENTS` that starts with `http://` or `https://` IS the URL. If the user wrote it without a scheme, prepend `https://`. If no URL is found, ask once: "What URL should I record?".

2. **Steps**: everything else in `$ARGUMENTS` (whatever is not the URL) is the natural-language steps. If empty, use the default exploratory walkthrough (see template below).

3. **Slug**: build from the URL's host + first path segment (e.g. `https://erp.traidagency.com/login` → `erp-traidagency-com-login`). Lowercase, non-alphanumeric → `-`, collapse repeats, trim to 60 chars.

4. **Date**: today in `YYYY-MM-DD` (local time).

5. **Paths** (all relative to current working directory):
   - `OUTPUT_DIR` = `docs/agy/recordings/`
   - `REPORT_FILE` = `docs/agy/recordings/<date>-<slug>.md`
   - `VIDEO_FILE` = `docs/agy/recordings/<date>-<slug>.webm`
   - `MP4_FILE` = `docs/agy/recordings/<date>-<slug>.mp4` (only if ffmpeg available)

6. **Pre-flight**: with ONE `Bash` call:
   ```bash
   mkdir -p docs/agy/recordings
   ```

7. **Hand off to subagent**: pass this header block followed by the URL and steps:

   ```
   MODE: record
   URL: <url>
   CWD: <absolute path to current working directory>
   OUTPUT_DIR: docs/agy/recordings
   REPORT_FILE: docs/agy/recordings/<date>-<slug>.md
   VIDEO_FILE: docs/agy/recordings/<date>-<slug>.webm
   STEPS:
   <natural-language steps, or "DEFAULT_WALKTHROUGH" if empty>
   ```

## Default walkthrough (when no steps given)

If the user did not provide steps, instruct agy to:

1. Navigate to the URL and wait for DOM ready.
2. Take an initial screenshot.
3. Scroll slowly to the bottom of the page in 3-4 steps.
4. Scroll back to the top.
5. Identify the most prominent visible CTA (button/link), click it. Do NOT type credentials or fill forms.
6. Take a final screenshot.
7. Stop.

## Operating rules

- The subagent invokes agy with `--add-dir <CWD>` so the browser subagent can write the report directly into the project. It also instructs agy to write the report to `REPORT_FILE` and to ensure the .webm artifact ends up at or copied to `VIDEO_FILE`.
- After agy returns, the subagent attempts MP4 conversion via ffmpeg (`ffmpeg -i <webm> -c:v libx264 -crf 23 -preset fast -c:a aac <mp4>`). If ffmpeg is missing, it logs a warning and skips conversion, leaving the .webm as the only output.
- The subagent reports:
  1. Saved video path(s) (.webm always, .mp4 if conversion succeeded).
  2. Saved report path.
  3. First ~30 lines of the report.
  4. If ffmpeg is missing: hint to install (`winget install Gyan.FFmpeg` on Windows, `brew install ffmpeg` on macOS, `apt install ffmpeg` on Linux).
- Present that to the user as-is. Do not paraphrase.
- If agy reports it is missing or unauthenticated, tell the user to run `/agy:setup`.
- If the URL is blocked, returns non-200, or the browser session crashes, surface the error verbatim.

## Notes

- Recordings have **no audio**. If the user needs narration, suggest pairing with their TTS skill afterwards and muxing with ffmpeg.
- agy uses an **isolated Chrome profile** — cookies, sessions, and extensions from the user's main Chrome are NOT available. If the demo requires login, the user must pass credentials in the steps (e.g., "login with demo@x.com / pass=test1234") and accept that those credentials will be in the prompt/transcript.
- Long recordings (multi-minute flows) increase token usage and may hit timeouts. Default timeout is 8 minutes; the subagent allows up to 15 minutes if the steps look complex.
