---
name: testwatch
description: Use after making code changes to automatically run affected tests, verify nothing broke, and fix any regressions immediately. A post-edit safety net.
---

# TestWatch - Post-Edit Safety Net

Run `/testwatch` after making changes to automatically verify nothing broke.

## Usage

```
/testwatch                   # Run tests affected by recent changes
/testwatch --all             # Run full test suite
/testwatch --autofix         # Automatically fix any regressions
```

## Process

1. **Detect changed files** - via `git diff` (staged + unstaged)
2. **Map changes to tests** - find test files that import/cover changed modules
3. **Run affected tests only** - fast feedback
4. **If failures**:
   - With `--autofix`: invoke TestFix agent automatically
   - Without: report failures with context

## Smart Test Mapping

```
Changed: src/utils/auth.ts
  → Runs: tests/utils/auth.test.ts
  → Runs: tests/api/login.test.ts (imports auth)
  → Skips: tests/ui/dashboard.test.ts (unrelated)
```

Mapping uses import graph analysis, not just filename matching.
