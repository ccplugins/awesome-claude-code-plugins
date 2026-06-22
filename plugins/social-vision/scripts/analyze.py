#!/usr/bin/env python3
"""
analyze.py — social-vision pipeline orchestrator (pure standard library).

Takes one Instagram / TikTok / YouTube(-Shorts) / X(Twitter) URL or a local video
file and produces a "bundle" directory that Claude then reads:

    <bundle>/
      frames/frame_###.jpg   sampled video frames or carousel slides
      transcript.txt / .srt  spoken audio (if any)
      meta.txt               human-readable metadata + caption
      manifest.json          machine-readable map of the bundle (+ error codes)
      SUMMARY.md             index

It shells out to the tools installed by bootstrap.py (yt-dlp, gallery-dl, ffmpeg,
and the venv's transcribe.py). It never hard-crashes: if it can salvage any
frames or a caption it writes a partial bundle and exits 0.
"""

import argparse
import json
import re
import shutil
import subprocess
import sys
from datetime import datetime
from pathlib import Path

import bootstrap  # same directory

SCRIPT_DIR = Path(__file__).resolve().parent
VIDEO_EXTS = (".mp4", ".mkv", ".webm", ".mov", ".m4v")
IMAGE_EXTS = (".jpg", ".jpeg", ".png", ".webp")

LOGIN_PATTERNS = [
    "login required", "log in", "logged in", "sign in to confirm", "use --cookies",
    "requested content is not available", "account is private", "this account is private",
    "only available for registered", "rate-limit reached", "cookies are no longer valid",
]
RATE_PATTERNS = ["429", "too many requests", "please wait a few minutes", "rate limit", "rate-limit"]
STALE_PATTERNS = ["unable to extract", "unsupported url", "unable to download webpage",
                  "failed to parse json"]


def run(cmd):
    return subprocess.run([str(c) for c in cmd], capture_output=True, text=True)


def platform_of(url):
    u = url.lower()
    if "instagram.com" in u:
        return "Instagram"
    if "tiktok.com" in u:
        return "TikTok"
    if "youtube.com" in u or "youtu.be" in u:
        return "YouTube"
    if "x.com" in u or "twitter.com" in u:
        return "X"
    return "Web"


def classify_error(stderr):
    s = (stderr or "").lower()
    if any(p in s for p in RATE_PATTERNS):
        return "RATE_LIMITED"
    if any(p in s for p in LOGIN_PATTERNS):
        return "NEEDS_LOGIN"
    if any(p in s for p in STALE_PATTERNS):
        return "EXTRACTOR_STALE"
    return None


# --------------------------------------------------------------------------- #
# metadata + routing
# --------------------------------------------------------------------------- #
def ytdlp_json(deps, url, cookies):
    cmd = [deps["yt_dlp"], "-J", "--no-warnings", "--no-playlist", *cookies, url]
    proc = run(cmd)
    if proc.returncode == 0 and proc.stdout.strip():
        try:
            return json.loads(proc.stdout), None
        except json.JSONDecodeError:
            return None, "EXTRACTOR_STALE"
    return None, classify_error(proc.stderr) or "EXTRACTOR_STALE"


def has_video(meta):
    if not meta:
        return False
    if meta.get("duration"):
        return True
    for f in meta.get("formats", []) or []:
        if f.get("vcodec") and f.get("vcodec") != "none":
            return True
    return meta.get("_type") == "video"


def meta_fields(meta, url):
    return {
        "title": (meta or {}).get("title"),
        "uploader": (meta or {}).get("uploader") or (meta or {}).get("channel"),
        "upload_date": (meta or {}).get("upload_date"),
        "duration": (meta or {}).get("duration"),
        "like_count": (meta or {}).get("like_count"),
        "view_count": (meta or {}).get("view_count"),
        "caption": (meta or {}).get("description") or "",
        "source_url": url,
    }


