#!/usr/bin/env python3
"""Inventory of skills, plugins and MCP connectors, with real usage taken from
Claude Code transcripts and an estimated token cost.

Usage:  python3 inventory.py [--project DIR] [--days 30] [--json]

Read-only. Does not modify or delete anything and does not touch the network.
"""
import argparse
import json
import os
import re
import sys
from collections import Counter, defaultdict
from datetime import datetime, timedelta, timezone
from pathlib import Path

HOME = Path.home()
CHARS_PER_TOKEN = 4  # approximation; good for comparing, not for billing
RECENT_DAYS = 14     # a skill installed more recently than this has not had a chance to be used yet

# Sessions that read SKILL.md as part of their job (auditing, creating, finding
# skills). Reads made in them do not count as usage.
AUDIT_SKILLS = re.compile(
    r"(skill-trimmer|skill-stocktake|context-budget|skill-creator|find-skills|skill-router)$")

STOPWORDS = set("""
use when user asks wants this that with from into your about them they their
have will skill skills also only like more what which while should using used
then than such each other must need needs make makes made just very even
para como quando usar pelo pela pelos pelas mais esta este isso essa esse com
sobre quer pede seja sejam uma umas uns pode podem deve fazer feito cada
""".split())


def tok(n_chars):
    return round(n_chars / CHARS_PER_TOKEN)


def read_frontmatter(path):
    """Returns (name, description, lines, characters, slash_only) for a SKILL.md."""
    try:
        text = path.read_text(encoding="utf-8", errors="replace")
    except OSError:
        return None, "", 0, 0, False
    lines = text.splitlines()
    fields = {}
    if lines and lines[0].strip() == "---":
        i = 1
        while i < len(lines) and lines[i].strip() != "---":
            m = re.match(r"^(name|description|disable-model-invocation):\s*(.*)$", lines[i])
            if not m:
                i += 1
                continue
            key, value = m.group(1), m.group(2).strip()
            if value in ("|", ">", "|-", ">-", ""):
                parts = []
                i += 1
                while i < len(lines) and (lines[i][:1] in (" ", "\t") or not lines[i].strip()):
                    if lines[i].strip():
                        parts.append(lines[i].strip())
                    i += 1
                fields[key] = " ".join(parts)
                continue
            fields[key] = value.strip("\"'")
            i += 1
    # With disable-model-invocation the skill only runs via slash command and is
    # not in the list Claude reads: its description costs nothing per session.
    slash_only = fields.get("disable-model-invocation", "").lower() == "true"
    return fields.get("name"), ("" if slash_only else fields.get("description", "")), len(lines), len(text), slash_only


def extras_size(folder, skill_md):
    """Characters of text files beyond SKILL.md (read only on demand)."""
    total, has_script = 0, False
    for root, dirs, files in os.walk(folder):
        dirs[:] = [d for d in dirs if d not in ("node_modules", ".git", "__pycache__")]
        for f in files:
            p = Path(root) / f
            if p == skill_md:
                continue
            if p.suffix in (".py", ".sh", ".js", ".ts", ".mjs"):
                has_script = True
            if p.suffix in (".md", ".txt", ".py", ".sh", ".js", ".ts", ".mjs", ".json", ".csv", ".yaml", ".yml"):
                try:
                    total += p.stat().st_size
                except OSError:
                    pass
    return total, has_script


RE_PATH = re.compile(r"(?:~|\$HOME)/(\.[A-Za-z0-9_.-]+(?:/[A-Za-z0-9_.-]+)*)")
RE_OTHER_AGENT = re.compile(r"~/\.cursor|\.cursorrules|\bCursor\b(?!\s*:)|\b[Cc]odex\b|\bWindsurf\b|\bCopilot\b")
RE_SUBAGENT = re.compile(r"\bsubagent|\bAgent\(|Task tool|spawn (?:a |an )?agent|in parallel", re.I)


