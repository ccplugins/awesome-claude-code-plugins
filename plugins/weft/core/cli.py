#!/usr/bin/env python3
"""Unified CLI entry point for weft.

Usage:
    python3 cli.py start <template> [--steps step1,step2,...]
    python3 cli.py step <complete|fail|skip|retry> [reason]
    python3 cli.py status [--json]
    python3 cli.py abort [reason]
    python3 cli.py rebuild [workflow_id]
    python3 cli.py query [--type TYPE] [--tool TOOL] [--last N] [--workflow ID]
    python3 cli.py guard          # reads hook JSON from stdin
    python3 cli.py gate           # reads hook JSON from stdin (stop hook)
    python3 cli.py context        # outputs context.md to stdout
"""

import json
import os
import sys

# Ensure the core package is importable
sys.path.insert(0, str(__import__("pathlib").Path(__file__).parent.parent))

from core import event_store, state_machine, projections, templates


def _session_id() -> str:
    return os.environ.get("CLAUDE_SESSION_ID", "unknown")


def _project_dir() -> str | None:
    return os.environ.get("CLAUDE_PROJECT_DIR") or None


def cmd_start(args: list[str]) -> None:
    """Start a new workflow."""
    if not args:
        available = templates.list_templates(_project_dir())
        print("Available templates:")
        for t in available:
            print(f"  {t['name']} — {t['description']} ({t['steps']} steps)")
        return

    name = args[0]

    # Check if it's comma-separated step names
    if "," in name:
        step_names = [s.strip() for s in name.split(",")]
        tmpl = templates.template_from_steps(step_names)
    else:
        tmpl = templates.load_template(name, _project_dir())
        if not tmpl:
            print(f"Template not found: {name}", file=sys.stderr)
            print("Available:", file=sys.stderr)
            for t in templates.list_templates(_project_dir()):
                print(f"  {t['name']}", file=sys.stderr)
            sys.exit(1)

    state = state_machine.start_workflow(tmpl, _session_id(), _project_dir())
    projections.write_context_md(state, _project_dir())

    print(f"Workflow started: {state['workflow_id']}")
    print(f"Steps: {len(state['steps'])}")
    print(f"Current: {state['steps'][0]['name']}")
    print()
    print(projections.generate_context_md(state, _project_dir()))


def cmd_step(args: list[str]) -> None:
    """Transition the current step."""
    if not args:
        print("Usage: step <complete|fail|skip|retry> [reason]", file=sys.stderr)
        sys.exit(1)

    action = args[0]
    reason = " ".join(args[1:]) if len(args) > 1 else ""
    sid = _session_id()
    pdir = _project_dir()

    state = state_machine.load_state(pdir)
    if not state:
        print("No active workflow", file=sys.stderr)
        sys.exit(1)

    if state["status"] not in ("running", "failed"):
        print(f"Workflow is {state['status']}, cannot transition steps", file=sys.stderr)
        sys.exit(1)

    actions = {
        "complete": state_machine.step_complete,
        "fail": state_machine.step_fail,
        "skip": state_machine.step_skip,
        "retry": state_machine.step_retry,
        "loop-continue": state_machine.step_loop_back,
        "loop-done": state_machine.step_loop_done,
    }

    fn = actions.get(action)
    if not fn:
        print(f"Unknown action: {action}. Use: complete|fail|skip|retry|loop-continue|loop-done", file=sys.stderr)
        sys.exit(1)

    try:
        state = fn(state, reason, sid, pdir)
    except ValueError as e:
        print(str(e), file=sys.stderr)
        sys.exit(1)

    projections.write_context_md(state, pdir)
    print(projections.generate_context_md(state, pdir))


def cmd_status(args: list[str]) -> None:
    """Show current workflow status."""
    pdir = _project_dir()
    state = state_machine.load_state(pdir)

    if not state:
        print("No active workflow.")
        return

    if "--json" in args:
        print(json.dumps(state, indent=2))
    else:
        print(projections.format_status(state, pdir))


def cmd_abort(args: list[str]) -> None:
    """Abort the current workflow."""
    reason = " ".join(args) if args else "user aborted"
    pdir = _project_dir()
    state = state_machine.load_state(pdir)

    if not state:
        print("No active workflow.", file=sys.stderr)
        sys.exit(1)

    state = state_machine.abort_workflow(state, reason, _session_id(), pdir)
    projections.write_context_md(state, pdir)
    print(f"Workflow '{state['name']}' aborted: {reason}")


def cmd_rebuild(args: list[str]) -> None:
    """Rebuild state.json from the event log."""
    workflow_id = args[0] if args else None
    pdir = _project_dir()

    state = state_machine.rebuild_from_events(pdir, workflow_id)
    if state:
        projections.write_context_md(state, pdir)
        print(f"Rebuilt state for: {state['workflow_id']}")
        print(projections.generate_context_md(state, pdir))
    else:
        print("No workflow events found to rebuild from.", file=sys.stderr)
        sys.exit(1)


