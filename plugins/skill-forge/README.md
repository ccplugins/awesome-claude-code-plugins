# skill-forge

**TDD-Based Automatic Skill Upgrade Plugin for Claude Code**

> *"The only TDD-based self-improvement system for Claude Code skills"*

## Overview

skill-forge automatically analyzes, evaluates, and improves AI agent skills using Test-Driven Development principles. Inspired by Gödel Machines and validated through statistical methods (95% confidence intervals).

## Features

- **TDD-Fit Assessment**: Verify skills have tests and are improvable
- **Trial Branch Strategy**: Safe experimentation with automatic rollback
- **Statistical Validation**: 3x independent evaluations with 95% CI
- **Evaluator Separation**: Prevents bias through independent evaluation agents
- **Max 6 Iterations**: Balances improvement vs. stability

## Installation

```bash
git clone https://github.com/quantsquirrel/claude-skill-forge.git \
  ~/.claude/plugins/local/skill-forge
```

## Usage

```bash
/skill-forge:forge --scan        # Scan upgradeable skills
/skill-forge:forge <skill>       # Upgrade specific skill
/skill-forge:forge --history     # View upgrade history
```

## Results

| Metric | Baseline | After | Improvement |
|--------|----------|-------|-------------|
| CSO Score | 71 | 90.33 | **+27%** |

## Links

- [GitHub Repository](https://github.com/quantsquirrel/claude-skill-forge)
- [Documentation (English)](https://github.com/quantsquirrel/claude-skill-forge/blob/main/README.md)
- [Documentation (한국어)](https://github.com/quantsquirrel/claude-skill-forge/blob/main/README.ko.md)

## Research Background

Based on proven theories:
- **Gödel Machines** (Schmidhuber, 2007) - Provable self-improvement
- **Dynamic Gödel Machines** - Incremental optimization
- **TDD Safety** - Tests define change boundaries

## License

MIT
