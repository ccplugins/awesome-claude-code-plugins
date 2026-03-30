# Example: GitHub Signal Reprioritization

## Situation

The repo already has pending polish tasks, then a failing CI run or review-blocking PR appears.

## Commands

```bash
python3 scripts/operator_runtime.py scan --repo /workspace/demo
python3 scripts/operator_runtime.py next --repo /workspace/demo
```

## Expected outcome

- failing CI and review blockers move above polish items
- the next active task becomes the GitHub blocker
- `.operator/backlog.json` and `.operator/state.json` reflect the reprioritized queue