def cmd_query(args: list[str]) -> None:
    """Query the event log."""
    kwargs = {}
    i = 0
    while i < len(args):
        if args[i] == "--type" and i + 1 < len(args):
            kwargs["event_type"] = args[i + 1]
            i += 2
        elif args[i] == "--tool" and i + 1 < len(args):
            kwargs["tool"] = args[i + 1]
            i += 2
        elif args[i] == "--last" and i + 1 < len(args):
            try:
                kwargs["last_n"] = int(args[i + 1])
            except ValueError:
                print(f"--last requires integer, got: {args[i + 1]}", file=sys.stderr)
                sys.exit(1)
            i += 2
        elif args[i] == "--workflow" and i + 1 < len(args):
            kwargs["workflow_id"] = args[i + 1]
            i += 2
        elif args[i] == "--session" and i + 1 < len(args):
            kwargs["session_id"] = args[i + 1]
            i += 2
        else:
            # Treat bare arg as event_type filter
            kwargs["event_type"] = args[i]
            i += 1

    events = event_store.query(_project_dir(), **kwargs)

    if not events:
        # No filter results, show summary
        all_events = event_store.read_all(_project_dir())
        if not all_events:
            print("No events recorded yet.")
            return
        counts: dict[str, int] = {}
        for e in all_events:
            et = e.get("event_type", "unknown")
            counts[et] = counts.get(et, 0) + 1
        print(f"Total events: {len(all_events)}")
        for et, c in sorted(counts.items()):
            print(f"  {et}: {c}")
        return

    for ev in events:
        ts = ev.get("ts", "?")[:19]
        et = ev.get("event_type", "?")
        data = ev.get("data", {})
        parts = [f"{ts} {et}"]
        if data.get("tool"):
            parts.append(f"tool={data['tool']}")
        if data.get("step_name"):
            parts.append(f"step={data['step_name']}")
        if data.get("to_status"):
            parts.append(f"→ {data['to_status']}")
        if data.get("reason"):
            parts.append(f"({data['reason'][:80]})")
        print("  ".join(parts))


def cmd_guard(_args: list[str]) -> None:
    """Guard check for PreToolUse hook. Reads stdin."""
    from core import guard_engine
    guard_engine.main()


def cmd_gate(_args: list[str]) -> None:
    """Completion gate for Stop hook. Reads stdin."""
    raw = sys.stdin.read()
    try:
        hook_input = json.loads(raw)
    except json.JSONDecodeError:
        sys.exit(0)

    # If this is a stop_hook re-entry, allow
    if hook_input.get("stop_hook_active"):
        sys.exit(0)

    pdir = _project_dir()
    state = state_machine.load_state(pdir)

    if not state:
        sys.exit(0)

    status = state.get("status", "idle")
    if status in ("idle", "complete", "aborted"):
        sys.exit(0)

    # Session isolation — only block the session that owns the workflow.
    # "unknown" means no session tracking; treat as wildcard (block all sessions).
    state_session = state.get("session_id", "")
    hook_session = hook_input.get("session_id", "")
    if (state_session and state_session != "unknown"
            and hook_session and hook_session != "unknown"
            and state_session != hook_session):
        sys.exit(0)

    incomplete = [
        s["name"] for s in state["steps"]
        if s["status"] not in ("complete", "skipped")
    ]

    if incomplete:
        print(
            f"Workflow '{state['name']}' has incomplete steps: {', '.join(incomplete)}. "
            f"Use /weft:wf-step to advance or /weft:wf-abort to cancel.",
            file=sys.stderr,
        )
        sys.exit(2)

    sys.exit(0)


def cmd_context(_args: list[str]) -> None:
    """Output context.md to stdout for hook injection."""
    pdir = _project_dir()
    state = state_machine.load_state(pdir)

    if not state or state.get("status") in ("idle",):
        sys.exit(0)

    print(projections.generate_context_md(state, pdir))


def cmd_preview(args: list[str]) -> None:
    """Show detailed template preview."""
    if not args:
        print("Usage: preview <template-name>", file=sys.stderr)
        print("Use 'start' with no args to list templates.", file=sys.stderr)
        sys.exit(1)

    detail = templates.template_detail(args[0], _project_dir())
    if not detail:
        print(f"Template not found: {args[0]}", file=sys.stderr)
        sys.exit(1)

    print(detail)


def cmd_save_template(_args: list[str]) -> None:
    """Save a template from JSON on stdin."""
    raw = sys.stdin.read()
    try:
        tmpl = json.loads(raw)
    except json.JSONDecodeError as e:
        print(f"Invalid JSON: {e}", file=sys.stderr)
        sys.exit(1)

    if "name" not in tmpl or "steps" not in tmpl:
        print("Template must have 'name' and 'steps' fields", file=sys.stderr)
        sys.exit(1)

    path = templates.save_template(tmpl, _project_dir())
    print(f"Template saved: {path}")


def cmd_dashboard(_args: list[str]) -> None:
    """Launch the interactive TUI dashboard."""
    from core.dashboard import WeftDashboard
    app = WeftDashboard(project_dir=_project_dir())
    app.run()


def main():
    if len(sys.argv) < 2:
        print("Usage: cli.py <command> [args...]", file=sys.stderr)
        print("Commands: start, step, status, abort, rebuild, query, preview, save-template, dashboard, guard, gate, context",
              file=sys.stderr)
        sys.exit(1)

    commands = {
        "start": cmd_start,
        "step": cmd_step,
        "status": cmd_status,
        "abort": cmd_abort,
        "rebuild": cmd_rebuild,
        "query": cmd_query,
        "preview": cmd_preview,
        "save-template": cmd_save_template,
        "dashboard": cmd_dashboard,
        "guard": cmd_guard,
        "gate": cmd_gate,
        "context": cmd_context,
    }

    cmd = sys.argv[1]
    fn = commands.get(cmd)
    if not fn:
        print(f"Unknown command: {cmd}", file=sys.stderr)
        sys.exit(1)

    fn(sys.argv[2:])


if __name__ == "__main__":
    main()