def check_content(folder):
    """Signals that only show up by reading the skill: config paths that do not
    exist on this machine, another agent as the target environment, and subagents."""
    if Path(folder).resolve() == Path(__file__).resolve().parent.parent:
        return [], [], False  # this skill quotes the very patterns it searches for
    texts = []
    for root, dirs, files in os.walk(folder):
        dirs[:] = [d for d in dirs if d not in ("node_modules", ".git", "__pycache__", "data", "assets")]
        for f in files:
            if f.endswith((".md", ".sh", ".py", ".js", ".ts", ".mjs")):
                try:
                    texts.append((Path(root) / f).read_text(encoding="utf-8", errors="replace"))
                except OSError:
                    pass
    everything = "\n".join(texts)
    missing = set()
    for m in RE_PATH.finditer(everything):
        rel = m.group(1).rstrip(".")
        parts = rel.split("/")
        # checks down to the tool folder + 2 levels; deeper is usually an example
        target = HOME.joinpath(*parts[:3])
        if any(c in rel for c in "<>{}*") or target.exists():
            continue
        missing.add("~/" + "/".join(parts[:3]))
    others = sorted({m.group(0).strip().lstrip("~/.").lower() for m in RE_OTHER_AGENT.finditer(everything)})
    return sorted(missing)[:4], others[:4], bool(RE_SUBAGENT.search(everything))


def install_date(folder):
    st = folder.stat()
    t = getattr(st, "st_birthtime", None) or st.st_mtime
    return datetime.fromtimestamp(t, timezone.utc)


def load_locks(project):
    sources = {}
    for f in (project / "skills-lock.json", HOME / ".agents" / ".skill-lock.json"):
        try:
            data = json.loads(f.read_text())
        except (OSError, ValueError):
            continue
        for name, info in (data.get("skills") or {}).items():
            sources.setdefault(name, {"source": info.get("source", "?"), "lock": str(f)})
    return sources


def local_skills(project):
    """Skills in ~/.claude/skills and in the project. Only .claude/skills is
    loaded; .agents/skills is the `skills` CLI's store, linked in by symlink."""
    locks = load_locks(project)
    seen, out = {}, []
    roots = [
        ("global", HOME / ".claude" / "skills", True),
        ("project", project / ".claude" / "skills", True),
        ("global", HOME / ".agents" / "skills", False),
        ("project", project / ".agents" / "skills", False),
    ]
    for scope, root, loaded in roots:
        if not root.is_dir():
            continue
        for entry in sorted(root.iterdir()):
            skill_md = entry / "SKILL.md"
            if not skill_md.is_file():
                continue
            real = str(entry.resolve())
            if real in seen:
                continue
            fm_name, desc, lines, chars, slash_only = read_frontmatter(skill_md)
            name = entry.name
            extras, has_script = extras_size(entry.resolve(), skill_md.resolve())
            missing, others, subagents = check_content(entry.resolve())
            lock = locks.get(name) or locks.get(fm_name or "")
            item = {
                "name": name,
                "frontmatter_name": fm_name,
                "scope": scope,
                "path": str(entry).replace(str(HOME), "~"),
                "symlink": entry.is_symlink(),
                "loaded": loaded,
                "source": lock["source"] if lock else "unregistered",
                "lock": lock["lock"].replace(str(HOME), "~") if lock else None,
                "installed_on": install_date(entry.resolve()).date().isoformat(),
                "desc_tok": tok(len(desc)),
                "body_tok": tok(chars),
                "body_lines": lines,
                "extras_tok": tok(extras),
                "has_script": has_script,
                "slash_only": slash_only,
                "missing_paths": missing,
                "mentions_other_agent": others,
                "spawns_subagents": subagents,
                "description": desc,
            }
            seen[real] = item
            out.append(item)
    return out


