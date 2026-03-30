# Example: Resume In A Fresh Thread

## Situation

The previous thread stopped after a verified checkpoint.

## Commands

```bash
python3 scripts/operator_runtime.py status --repo /workspace/demo
python3 scripts/operator_runtime.py next --repo /workspace/demo
```

## Expected outcome

- the new thread reads `.operator/state.json`
- the next item is selected from the existing backlog
- work resumes from `next_action` instead of rebuilding context from memory
