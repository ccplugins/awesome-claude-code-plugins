"""Whether the MessageDisplay hook can start.

hooks.json launches its interpreters in exec form, which Claude Code spawns with
no shell, so the name must resolve to a real executable. Windows ships a
Microsoft Store placeholder named python3.exe that spawns and exits without
running Python, so a candidate is judged by running it, not by finding it.
"""

import json
import os
import shutil
import subprocess
import sys
from typing import NamedTuple

MINIMUM = (3, 10)
PROBE_TIMEOUT = 10
_PROBE = "import sys; print(sys.version_info[0], sys.version_info[1])"


class Candidate(NamedTuple):
    """An interpreter the hook could be launched with."""

    command: str
    args: tuple[str, ...] = ()


def candidate_of(hook: dict) -> Candidate | None:
    """The interpreter one hooks.json entry launches, flags included."""
    command = hook.get("command")
    if not isinstance(command, str) or not command:
        return None
    if not isinstance(hook.get("args"), list):
        return None
    flags = tuple(str(a) for a in hook["args"] if not str(a).endswith(".py"))
    return Candidate(command, flags)


def _entries(hooks_json: dict) -> list[dict]:
    """The MessageDisplay hook entries, ignoring anything oddly shaped.

    A malformed file yields no entries rather than an exception, so it cannot
    take a slash command down with it.
    """
    if not isinstance(hooks_json, dict) or not isinstance(hooks_json.get("hooks"), dict):
        return []
    groups = hooks_json["hooks"].get("MessageDisplay")
    if not isinstance(groups, list):
        return []
    return [hook
            for group in groups if isinstance(group, dict)
            and isinstance(group.get("hooks"), list)
            for hook in group["hooks"] if isinstance(hook, dict)]


def declared(hooks_json: dict) -> tuple[Candidate, ...]:
    """Every interpreter the MessageDisplay hook declares, in order."""
    found = []
    for hook in _entries(hooks_json):
        candidate = candidate_of(hook)
        if candidate is not None and candidate not in found:
            found.append(candidate)
    return tuple(found)


def parse_version(raw: bytes) -> tuple[int, int] | None:
    """Read `(major, minor)` from the last line the probe printed.

    Only the last line counts: a sitecustomize or a conda banner can print ahead
    of it, and reading the whole stream would call a healthy interpreter dead.
    """
    lines = raw.decode("utf-8", "replace").strip().splitlines()
    parts = lines[-1].split() if lines else []
    try:
        return int(parts[0]), int(parts[1])
    except (IndexError, ValueError):
        return None


def found_only_beside_prober(command: str) -> bool:
    """Whether Windows resolved this name from our own directory rather than PATH.

    CreateProcess searches the calling process's directory first, so a Python
    probing for `python` finds its own sibling, which the hook cannot reach.
    """
    if os.name != "nt":
        return False
    beside = os.path.join(os.path.dirname(sys.executable), f"{command}.exe")
    if not os.path.exists(beside):
        return False
    on_path = shutil.which(command)
    return on_path is None or not os.path.samefile(on_path, beside)


def starts(candidate: Candidate, timeout: int = PROBE_TIMEOUT) -> bool:
    """Whether running `candidate` yields a Python the hook could use."""
    argv = [candidate.command, *candidate.args, "-c", _PROBE]
    try:
        done = subprocess.run(argv, capture_output=True, timeout=timeout)
    except (OSError, subprocess.SubprocessError):
        return False
    if done.returncode != 0:          # the Store placeholder lands here, exiting 9009
        return False
    if found_only_beside_prober(candidate.command):
        return False
    version = parse_version(done.stdout)
    return version is not None and version >= MINIMUM


def load_hooks(plugin_root: str) -> dict:
    with open(os.path.join(plugin_root, "hooks", "hooks.json"), encoding="utf-8") as f:
        return json.load(f)


def any_usable(plugin_root: str, timeout: int = PROBE_TIMEOUT) -> bool:
    """Whether the hook can start, stopping at the first interpreter that works."""
    return any(starts(c, timeout) for c in declared(load_hooks(plugin_root)))