def find_plugins():
    """Plugins from the desktop app (Cowork/claude.ai) and the Claude Code CLI."""
    bases = [
        HOME / ".claude" / "plugins",
        HOME / "Library" / "Application Support" / "Claude" / "local-agent-mode-sessions",
        HOME / ".config" / "Claude" / "local-agent-mode-sessions",
        HOME / "AppData" / "Roaming" / "Claude" / "local-agent-mode-sessions",
    ]
    skip = {"node_modules", ".git", "artifacts", "spaces", ".project-cache", "outputs", "uploads"}
    found = {}
    for base in bases:
        if not base.is_dir():
            continue
        for root, dirs, _ in os.walk(base):
            depth = len(Path(root).relative_to(base).parts)
            if ".claude-plugin" in dirs:
                p = Path(root)
                try:
                    meta = json.loads((p / ".claude-plugin" / "plugin.json").read_text())
                except (OSError, ValueError):
                    meta = {}
                name = meta.get("name") or p.name
                mtime = p.stat().st_mtime
                if name not in found or mtime > found[name][1]:
                    found[name] = (p, mtime)
                dirs[:] = []
                continue
            dirs[:] = [d for d in dirs if d not in skip and depth < 7]
    plugins = []
    for name, (p, _) in sorted(found.items()):
        skills = []
        for skill_md in sorted(p.glob("skills/*/SKILL.md")):
            _, desc, _, chars, _ = read_frontmatter(skill_md)
            skills.append({"name": f"{name}:{skill_md.parent.name}", "desc_tok": tok(len(desc)),
                           "body_tok": tok(chars), "description": desc})
        commands = [f"{name}:{c.stem}" for c in sorted(p.glob("commands/*.md"))]
        mcp = []
        try:
            mcp = sorted((json.loads((p / ".mcp.json").read_text()).get("mcpServers") or {}).keys())
        except (OSError, ValueError):
            pass
        plugins.append({"name": name, "path": str(p).replace(str(HOME), "~"),
                        "installed_on": install_date(p).date().isoformat(),
                        "skills": skills, "commands": commands, "mcp": mcp})
    return plugins


def fixed_instructions(project):
    """CLAUDE.md and the memory index: loaded in full in every session."""
    candidates = [
        ("global CLAUDE.md", HOME / ".claude" / "CLAUDE.md"),
        ("project CLAUDE.md", project / "CLAUDE.md"),
        ("CLAUDE.md in .claude/", project / ".claude" / "CLAUDE.md"),
        ("CLAUDE.local.md", project / "CLAUDE.local.md"),
        ("MEMORY.md", HOME / ".claude" / "projects" / project_folder(project) / "memory" / "MEMORY.md"),
    ]
    out = []
    for label, f in candidates:
        try:
            out.append({"file": label, "path": str(f).replace(str(HOME), "~"),
                        "tokens": tok(len(f.read_text(encoding="utf-8", errors="replace")))})
        except OSError:
            pass
    return out


def configured_mcp(project):
    """MCP servers declared in local files. claude.ai connectors are not on
    disk: they only show up in the session's tool list."""
    out = {}

    def read(f):
        try:
            return json.loads(Path(f).read_text())
        except (OSError, ValueError):
            return {}

    cfg = read(HOME / ".claude.json")
    for name in (cfg.get("mcpServers") or {}):
        out[name] = "~/.claude.json (global)"
    proj = (cfg.get("projects") or {}).get(str(project)) or {}
    for name in (proj.get("mcpServers") or {}):
        out[name] = "~/.claude.json (project)"
    for name in (read(project / ".mcp.json").get("mcpServers") or {}):
        out[name] = ".mcp.json"
    desktop_configs = [
        HOME / "Library" / "Application Support" / "Claude" / "claude_desktop_config.json",
        HOME / "AppData" / "Roaming" / "Claude" / "claude_desktop_config.json",
        HOME / ".config" / "Claude" / "claude_desktop_config.json",
    ]
    for desk in desktop_configs:
        for name in (read(desk).get("mcpServers") or {}):
            out[name] = "claude_desktop_config.json"
    return out


RE_TS = re.compile(r'"timestamp":"([^"]+)"')
RE_CMD = re.compile(r"<command-name>/?([^<\s]+)</command-name>")
RE_SKILL_MD = re.compile(r"/skills/([^/]+)/SKILL\.md$")


def parse_ts(s):
    try:
        return datetime.fromisoformat(s.replace("Z", "+00:00"))
    except (TypeError, ValueError):
        return None