# --------------------------------------------------------------------------- #
# acquisition
# --------------------------------------------------------------------------- #
def download_video(deps, url, cookies, bundle):
    cmd = [deps["yt_dlp"], "-f", "bv*+ba/best", "--merge-output-format", "mp4",
           "--no-playlist", "--no-warnings", *cookies,
           "-o", str(bundle / "video.%(ext)s"), url]
    proc = run(cmd)
    for ext in VIDEO_EXTS:
        hit = list(bundle.glob("video" + ext))
        if hit:
            return hit[0], None
    return None, classify_error(proc.stderr) or "DOWNLOAD_FAILED"


def download_images(deps, url, cookies, bundle):
    media = bundle / "media"
    media.mkdir(exist_ok=True)
    proc = run([deps["gallery_dl"], "--dest", str(media), "-o", "directory=[]",
                *cookies, url])
    imgs = sorted(p for p in media.iterdir() if p.suffix.lower() in IMAGE_EXTS)
    if imgs:
        return imgs, None
    return [], classify_error(proc.stderr) or "DOWNLOAD_FAILED"


def gallery_caption(deps, url, cookies):
    proc = run([deps["gallery_dl"], "-j", *cookies, url])
    if proc.returncode != 0 or not proc.stdout.strip():
        return {}
    try:
        data = json.loads(proc.stdout)
    except json.JSONDecodeError:
        return {}
    for item in data:
        if isinstance(item, list) and len(item) >= 2 and isinstance(item[-1], dict):
            d = item[-1]
            return {
                "caption": d.get("description") or d.get("content") or d.get("tweet_text") or "",
                "uploader": d.get("username") or d.get("uploader") or d.get("author", {}).get("name"),
                "title": d.get("title"),
            }
    return {}


# --------------------------------------------------------------------------- #
# frames + transcription
# --------------------------------------------------------------------------- #
def probe_duration(deps, video):
    proc = run([deps["ffprobe"], "-v", "error", "-show_entries", "format=duration",
                "-of", "csv=p=0", str(video)])
    try:
        return float(proc.stdout.strip())
    except ValueError:
        return 0.0


def has_audio(deps, video):
    proc = run([deps["ffprobe"], "-v", "error", "-select_streams", "a",
                "-show_entries", "stream=index", "-of", "csv=p=0", str(video)])
    return bool(proc.stdout.strip())


def extract_frames(deps, video, frames_dir, target_frames, width):
    dur = probe_duration(deps, video)
    fps = 1.0 if dur <= 0 else max(0.2, min(2.0, target_frames / dur))
    run([deps["ffmpeg"], "-hide_banner", "-loglevel", "error", "-y", "-i", str(video),
         "-vf", f"fps={fps:.4f},scale={width}:-2", "-q:v", "3",
         str(frames_dir / "frame_%03d.jpg")])
    return dur, sorted(frames_dir.glob("frame_*.jpg"))


def slides_to_frames(deps, images, frames_dir, width):
    out = []
    for i, img in enumerate(images, 1):
        dst = frames_dir / f"frame_{i:03d}.jpg"
        run([deps["ffmpeg"], "-hide_banner", "-loglevel", "error", "-y", "-i", str(img),
             "-vf", f"scale={width}:-2", "-q:v", "3", str(dst)])
        if dst.exists():
            out.append(dst)
    return out


def transcribe(deps, video, bundle, lang):
    proc = run([deps["venv_python"], str(SCRIPT_DIR / "transcribe.py"),
                str(video), str(bundle), lang or "auto"])
    if proc.returncode == 0 and (bundle / "transcript.txt").exists():
        return True
    print(proc.stderr, file=sys.stderr)
    return False


