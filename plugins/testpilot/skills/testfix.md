---
name: testfix
description: Use when existing tests are failing and you want autonomous diagnosis and fixing. Reads test output, identifies root cause, applies fix, and re-runs until green.
---

# TestFix - Autonomous Test Repair

Run `/testfix` when your tests are broken and you want them fixed without manual debugging.

## Usage

```
/testfix                     # Fix all failing tests in project
/testfix src/auth            # Fix tests in specific directory
/testfix --fix-tests-only    # Only modify test files, never source
/testfix --fix-source        # Allowed to fix source code bugs too
```

## Process

1. **Run existing tests** - capture full output with stack traces
2. **Classify each failure**:
   - `TEST_BUG` - test logic is wrong (bad assertion, stale mock, wrong setup)
   - `SOURCE_BUG` - test caught a real bug in source code
   - `ENV_ISSUE` - missing dep, wrong config, port conflict
   - `FLAKY` - passes sometimes, timing/race condition
3. **Fix based on classification**:
   - `TEST_BUG` → fix the test
   - `SOURCE_BUG` → fix source (if `--fix-source`) or report
   - `ENV_ISSUE` → fix config/install deps
   - `FLAKY` → add retries, waitFor, or fix race condition
4. **Re-run** until green or max retries

## Rules

- Read the FULL error output before attempting any fix
- Understand WHY it fails before changing code
- Each retry must apply a DIFFERENT fix strategy
- Never silence errors by weakening assertions
- Preserve test intent - fix the mechanism, not the expectation
