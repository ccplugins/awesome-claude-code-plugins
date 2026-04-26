---
name: wf-step
description: "Transition the current weft workflow step. Use only when user types /wf-step."
argument-hint: "<complete|fail|skip|retry> [reason]"
allowed-tools: [Bash, Read, Write]
---

# Advance Weft Workflow Step

Transition the current step to a new status.

## Arguments
$ARGUMENTS

## Parsing

Parse the arguments flexibly. The user may say:
- `/wf-step complete "planning done"` — standard form
- `/wf-step done` or `/wf-step` with no args — treat as `complete`
- `/wf-step skip not needed` — skip with reason
- `/wf-step failed, try again` — treat as `retry` if step is failed, or `fail` if running
- `/wf-step complete 3` or `/wf-step complete next 3` — bulk complete N steps

Map natural language to actions:
| User says | Action |
|-----------|--------|
| done, finished, complete, next | `complete` |
| skip, not needed, pass | `skip` |
| failed, broken, error | `fail` |
| retry, again, redo | `retry` |
| again, loop, iterate, continue loop, not done yet, issues remain | `loop-continue` |
| done looping, exit loop, loop done, clean, all clear | `loop-done` |

**Loop disambiguation:** If the current step has a `loop_back_to` field, prefer loop actions over regular ones. "again" on a loop step means `loop-continue`, not `retry`. "done" on a loop step means `loop-done`, not `complete`. If the user explicitly says "complete" or "skip", use those literally even on loop steps.

## Single step transition

```bash
python3 "${CLAUDE_PLUGIN_ROOT}/core/cli.py" step <action> <reason>
```

## Bulk transitions

If the user specifies a count (e.g., "complete 3"), loop:
```bash
for i in 1 2 3; do
  python3 "${CLAUDE_PLUGIN_ROOT}/core/cli.py" step complete "bulk advance"
done
```

Stop looping if any step fails or the workflow completes.

## After transition

1. Display the updated workflow checklist.
2. If the workflow just completed, congratulate and summarize what was accomplished.
3. If a step failed with `block` policy, explain options: `/wf-step retry` or `/wf-abort`.
4. If the next step has guards, explain what commands are blocked.
5. If the next step has a description in the template, mention what it expects.

### After loop-continue
- Show "Loop iteration N/M" with the current count and max.
- List which steps were reset back to pending.
- If the exit condition is defined, remind the user what needs to be true to exit.

### After loop-done
- Show "Exited loop after N iterations."
- Show the next step info as normal.

### Loop max exceeded
- If loop-continue triggers max_iterations, the step fails per its on_fail policy.
- Explain: "Loop hit max iterations (N). Workflow blocked — use `/wf-step retry` to reset or `/wf-abort`."
