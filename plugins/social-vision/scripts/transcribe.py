#!/usr/bin/env python3
"""
transcribe.py — runs INSIDE the social-vision venv (so it can import the
Whisper engine). Reads ~/.social-vision/engine.json, transcribes one audio/video
file, and writes transcript.txt + transcript.srt into the output directory.

Usage:
    <venv python> transcribe.py <media_path> <out_dir> [language]

Both engines are configured to avoid the classic Whisper "silence hallucination"
(repeated phantom lines) via VAD / no-condition-on-previous-text settings.
"""

import json
import sys
from pathlib import Path

HOME = Path.home() / ".social-vision"
ENGINE_JSON = HOME / "engine.json"


def fmt_ts(seconds):
    if seconds is None or seconds < 0:
        seconds = 0
    ms = int(round(seconds * 1000))
    h, ms = divmod(ms, 3600_000)
    m, ms = divmod(ms, 60_000)
    s, ms = divmod(ms, 1000)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"


def write_outputs(out_dir, segments):
    """segments: list of (start, end, text)."""
    out_dir = Path(out_dir)
    txt_lines, srt_blocks = [], []
    for i, (start, end, text) in enumerate(segments, 1):
        text = (text or "").strip()
        if not text:
            continue
        txt_lines.append(text)
        srt_blocks.append(f"{i}\n{fmt_ts(start)} --> {fmt_ts(end)}\n{text}\n")
    (out_dir / "transcript.txt").write_text("\n".join(txt_lines) + "\n", encoding="utf-8")
    (out_dir / "transcript.srt").write_text("\n".join(srt_blocks) + "\n", encoding="utf-8")
    return len(txt_lines)


def transcribe_mlx(media, model, language):
    import mlx_whisper
    result = mlx_whisper.transcribe(
        str(media),
        path_or_hf_repo=model,
        language=language,
        condition_on_previous_text=False,      # kills the repeat-line hallucination
        no_speech_threshold=0.6,
        compression_ratio_threshold=2.4,
        hallucination_silence_threshold=2.0,
        verbose=False,
    )
    segs = [(s.get("start"), s.get("end"), s.get("text")) for s in result.get("segments", [])]
    if not segs and result.get("text"):
        segs = [(0, 0, result["text"])]
    return segs


def transcribe_faster(media, model, device, compute_type, language):
    from faster_whisper import WhisperModel

    def load(dev, ct):
        return WhisperModel(model, device=dev, compute_type=ct)

    try:
        wm = load(device, compute_type)
    except Exception as e:
        print(f"[transcribe] {device}/{compute_type} unavailable ({e}); "
              f"falling back to CPU int8", file=sys.stderr)
        wm = load("cpu", "int8")

    segments, _info = wm.transcribe(
        str(media),
        language=language,
        vad_filter=True,                        # drop silence -> no hallucinated lines
        condition_on_previous_text=False,
        no_speech_threshold=0.6,
    )
    return [(s.start, s.end, s.text) for s in segments]


def main():
    if len(sys.argv) < 3:
        print("usage: transcribe.py <media> <out_dir> [language]", file=sys.stderr)
        sys.exit(2)

    media, out_dir = sys.argv[1], sys.argv[2]
    language = sys.argv[3] if len(sys.argv) > 3 and sys.argv[3] not in ("", "auto") else None

    engine = json.loads(ENGINE_JSON.read_text())
    eng = engine["engine"]
    model = engine["model"]

    if eng == "mlx":
        segs = transcribe_mlx(media, model, language)
    else:
        segs = transcribe_faster(media, model, engine["device"],
                                 engine["compute_type"], language)

    n = write_outputs(out_dir, segs)
    print(f"[transcribe] wrote {n} lines using {eng}:{model}", file=sys.stderr)


if __name__ == "__main__":
    main()