# --------------------------------------------------------------------------- #
# bundle writers
# --------------------------------------------------------------------------- #
def write_bundle(bundle, manifest):
    (bundle / "manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")

    m = manifest
    lines = []
    for k in ("title", "uploader", "upload_date", "duration",
              "like_count", "view_count", "source_url"):
        if m.get(k) not in (None, ""):
            lines.append(f"{k}: {m[k]}")
    if m.get("caption"):
        lines.append("\n--- caption / description ---\n" + m["caption"])
    (bundle / "meta.txt").write_text("\n".join(lines) + "\n", encoding="utf-8")

    summary = [
        "# social-vision bundle", "",
        f"- platform: {m.get('platform')}",
        f"- type: {m.get('type')}",
        f"- source: {m.get('source_url')}",
        f"- frames: {m.get('n_frames')} -> {m.get('frames_dir')}",
        f"- transcript: {m.get('transcript_path') or '(none)'}",
        f"- meta: {bundle / 'meta.txt'}",
    ]
    if m.get("error_code"):
        summary.append(f"- error_code: {m['error_code']}")
    (bundle / "SUMMARY.md").write_text("\n".join(summary) + "\n", encoding="utf-8")


def emit(manifest, bundle=None):
    print("\n=== social-vision result ===")
    print(f"ERROR_CODE: {manifest.get('error_code') or 'none'}")
    if bundle:
        print(f"BUNDLE: {bundle}")
        print(f"MANIFEST: {bundle / 'manifest.json'}")
    print(f"TYPE: {manifest.get('type')}")
    print(f"FRAMES: {manifest.get('n_frames', 0)}")
    print(f"TRANSCRIPT: {'yes' if manifest.get('transcript_path') else 'no'}")
    if manifest.get("message"):
        print("MESSAGE: " + manifest["message"])


