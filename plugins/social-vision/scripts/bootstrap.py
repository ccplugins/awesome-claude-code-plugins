#!/usr/bin/env python3
"""
bootstrap.py — first-run dependency setup for social-vision.

Pure standard library. Detects the platform, creates a plugin-local virtualenv,
installs the Python tools (yt-dlp, gallery-dl, and the best Whisper engine for
this machine), and makes sure ffmpeg is available. Idempotent: after the first
successful run it just reads the cached engine.json.

Engine choice:
  - macOS Apple Silicon      -> mlx-whisper       (Metal / Neural Engine)
  - NVIDIA GPU (Win/Linux)   -> faster-whisper    (CUDA, float16)
  - everything else (CPU)    -> faster-whisper    (CPU, int8)
"""

import json
import os
import platform
import shutil
import subprocess
import sys
from pathlib import Path

VERSION = "1.0.0"  # bump to force a re-bootstrap on upgrade

HOME = Path.home() / ".social-vision"
VENV = HOME / "venv"
ENGINE_JSON = HOME / "engine.json"
MARKER = HOME / ".deps-ok"

IS_WINDOWS = os.name == "nt"


# --------------------------------------------------------------------------- #
# small helpers
# --------------------------------------------------------------------------- #
def log(msg):
    print(f"[bootstrap] {msg}", file=sys.stderr, flush=True)


def venv_bin(name):
    """Path to an executable inside the venv (handles Windows layout)."""
    if IS_WINDOWS:
        exe = VENV / "Scripts" / (name + ".exe")
        return exe if exe.exists() else VENV / "Scripts" / name
    return VENV / "bin" / name


def venv_python():
    return str(venv_bin("python"))


def run(cmd, **kw):
    """Run a command, returning CompletedProcess (never raises on non-zero)."""
    return subprocess.run(cmd, capture_output=True, text=True, **kw)


def total_ram_gb():
    """Best-effort total RAM in GB (stdlib only). Defaults to 8 if unknown."""
    try:
        if sys.platform == "darwin":
            out = run(["sysctl", "-n", "hw.memsize"]).stdout.strip()
            return int(out) / (1024 ** 3)
        if sys.platform.startswith("linux"):
            pages = os.sysconf("SC_PHYS_PAGES")
            page_size = os.sysconf("SC_PAGE_SIZE")
            return pages * page_size / (1024 ** 3)
        if IS_WINDOWS:
            import ctypes

            class MemStatus(ctypes.Structure):
                _fields_ = [
                    ("dwLength", ctypes.c_ulong),
                    ("dwMemoryLoad", ctypes.c_ulong),
                    ("ullTotalPhys", ctypes.c_ulonglong),
                    ("ullAvailPhys", ctypes.c_ulonglong),
                    ("ullTotalPageFile", ctypes.c_ulonglong),
                    ("ullAvailPageFile", ctypes.c_ulonglong),
                    ("ullTotalVirtual", ctypes.c_ulonglong),
                    ("ullAvailVirtual", ctypes.c_ulonglong),
                    ("ullAvailExtendedVirtual", ctypes.c_ulonglong),
                ]

            stat = MemStatus()
            stat.dwLength = ctypes.sizeof(MemStatus)
            ctypes.windll.kernel32.GlobalMemoryStatusEx(ctypes.byref(stat))
            return stat.ullTotalPhys / (1024 ** 3)
    except Exception:
        pass
    return 8.0


def has_nvidia_gpu():
    if shutil.which("nvidia-smi") is None:
        return False
    return run(["nvidia-smi"]).returncode == 0


# --------------------------------------------------------------------------- #
# engine selection
# --------------------------------------------------------------------------- #
def choose_engine():
    ram = total_ram_gb()
    is_apple_silicon = sys.platform == "darwin" and platform.machine() == "arm64"

    if is_apple_silicon:
        model = (
            "mlx-community/whisper-large-v3-turbo"
            if ram >= 8
            else "mlx-community/whisper-small-mlx"
        )
        return {"engine": "mlx", "model": model, "device": "metal",
                "compute_type": "float16", "pip": ["mlx-whisper"]}

    if has_nvidia_gpu():
        return {"engine": "faster-whisper", "model": "large-v3", "device": "cuda",
                "compute_type": "float16", "pip": ["faster-whisper"]}

    # CPU fallback — small is fast and decent; base on low-RAM boxes
    model = "small" if ram >= 8 else "base"
    return {"engine": "faster-whisper", "model": model, "device": "cpu",
            "compute_type": "int8", "pip": ["faster-whisper"]}


