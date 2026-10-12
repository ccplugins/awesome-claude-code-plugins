#!/usr/bin/env python3
"""Check the skill-router table against installed skills and real usage.

Usage:  python3 check.py [--days 30] [--json]

Shows skills with no route, table names that disappeared, overlaps not yet
decided, and what was invoked after each consultation of the table.
Only reads files. Changes nothing and does not touch the network.
"""
import argparse
import json
import os
import re
from collections import Counter, defaultdict
from datetime import datetime, timedelta, timezone
from pathlib import Path

HOME = Path.home()
TABLE = Path(__file__).resolve().parent.parent / "SKILL.md"
SELF = "skill-router"

STOPWORDS = set("""
use when user asks wants this that with from into your about them they their
have will skill skills also only like more what which while should using used
then than such each other must need needs make makes made just very even
para como quando usar pelo pela pelos pelas mais esta este isso essa esse com
sobre quer pede seja sejam uma umas uns pode podem deve fazer feito cada
""".split())


def description(skill_md):
    """Frontmatter description; empty if the skill only runs by command."""
    try:
        lines = skill_md.read_text(encoding="utf-8", errors="replace").splitlines()
    except OSError:
        return ""
    if not lines or lines[0].strip() != "---":
        return ""
    fields, i = {}, 1
    while i < len(lines) and lines[i].strip() != "---":
        m = re.match(r"^(description|disable-model-invocation):\s*(.*)$", lines[i])
        i += 1
        if not m:
            continue
        value = m.group(2).strip()
        if value in ("|", ">", "|-", ">-", ""):
            parts = []
            while i < len(lines) and (lines[i][:1] in (" ", "\t") or not lines[i].strip()):
                parts.append(lines[i].strip())
                i += 1
            value = " ".join(p for p in parts if p)
        fields[m.group(1)] = value.strip("\"'")
    if fields.get("disable-model-invocation", "").lower() == "true":
        return ""
    return fields.get("description", "")


def project_of(folder):
    """The project path behind a folder in ~/.claude/projects: the "cwd" that
    Claude Code records in the folder's transcripts, or, with no transcript
    yet, the folder name with hyphens read back as slashes."""
    for path in sorted(folder.glob("*.jsonl"))[:3]:
        try:
            with open(path, encoding="utf-8", errors="replace") as fh:
                for _, line in zip(range(30), fh):
                    m = re.search(r'"cwd"\s*:\s*"([^"]+)"', line)
                    if m:
                        return Path(m.group(1))
        except OSError:
            continue
    guess = Path("/" + folder.name.lstrip("-").replace("-", "/"))
    return guess if guess.is_dir() else None


def known_projects():
    """Project folders that have already had a Claude Code session."""
    root = HOME / ".claude" / "projects"
    if not root.is_dir():
        return set()
    return {p for p in (project_of(d) for d in root.iterdir() if d.is_dir()) if p and p.is_dir()}


def installed_skills():
    """name -> {'where': set(projects), 'description': str}, local and plugin."""
    out = defaultdict(lambda: {"where": set(), "description": ""})
    roots = [("global", HOME / ".claude" / "skills")]
    for proj in sorted(known_projects()):
        if proj != HOME:
            roots.append((proj.name, proj / ".claude" / "skills"))
    for where, root in roots:
        if not root.is_dir():
            continue
        for entry in root.iterdir():
            md = entry / "SKILL.md"
            if md.is_file():
                item = out[entry.name]
                item["where"].add(where)
                item["description"] = item["description"] or description(md)
    bases = [HOME / ".claude" / "plugins",
             HOME / "Library" / "Application Support" / "Claude" / "local-agent-mode-sessions",
             HOME / ".config" / "Claude" / "local-agent-mode-sessions",
             HOME / "AppData" / "Roaming" / "Claude" / "local-agent-mode-sessions"]
    skip = {"node_modules", ".git", "artifacts", "spaces", ".project-cache", "outputs", "uploads"}
    plugins = {}
    for base in bases:
        if not base.is_dir():
            continue
        for root, dirs, _ in os.walk(base):
            if ".claude-plugin" in dirs:
                p = Path(root)
                try:
                    name = json.loads((p / ".claude-plugin" / "plugin.json").read_text()).get("name") or p.name
                except (OSError, ValueError):
                    name = p.name
                if name not in plugins or p.stat().st_mtime > plugins[name].stat().st_mtime:
                    plugins[name] = p
                dirs[:] = []
                continue
            depth = len(Path(root).relative_to(base).parts)
            dirs[:] = [d for d in dirs if d not in skip and depth < 7]
    for name, p in plugins.items():
        for md in p.glob("skills/*/SKILL.md"):
            item = out[f"{name}:{md.parent.name}"]
            item["where"].add(f"plugin {name}")
            item["description"] = description(md)
        for cmd in p.glob("commands/*.md"):
            out[f"{name}:{cmd.stem}"]["where"].add(f"plugin {name}")
    return out


