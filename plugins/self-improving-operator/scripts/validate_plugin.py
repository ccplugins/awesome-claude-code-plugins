#!/usr/bin/env python3
from __future__ import annotations

import hashlib
import json
import shutil
import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "variant-manifest.json"


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main() -> int:
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    errors: list[str] = []
    for item in manifest["files"]:
        target = ROOT / item["path"]
        if not target.exists():
            errors.append(f"Missing generated file: {target}")
            continue
        digest = sha256(target)
        if digest != item["sha256"]:
            errors.append(f"Generated file drift: {target}")
    if errors:
        for error in errors:
            print(f"ERROR: {error}")
        return 1

    if shutil.which("claude") is not None:
        result = subprocess.run(["claude", "plugin", "validate"], cwd=ROOT, check=False)
        if result.returncode != 0:
            return result.returncode

    print("Claude plugin variant matches manifest.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