def scan_usage():
    """Counts Skill tool calls, slash commands, SKILL.md reads and MCP tool
    calls in the transcripts."""
    root = HOME / ".claude" / "projects"
    usage = defaultdict(list)   # skill -> [(date, folder)] (Skill or /command)
    reads = defaultdict(list)   # skill -> [(date, folder)] (Read of SKILL.md outside an audit)
    mcp = defaultdict(lambda: {"n": 0, "last": None, "tools": Counter()})
    coverage = {"transcripts": 0, "start": None, "end": None, "projects": set()}

    def mark(ts):
        if ts is None:
            return
        if coverage["start"] is None or ts < coverage["start"]:
            coverage["start"] = ts
        if coverage["end"] is None or ts > coverage["end"]:
            coverage["end"] = ts

    if not root.is_dir():
        return usage, reads, mcp, coverage

    for f in root.rglob("*.jsonl"):
        coverage["transcripts"] += 1
        folder = f.relative_to(root).parts[0]
        coverage["projects"].add(folder)
        reads_here, audit = [], False
        try:
            fh = open(f, encoding="utf-8", errors="replace")
        except OSError:
            continue
        with fh:
            first = True
            for line in fh:
                if first:
                    m = RE_TS.search(line[:4000])
                    mark(parse_ts(m.group(1)) if m else None)
                    first = False
                has_tool = '"tool_use"' in line
                has_cmd = "<command-name>" in line
                if not (has_tool or has_cmd):
                    continue
                try:
                    rec = json.loads(line)
                except ValueError:
                    continue
                ts = parse_ts(rec.get("timestamp"))
                mark(ts)
                msg = rec.get("message") or {}
                content = msg.get("content")
                if has_cmd and rec.get("type") == "user":
                    # Only what the user typed; a tool result that mentions a
                    # command (e.g. a grep over the transcripts) is not usage.
                    if isinstance(content, str):
                        text = content
                    else:
                        text = " ".join(b.get("text", "") for b in content or []
                                        if isinstance(b, dict) and b.get("type") == "text")
                    for name in RE_CMD.findall(text):
                        usage[name].append((ts, folder))
                        if AUDIT_SKILLS.search(name):
                            audit = True
                if not isinstance(content, list):
                    continue
                for block in content:
                    if not isinstance(block, dict) or block.get("type") != "tool_use":
                        continue
                    tool_name = block.get("name") or ""
                    tool_input = block.get("input") or {}
                    if tool_name == "Skill":
                        s = str(tool_input.get("skill", "")).lstrip("/")
                        if s:
                            usage[s].append((ts, folder))
                            if AUDIT_SKILLS.search(s):
                                audit = True
                    elif tool_name == "Read":
                        m = RE_SKILL_MD.search(str(tool_input.get("file_path", "")))
                        if m:
                            reads_here.append((m.group(1), ts))
                    elif tool_name.startswith("mcp__"):
                        parts = tool_name.split("__")
                        server = parts[1] if len(parts) > 1 else tool_name
                        mcp_rec = mcp[server]
                        mcp_rec["n"] += 1
                        mcp_rec["tools"]["__".join(parts[2:])] += 1
                        if ts and (mcp_rec["last"] is None or ts > mcp_rec["last"]):
                            mcp_rec["last"] = ts
        try:
            mark(datetime.fromtimestamp(f.stat().st_mtime, timezone.utc))
        except OSError:
            pass
        if not audit:
            for name, ts in reads_here:
                reads[name].append((ts, folder))
    return usage, reads, mcp, coverage


def project_folder(project):
    """Name of the project's transcript folder in ~/.claude/projects."""
    return re.sub(r"[^A-Za-z0-9]", "-", str(project))