def read_table():
    """Return (cited, rejected, no_route, wildcards, rows).

    cited: every backticked name in the table rows.
    rejected: names that appear only in the Don't use column.
    no_route / wildcards: the "No route" section (wildcard = plugin:*).
    rows: number of data rows in the table."""
    text = TABLE.read_text(encoding="utf-8")
    cited, rejected, accepted, rows = set(), set(), set(), 0
    name_re = re.compile(r"`/?([a-z0-9][a-z0-9-]*(?::[a-z0-9*-]+)?)`")
    for line in text.splitlines():
        if not line.startswith("| ") or line.startswith("| Task") or set(line) <= set("|- "):
            continue
        rows += 1
        cols = [c.strip() for c in line.strip("|").split("|")]
        for i, col in enumerate(cols):
            for n in name_re.findall(col):
                cited.add(n)
                (rejected if i == 2 else accepted).add(n)
    no_route, wildcards = set(), set()
    m = re.search(r"## No route\n(.*?)\n## ", text, re.S)
    if m:
        for n in name_re.findall(m.group(1)):
            (wildcards if n.endswith(":*") else no_route).add(n.rstrip(":*").rstrip(":"))
    return cited, rejected - accepted, no_route, wildcards, rows


BUILT_IN = {"security-review", "code-review", "simplify", "init", "loop", "schedule"}


def words(text):
    return {w for w in re.findall(r"[a-zà-ú0-9]{4,}", text.lower()) if w not in STOPWORDS}


def overlaps(installed, threshold=0.28):
    sets = [(n, words(i["description"])) for n, i in installed.items()]
    sets = [(n, p) for n, p in sets if len(p) >= 5]
    pairs = []
    for a in range(len(sets)):
        for b in range(a + 1, len(sets)):
            pa, pb = sets[a][1], sets[b][1]
            j = len(pa & pb) / len(pa | pb)
            if j >= threshold:
                pairs.append((round(j, 2), sets[a][0], sets[b][0]))
    return sorted(pairs, reverse=True)


def usage(days):
    """Count invocations (Skill or /command) and, after each consultation of
    this table, which skill came next in the same session."""
    root = HOME / ".claude" / "projects"
    cutoff = datetime.now(timezone.utc) - timedelta(days=days)
    counts, following = Counter(), Counter()
    if not root.is_dir():
        return counts, following
    for path in root.rglob("*.jsonl"):
        try:
            if datetime.fromtimestamp(path.stat().st_mtime, timezone.utc) < cutoff:
                continue
            fh = open(path, encoding="utf-8", errors="replace")
        except OSError:
            continue
        waiting = False
        with fh:
            for line in fh:
                if '"Skill"' not in line and "<command-name>" not in line:
                    continue
                try:
                    rec = json.loads(line)
                except ValueError:
                    continue
                content = (rec.get("message") or {}).get("content")
                names = []
                if rec.get("type") == "user":
                    text = content if isinstance(content, str) else " ".join(
                        b.get("text", "") for b in content or []
                        if isinstance(b, dict) and b.get("type") == "text")
                    names += re.findall(r"<command-name>/?([^<\s]+)</command-name>", text)
                if isinstance(content, list):
                    names += [str((b.get("input") or {}).get("skill", "")).lstrip("/")
                              for b in content if isinstance(b, dict)
                              and b.get("type") == "tool_use" and b.get("name") == "Skill"]
                for n in filter(None, names):
                    # Installed as a plugin, this skill is called "<plugin>:skill-router".
                    if n.endswith(":" + SELF):
                        n = SELF
                    counts[n] += 1
                    if n == SELF:
                        waiting = True
                    elif waiting:
                        following[n] += 1
                        waiting = False
    return counts, following


