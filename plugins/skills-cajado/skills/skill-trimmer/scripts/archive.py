#!/usr/bin/env python3
"""Archives or restores local skills. Nothing is deleted.

Archiving moves the folder to ~/.claude/skills-archive/<date>/<name>, removes the
symlink from .claude/skills, drops the entry from the lock (the project's
skills-lock.json or ~/.agents/.skill-lock.json) and records everything in
ARCHIVE.md. Restoring undoes it.

Usage:
  python3 archive.py --project DIR --reason "text" name [name ...]
  python3 archive.py --restore name [name ...]
  --dry-run shows what would be done, without changing anything.
"""
import argparse
import json
import os
import shutil
import sys
from datetime import date, datetime
from pathlib import Path

HOME = Path.home()
ARCHIVE_DIR = HOME / ".claude" / "skills-archive"
REGISTRY_JSON = ARCHIVE_DIR / "registry.json"
ARCHIVE_MD = ARCHIVE_DIR / "ARCHIVE.md"
SCRIPT_DIR = Path(__file__).resolve().parent


def read_json(p, default):
    try:
        return json.loads(Path(p).read_text())
    except (OSError, ValueError):
        return default


def write_json(p, data):
    if isinstance(data, dict) and isinstance(data.get("skills"), dict):
        data["skills"] = dict(sorted(data["skills"].items()))  # same order the CLI writes
    Path(p).write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n")


def locate(name, project):
    """Finds the skill, whether loaded (.claude/skills) or only stored (.agents/skills)."""
    for scope, base in (("project", project), ("global", HOME)):
        for sub in (".claude/skills", ".agents/skills"):
            e = base / sub / name
            if e.exists() or e.is_symlink():
                return scope, base, e
    return None, None, None


def lock_entry(lock_path, name):
    data = read_json(lock_path, None)
    if not data:
        return None, None
    for key, info in (data.get("skills") or {}).items():
        path = str(info.get("skillPath", ""))
        if key == name or f"/{name}/SKILL.md" in f"/{path}" or path.startswith(f"{name}/"):
            return key, info
    return None, None


def archive(name, project, reason, dry_run):
    scope, base, entry = locate(name, project)
    if not entry:
        print(f"[{name}] not found in .claude/skills or .agents/skills (project or global).")
        return None
    loaded = base / ".claude" / "skills" / name
    link = loaded if loaded.is_symlink() else None
    link_target = os.readlink(link) if link else None
    real = entry.resolve()
    store = (base / ".agents" / "skills").resolve()
    # A folder from elsewhere linked in by symlink (e.g. a skill under development) is not moved.
    move = real.is_dir() and (link is None or real.parent == store)
    lock_path = project / "skills-lock.json" if scope == "project" else HOME / ".agents" / ".skill-lock.json"
    key, info = lock_entry(lock_path, name)

    dest = ARCHIVE_DIR / date.today().isoformat() / name
    n = 2
    while dest.exists():
        dest = ARCHIVE_DIR / date.today().isoformat() / f"{name}-{n}"
        n += 1

    print(f"[{name}] scope {scope}")
    if link:
        print(f"  remove symlink {link}")
    if move:
        print(f"  move {real} -> {dest}")
    elif link:
        print(f"  real folder outside the store ({real}); stays where it is")
    if key:
        print(f"  remove '{key}' from {lock_path}")
    if dry_run:
        return None

    dest.parent.mkdir(parents=True, exist_ok=True)
    if link:
        link.unlink()
    if move:
        shutil.move(str(real), str(dest))
    if key:
        data = read_json(lock_path, {})
        data.get("skills", {}).pop(key, None)
        write_json(lock_path, data)

    rec = {
        "name": name, "scope": scope, "archived_at": datetime.now().isoformat(timespec="seconds"),
        "reason": reason, "link": str(link) if link else None,
        "link_target": link_target,
        "origin": str(real), "destination": str(dest) if move else None,
        "lock": str(lock_path) if key else None, "lock_key": key, "lock_info": info,
        "source": (info or {}).get("source"), "restored_at": None,
    }
    records = read_json(REGISTRY_JSON, [])
    records.append(rec)
    write_json(REGISTRY_JSON, records)
    reinstall = f"npx -y skills add {rec['source']} --skill \"{key}\" -y" if rec["source"] else "no source recorded"
    is_new = not ARCHIVE_MD.exists()
    with open(ARCHIVE_MD, "a", encoding="utf-8") as f:
        if is_new:
            f.write(f"# Archived skills\n\nRestore: `python3 {SCRIPT_DIR / 'archive.py'} --restore <name>`\n\n"
                    "| date | skill | scope | reason | reinstall from scratch |\n"
                    "|---|---|---|---|---|\n")
        f.write(f"| {date.today().isoformat()} | {name} | {scope} | {reason} | `{reinstall}` |\n")
    print("  done")
    return rec


def restore(name, dry_run):
    records = read_json(REGISTRY_JSON, [])
    target = next((r for r in reversed(records) if r["name"] == name and not r.get("restored_at")), None)
    if not target:
        print(f"[{name}] nothing archived under that name.")
        return
    print(f"[{name}] restore from {target['destination'] or '(symlink only)'}")
    if dry_run:
        return
    if target["destination"]:
        if Path(target["origin"]).exists():
            print(f"  {target['origin']} already exists; nothing moved")
            return
        Path(target["origin"]).parent.mkdir(parents=True, exist_ok=True)
        shutil.move(target["destination"], target["origin"])
    if target["link"] and not Path(target["link"]).exists():
        Path(target["link"]).parent.mkdir(parents=True, exist_ok=True)
        os.symlink(target["link_target"], target["link"])
    if target["lock"] and target["lock_key"]:
        data = read_json(target["lock"], {"version": 1, "skills": {}})
        data.setdefault("skills", {})[target["lock_key"]] = target["lock_info"]
        write_json(target["lock"], data)
    target["restored_at"] = datetime.now().isoformat(timespec="seconds")
    write_json(REGISTRY_JSON, records)
    with open(ARCHIVE_MD, "a", encoding="utf-8") as f:
        f.write(f"| {date.today().isoformat()} | {name} | restored | | |\n")
    print("  done")


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("names", nargs="+")
    ap.add_argument("--project", default=os.getcwd())
    ap.add_argument("--reason", default="")
    ap.add_argument("--restore", action="store_true")
    ap.add_argument("--dry-run", action="store_true")
    a = ap.parse_args()
    if not a.restore and not a.reason and not a.dry_run:
        sys.exit("Provide --reason: the registry exists to remember why the skill was removed.")
    project = Path(a.project).expanduser().resolve()
    for name in a.names:
        if a.restore:
            restore(name, a.dry_run)
        else:
            archive(name, project, a.reason, a.dry_run)


if __name__ == "__main__":
    main()
