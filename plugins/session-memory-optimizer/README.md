# Session Memory Optimizer

A Claude Code plugin that solves performance degradation in long coding sessions.

## The Problem

Claude Code experiences significant performance degradation after 2-5 hours of continuous work:
- Response times increase noticeably
- Context confusion (mixing up details from different files)
- Repetition (asking about things already discussed)
- Pro Max subscribers ($199/mo) getting worse results than expected

This is documented across GitHub issues #7769, #10881, #4511 with 15+ reactions each.

## The Solution

This plugin provides proactive session management:

1. **Health Monitoring** - Know when optimization is needed
2. **Smart Checkpoints** - Save/restore session context summaries
3. **Optimization Guidance** - What to prune vs. preserve
4. **PreCompact Hook** - Automatic optimization hints during compaction

## Installation

```bash
# From GitHub
claude plugins add github:aimakemoney/session-memory-optimizer

# Local development
claude --plugin-dir /path/to/session-memory-optimizer
```

## Commands

### `/session-status`
Display current session health metrics and recommendations.

```
SESSION HEALTH DASHBOARD
========================
Duration:        3h 45m
Health Status:   🟡 MODERATE
Last Checkpoint: None

Recommendation:  Consider creating a checkpoint with /session-checkpoint
```

### `/session-checkpoint <name>`
Save current session context as a compressed checkpoint.

```bash
/session-checkpoint before-refactor
/session-checkpoint end-of-day
/session-checkpoint feature-complete
```

Captures:
- Active files and current task
- Key decisions and their rationale
- Established patterns/conventions
- Pending TODOs and blockers

### `/session-restore [name]`
Restore context from a previously saved checkpoint.

```bash
/session-restore              # List available checkpoints
/session-restore before-refactor  # Restore specific checkpoint
```

### `/session-optimize`
Analyze session context and provide optimization recommendations.

Shows:
- What's safe to prune (old outputs, resolved errors)
- What must be preserved (active task, decisions, errors)
- Estimated context reduction
- Specific `/compact` command to run

## Automatic Features

### PreCompact Hook
When Claude Code auto-compacts, this plugin injects guidance to:
- Preserve current task, decisions, active files, unresolved errors
- Aggressively compress old outputs, resolved issues, dead-end explorations

### Session Start
Notifies you of available checkpoints from previous sessions.

### Session End
Auto-saves a quick checkpoint for sessions longer than 30 minutes.

## Best Practices

1. **Check health every 2 hours**: `/session-status`
2. **Checkpoint at milestones**: `/session-checkpoint <milestone>`
3. **Read files on demand**: Not preemptively
4. **Summarize completed work**: Before moving on
5. **Compact with focus**: Guide what to preserve

## File Structure

```
session-memory-optimizer/
├── .claude-plugin/
│   └── plugin.json
├── commands/
│   ├── session-status.md
│   ├── session-checkpoint.md
│   ├── session-restore.md
│   └── session-optimize.md
├── hooks/
│   ├── hooks.json
│   └── scripts/
├── skills/
│   └── context-management/
├── scripts/
│   ├── checkpoint-manager.py
│   └── health-calculator.py
└── data/
    └── checkpoints/
```

## License

MIT License - See LICENSE file.

## Contributing

Issues and PRs welcome at: https://github.com/aimakemoney/session-memory-optimizer