def recent_session(project):
    """What the project's most recent main session actually loaded, read from
    the attachments Claude Code writes into the transcript. The format is
    internal and may change: if nothing is found, returns None and the report
    goes on without this part."""
    folder = HOME / ".claude" / "projects" / project_folder(project)
    if not folder.is_dir():
        return None
    for f in sorted(folder.glob("*.jsonl"), key=lambda a: a.stat().st_mtime, reverse=True)[:5]:
        listing, deferred, need_login, failed, mcp_instr = None, [], set(), [], {}
        try:
            fh = open(f, encoding="utf-8", errors="replace")
        except OSError:
            continue
        with fh:
            for line in fh:
                if '"attachment"' not in line:
                    continue
                try:
                    a = (json.loads(line).get("attachment") or {})
                except ValueError:
                    continue
                t = a.get("type")
                if t == "skill_listing" and a.get("isInitial") and listing is None:
                    listing = a.get("content") or ""
                elif t == "deferred_tools_delta":
                    deferred += a.get("addedNames") or []
                    need_login |= set(a.get("needsAuthMcpServers") or [])
                    failed += [x.get("name") for x in a.get("failedMcpServers") or [] if isinstance(x, dict)]
                elif t == "mcp_instructions_delta":
                    for name, block in zip(a.get("addedNames") or [], a.get("addedBlocks") or []):
                        mcp_instr[name] = tok(len(block))
        if listing is None:
            continue
        deferred = list(dict.fromkeys(deferred))  # a resumed session repeats the same attachments
        lines = [l for l in listing.splitlines() if l.startswith("- ")]
        name_only = [l[2:].strip() for l in lines if ": " not in l]
        by_plugin = Counter(n.split(":", 1)[0] if ":" in n else "(local)" for n in name_only)
        servers = defaultdict(list)
        for n in deferred:
            if n.startswith("mcp__"):
                parts = n.split("__")
                servers[parts[1]].append("__".join(parts[2:]))
        return {
            "transcript": f.name,
            "date": datetime.fromtimestamp(f.stat().st_mtime, timezone.utc).date().isoformat(),
            "skill_list": {"items": len(lines), "tokens": tok(len(listing)),
                           "name_only": len(name_only), "name_only_by_plugin": dict(by_plugin.most_common())},
            "deferred_tools": {"total": len(deferred), "name_tokens": tok(sum(len(n) + 1 for n in deferred)),
                               "by_server": {k: {"tools": len(v), "examples": v[:2]}
                                             for k, v in sorted(servers.items(), key=lambda kv: -len(kv[1]))}},
            "servers_needing_login": len(need_login),
            "servers_failed": sorted(set(failed)),
            "mcp_instructions": dict(sorted(mcp_instr.items(), key=lambda kv: -kv[1])),
        }
    return None


def usage_summary(events, cutoff, folder):
    dates = [d for d, _ in events if d]
    here = [d for d, p in events if d and p == folder]
    return {"total": len(dates), "here": len(here), "recent": sum(1 for d in dates if d >= cutoff),
            "last": max(dates).date().isoformat() if dates else None,
            "last_here": max(here).date().isoformat() if here else None}


def words(text):
    return {w for w in re.findall(r"[a-zà-ú0-9]{4,}", text.lower()) if w not in STOPWORDS}


def overlaps(items, threshold=0.28, limit=15):
    sets = [(i["name"], words(i.get("description", ""))) for i in items]
    sets = [(n, p) for n, p in sets if len(p) >= 5]
    pairs = []
    for a in range(len(sets)):
        for b in range(a + 1, len(sets)):
            pa, pb = sets[a][1], sets[b][1]
            j = len(pa & pb) / len(pa | pb)
            if j >= threshold:
                pairs.append((round(j, 2), sets[a][0], sets[b][0]))
    pairs.sort(reverse=True)
    return pairs[:limit]


