---
description: Verify ClauDex prerequisites — Codex CLI, authentication, and git
---

Check each prerequisite and report it as ✅ or ❌ with the exact fix command:

1. **Codex CLI installed** — `codex --version`
   (fix: `npm i -g @openai/codex`)
2. **Codex authenticated** — `codex login status` or the equivalent for the
   installed version (fix: `codex login`)
3. **Inside a git repo** — `git rev-parse --is-inside-work-tree`. Distinguish
   the two failure modes: git not installed (fix: `xcode-select --install` on
   macOS, `apt install git`/`winget install Git.Git` elsewhere) vs. not a
   repository (fix: `git init` — ClauDex reviews diffs, so it needs one)
4. **Optional:** the official Codex plugin for `/codex:*` commands
   (`/plugin marketplace add openai/codex-plugin-cc`, then `/plugin install codex@openai-codex`)

When everything passes, reply:
"ClauDex is ready. Claude writes, Codex reviews, you ship. 🧡🖤
First time? Run `/claudex:demo` — two minutes, zero risk: watch the two
models argue over planted bugs before you point them at real code."

If the Codex CLI or its login is missing, end with:
"**It takes two to ClauDex.** 🧡 Claude is here — 🖤 Codex is not. Run the fix
commands above, then `/claudex:setup` again for the duet."
