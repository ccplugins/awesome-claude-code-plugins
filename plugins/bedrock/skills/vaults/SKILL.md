---
name: vaults
description: >
  Manage registered Bedrock vaults. List all vaults, set a default vault,
  or remove a vault from the registry. The registry lives in the plugin
  directory and maps vault names to filesystem paths.
  Use when: "bedrock vaults", "bedrock-vaults", "/bedrock:vaults", "list vaults",
  "set default vault", "remove vault", "show vaults", "which vault", "my vaults",
  or when a user wants to manage their registered vaults.
user_invocable: true
allowed-tools: Bash, Read, Write, Edit, Glob, Grep
---

# /bedrock:vaults — Vault Management

## Plugin Paths

The vault registry lives in the plugin root directory, not in any vault.
Use the "Base directory for this skill" provided at invocation to resolve paths:

- Vault registry: `<base_dir>/../../vaults.json`
- Plugin CLAUDE.md: `<base_dir>/../../CLAUDE.md` (auto-injected into context)

Where `<base_dir>` is the path shown in "Base directory for this skill".

---

## Overview

This skill manages the global vault registry — the file that maps vault names to
filesystem paths and tracks which vault is the default.

**You are a management agent.** This skill is read-only with respect to vaults themselves —
it never reads or modifies vault entities, never runs git operations inside vaults, and
never touches `.bedrock/config.json`. It only reads and writes the registry file (`vaults.json`).

---

## Phase 0 — Parse Input

Parse the user's input to determine the command mode:

| Input pattern | Mode | Variables |
|---|---|---|
| No flags / empty / `list` | **list** | — |
| `--set-default <name>` | **set-default** | `TARGET_NAME = <name>` |
| `--remove <name>` | **remove** | `TARGET_NAME = <name>` |

If the input doesn't match any pattern, default to **list** mode.

---

## Phase 1 — Read Registry

Resolve the registry path:

```
REGISTRY_PATH = <base_dir>/../../vaults.json
```

Read the registry file:

```bash
cat <REGISTRY_PATH> 2>/dev/null
```

**If the file does not exist or is empty:**
- For **list** mode: display "No vaults registered. Run `/bedrock:setup` in a vault directory to register your first vault."
- For **set-default** and **remove** modes: display "No vaults registered. Nothing to modify." and exit.

**If the file exists:** parse the JSON. Expected schema:

```json
{
  "vaults": [
    {
      "name": "<string>",
      "path": "<absolute-path>",
      "default": true | false
    }
  ]
}
```

Store the parsed vaults array as `VAULTS`.

---

## Phase 2 — Execute Command

### 2.1 List Mode

For each vault in `VAULTS`, check if the path still exists on disk:

```bash
test -d "<vault_path>" && echo "exists" || echo "missing"
```

Present a table:

```
## Registered Vaults

| Name | Path | Default | Status |
|---|---|---|---|
| my-vault | /Users/me/vaults/my-vault | * | ok |
| team-vault | /Users/me/vaults/team-vault | | ok |
| old-vault | /Users/me/vaults/old-vault | | missing |
```

- The `Default` column shows `*` for the default vault
- The `Status` column shows `ok` if the directory exists, `missing` if it does not

If any vault has status `missing`, add a note:

```
> Vaults marked as "missing" have paths that no longer exist on disk.
> Run `/bedrock:vaults --remove <name>` to clean up, or re-create the vault at the registered path.
```

### 2.2 Set-Default Mode

1. Find the vault with `name == TARGET_NAME` in `VAULTS`
2. If not found: display "Vault `<TARGET_NAME>` is not registered. Available vaults:" followed by a list of names. Exit.
3. If found:
   - Set `"default": false` on all vaults
   - Set `"default": true` on the matching vault
   - Write the updated registry back to `REGISTRY_PATH`
   - Display: "Default vault set to `<TARGET_NAME>` (<path>)."

### 2.3 Remove Mode

1. Find the vault with `name == TARGET_NAME` in `VAULTS`
2. If not found: display "Vault `<TARGET_NAME>` is not registered. Available vaults:" followed by a list of names. Exit.
3. If found:
   - Remove the entry from `VAULTS`
   - If the removed vault was the default AND other vaults remain, mark the first remaining vault as default and inform the user
   - Write the updated registry back to `REGISTRY_PATH`
   - Display: "Vault `<TARGET_NAME>` removed from registry. Files on disk were NOT deleted (<path>)."

---

## Phase 3 — Write Registry

When writing the registry (set-default or remove modes), use the Write tool to overwrite `REGISTRY_PATH` with the updated JSON:

```json
{
  "vaults": [
    { "name": "...", "path": "...", "default": true },
    { "name": "...", "path": "...", "default": false }
  ]
}
```

Format the JSON with 2-space indentation for readability.

---

## Critical Rules

| # | Rule |
|---|---|
| 1 | **NEVER modify vault files** — this skill only touches `vaults.json` |
| 2 | **NEVER run git operations** — no git pull, commit, push, or any git command |
| 3 | **NEVER delete files on disk** — `--remove` only removes the registry entry |
| 4 | **ALWAYS validate vault name exists** before set-default or remove |
| 5 | **ALWAYS check path existence** when listing vaults — flag missing paths |
| 6 | **ALWAYS maintain exactly one default** — if the default is removed, auto-assign the first remaining vault |
| 7 | **Vault names are kebab-case** — lowercase, no spaces, no special characters beyond hyphens |
