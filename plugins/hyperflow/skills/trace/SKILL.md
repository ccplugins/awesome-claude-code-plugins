---
name: trace
description: Use when diagnosing or fixing a bug, regression, failing test, or unexplained behavior by establishing root cause before editing.
allowed-tools: Read, Write, Edit, Glob, Grep, Agent, Skill, AskUserQuestion, WebSearch, WebFetch, Bash
argument-hint: "<symptom>"
version: 6.1.1
license: MIT
compatibility: Portable; hypothesis fan-out is reserved for genuinely independent causes
tags: [debugging, root-cause, regression]
---

# Trace

Reproduce, explain, and only then patch. “Why” or “diagnose” stops after the evidence-backed cause. “Fix,” “solve,” or an equivalent explicit build intent continues into implementation without a build confirmation.

## Flow

1. Read the error, local instructions, recent relevant changes, implicated code, and nearby tests. Capture the smallest reliable reproduction and distinguish observed facts from assumptions.
2. Choose a lane:
   - **Direct:** one clear code path and a reproducible local cause; coordinator investigates with zero children.
   - **Focused:** multiple plausible causes inside one subsystem; use one `debugger` investigator and one independent review after a fix.
   - **Deep:** intermittent, security-sensitive, cross-boundary, or multi-system failure; assign two or three independent hypotheses to investigators, then use one debugger synthesis. Do not fan out variants of the same hypothesis.
3. Build a short causal chain: symptom → immediate failure → enabling condition → root cause. Each link needs a log, test, value, or `path:line` observation. Falsify competing hypotheses before choosing one.
4. For version-specific or current known issues, research only the implicated version and prefer primary sources. Do not browse for ordinary business-logic bugs.
5. If diagnosis-only, return the reproduction, root cause, rejected hypotheses, and smallest fix direction; do not edit.
6. If fix was requested:
   - Direct: make the smallest root-cause patch and add or adjust a regression test.
   - Focused/Deep: write the diagnosis and bounded fix tasks into one `.hyperflow/tasks/<slug>.md`, then continue through `dispatch` automatically.
7. Re-run the reproduction, affected tests, and relevant static checks. A patch that only hides the symptom or lacks evidence does not pass.

## Constraints

Investigators are read-only and do not patch. Implementers never review their own changes. Stop with `SECURITY_VIOLATION:` on a confirmed secret or trust-boundary breach. Preserve unrelated work and do not broaden a focused bug fix into cleanup.

Keep output concise: cause, evidence, fix status, checks, and remaining uncertainty. Record a project-memory pitfall only when the verified cause is likely to recur.
