---
name: analyze-social
description: Use when the user shares a social video/post link or local video and wants it understood — an Instagram (instagram.com), TikTok (tiktok.com), YouTube or YouTube Shorts (youtube.com/youtu.be), or X/Twitter (x.com/twitter.com) URL, or a local .mp4/.mov file, OR when they say "analyze/watch/transcribe this video/reel/post." Downloads it, transcribes the audio, extracts frames Claude can see, and produces a thorough breakdown.
---

# Analyze Social (watch a video/post for the user)

## Overview

Turns a social link (or local video) into material you can actually read: sampled
frames you view with native vision, a full transcript, and the post's caption.
Then you write a thorough breakdown. A bundled cross-platform Python pipeline does
the fetching/transcribing; you do the understanding.

## When to use

- The user pastes an **Instagram / TikTok / YouTube / YouTube Shorts / X (Twitter)** URL.
- The user gives a **local video file** path.
- The user asks to **watch / analyze / transcribe / summarize** a video, reel, short, or post.

## Workflow

1. **Run the pipeline** (use the Bash tool):
   ```bash
   python3 "${CLAUDE_PLUGIN_ROOT}/scripts/analyze.py" "<URL or local file path>"
   ```
   - The **first run auto-installs** its tools (yt-dlp, gallery-dl, a Whisper engine, and ffmpeg). Tell the user this one-time setup can take a few minutes and may ask them to approve installs. Subsequent runs are fast.
   - Useful flags: `--no-transcribe` (frames + caption only, faster), `--target-frames N`, `--lang <code>`.

2. **Read the printed result block.** It ends with `ERROR_CODE`, `BUNDLE`, `TYPE`, `FRAMES`, `TRANSCRIPT`. Handle the error code:
   - `NEEDS_LOGIN` → the content is private/login-walled. Ask the user: *"Which browser are you logged into that platform on? (chrome / firefox / safari / edge / brave)"* then re-run with `--cookies-from-browser <browser>`. Only do this when the user has opted in — reading browser cookies is sensitive and may trigger a keychain prompt.
   - `RATE_LIMITED` → tell them to wait a few minutes, or retry with `--cookies-from-browser` to use their logged-in session.
   - `SETUP_FAILED` → show the `MESSAGE` (usually a one-line command to install ffmpeg) and offer to run it.
   - `none` → success, continue.

3. **Load the bundle.** Read `manifest.json` (the contract) from the `BUNDLE` path, then:
   - Read `meta.txt` (caption + metadata) and, if present, `transcript.txt`.
   - **View the frames** with the Read tool — a spread across the timeline (first, several middle, last) for video; **all slides in order** for an image carousel. You read on-screen text/captions directly from the frames; no separate OCR.

4. **Write the analysis** using the template below.

## Output template (be thorough — a faithful record, not a teaser)

- **Header** — platform · creator handle/name · date · type · duration · engagement (views/likes/comments if present) · URL.
- **TL;DR** — 1–2 sentences: what this is.
- **Full transcript — verbatim, everything.** The complete spoken audio word-for-word, with timestamps from `transcript.srt`. Do not summarize or drop lines. The only allowed cleanup is collapsing obvious hallucinated repeat-lines (e.g. "Okay. Okay. Okay."), never real speech. If there's no audio/speech, say so.
- **On-screen text & visuals (timeline)** — everything visible across the frames: text overlays/captions transcribed, graphics, charts/numbers, b-roll, setting, what the creator is doing, products/profiles shown. For carousels: every slide in order, with its full text + a description of its image.
- **Caption / description — verbatim** — exactly as posted, including hashtags, @mentions, links.
- **Beat-by-beat structure** (video) — how it's built, with timestamps: hook → point 1 → … → CTA.
- **Takeaway & intent** — core message, what it's actually sharing, the goal (educate / sell / lead-gen / entertain), and any explicit CTA.
- **Notable details** — names, tools, stats, claims, prices, links, anything quotable.

Adapt per `type`: a plain text tweet skips transcript/frames; an image carousel leans on the visuals section.

Then stay open for follow-ups ("just the hook," "list every stat," "summarize in 3 bullets," etc.).

## Notes

- Everything runs locally; nothing is uploaded. Browser cookies are read **only** when the user opts in for login-walled content.
- TikTok and YouTube are usually public (no login). Instagram posts/carousels and many X posts require being logged in.
