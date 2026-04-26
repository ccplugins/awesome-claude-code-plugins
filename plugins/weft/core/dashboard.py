#!/usr/bin/env python3
"""Weft TUI Dashboard — visual overview of plugin building blocks."""

import json
import os
import sys
from pathlib import Path

from textual.app import App, ComposeResult
from textual.binding import Binding
from textual.containers import Horizontal, Vertical, VerticalScroll
from textual.widgets import Footer, Header, Static
from rich.panel import Panel
from rich.table import Table
from rich.text import Text

sys.path.insert(0, str(Path(__file__).parent.parent))

from core import state_machine, event_store, templates, weft_dir


PLUGIN_ROOT = Path(__file__).parent.parent


def _load_hooks_json() -> dict:
    path = PLUGIN_ROOT / "hooks" / "hooks.json"
    if path.exists():
        return json.loads(path.read_text())
    return {}


def _load_skills() -> list[dict]:
    skills_dir = PLUGIN_ROOT / "skills"
    results = []
    if not skills_dir.exists():
        return results
    for skill_dir in sorted(skills_dir.iterdir()):
        md = skill_dir / "SKILL.md"
        if not md.exists():
            continue
        text = md.read_text()
        info = {"id": skill_dir.name, "name": skill_dir.name, "description": "", "hint": ""}
        for line in text.split("\n"):
            if line.startswith("name:"):
                info["name"] = line.split(":", 1)[1].strip().strip('"')
            elif line.startswith("description:"):
                info["description"] = line.split(":", 1)[1].strip().strip('"')
            elif line.startswith("argument-hint:"):
                info["hint"] = line.split(":", 1)[1].strip().strip('"')
        results.append(info)
    return results


def _load_template_detail(name: str) -> dict | None:
    path = PLUGIN_ROOT / "templates" / f"{name}.json"
    if path.exists():
        return json.loads(path.read_text())
    return None


# ── Panel builders ─────────────────────────────────────────────────


def _build_workflow_panel(state: dict | None) -> Panel:
    if not state:
        content = Text("No active workflow\n\nStart one with /wf-start <template>", style="dim")
        return Panel(content, title="[bold green] Workflow [/]", border_style="green")

    status_colors = {
        "running": "bold green",
        "complete": "bold blue",
        "failed": "bold red",
        "aborted": "bold yellow",
    }
    status_style = status_colors.get(state["status"], "bold white")

    lines = Text()
    lines.append(f"  {state['name']}", style="bold white")
    lines.append(f"  [{state['status'].upper()}]", style=status_style)
    lines.append(f"\n  ID: {state['workflow_id']}", style="dim")
    lines.append(f"  |  Session: {state.get('session_id', '?')}\n\n", style="dim")

    step_icons = {
        "complete": ("  [bold green]✓[/] ", "green"),
        "running":  ("  [bold cyan]►[/] ", "bold cyan"),
        "failed":   ("  [bold red]✗[/] ", "red"),
        "skipped":  ("  [dim]–[/] ", "dim"),
        "pending":  ("  [dim]○[/] ", "dim"),
    }

    for i, step in enumerate(state["steps"]):
        markup_icon, style = step_icons.get(step["status"], ("  ? ", "white"))
        is_current = i == state.get("current_step") and state["status"] == "running"
        pointer = "[bold cyan]→[/]" if is_current else " "

        lines.append(f" {pointer}", style="")

        name_style = "bold cyan" if is_current else style
        lines.append(f" {step['name']}", style=name_style)

        status_tag = step["status"]
        if step.get("guards") and step["status"] == "running":
            status_tag += " | guarded"
        lines.append(f"  ({status_tag})", style="dim")

        if step.get("on_fail") not in ("block", None):
            lines.append(f"  on_fail={step['on_fail']}", style="dim yellow")

        lines.append("\n")

    # Active guards inline
    if state["status"] == "running":
        current = state["current_step"]
        if current < len(state["steps"]):
            guards = state["steps"][current].get("guards", [])
            if guards:
                lines.append("\n  [bold red]Active Guards:[/]\n", style="")
                for g in guards:
                    if isinstance(g, dict):
                        pat = g.get("command_pattern", g.get("pattern", "?"))
                        msg = g.get("message", "blocked")
                        lines.append(f"    [red]/{pat}/[/]  {msg}\n", style="")
                    else:
                        lines.append(f"    [red]{g}[/]\n", style="")

    return Panel(lines, title="[bold green] Workflow [/]", border_style="green")


