"""Template loading and discovery."""

import json
import os
from pathlib import Path


def _plugin_templates_dir() -> Path:
    """Templates bundled with the plugin."""
    return Path(__file__).parent.parent / "templates"


def _project_templates_dir(project_dir: str | None = None) -> Path:
    """Project-local templates."""
    base = project_dir or os.environ.get("CLAUDE_PROJECT_DIR", ".")
    return Path(base) / ".claude" / "weft" / "templates"


def _user_templates_dir() -> Path:
    """User-global templates. Override with WEFT_USER_TEMPLATES_DIR."""
    override = os.environ.get("WEFT_USER_TEMPLATES_DIR")
    if override:
        return Path(override).expanduser()
    return Path.home() / ".weft" / "templates"


def list_templates(project_dir: str | None = None) -> list[dict]:
    """List all available templates (plugin + user-global + project-local)."""
    templates = []
    for d in [_plugin_templates_dir(), _user_templates_dir(), _project_templates_dir(project_dir)]:
        if not d.exists():
            continue
        for f in sorted(d.glob("*.json")):
            try:
                t = json.loads(f.read_text())
                templates.append({
                    "name": t.get("name", f.stem),
                    "description": t.get("description", ""),
                    "path": str(f),
                    "steps": len(t.get("steps", [])),
                })
            except (json.JSONDecodeError, OSError):
                continue
    return templates


def load_template(name: str, project_dir: str | None = None) -> dict | None:
    """Load a template by name. Project-local > user-global > plugin."""
    for d in [_project_templates_dir(project_dir), _user_templates_dir(), _plugin_templates_dir()]:
        path = d / f"{name}.json"
        if path.exists():
            try:
                return json.loads(path.read_text())
            except (json.JSONDecodeError, OSError):
                continue
    return None


def template_from_steps(step_names: list[str], name: str = "adhoc") -> dict:
    """Build an ad-hoc template from comma-separated step names."""
    return {
        "name": name,
        "description": f"Ad-hoc workflow: {', '.join(step_names)}",
        "steps": [
            {"name": s.strip(), "context": "inline", "on_fail": "block", "guards": []}
            for s in step_names
        ],
    }


def save_template(template: dict, project_dir: str | None = None) -> Path:
    """Save a template to the project-local templates directory. Returns the path."""
    name = template.get("name", "unnamed")
    d = _project_templates_dir(project_dir)
    d.mkdir(parents=True, exist_ok=True)
    path = d / f"{name}.json"
    path.write_text(json.dumps(template, indent=2) + "\n")
    return path


def template_detail(name: str, project_dir: str | None = None) -> str | None:
    """Return a detailed formatted view of a template's steps."""
    tmpl = load_template(name, project_dir)
    if not tmpl:
        return None

    lines = [
        f"Template: {tmpl['name']}",
        f"Description: {tmpl.get('description', '')}",
        f"Steps: {len(tmpl['steps'])}",
        "",
    ]

    for i, step in enumerate(tmpl["steps"]):
        is_last = i == len(tmpl["steps"]) - 1
        prefix = "  └─" if is_last else "  ├─"

        parts = [f"{prefix} {step['name']}"]

        policy = step.get("on_fail", "block")
        if policy != "block":
            parts.append(f"[on_fail={policy}]")

        if step.get("guards"):
            guard_pats = []
            for g in step["guards"]:
                if isinstance(g, dict):
                    guard_pats.append(g.get("command_pattern", g.get("pattern", "?")))
                else:
                    guard_pats.append(str(g))
            parts.append(f"guards: {', '.join(guard_pats)}")

        if step.get("optional"):
            parts.append("[optional]")

        if step.get("requires_skill"):
            parts.append(f"requires: {step['requires_skill']}")

        if step.get("skill"):
            parts.append(f"skill: {step['skill']}")

        if step.get("loop_back_to"):
            max_iter = step.get("max_iterations", 3)
            parts.append(f"↻ → {step['loop_back_to']} (max {max_iter})")

        lines.append("  ".join(parts))

        if step.get("description"):
            cont = "  │ " if not is_last else "    "
            lines.append(f"{cont} {step['description']}")

        if step.get("exit_condition"):
            cont = "  │ " if not is_last else "    "
            lines.append(f"{cont} exit: {step['exit_condition']}")

    return "\n".join(lines)
