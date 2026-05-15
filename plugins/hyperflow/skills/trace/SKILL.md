---
name: trace
description: Use when encountering bugs, test failures, runtime errors, unexpected behavior, broken builds, or "this doesn't work" reports. Systematic root-cause analysis before any patch — never blind-patches symptoms. Standalone (off the spec → scope → dispatch chain). Ends with a thinking-tier review of the fix.
---

# Trace

Root cause, not symptom. Never patch over a bug without understanding why it happened.

Dispatcher and reviewer — Opus 4.7 (thinking-tier). Implementer/Searcher/Writer — Sonnet 4.6.

## Per-Step Agent Map (DOCTRINE rule 12)

Every substantive step dispatches at least one Agent.

| Step | Worker tier | Thinking tier | Notes |
|---|---|---|---|
| 1 — Reproduce | Searcher (Sonnet) if repro missing | **Reviewer** (Opus) confirms repro is valid | Both tiers if dispatched |
| 2 — Gather evidence | Searcher × 3 (Sonnet) parallel | **Reviewer** (Opus) verifies evidence coverage | Both tiers |
| 3 — Hypothesize | — | **Debugger** (Opus) produces ranked hypotheses | Pure thinking |
| 4 — Verify | Implementer (Sonnet) minimal change | **Debugger** (Opus) re-evaluates against evidence | Both tiers · loop |
| 5 — Fix at root | Implementer (Sonnet) | **Reviewer** (Opus) checks no error-swallow / no symptom-patch | Both tiers |
| 6 — Regression test | Writer (Sonnet) | **Reviewer** (Opus) confirms test fails-without / passes-with | Both tiers |
| 7 — Memory + final | Writer (Sonnet) appends pitfall | **Reviewer** (Opus) final validation | Both tiers |

## Step 1 — Reproduce

Agents — `Searcher` (Sonnet, if needed) ⇒ **Reviewer** (Opus).

1. Confirm the bug is reproducible.
2. If repro steps missing — dispatch `Searcher — locating bug reproduction in recent changes/tests`.
3. Dispatch `**Reviewer** — confirming reproduction is valid` to validate the repro actually fails for the stated reason (not a flake).
4. If environmental (CI-only, intermittent, time-dependent) — flag explicitly before proceeding.

## Step 2 — Gather Evidence (parallel)

Agents — `Searcher` × 3 (Sonnet) parallel ⇒ **Reviewer** (Opus).

1. Dispatch simultaneously in a single message:
   - `Searcher — reading error stack traces and logs`
   - `Searcher — mapping the code paths involved`
   - `Searcher — finding related tests (passing and failing)`
2. Dispatch `**Reviewer** — verifying evidence coverage` to confirm the three Searchers actually triangulate the failure surface. If gaps remain, redispatch.

## Step 3 — Hypothesize

Agents — **Debugger** (Opus, thinking-tier).

Dispatch `**Debugger** — root cause analysis: <bug-summary>` — model: opus.

Apply **5 Whys** + **hypothesis testing** + **bisect mindset**:
- Why does this fail? → because X → why X? → because Y → continue to root
- Output 1–3 hypotheses ranked by likelihood, each with:
  - **What** — suspected root cause
  - **Evidence** — what supports it
  - **Counter-evidence** — what would falsify it
  - **Test** — minimal change to verify

## Step 4 — Verify

Agents — `Implementer` (Sonnet) ⇒ **Debugger** (Opus).

1. Pick highest-ranked hypothesis.
2. Dispatch `Implementer — verifying hypothesis: <hypothesis>` — make the minimal change needed to confirm/falsify.
3. Dispatch `**Debugger** — re-evaluating hypothesis against test result` to re-check against the evidence from Step 2.
4. Confirmed → proceed to Step 5. Falsified → return to Step 3 with next hypothesis.

## Step 5 — Fix at Root

Agents — `Implementer` (Sonnet) ⇒ **Reviewer** (Opus).

1. Dispatch `Implementer — fixing root cause: <root-cause>` with full context: the bug, the verified root cause, the minimal fix.
2. Dispatch `**Reviewer** — checking fix is at root` to verify the fix actually addresses the cause and doesn't patch the symptom.

Constraints (non-negotiable):
- No error swallowing
- No defensive try/catch around the symptom
- No flags or feature gates to hide the bug

## Step 6 — Regression Test

Agents — `Writer` (Sonnet) ⇒ **Reviewer** (Opus).

1. Dispatch `Writer — adding regression test for <bug>`.
2. Dispatch `**Reviewer** — confirming regression test fails-without and passes-with the fix`.
3. If existing suite had gaps that allowed this bug → note in `.hyperflow/memory/pitfalls.md`.

## Step 7 — Memory + Final Review

Agents — `Writer` (Sonnet) ⇒ **Reviewer** (Opus).

1. Dispatch `Writer — appending pitfall to .hyperflow/memory/pitfalls.md` per [memory-system.md](../hyperflow/memory-system.md): the bug pattern, why tests missed it, prevention strategy. Tags — `pitfall` plus domain tags.
2. Dispatch `**Reviewer** — final validation of fix + test + memory entry`. This is the integration review for the trace flow.

## Anti-Patterns (refuse these)

| Symptom patch | Why it's wrong |
|---|---|
| "Just catch the exception" | Find why it threw |
| "Add a null check" | Find why it was null |
| "Increase the timeout" | Find why it's slow |
| "Retry on failure" | Understand the failure mode first |

## Output Format

```
── Debug Result ─────────────────────
Bug: <one-line>
Reproducible: yes / no / intermittent
Root cause: <one-line>
Fix: <one-line summary>
Files changed: <list>
Regression test: <path>
─────────────────────────────────────
```

End with usage summary (model names, agent count, token totals) per [output-style.md](../hyperflow/output-style.md).

## Hand-off

Debug is **off the auto-chain** — it's standalone. After Step 7 reviewer passes, stop and suggest `/hyperflow:deploy` to run pre-push gates and commit the fix + regression test together. Do **not** auto-invoke ship — push requires explicit user opt-in.

## Doctrine

Full rules in [DOCTRINE.md](../hyperflow/DOCTRINE.md). See also [worker-prompt.md](../hyperflow/worker-prompt.md) and [reviewer-prompt.md](../hyperflow/reviewer-prompt.md).