def _build_skills_panel(skills: list[dict]) -> Panel:
    lines = Text()
    for s in skills:
        cmd = f"/weft:{s['name']}"
        desc = s["description"].split(". Use only")[0]
        hint = s.get("hint", "")

        lines.append(f"  {cmd:<20}", style="bold green")
        lines.append(f"{desc}\n", style="")
        if hint:
            lines.append(f"  {'':20}", style="")
            lines.append(f"{hint}\n", style="dim")

    return Panel(lines, title="[bold cyan] Skills [/]", border_style="cyan")


def _build_templates_panel(tmpls: list[dict], project_dir: str | None) -> Panel:
    lines = Text()

    for t in tmpls:
        lines.append(f"\n  {t['name']}", style="bold green")
        lines.append(f"  ({t['steps']} steps)\n", style="dim")
        lines.append(f"  {t['description']}\n", style="")

        detail = _load_template_detail(t["name"])
        if detail and "steps" in detail:
            for j, s in enumerate(detail["steps"]):
                prefix = "├─" if j < len(detail["steps"]) - 1 else "└─"
                lines.append(f"    {prefix} ", style="dim")
                lines.append(f"{s['name']}", style="white")
                policy = s.get("on_fail", "block")
                if policy != "block":
                    lines.append(f" [on_fail={policy}]", style="dim yellow")
                if s.get("guards"):
                    lines.append(" guarded", style="dim red")
                if s.get("optional"):
                    lines.append(" optional", style="dim")
                lines.append("\n")

    lines.append(f"\n  [dim]ad-hoc[/]", style="")
    lines.append(f"  [dim](N steps)[/]\n", style="")
    lines.append(f"  [dim]Pass comma-separated names: /wf-start plan,build,test[/]\n", style="")

    return Panel(lines, title="[bold yellow] Templates [/]", border_style="yellow")


def _build_hooks_panel(hooks_json: dict) -> Panel:
    hook_info = {
        "SessionStart": ("Context Inject", "Reinjects workflow state on new session"),
        "PreToolUse":   ("Guard Engine",   "Blocks commands outside current step scope"),
        "PreCompact":   ("Context Inject", "Reinjects workflow state after compaction"),
        "Stop":         ("Completion Gate", "Blocks exit with incomplete steps"),
    }

    lines = Text()
    for hook_type in hooks_json.get("hooks", {}):
        label, desc = hook_info.get(hook_type, ("?", "?"))
        entries = hooks_json["hooks"][hook_type]
        matcher = "all tools"
        for entry in entries:
            if "matcher" in entry:
                matcher = entry["matcher"]

        lines.append(f"\n  {hook_type}", style="bold magenta")
        lines.append(f"  [{label}]\n", style="dim")
        lines.append(f"  {desc}\n", style="")
        lines.append(f"  Matcher: {matcher}\n", style="dim")

    return Panel(lines, title="[bold magenta] Hooks [/]", border_style="magenta")


def _build_events_panel(project_dir: str | None) -> Panel:
    events = event_store.query(project_dir, last_n=12)
    if not events:
        content = Text("  No events recorded yet.", style="dim")
        return Panel(content, title="[bold blue] Events [/]", border_style="blue")

    type_styles = {
        "wf.started": "green",
        "wf.completed": "bold blue",
        "wf.aborted": "yellow",
        "wf.step_changed": "cyan",
    }

    lines = Text()
    for ev in events:
        ts = ev.get("ts", "?")[11:19]
        et = ev.get("event_type", "?")
        data = ev.get("data", {})
        style = type_styles.get(et, "white")

        lines.append(f"  {ts} ", style="dim")
        lines.append(f"{et:<20}", style=style)

        details = []
        if data.get("step_name"):
            details.append(data["step_name"])
        if data.get("to_status"):
            details.append(f"-> {data['to_status']}")
        if data.get("reason"):
            details.append(data["reason"][:35])
        lines.append(" ".join(details), style="dim")
        lines.append("\n")

    return Panel(lines, title="[bold blue] Events [/]", border_style="blue")