def covered(name, cited, no_route, wildcards):
    if name in cited or name in no_route:
        return True
    return ":" in name and name.split(":", 1)[0] in wildcards


def main():
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--days", type=int, default=30)
    ap.add_argument("--json", action="store_true", help="print the findings as JSON")
    args = ap.parse_args()

    installed = installed_skills()
    cited, rejected, no_route, wildcards, rows = read_table()
    counts, following = usage(args.days)

    uncovered = sorted(n for n in installed if not covered(n, cited, no_route, wildcards))
    missing = sorted(n for n in cited | no_route
                     if n not in installed and n not in BUILT_IN)

    def no_dispute(n):
        return n in no_route or (":" in n and n.split(":", 1)[0] in wildcards and n not in cited)
    open_overlaps = [(j, a, b) for j, a, b in overlaps(installed)
                     if not (a in rejected or b in rejected)
                     and not (a in cited and b in cited)
                     and not (no_dispute(a) and no_dispute(b))]
    in_table = [(n, c) for n, c in counts.most_common() if n in cited and n != SELF]
    only_dont_use = sorted(n for n in rejected if n in installed and counts.get(n, 0) == 0)

    if args.json:
        print(json.dumps({
            "uncovered": [{"name": n, "where": sorted(installed[n]["where"])} for n in uncovered],
            "missing": missing,
            "open_overlaps": [{"a": a, "b": b, "similarity": j} for j, a, b in open_overlaps[:15]],
            "router_consults": counts.get(SELF, 0),
            "after_consult": dict(following.most_common()),
            "table_skill_uses": dict(in_table),
            "only_in_dont_use": only_dont_use,
        }, indent=2, ensure_ascii=False))
        return

    print(f"# skill-router check ({datetime.now().date().isoformat()})\n")
    if rows == 0:
        print("The table is empty: build it first (see SKILL.md, First run).\n")
    print(f"{len(installed)} skills installed across all projects; "
          f"{len(cited)} names in the table.\n")

    print("## Installed with no route")
    if uncovered:
        for n in uncovered:
            print(f"- `{n}` ({', '.join(sorted(installed[n]['where']))})")
        print("\nDecide with the user: new row, Don't use in an existing row, or No route.")
    else:
        print("None.")

    print("\n## In the table but not installed anywhere")
    if missing:
        for n in missing:
            print(f"- `{n}`")
        print("\nMay be a disabled plugin or an archived skill: remove it from the table or change the row.")
    else:
        print("None.")

    print("\n## Similar descriptions not yet decided")
    if open_overlaps:
        for j, a, b in open_overlaps[:15]:
            print(f"- `{a}` × `{b}` ({j})")
    else:
        print("None.")

    print(f"\n## Usage in the last {args.days} days")
    print(f"Consultations of this table: {counts.get(SELF, 0)}.")
    if following:
        after = ", ".join(f"`{n}` {c}" for n, c in following.most_common())
        print(f"Invoked right after the consultation: {after}.")
        wrong = [n for n in following if n in rejected]
        if wrong:
            print(f"Warning: after the consultation came a skill from the Don't use column: {', '.join(wrong)}.")
    if in_table:
        print("Table skills invoked: " + ", ".join(f"`{n}` {c}" for n, c in in_table) + ".")
    if only_dont_use:
        print("Only appear in Don't use and were not invoked (skill-trimmer candidates): "
              + ", ".join(f"`{n}`" for n in only_dont_use) + ".")


if __name__ == "__main__":
    main()
