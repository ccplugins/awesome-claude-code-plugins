# Output Style Guide

Every Hyperflow output follows this visual language. Calm, elegant, no decorative icons. Em-dash, lowercase descriptions, and box-drawing rules for section separators only.

## Allowed Characters

| Symbol | Use |
|---|---|
| `—` | Em-dash separator between role/label and description |
| `·` | Subtle separator in inline lists (e.g. `pass · skipped · pass`) |
| `─` | Horizontal rule for top/bottom of summary blocks |
| `│├└` | Tree connectors in flow diagrams |

## Banned Characters

These must **never** appear in user-facing output:

`⚡` `✓` `✗` `▸` `→` `•` (as bullet prefix) `🚀` `📦` `⚠️` `🟢` `🔴` `*` (when used as a label prefix)

The only exception: code blocks may contain whatever the user's code contains. Banned-char rules apply to status lines, agent labels, summaries, and any text the skill outputs directly.

## 1. Session Banner

```
Hyperflow v1.12.1
Thinking: Opus 4.7  ·  Worker: Sonnet 4.6
```

Two lines. Version on first. Models indented on second, separated by a middle dot.

## 2. Update Notification

```
Hyperflow update available — v1.12.1 → v1.13.0
  run: claude plugin update hyperflow@hyperflow-marketplace
```

Em-dash between phrase and version delta. Install hint indented two spaces, no icon prefix.

## 3. Analysis Cache Status

### Fresh (skip)
```
Analysis cache fresh — skipping
```

### Partial refresh
```
Refreshing — profile.md, dependencies.md
```

### Full analysis
```
Analyzing project — 6 searchers in parallel
Cached — no incomplete tasks
```

### Incomplete tasks found
```
Incomplete tasks from prior session:
  implement-auth.md       3/5 sub-tasks done
  fix-login-bug.md        1/3 sub-tasks done
```

Two-space indent, no bullet prefix.

## 4. Agent Dispatch Labels

Every agent dispatch gets a label **before** the Agent tool call. Format:

```
<Role> — <short lowercase description>
```

**Thinking-tier roles** (Reviewer, Debugger) wrap the role in `**bold**`:

```
**Reviewer** — reviewing auth middleware output
**Debugger** — investigating test failure in auth.test.ts
```

**Worker-tier roles** (Implementer, Searcher, Writer) stay plain:

```
Implementer — creating auth middleware
Searcher — finding related test files
Writer — generating API documentation
```

### Parallel dispatch (2+ agents in same batch)

Align with two-space padding so roles line up. No tree connectors. The "parallel" caption is one line under the block.

```
Searcher       — analyze existing auth patterns
Implementer    — write middleware + route guards
Writer         — generate test suite for auth
(parallel — single message, three Agent calls)
```

Rules:
- Role left-padded to the longest role in the block (typically 13 chars for `Implementer`).
- Description starts after the em-dash, lowercased.
- Single-agent dispatch — just one line, no caption.

## 5. Agent Progress

For long batches (3+ agents, multi-minute), print a running indicator with middle dots:

```
running···  done
```

Skip for single-agent or fast dispatches.

## 6. Quality Gates

Single line, all gates separated by middle dots:

```
gates — lint: pass · typecheck: pass · tests: pass · build: pass
```

On failure:

```
gates — lint: pass · typecheck: fail · tests: skipped · build: skipped
  typecheck: 3 errors in src/auth/middleware.ts
```

Use `pass` / `fail` / `skipped` as plain words. No `✓` / `✗` / `—`. Detail lines indented two spaces.

## 7. Usage Summary

Printed after every completed task. Exact format:

```
── Usage ─────────────────────────────────────────
Thinking  (Opus 4.7  )   3 agents    48.1k tokens
Worker    (Sonnet 4.6)   8 agents   186.0k tokens
Total                   11 agents   234.1k tokens
──────────────────────────────────────────────────
```

Rules:
- Top/bottom rules — `──` repeated to ~50 chars
- Model names in parens, padded to 10 chars
- Agent counts right-aligned in 3-char column
- Token counts right-aligned in 7-char column, formatted as `Xk` or `X.Xk`
- Breakdown after tokens (optional): `(3 reviewers: 38.4k · 1 final: 13.7k)` — middle dots between items

## 8. Section Headers

Lowercase bracketed labels for structured multi-line blocks only:

```
[layers]
[skills]
[detection]
[memory]
[gates]
[capabilities]
```

Use sparingly. Never use as a decorative prefix on a single status line.

## 9. Memory Output

```
[memory]  location: .hyperflow/memory/
  1  hot    auth uses JWT RS256, not HS256     (tags: auth, security)
  2  hot    zod is project-wide validation     (tags: validation, zod)
  3  warm   Postgres uses UTC timestamps       (tags: db, conventions)
```

Entry number two-space indent. Tier as plain word (`hot` / `warm` / `cold`), no brackets. Tags in parens at end.

## 10. Task File Status

When creating/updating task files:

```
Task: implement-auth (3 sub-tasks)
  Write auth middleware          pending
  Add route guards               pending
  Generate test suite            pending
```

After completion:

```
Task complete — implement-auth (3/3)
```

No bullet prefixes. Status word right-padded for column alignment.

## 11. Security Violations

```
SECURITY VIOLATION — hardcoded API key in src/config.ts:42
  Pipeline halted, review required
```

## 12. Blocked Resources

```
BLOCKED — worker attempted to read .env
  File is in security blocklist
```

## Formatting Rules

1. **No prose between outputs.** Status lines only. No "I'm now going to…" or "Let me…".
2. **Alignment matters.** Pad roles, model names, and counts for columnar alignment.
3. **One blank line** between different output sections (e.g., between agent labels and gates).
4. **No trailing summaries.** The usage block IS the summary. Don't add "Done! I completed X."
5. **No decorative chars.** Em-dash for separators, middle dots for inline lists. Never `⚡`, `✓`, `✗`, `▸`, `→`, etc.
6. **Bold for thinking-tier.** Only `**Reviewer**` and `**Debugger**` are bolded. Workers stay plain.
