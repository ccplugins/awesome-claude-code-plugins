---
name: conductor-orchestrator
description: "Master coordinator for the Evaluate-Loop. Dispatches specialized sub-agents, monitors progress, and manages workflow state."
---

# Conductor Orchestrator

Multi-agent orchestration system for Claude Code with parallel execution, automated quality gates, and a 5-member Board of Directors.

## What It Does

One command (`/go`) handles the full development lifecycle:

1. Creates a specification from your goal
2. Generates a dependency-aware execution plan (DAG)
3. Evaluates the plan for scope, overlap, and feasibility
4. Executes tasks in parallel where possible
5. Evaluates results (code quality, UI/UX, integrations, business logic)
6. Fixes any issues automatically
7. Reports completion

## Components

- **16 Agents** — Orchestrator, loop agents, board directors, executive advisors, workers
- **42 Skills** — Planning, execution, evaluation, debugging, TDD, code review
- **22 Commands** — `/go`, `/conductor:implement`, `/board-meeting`, `/cto-advisor`, and more
- **4 Evaluators** — UI/UX, Code Quality, Integration, Business Logic
- **5 Board of Directors** — Chief Architect, CPO, CSO, COO, CXO

## Installation

```bash
git clone https://github.com/Ibrahim-3d/conductor-orchestrator-superpowers.git ~/.claude/plugins/conductor-orchestrator-superpowers
```

## Usage

```bash
/go Add user authentication with OAuth
/go Fix the login bug where users get logged out after refresh
/go Build a dashboard with real-time analytics charts
```

Bundles [superpowers](https://github.com/obra/superpowers) v4.3.0 (MIT).

For full documentation, see the [GitHub repository](https://github.com/Ibrahim-3d/conductor-orchestrator-superpowers).
