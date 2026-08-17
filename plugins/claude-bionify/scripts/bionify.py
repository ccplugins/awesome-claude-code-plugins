#!/usr/bin/env python3
"""claude-bionify MessageDisplay hook: bold the leading part of prose words.

Reads a MessageDisplay event as JSON on stdin and prints a `displayContent`
replacement built by the functional `core`. Code, existing bold, markdown links,
bare URLs, and emails render verbatim, and ALL-CAPS acronyms are left whole.

The change is display-only. Claude Code keeps the original text in the
transcript and in the model's context. This shell holds the side effects: it
reads userConfig and live overrides, persists per-message fence state, and
writes to stdout. It is crash-safe: on any error it prints nothing, so Claude
Code falls back to the original text. Set CLAUDE_BIONIFY_DEBUG=1 to re-raise instead.
"""

import contextlib
import json
import os
import re
import sys
from typing import NamedTuple

import core
import overrides
import settings


def _option(name: str) -> str | None:
    """Read a userConfig value from its CLAUDE_PLUGIN_OPTION_* env var."""
    return (os.environ.get(f"CLAUDE_PLUGIN_OPTION_{name.upper()}")
            or os.environ.get(f"CLAUDE_PLUGIN_OPTION_{name}"))


def load_config() -> settings.Style | None:
    """Resolve the active Style from userConfig plus any live overrides.

    Returns None when claude-bionify is turned off via `/claude-bionify:off`, so the hook
    passes the original text through unchanged.
    """
    raw = settings.from_env(_option)
    override = overrides.load()
    if override.get("enabled") is False:
        return None
    for key in settings.RAW_KEYS:
        if key in override:
            raw[key] = override[key]
    return settings.build_style(raw)


def _fence_dir() -> str | None:
    return os.environ.get("CLAUDE_PLUGIN_DATA")


def _fence_path(data_dir: str, message_id: str) -> str:
    safe = re.sub(r"[^A-Za-z0-9_-]", "-", message_id)
    return os.path.join(data_dir, f"fence-{safe}.state")


def _remove_quietly(path: str) -> None:
    with contextlib.suppress(OSError):
        os.remove(path)


def read_fence_state(message_id: str, index: int | None) -> bool:
    """Whether the previous delta ended inside a code fence.

    A message always begins outside a fence, so the first delta (index 0) starts
    fresh and never trusts a leftover file.
    """
    data_dir = _fence_dir()
    if not data_dir or not message_id or index == 0:
        return False
    try:
        with open(_fence_path(data_dir, message_id), encoding="utf-8") as f:
            return f.read().strip() == "1"
    except OSError:
        return False


def write_fence_state(message_id: str, inside_fence: bool) -> None:
    """Persist fence state for the next delta.

    Written to a temporary file and moved into place, because Claude Code allows
    several flushes of one message to be in flight at once. A plain truncating
    write would let a concurrent reader see an empty file and treat a code block
    as prose.
    """
    data_dir = _fence_dir()
    if not data_dir or not message_id:
        return
    path = _fence_path(data_dir, message_id)
    tmp = f"{path}.tmp-{os.getpid()}"
    try:
        os.makedirs(data_dir, exist_ok=True)
        with open(tmp, "w", encoding="utf-8") as f:
            f.write("1" if inside_fence else "0")
        os.replace(tmp, path)
    except OSError:
        _remove_quietly(tmp)


def clear_fence_state(message_id: str) -> None:
    """Drop the fence file once a message has ended."""
    data_dir = _fence_dir()
    if not data_dir or not message_id:
        return
    _remove_quietly(_fence_path(data_dir, message_id))


def sweep_stale_state(current_message_id: str) -> None:
    """Drop fence files left by earlier messages that never sent a final delta.

    Also collects temporary files orphaned by a killed process, which is why the
    match is on the `fence-` prefix alone rather than the `.state` suffix. The
    keep test is a prefix match so the current message's in-flight temporary
    files survive too: a concurrent flush may be between writing its temporary
    file and moving it into place while this sweep runs.
    """
    data_dir = _fence_dir()
    if not data_dir:
        return
    keep = (os.path.basename(_fence_path(data_dir, current_message_id))
            if current_message_id else None)
    try:
        for entry in os.listdir(data_dir):
            if entry.startswith("fence-") and not (keep and entry.startswith(keep)):
                _remove_quietly(os.path.join(data_dir, entry))
    except OSError:
        pass


class DisplayEvent(NamedTuple):
    """The MessageDisplay payload, parsed from Claude Code's raw hook event.

    Claude Code streams an assistant message as a sequence of these, one per
    flush of newly completed lines. `parse_event` is the one place that reads the
    wire format.
    """
    delta: str
    message_id: str    # keys the per-message fence state
    index: int | None
    final: bool


def parse_event(raw: dict) -> DisplayEvent:
    """Read the fields the hook needs from a raw MessageDisplay event.

    Claude Code sends `message_id`; `messageId` is accepted for older builds.
    `session_id` is the floor because the base hook payload always carries it,
    and an empty key would let code blocks spanning deltas get bolded.
    """
    return DisplayEvent(
        delta=raw.get("delta") or "",
        message_id=str(raw.get("message_id") or raw.get("messageId")
                       or raw.get("session_id") or ""),
        index=raw.get("index"),
        final=bool(raw.get("final")),
    )


def main() -> None:
    try:
        # JSON is UTF-8 on the wire; sys.stdin would apply the locale encoding.
        event = parse_event(json.loads(sys.stdin.buffer.read() or b"{}"))
        if not event.delta:
            # Only the final flush can arrive empty, and it does whenever the
            # message ends on a newline. Nothing is left to bold, but the fence
            # file still has to go, since no later flush will clear it.
            if event.final:
                clear_fence_state(event.message_id)
            return

        style = load_config()
        if style is None:        # turned off via /claude-bionify:off
            return

        if event.index == 0:
            sweep_stale_state(event.message_id)
        inside_fence = read_fence_state(event.message_id, event.index)
        display, inside_fence = core.transform(event.delta, inside_fence, style)
        if event.final:
            clear_fence_state(event.message_id)
        else:
            write_fence_state(event.message_id, inside_fence)

        # ensure_ascii keeps the payload ASCII, so stdout encodes under any locale.
        json.dump({
            "hookSpecificOutput": {
                "hookEventName": "MessageDisplay",
                "displayContent": display,
            }
        }, sys.stdout, ensure_ascii=True)
    except Exception:
        # Crash-safe: emit nothing so Claude Code renders the original text.
        if os.environ.get("CLAUDE_BIONIFY_DEBUG"):
            raise


if __name__ == "__main__":
    main()
