"""Projections — derived views from state and events."""

from . import weft_dir, event_store


def generate_context_md(state: dict, project_dir: str | None = None) -> str:
    """Generate a compact context summary for injection into Claude's context."""
    name = state["name"]
    status = state["status"]
    steps = state["steps"]
    current = state["current_step"]
    total = len(steps)

    current_name = steps[current]["name"] if current < total else "done"

    lines = [
        f"# Workflow: {name} [{status}]",
        f"Step {current + 1}/{total}: {current_name}",
        "",
    ]

    for s in steps:
        mark = {
            "complete": "x",
            "running": "~",
            "failed": "!",
            "skipped": "-",
        }.get(s["status"], " ")
        suffix = ""
        if s["status"] == "running" and s.get("on_fail") != "block":
            suffix = f" (on_fail: {s['on_fail']})"
        if s["status"] == "failed":
            suffix = f" (on_fail: {s['on_fail']}, retries: {s.get('retry_count', 0)})"
        opt = " [optional]" if s.get("optional") else ""
        skill = f" → invoke: {s['skill']}" if s.get("skill") else ""
        loop = ""
        if s.get("loop_back_to"):
            loop = f" ↻ loops to {s['loop_back_to']} ({s.get('loop_count', 0)}/{s.get('max_iterations', 3)})"
        lines.append(f"- [{mark}] {s['name']} ({s['status']}){suffix}{opt}{skill}{loop}")

    if status == "running" and current < total:
        cur_step = steps[current]
        guards = cur_step.get("guards", [])
        if guards:
            lines.append("")
            lines.append("Active guards (current step):")
            for g in guards:
                if isinstance(g, dict):
                    lines.append(f"  - {g.get('command_pattern', g.get('pattern', '?'))}: {g.get('message', 'blocked')}")
                else:
                    lines.append(f"  - {g}")
        if cur_step.get("exit_condition"):
            lines.append("")
            lines.append(f"Loop exit condition: {cur_step['exit_condition']}")

    lines += [
        "",
        "Use /weft:wf-step to advance. /weft:wf-status for details. /weft:ev-query for events.",
    ]

    return "\n".join(lines)


def write_context_md(state: dict, project_dir: str | None = None) -> None:
    """Write context.md to the weft directory."""
    content = generate_context_md(state, project_dir)
    path = weft_dir(project_dir) / "context.md"
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content)


def format_status(state: dict, project_dir: str | None = None) -> str:
    """Format a human-readable status view."""
    lines = [generate_context_md(state, project_dir)]

    events = event_store.query(
        project_dir,
        workflow_id=state.get("workflow_id"),
        last_n=10,
    )
    if events:
        lines.append("")
        lines.append("Recent events:")
        for ev in events:
            ts = ev.get("ts", "?")[:19]
            et = ev.get("event_type", "?")
            data_str = ""
            data = ev.get("data", {})
            if data.get("step_name"):
                data_str = f" → {data['step_name']}"
                if data.get("to_status"):
                    data_str += f" ({data['to_status']})"
            elif data.get("reason"):
                data_str = f" — {data['reason']}"
            lines.append(f"  {ts} {et}{data_str}")

    return "\n".join(lines)