def build(project, days):
    now = datetime.now(timezone.utc)
    cutoff = now - timedelta(days=days)
    local = local_skills(project)
    plugins = find_plugins()
    usage, reads, mcp, cov = scan_usage()
    folder = project_folder(project)

    for s in local:
        names = {s["name"], s["frontmatter_name"] or s["name"]}
        s["usage"] = usage_summary([e for n in names for e in usage.get(n, [])], cutoff, folder)
        s["reads"] = usage_summary([e for n in names for e in reads.get(n, [])], cutoff, folder)
        age = (now.date() - datetime.fromisoformat(s["installed_on"]).date()).days
        s["age_days"] = age
        signals = []
        if s["usage"]["total"] == 0 and s["reads"]["total"] == 0:
            signals.append("never-used")
        elif s["scope"] == "project" and s["usage"]["here"] == 0 and s["reads"]["here"] == 0:
            signals.append("used-only-in-other-project")
        if age < RECENT_DAYS:
            signals.append("recent")
        if not s["loaded"]:
            signals.append("not-loaded")
        if s["slash_only"]:
            signals.append("slash-only")
        elif not s["description"]:
            signals.append("no-description")
        if s["desc_tok"] > 120:
            signals.append("long-description")
        if s["body_lines"] > 500:
            signals.append("large-body")
        if s["has_script"]:
            signals.append("has-script")
        if s["spawns_subagents"]:
            signals.append("spawns-subagents")
        if s["missing_paths"]:
            signals.append("missing-path:" + ",".join(s["missing_paths"]))
        if s["mentions_other_agent"]:
            signals.append("mentions:" + ",".join(s["mentions_other_agent"]))
        s["signals"] = signals

    for p in plugins:
        used = {}
        for name in [x["name"] for x in p["skills"]] + p["commands"]:
            r = usage_summary(usage.get(name, []), cutoff, folder)
            if r["total"]:
                used[name.split(":", 1)[1]] = r
        p["used"] = used
        p["usage_total"] = sum(r["total"] for r in used.values())
        lasts = [r["last"] for r in used.values() if r["last"]]
        p["last"] = max(lasts) if lasts else None
        p["desc_tok"] = sum(x["desc_tok"] for x in p["skills"])

    everything = local + [x for p in plugins for x in p["skills"]]
    return {
        "generated_at": now.isoformat(timespec="seconds"),
        "window_days": days,
        "coverage": {
            "transcripts": cov["transcripts"],
            "start": cov["start"].date().isoformat() if cov["start"] else None,
            "end": cov["end"].date().isoformat() if cov["end"] else None,
            "projects": len(cov["projects"]),
        },
        "local_skills": local,
        "plugins": plugins,
        "mcp": {k: {"calls": v["n"], "last": v["last"].date().isoformat() if v["last"] else None,
                    "tools": v["tools"].most_common(3)} for k, v in mcp.items()},
        "configured_mcp": configured_mcp(project),
        "fixed_instructions": fixed_instructions(project),
        "recent_session": recent_session(project),
        "overlaps": overlaps(everything),
        "unidentified": sorted(
            n for n in usage
            if n not in {s["name"] for s in local} | {s["frontmatter_name"] for s in local}
            and ":" not in n),
    }


