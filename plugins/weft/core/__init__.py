"""Weft — deterministic workflow tracking for Claude Code."""

import os
from datetime import datetime, timezone
from pathlib import Path


def weft_dir(project_dir: str | None = None) -> Path:
    """Return the weft data directory for the given project."""
    base = project_dir or os.environ.get("CLAUDE_PROJECT_DIR", ".")
    return Path(base) / ".claude" / "weft"


def now_iso() -> str:
    """ISO 8601 UTC timestamp with millisecond precision."""
    now = datetime.now(timezone.utc)
    return now.strftime("%Y-%m-%dT%H:%M:%S.") + f"{now.microsecond // 1000:03d}Z"


def now_dt_and_iso() -> tuple[datetime, str]:
    """Return both the datetime and ISO string from a single now() call."""
    now = datetime.now(timezone.utc)
    iso = now.strftime("%Y-%m-%dT%H:%M:%S.") + f"{now.microsecond // 1000:03d}Z"
    return now, iso
