# Session Memory Optimizer

Optimize Claude Code session performance with health monitoring, context pruning guidance, and checkpoints for long coding sessions.

## Problem Solved

Claude Code experiences performance degradation after 2-5 hours of continuous work:
- Response times increase
- Context confusion occurs
- Pro Max subscribers ($199/mo) get degraded results

This plugin provides proactive session management to prevent degradation.

## Features

### Commands
- `/session-status` - Display session health metrics and recommendations
- `/session-checkpoint <name>` - Save current session context as a checkpoint
- `/session-restore [name]` - Restore context from a checkpoint
- `/session-optimize` - Analyze context and get pruning recommendations

### Hooks
- **PreCompact** - Injects optimization guidance when Claude auto-compacts
- **SessionStart** - Notifies of available checkpoints from previous sessions
- **SessionEnd** - Auto-saves checkpoint for sessions >30 minutes

### Skills
- **Context Management** - Best practices for maintaining session performance

## Installation

```bash
claude plugins add github:ojallington/session-memory-optimizer
```

## Usage

```bash
# Check session health
/session-status

# Save checkpoint before major work
/session-checkpoint before-refactor

# Get optimization recommendations
/session-optimize

# Restore after restart
/session-restore before-refactor
```

## Links

- [GitHub Repository](https://github.com/ojallington/session-memory-optimizer)
- [Documentation](https://github.com/ojallington/session-memory-optimizer#readme)

## License

MIT