def render(d):
    c = d["coverage"]
    print(f"# Inventory ({d['generated_at'][:10]})\n")
    if c["transcripts"]:
        print(f"Usage measured over {c['transcripts']} transcripts from {c['projects']} folders, "
              f"from {c['start']} to {c['end']}. Recent window: {d['window_days']} days. "
              f"\"here\" = sessions of this project; \"all\" = all projects.")
    else:
        print("No Claude Code transcripts found in ~/.claude/projects: usage can't be measured yet, "
              "only cost. Treat every \"never used\" as unknown.")
    local = d["local_skills"]
    loaded = [s for s in local if s["loaded"]]
    fixed_local = sum(s["desc_tok"] for s in loaded)
    fixed_plug = sum(p["desc_tok"] for p in d["plugins"])
    n_plug = sum(len(p["skills"]) for p in d["plugins"])
    print(f"Fixed cost of descriptions (read every session): ≈{fixed_local} tokens in "
          f"{len(loaded)} local skills + ≈{fixed_plug} tokens in {n_plug} skills from "
          f"{len(d['plugins'])} plugins.")
    if d["fixed_instructions"]:
        print("Instructions read every session: " + "; ".join(
            f"{i['file']} ≈{i['tokens']}" for i in d["fixed_instructions"]) + " tokens.")
    print()

    sr = d.get("recent_session")
    if sr:
        sl, dt = sr["skill_list"], sr["deferred_tools"]
        print(f"## What the last session loaded ({sr['date']})\n")
        print(f"- Skill list: {sl['items']} items, ≈{sl['tokens']} tokens; {sl['name_only']} appear by name only"
              + (" (" + ", ".join(f"{k} {v}" for k, v in sl["name_only_by_plugin"].items()) + ")" if sl["name_only"] else "")
              + ". A skill listed by name only is rarely triggered on its own.")
        print(f"- Deferred tool names: {dt['total']}, ≈{dt['name_tokens']} tokens. By MCP server: "
              + "; ".join(f"{k} {v['tools']} ({', '.join(v['examples'])})" for k, v in dt["by_server"].items()))
        if sr["mcp_instructions"]:
            print("- MCP server instructions (tokens): "
                  + ", ".join(f"{k} {v}" for k, v in sr["mcp_instructions"].items()))
        print(f"- Servers asking for login: {sr['servers_needing_login']}; failed: "
              + (", ".join(sr["servers_failed"]) or "none") + "\n")
    print("## Local skills\n")
    print("| skill | scope | source | days | uses here/all | reads | last use | desc | body | signals |")
    print("|---|---|---|---|---|---|---|---|---|---|")
    order = sorted(local, key=lambda s: (s["usage"]["here"] + s["reads"]["here"] > 0,
                                         s["usage"]["total"] + s["reads"]["total"] > 0,
                                         s["usage"]["last"] or "", s["name"]))
    for s in order:
        u, r = s["usage"], s["reads"]
        print(f"| {s['name']} | {s['scope']} | {s['source']} | {s['age_days']} | "
              f"{u['here']}/{u['total']} | {r['total']} | {u['last'] or r['last'] or '-'} | "
              f"{s['desc_tok']} | {s['body_tok']} | {' '.join(s['signals'])} |")

    print("\n## Plugins\n")
    print("| plugin | installed | skills | commands | MCP | desc | uses | last | used |")
    print("|---|---|---|---|---|---|---|---|---|")
    for p in sorted(d["plugins"], key=lambda p: (p["usage_total"], -len(p["skills"]))):
        used = ", ".join(f"{k}({v['total']})" for k, v in
                         sorted(p["used"].items(), key=lambda kv: -kv[1]["total"]))
        print(f"| {p['name']} | {p['installed_on']} | {len(p['skills'])} | {len(p['commands'])} | {len(p['mcp'])} | "
              f"{p['desc_tok']} | {p['usage_total']} | {p['last'] or '-'} | {used or '-'} |")

    print("\n## MCP servers with recorded calls\n")
    if d["mcp"]:
        print("| server | calls | last | most used tools |")
        print("|---|---|---|---|")
        for k, v in sorted(d["mcp"].items(), key=lambda kv: -kv[1]["calls"]):
            tools = ", ".join(f"{n}({c})" for n, c in v["tools"])
            print(f"| {k} | {v['calls']} | {v['last'] or '-'} | {tools} |")
    else:
        print("No MCP calls recorded.")
    idle = {k: v for k, v in d["configured_mcp"].items() if k not in d["mcp"]}
    if idle:
        print("\nConfigured in a file and never called: "
              + ", ".join(f"{k} ({v})" for k, v in sorted(idle.items())))
    print("claude.ai connectors are not stored on disk: the ones in your tool list "
          "that do not appear in the table have never been called.")

    if d["overlaps"]:
        print("\n## Similar descriptions (candidates to merge, or to confuse triggering)\n")
        for j, a, b in d["overlaps"]:
            print(f"- {a} ↔ {b} ({j})")
    if d["unidentified"]:
        print("\nTriggered with no local folder (built into the app, internal commands, or already removed): "
              + ", ".join(d["unidentified"]))


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("--project", default=os.getcwd(), help="project root (default: current folder)")
    ap.add_argument("--days", type=int, default=30, help="recent-usage window")
    ap.add_argument("--json", action="store_true", help="full output as JSON")
    args = ap.parse_args()
    data = build(Path(args.project).expanduser().resolve(), args.days)
    if args.json:
        for s in data["local_skills"]:
            s.pop("description", None)
        for p in data["plugins"]:
            for s in p["skills"]:
                s.pop("description", None)
        json.dump(data, sys.stdout, ensure_ascii=False, indent=1, default=str)
        print()
    else:
        render(data)


if __name__ == "__main__":
    main()
