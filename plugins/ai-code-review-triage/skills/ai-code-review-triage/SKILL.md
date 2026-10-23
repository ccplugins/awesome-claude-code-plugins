---
name: ai-code-review-triage
description: Review pull requests or diffs written by AI coding agents (Claude Code, Codex, Copilot, Cursor) when reading every line no longer scales, or when the code looks clean but you don't trust it yet. Splits "reading the code" into three separate jobs (catch bugs, align context, own the sign-off) and runs a different process for each. Use for requests like "review this AI-generated PR", "can this diff be merged", "too many agent PRs to review", "check this before I approve", or "what should I verify before signing off". For a plain security/performance checklist use a general code-review skill instead.
---

# AI Code Review Triage

AI agents write code faster than humans can read it. Line-by-line review stops scaling, and it also stops working: agent-written code is tidy on the surface, so the real problems hide well enough that you can read every line and still miss them. Skipping review and rolling back when something breaks is technically possible, but a human still answers for the incident.

The fix is to stop treating "reading the code" as one activity. It is three jobs that used to be bundled together because code arrived slowly:

| Job | Question it answers | Who does it best |
|---|---|---|
| **1. Catch bugs** | Is the code wrong? | Machines, with an independent second pass |
| **2. Align context** | Is the change right for *this* product, today? | A human, checking from angles that are not the code |
| **3. Own the sign-off** | Am I willing to put my name on this? | The approver, with explicit scope |

Run them as separate steps. Each step writes into the report at the end.

---

## Step 0: Triage

1. **Scope the diff.** List files and modules touched. Flag anything that changes configuration, constants, timeouts, retries, permissions, billing, data migrations, or public APIs.
2. **State the intent in one sentence.** Use the PR description, commit messages, and linked issue. If you can't write that sentence, stop and ask the author.
3. **Pick a risk tier.**
   - **Low**: copy, tests, internal scripts, docs. Run Step 1 only.
   - **Medium**: user-facing behavior behind a flag, isolated modules. Run Steps 1 and 2.
   - **High**: production behavior, data, security, money, anything hard to roll back. Run all three steps fully.

## Step 1: Catch bugs with an independent machine pass

The goal is objective defects, found without relying on a human reading every line.

- **Spawn a fresh-context reviewer.** Use a sub-agent (the Agent tool) that has *not* seen the conversation that produced the code. Give it only the diff, the files it touches, and the stated intent from Step 0.
- **Keep the prompt neutral.** Ask it to find bugs and give a concrete failure scenario for each one. Don't tell it which parts the author believes are fine.
- **If this session wrote the code, it is not an independent reviewer.** Always delegate this step.
- **Make findings reproducible.** Run existing tests, linters, and type checks. For each reported bug, try to write a failing test or a command that shows it. Mark findings `CONFIRMED` when reproduced and `PLAUSIBLE` when not. Don't present plausible findings as confirmed.
- **Optionally widen the net.** Merge in results from other review tools (correctness, security, performance). Keep this step about defects only. Steps 2 and 3 cover what those tools can't see.

## Step 2: Align context from angles outside the code

Correct code can still be the wrong change. A reviewer looking only at the diff cannot see whether a value fits production, or whether someone else changed the same thing last week.

### Order-of-magnitude check
For every constant the diff changes, write one line:

```
<name>: old → new (unit) — plausible against real traffic/usage? why
```

Look hardest at timeouts, session and token lifetimes, retry counts, batch sizes, cache TTLs, rate limits, and money units. Seconds vs. milliseconds and minutes vs. hours are the classic mix-ups, and they pass every test that doesn't hit the boundary.

### History and neighbors
```bash
git log -p --since=30.days -- <changed files>   # what changed here recently
git log -S'<constant or function name>'          # who touched this value before
git log --grep=revert -i -- <changed files>      # was this tried and rolled back
grep -rn '<constant or function name>' .         # who depends on it
```

Then ask:
- Did another recent PR change the same value or code path?
- Does any upstream assumption or downstream SLA depend on the old behavior?
- Do clients (web, mobile, other services) hard-code the same value?

### Requirement match
Does the PR do what the issue or product request actually asks for? Note anything it does beyond that and anything it leaves out.

Findings from this step are usually invisible to the Step 1 reviewer. List them separately in the report.

## Step 3: Own the sign-off

Clicking approve is a signature. Before signing, the approver must be able to answer:

1. **Can I explain it?** In two or three sentences: what changed, why, and where the risk is. If not, don't approve.
2. **How would we notice it breaking?** Is there monitoring or alerting that covers this change?
3. **How do we undo it?** A one-command rollback, a feature flag, or a reversible migration. If undo is hard, the bar for Steps 1 and 2 goes up.
4. **What risk am I accepting?** List open findings from Steps 1–2 that you are knowingly letting through, with the reason.
5. **What exactly did I verify?** Write the scope into the approval comment, for example: *"Verified timeout units and all callers; did not load-test."* A signature with a stated scope is honest. A blanket approve is not.

---

## Report template

```markdown
## <one-sentence intent> · Risk: Low | Medium | High

### 1. Bugs (independent fresh-context review)
- [CONFIRMED] path/to/file.py:42 — <defect>. Repro: <command or scenario>
- [PLAUSIBLE] path/to/other.ts:88 — <defect>. Why unconfirmed: <reason>

### 2. Context
- Magnitudes: SESSION_TIMEOUT 30 → 30000 (s; was it meant to be ms?) — suspicious
- History / neighbors: <recent related changes, dependents, conflicts>
- Requirement match: <matches | extra: … | missing: …>

### 3. Sign-off
- Can explain the change: yes | no
- Detection: <monitoring/alerts> · Rollback: <method>
- Accepted risks: <list with reasons>
- Recommendation: approve | request changes | ask author first
- Verification scope for the approval comment: <verified … / not verified …>
```

## When not to use this

- Small hand-written PRs, or when you only want a security/performance checklist: use a general code-review skill.
- When you only want to know what is over-engineered and can be deleted: use a simplification-focused review.
- When you only need a bug hunt and no context or sign-off work: Step 1 alone, or a correctness review tool, is enough.
