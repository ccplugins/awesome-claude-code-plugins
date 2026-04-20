---
description: Smart project lifecycle router — from idea to deployed product. Routes to /kickstart (full cycle), /blueprint (planning only), or /guide (step-by-step prompts).
---

## Context

- Current directory: !`pwd`
- Git status: !`git status --short 2>/dev/null || echo "Not a git repo"`

## Your task

You are the entry point for the **idea-to-deploy** methodology — a complete project lifecycle from idea to deployed and hardened product.

Assess the user's request and route to the appropriate workflow:

**A) Full lifecycle** (idea → deployed product) → `/kickstart`
- User has an idea and wants a working project
- Covers: product discovery (MoSCoW/RICE), architecture, implementation plan, scaffolding, coding, testing, deployment

**B) Planning only** (no code) → `/blueprint`
- User wants documentation: strategic plan, architecture, PRD, implementation plan
- No code generation, just thorough planning artifacts

**C) Step-by-step guide** (existing docs) → `/guide`
- User already has documentation and wants copy-paste prompts to build via Claude Code

Ask the user which scenario fits, then delegate to the appropriate skill.

For work on **existing** codebases (bugs, refactoring, testing, deployment), use `/task` instead.

### Available skills (19 total)
- **Creation:** /kickstart, /blueprint, /guide
- **Daily work:** /task (router), /bugfix, /refactor, /doc, /test, /perf, /explain
- **Quality:** /review (self-review mode with binary rubric), /security-audit, /deps-audit
- **Operations:** /migrate, /harden, /infra
- **Workflow:** /project (this router), /session-save

### Subagents (6 total)
- architect, code-reviewer, doc-writer, perf-analyzer, test-generator, security-auditor

Full documentation: https://github.com/hihol-labs/idea-to-deploy
