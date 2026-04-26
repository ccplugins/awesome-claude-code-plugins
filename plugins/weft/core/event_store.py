"""Append-only JSONL event store with file locking."""

import fcntl
import json
from pathlib import Path

from . import weft_dir, now_iso


def _events_path(project_dir: str | None = None) -> Path:
    return weft_dir(project_dir) / "events.jsonl"


def append(event_type: str, data: dict, *,
           session_id: str = "unknown",
           workflow_id: str | None = None,
           project_dir: str | None = None) -> dict:
    """Append an event to events.jsonl. Returns the envelope."""
    path = _events_path(project_dir)
    path.parent.mkdir(parents=True, exist_ok=True)

    envelope = {
        "v": 1,
        "ts": now_iso(),
        "session_id": session_id,
        "workflow_id": workflow_id,
        "event_type": event_type,
        "data": data,
    }

    line = json.dumps(envelope, separators=(",", ":")) + "\n"

    with open(path, "a") as f:
        fcntl.flock(f, fcntl.LOCK_EX)
        try:
            f.write(line)
        finally:
            fcntl.flock(f, fcntl.LOCK_UN)

    return envelope


def read_all(project_dir: str | None = None) -> list[dict]:
    """Read all events."""
    path = _events_path(project_dir)
    if not path.exists():
        return []
    events = []
    with open(path) as f:
        for line in f:
            line = line.strip()
            if line:
                try:
                    events.append(json.loads(line))
                except json.JSONDecodeError:
                    continue
    return events


def query(project_dir: str | None = None, *,
          event_type: str | None = None,
          workflow_id: str | None = None,
          session_id: str | None = None,
          tool: str | None = None,
          last_n: int | None = None) -> list[dict]:
    """Query events with optional filters."""
    events = read_all(project_dir)

    if event_type:
        events = [e for e in events if e.get("event_type") == event_type]
    if workflow_id:
        events = [e for e in events if e.get("workflow_id") == workflow_id]
    if session_id:
        events = [e for e in events if e.get("session_id") == session_id]
    if tool:
        events = [e for e in events if e.get("data", {}).get("tool") == tool]
    if last_n:
        events = events[-last_n:]

    return events
