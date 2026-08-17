#!/usr/bin/env python3
"""claude-bionify live control: update the runtime-override file the hook reads.

Usage: control.py <verb> [args]
  on | off | toggle            enable / disable claude-bionify
  set <option> <value>         fixation <0.1-0.9> | boundary <fraction|syllable|log>
                               | minlen <n> | acronyms <on|off> | urls <on|off>
                               | headings <on|off>
  status                       show the active overrides
  reset                        clear all overrides (back to your configured defaults)

Option metadata lives in `settings`; persistence in `overrides`. This shell only
parses the verb and prints a single status line, and always exits 0 so the slash
command never errors.
"""

import os
import sys

import interpreters
import overrides
import settings

_PLUGIN_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

_PROBE_TIMEOUT = 5      # shorter than the hook's, so a wedged interpreter cannot stall a command


def health_warning() -> str | None:
    """Warn when this command runs but the hook's interpreters do not.

    A shell resolves names the hook's exec-form spawn cannot, so without this
    `status` reports ON on a machine where nothing is being bolded.
    """
    try:
        healthy = interpreters.any_usable(_PLUGIN_ROOT, timeout=_PROBE_TIMEOUT)
    except (OSError, ValueError):
        # Unreadable hooks.json means nothing is bolding either, and saying so
        # beats the silence that hid this class of failure in the first place.
        return "claude-bionify: WARNING the hook configuration could not be read"
    except Exception:
        return None
    if not healthy:
        return ("claude-bionify: WARNING nothing is being bolded, because no "
                "interpreter the hook declares could be started")
    return None


def _apply_set(state: dict, rest: list) -> tuple[dict, str]:
    if len(rest) < 2:
        return state, ("claude-bionify: set "
                       "<fixation|boundary|minlen|acronyms|urls|headings> <value>")
    key, value = rest[0].lower(), rest[1]
    setting = settings.by_cli_key(key)
    if setting is None:
        return state, f"claude-bionify: unknown option '{key}'"
    try:
        state[setting.name] = setting.parse(value)
    except (TypeError, ValueError):
        return state, f"claude-bionify: {setting.invalid(value)}"
    return state, settings.render_state(state)


def apply(state: dict, argv: list) -> tuple[dict | None, str]:
    """Apply a command to `state`. Returns (new_state | None to reset, message)."""
    if not argv:
        return state, settings.render_state(state)
    verb, rest = argv[0].lower(), argv[1:]
    if verb in ("on", "enable"):
        state["enabled"] = True
    elif verb in ("off", "disable"):
        state["enabled"] = False
    elif verb == "toggle":
        state["enabled"] = state.get("enabled") is False  # flip; default ON
    elif verb == "status":
        return state, settings.render_state(state)
    elif verb == "reset":
        return None, "claude-bionify: overrides cleared, using your configured defaults"
    elif verb == "set":
        return _apply_set(state, rest)
    else:
        return _apply_set(state, argv)  # forgiving: treat bare `<option> <value>`
    return state, settings.render_state(state)


def main(argv: list) -> None:
    new_state, message = apply(overrides.load(), argv)
    if new_state is None:
        overrides.clear()
    else:
        overrides.save(new_state)
    if argv and argv[0].lower() == "status":
        warning = health_warning()
        if warning:
            message = f"{message}\n{warning}"
    # Output is read as UTF-8; print() would apply the locale encoding.
    sys.stdout.buffer.write(message.encode("utf-8") + b"\n")


if __name__ == "__main__":
    main(sys.argv[1:])