def _build_architecture_panel() -> Panel:
    lines = Text()

    lines.append("\n  Data Flow\n", style="bold underline")
    lines.append("  Template ", style="dim")
    lines.append("->", style="white")
    lines.append(" start_workflow() ", style="green")
    lines.append("->", style="white")
    lines.append(" state.json + events.jsonl\n", style="dim")
    lines.append("  Hooks read state ", style="dim")
    lines.append("->", style="white")
    lines.append(" guard/gate/context ", style="yellow")
    lines.append("->", style="white")
    lines.append(" allow/block\n", style="dim")
    lines.append("  Events = source of truth ", style="dim")
    lines.append("->", style="white")
    lines.append(" rebuild_from_events()", style="cyan")
    lines.append(" recovers state\n", style="dim")

    lines.append("\n  Step Lifecycle\n", style="bold underline")
    lines.append("  pending", style="dim")
    lines.append(" -> ", style="white")
    lines.append("running", style="cyan")
    lines.append(" -> ", style="white")
    lines.append("complete", style="green")
    lines.append(" | ", style="dim")
    lines.append("failed", style="red")
    lines.append(" | ", style="dim")
    lines.append("skipped\n", style="yellow")

    lines.append("\n  on_fail Policies\n", style="bold underline")
    lines.append("    retry    ", style="cyan")
    lines.append("auto-retry once, then block\n", style="dim")
    lines.append("    block    ", style="red")
    lines.append("halt workflow until manual retry\n", style="dim")
    lines.append("    continue ", style="yellow")
    lines.append("mark failed, advance to next step\n", style="dim")

    lines.append("\n  Files\n", style="bold underline")
    lines.append("  .claude/weft/state.json   ", style="white")
    lines.append(" derived workflow state\n", style="dim")
    lines.append("  .claude/weft/events.jsonl ", style="white")
    lines.append(" append-only event log (truth)\n", style="dim")
    lines.append("  .claude/weft/context.md   ", style="white")
    lines.append(" injected into Claude context\n", style="dim")

    return Panel(lines, title="[bold white] Architecture [/]", border_style="white")


# ── TUI App ────────────────────────────────────────────────────────


class WeftDashboard(App):
    CSS = """
    Screen {
        layout: grid;
        grid-size: 2 3;
        grid-columns: 1fr 1fr;
        grid-rows: auto auto auto;
        grid-gutter: 1;
        padding: 1;
        overflow-y: auto;
    }
    .panel { height: auto; }
    """

    TITLE = "Weft — Workflow Engine for Tracked Flows"
    BINDINGS = [
        Binding("q", "quit", "Quit"),
        Binding("r", "refresh", "Refresh"),
        Binding("escape", "quit", "Quit"),
    ]

    def __init__(self, project_dir: str | None = None):
        super().__init__()
        self.project_dir = project_dir

    def compose(self) -> ComposeResult:
        yield Header()
        yield Static(id="left-top", classes="panel")
        yield Static(id="right-top", classes="panel")
        yield Static(id="left-mid", classes="panel")
        yield Static(id="right-mid", classes="panel")
        yield Static(id="left-bot", classes="panel")
        yield Static(id="right-bot", classes="panel")
        yield Footer()

    def on_mount(self) -> None:
        self._render_panels()
        self.set_interval(2, self._render_panels)

    def action_refresh(self) -> None:
        self._render_panels()

    def _render_panels(self) -> None:
        pdir = self.project_dir
        state = state_machine.load_state(pdir)
        skills = _load_skills()
        tmpls = templates.list_templates(pdir)
        hooks_json = _load_hooks_json()

        self.query_one("#left-top", Static).update(_build_workflow_panel(state))
        self.query_one("#right-top", Static).update(_build_skills_panel(skills))
        self.query_one("#left-mid", Static).update(_build_templates_panel(tmpls, pdir))
        self.query_one("#right-mid", Static).update(_build_hooks_panel(hooks_json))
        self.query_one("#left-bot", Static).update(_build_events_panel(pdir))
        self.query_one("#right-bot", Static).update(_build_architecture_panel())


def main():
    project_dir = os.environ.get("CLAUDE_PROJECT_DIR") or None
    app = WeftDashboard(project_dir=project_dir)
    app.run()


if __name__ == "__main__":
    main()