# --------------------------------------------------------------------------- #
# ffmpeg
# --------------------------------------------------------------------------- #
def ensure_ffmpeg():
    """Return (ok, message). Auto-installs only via non-sudo managers."""
    if shutil.which("ffmpeg") and shutil.which("ffprobe"):
        return True, "ffmpeg present"

    log("ffmpeg not found — attempting install")
    if sys.platform == "darwin" and shutil.which("brew"):
        run(["brew", "install", "ffmpeg"])
    elif IS_WINDOWS and shutil.which("winget"):
        run(["winget", "install", "--silent", "--accept-package-agreements",
             "--accept-source-agreements", "-e", "--id", "Gyan.FFmpeg"])
    elif IS_WINDOWS and shutil.which("scoop"):
        run(["scoop", "install", "ffmpeg"])
    # Linux package managers need sudo — don't run silently.

    if shutil.which("ffmpeg") and shutil.which("ffprobe"):
        return True, "ffmpeg installed"

    if sys.platform.startswith("linux"):
        cmd = "sudo apt install -y ffmpeg   # (or: sudo dnf install ffmpeg / sudo pacman -S ffmpeg)"
    elif sys.platform == "darwin":
        cmd = "brew install ffmpeg   # (install Homebrew first: https://brew.sh)"
    else:
        cmd = "winget install Gyan.FFmpeg   # (or: scoop install ffmpeg)"
    return False, f"ffmpeg is required but could not be auto-installed. Please run:\n    {cmd}"


# --------------------------------------------------------------------------- #
# venv + python tools
# --------------------------------------------------------------------------- #
def ensure_venv():
    if not venv_bin("python").exists():
        log("creating virtualenv")
        run([sys.executable, "-m", "venv", str(VENV)])
        run([venv_python(), "-m", "pip", "install", "-q", "--upgrade", "pip"])


def pip_install(packages):
    log("installing: " + ", ".join(packages))
    proc = run([venv_python(), "-m", "pip", "install", "-q", "--upgrade", *packages])
    if proc.returncode != 0:
        log("pip install failed:\n" + (proc.stderr or proc.stdout))
    return proc.returncode == 0


# --------------------------------------------------------------------------- #
# orchestration
# --------------------------------------------------------------------------- #
def already_ok():
    if not MARKER.exists() or not ENGINE_JSON.exists():
        return False
    try:
        return MARKER.read_text().strip() == VERSION and venv_bin("python").exists()
    except Exception:
        return False


def ensure_ready(force=False):
    """
    Make sure everything is installed. Returns a dict:
      {ok, engine, model, device, compute_type, venv_python,
       yt_dlp, gallery_dl, ffmpeg, ffprobe, error}
    """
    HOME.mkdir(parents=True, exist_ok=True)

    if not force and already_ok():
        engine = json.loads(ENGINE_JSON.read_text())
        return _paths(engine, ok=True)

    engine = choose_engine()
    log(f"platform={sys.platform}/{platform.machine()} -> engine={engine['engine']} "
        f"model={engine['model']} device={engine['device']}")

    ensure_venv()
    pip_ok = pip_install(["yt-dlp", "gallery-dl", *engine["pip"]])
    ff_ok, ff_msg = ensure_ffmpeg()

    ENGINE_JSON.write_text(json.dumps(engine, indent=2))

    if pip_ok and ff_ok:
        MARKER.write_text(VERSION)
        return _paths(engine, ok=True)

    err = []
    if not pip_ok:
        err.append("Failed to install Python tools into the virtualenv.")
    if not ff_ok:
        err.append(ff_msg)
    return _paths(engine, ok=False, error="\n".join(err))


def _paths(engine, ok, error=None):
    return {
        "ok": ok,
        "error": error,
        "engine": engine["engine"],
        "model": engine["model"],
        "device": engine["device"],
        "compute_type": engine["compute_type"],
        "venv_python": venv_python(),
        "yt_dlp": str(venv_bin("yt-dlp")),
        "gallery_dl": str(venv_bin("gallery-dl")),
        "ffmpeg": shutil.which("ffmpeg") or "ffmpeg",
        "ffprobe": shutil.which("ffprobe") or "ffprobe",
        "home": str(HOME),
    }


if __name__ == "__main__":
    force = "--force" in sys.argv
    result = ensure_ready(force=force)
    print(json.dumps(result, indent=2))
    sys.exit(0 if result["ok"] else 1)
