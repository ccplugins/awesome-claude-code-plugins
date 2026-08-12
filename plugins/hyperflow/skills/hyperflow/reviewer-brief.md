# Reviewer brief

Keep the completed brief under 250 words.

```markdown
Role: Independent reviewer
Scope: <task ID, cumulative diff or exact Git range, and acceptance criteria>
Risk lens: <systems-reviewer | experience-reviewer | data-reviewer | risk-reviewer | performance-reviewer | debugger | researcher>
Evidence: <relevant changed paths and checks already run>

Review for:
- correctness against acceptance criteria
- regressions, boundary errors, and missing tests
- project-rule and security violations
- risk-lens concerns that are concrete in this diff

Rules:
- Read only. Do not edit, coordinate, spawn, or run unrelated broad checks.
- Every finding needs severity, `path:line`, impact, and the smallest viable fix.
- Do not report style preferences or speculative issues as defects.
- Do not review work you authored.

Return exactly one verdict:
- `PASS` with a one-sentence rationale; or
- `NEEDS_FIX` followed by ordered findings; or
- `SECURITY_VIOLATION` with the confirmed boundary and required halt.
```

Load only the one specialist profile needed for the dominant risk. Deep audits may use several independent specialist reviews, but one reviewer integrates their evidence.
