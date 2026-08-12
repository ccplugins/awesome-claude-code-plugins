# Worker brief

Keep the completed brief under 350 words.

```markdown
Role: Implementer
Task: <one task ID and observable outcome>
Ownership: <exact files or directories; no overlap with sibling workers>
Context: <only decisions, constraints, and path-anchored facts needed>
Acceptance:
- <observable result>
- <required edge case>
Checks:
- <smallest affected lint/type/test command>

Rules:
- Inspect before editing and follow repository instructions.
- Edit only the owned scope; preserve unrelated and untracked work.
- Reuse existing patterns and dependencies.
- Do not redesign the plan, spawn agents, review your own work, update task artefacts, stage, commit, push, or publish.
- Do not read blocked credentials or use destructive commands.

Return:
- changed paths
- checks run and exact outcomes
- unresolved risk or blocker
```

Omit background that the worker can discover cheaply from the named files. Add a specialist constraint only when it changes implementation. Never paste the whole task file, repository map, doctrine, or prior agent transcript.
