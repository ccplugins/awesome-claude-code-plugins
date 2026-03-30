# Example: Fresh Repo Bootstrap

## Situation

A new thread opens on a repository that has no prior operator state.

## Commands

```bash
python3 scripts/operator_runtime.py bootstrap --repo /workspace/demo --goal "Ship a reliable onboarding flow"
python3 scripts/operator_runtime.py scan --repo /workspace/demo
python3 scripts/operator_runtime.py next --repo /workspace/demo
```

## Expected outcome

- `.operator/` is created
- the backlog contains repo and GitHub signals
- `next_action` points at the first bounded improvement instead of returning a plan-only answer
