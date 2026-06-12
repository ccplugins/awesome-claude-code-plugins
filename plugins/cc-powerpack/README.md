# CC Powerpack — Guardrails for Claude Code

**[Website](https://ludoonus.github.io/cc-powerpack/)** · MIT · runs 100% locally · no telemetry

AI coding agents don't usually fail by writing malicious code. They fail by
running *correct* commands with unintended blast radius. This plugin gates the
dangerous ones at the harness level — before execution, not after.

```
/plugin marketplace add Ludoonus/cc-powerpack
/plugin install cc-powerpack
```

## What's in the free tier

| Hook | Catches |
|------|---------|
| `secret-scan-push` | Secrets in outgoing commits before any `git push` (gitleaks + regex layer + forbidden-file check) |
| `dangerous-cmd-gate` | `rm -rf` on dangerous paths, force-push to main, `chmod 777`, `curl \| sh`, `dd of=/dev/*` |
| `worktree-protect` | Agents deleting/staging other sessions' git worktrees; `git add -A` sweeping up worktree gitlinks |

All hooks run locally. No telemetry, no network calls, no servers, no exposed ports.

## Install

```bash
# via marketplace
/plugin install cc-powerpack

# or manual: clone, then add to ~/.claude/settings.json hooks, or:
claude plugin install ./cc-powerpack
chmod +x hooks/*.sh
```

Requires: `bash`, `jq`. Optional: `gitleaks` (strongly recommended — the regex
layer is a fallback, not a replacement).

## How it works

Each script is a `PreToolUse` hook on the Bash tool. It receives the pending
tool call as JSON on stdin, pattern-matches the command, and exits `2` to block
with an explanation fed back to the model — so the agent learns *why* and asks
the user instead of retrying.

## War stories (why each hook exists)

1. **The .env that almost shipped** — `git add -A` during a "chore: sync"
   commit staged an untracked `.env`. Caught in review by luck. Now caught by
   `secret-scan-push` every time.
2. **The worktree that wasn't orphaned** — an agent "cleaned up" `.claude/worktrees/`
   dirs that looked stale. They were live sessions with uncommitted work.
3. **The variable rm** — `rm -rf "$BUILD_DIR"` with `$BUILD_DIR` unset expands
   to `rm -rf ""` ... or worse, `/`. Gated now.

## Pro tier

5 more plugins (token-audit, pr-pipeline, onboard, team-sync + monthly new
ones), updated monthly: [https://evancreats.gumroad.com/l/PowerPackPro](https://evancreats.gumroad.com/l/PowerPackPro)

## License

Free tier: MIT. Use it, fork it, ship it.
