# Operator Flow

## Bootstrap

Run:

```bash
python3 scripts/operator_runtime.py bootstrap --repo /path/to/repo --goal "Stabilize onboarding and keep shipping"
```

This creates `.operator/mission.md`, `.operator/backlog.json`, `.operator/state.json`, and `.operator/checkpoints/`.

## Refresh signals

Run:

```bash
python3 scripts/operator_runtime.py scan --repo /path/to/repo
```

The scan merges:

- actionable TODO/FIXME comments in repo files
- explicit doc headings or bullets such as `Next steps`, `Follow-up`, and `Known blockers`
- failing GitHub Actions runs
- open issues
- PR review states
- discussions when available

Resolved scan-derived pending items automatically disappear on the next refresh, so the queue tracks the current repo state instead of accumulating stale noise.

## Choose the next item

Run:

```bash
python3 scripts/operator_runtime.py next --repo /path/to/repo
```

This marks the top pending item as `in_progress` and writes `next_action` into `.operator/state.json`.

## Turn plans into work

If a broad plan is needed, do not stop there. Convert it into executable backlog items:

```bash
python3 scripts/operator_runtime.py ingest-plan --repo /path/to/repo --plan-file /path/to/plan.md
```

## Checkpoint and continue

After one bounded improvement is implemented and verified:

```bash
python3 scripts/operator_runtime.py checkpoint \
  --repo /path/to/repo \
  --item-id <item-id> \
  --summary "Added retry diagnostics and tightened the smoke path." \
  --verification-status passed \
  --verification-summary "Smoke path passed locally and CI failure is gone." \
  --publish-checkpoint
```

This writes a durable checkpoint, updates state, refreshes the backlog, selects the next item, and optionally creates a checkpoint commit.

## Stop only on a real reason

Allowed stop reasons:

- `needs_user_decision`
- `external_blocker`
- `risk_budget_exceeded`
- `no_safe_work`
- `mission_complete`