# --------------------------------------------------------------------------- #
# main
# --------------------------------------------------------------------------- #
def main():
    ap = argparse.ArgumentParser(description="Analyze a social video/post for Claude.")
    ap.add_argument("input", help="URL (Instagram/TikTok/YouTube/X) or local video file")
    ap.add_argument("--cookies-from-browser", dest="cookies", default=None,
                    help="chrome|firefox|safari|edge|brave — for login-walled posts")
    ap.add_argument("--target-frames", type=int, default=40)
    ap.add_argument("--frame-width", type=int, default=512)
    ap.add_argument("--image-width", type=int, default=768)
    ap.add_argument("--model", default=None, help="override transcription model")
    ap.add_argument("--lang", default=None, help="force language code (else auto)")
    ap.add_argument("--no-transcribe", action="store_true")
    ap.add_argument("--outdir", default=None)
    args = ap.parse_args()

    deps = bootstrap.ensure_ready()
    if not deps["ok"]:
        print("\n=== social-vision result ===")
        print("ERROR_CODE: SETUP_FAILED")
        print("MESSAGE: " + (deps.get("error") or "dependency setup failed"))
        sys.exit(1)
    if args.model:
        deps["model"] = args.model  # informational; transcribe.py reads engine.json

    cookies = ["--cookies-from-browser", args.cookies] if args.cookies else []

    base = Path(args.outdir) if args.outdir else Path(deps["home"]) / "out"
    bundle = base / datetime.now().strftime("%Y%m%d-%H%M%S")
    frames_dir = bundle / "frames"
    frames_dir.mkdir(parents=True, exist_ok=True)

    is_local = Path(args.input).is_file()
    platform = "Local" if is_local else platform_of(args.input)
    errors = []

    # ---- local file: straight to frames + transcribe ----
    if is_local:
        video = bundle / ("video" + Path(args.input).suffix.lower())
        shutil.copy(args.input, video)
        meta = {"source_url": args.input, "caption": "", "title": Path(args.input).name}
        return finish_video(args, deps, bundle, frames_dir, video, meta, platform, errors)

    # ---- remote: metadata + routing ----
    meta_json, err = ytdlp_json(deps, args.input, cookies)

    if err == "EXTRACTOR_STALE":          # try a one-shot yt-dlp self-update, then retry
        run([deps["venv_python"], "-m", "pip", "install", "-q", "-U", "yt-dlp"])
        meta_json, err = ytdlp_json(deps, args.input, cookies)

    if err in ("NEEDS_LOGIN", "RATE_LIMITED") and not cookies:
        manifest = {**meta_fields(meta_json, args.input), "platform": platform,
                    "type": "text", "n_frames": 0, "transcript_path": None,
                    "error_code": err,
                    "message": ("This content needs you to be logged in. Re-run with "
                                "--cookies-from-browser <chrome|firefox|safari|edge|brave>."
                                if err == "NEEDS_LOGIN" else
                                "Rate-limited by the platform. Wait a few minutes, or pass "
                                "--cookies-from-browser to use your logged-in session.")}
        emit(manifest)
        sys.exit(0)

    fields = meta_fields(meta_json, args.input)

    if has_video(meta_json):
        video, derr = download_video(deps, args.input, cookies, bundle)
        if not video:
            errors.append(derr)
            ec = derr if derr in ("NEEDS_LOGIN", "RATE_LIMITED") else "DOWNLOAD_FAILED"
            manifest = {**fields, "platform": platform, "type": "text", "n_frames": 0,
                        "transcript_path": None, "error_code": ec, "errors": errors,
                        "message": "Could not download the video."}
            write_bundle(bundle, manifest)
            emit(manifest, bundle)
            sys.exit(0)
        return finish_video(args, deps, bundle, frames_dir, video, fields, platform, errors)

    # ---- image post (carousel / photo tweet) ----
    images, derr = download_images(deps, args.input, cookies, bundle)
    if not images:
        ec = derr if derr in ("NEEDS_LOGIN", "RATE_LIMITED") else "NO_MEDIA"
        msg = ("This post needs login — re-run with --cookies-from-browser <browser>."
               if ec == "NEEDS_LOGIN" else
               "No downloadable images or video were found at this URL.")
        if not fields["caption"]:
            fields.update({k: v for k, v in gallery_caption(deps, args.input, cookies).items() if v})
        manifest = {**fields, "platform": platform,
                    "type": "text" if fields.get("caption") else "text",
                    "n_frames": 0, "transcript_path": None, "error_code": ec,
                    "errors": errors, "message": msg}
        write_bundle(bundle, manifest)
        emit(manifest, bundle)
        sys.exit(0)

    if not fields["caption"]:
        fields.update({k: v for k, v in gallery_caption(deps, args.input, cookies).items() if v})

    frames = slides_to_frames(deps, images, frames_dir, args.image_width)
    manifest = {**fields, "platform": platform, "type": "image",
                "n_frames": len(frames), "frames_dir": str(frames_dir),
                "frame_files": [f.name for f in frames],
                "has_audio": False, "transcript_path": None, "errors": errors,
                "error_code": None}
    write_bundle(bundle, manifest)
    emit(manifest, bundle)


def finish_video(args, deps, bundle, frames_dir, video, fields, platform, errors):
    dur, frames = extract_frames(deps, video, frames_dir,
                                 args.target_frames, args.frame_width)
    audio = has_audio(deps, video)
    transcript_path = None
    if audio and not args.no_transcribe:
        if transcribe(deps, video, bundle, args.lang):
            transcript_path = str(bundle / "transcript.txt")
        else:
            errors.append("ASR_FAILED")
    fields["duration"] = fields.get("duration") or round(dur, 2)
    manifest = {**fields, "platform": platform, "type": "video",
                "n_frames": len(frames), "frames_dir": str(frames_dir),
                "frame_files": [f.name for f in frames],
                "has_audio": audio, "transcript_path": transcript_path,
                "transcript_srt": str(bundle / "transcript.srt") if transcript_path else None,
                "engine": deps["engine"], "model": deps["model"],
                "errors": errors,
                "error_code": "ASR_FAILED" if ("ASR_FAILED" in errors and not transcript_path) else None}
    write_bundle(bundle, manifest)
    emit(manifest, bundle)


if __name__ == "__main__":
    main()
