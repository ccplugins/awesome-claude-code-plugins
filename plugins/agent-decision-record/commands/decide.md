# /decide - Technical Decision Gate

Forces structured decision-making and creates an auditable Agent Decision Record (AgDR).

## Trigger

```
/decide "what you're deciding"
/decide which state management library to use
/decide how to implement caching
```

## Process

### 1. Parse Decision Topic

Extract the decision topic from input. If unclear, ask:
```
What technical decision do you need to make?
```

### 2. Gather Context

Identify decision-relevant context only:
- What problem are we solving?
- What constraints exist?
- What's already in the codebase?

### 3. List Options

Present 2-4 options in a table:

```markdown
| Option | Pros | Cons |
|--------|------|------|
| Option A | ... | ... |
| Option B | ... | ... |
```

### 4. Make Decision

State the chosen option with justification.

### 5. Generate AgDR

Create file at `{project-root}/docs/agdr/AgDR-{NNNN}-{slug}.md`:

```markdown
---
id: AgDR-{NNNN}
timestamp: {ISO-8601: YYYY-MM-DDTHH:MM:SSZ}
agent: claude-code
model: {model-id from environment}
session: {session-id if available}
trigger: user-prompt
status: executed
---

# {short title}

> In the context of {context}, facing {concern}, I decided {decision} to achieve {goal}, accepting {tradeoff}.

## Context
{Decision-relevant context only - 2-4 bullets}

## Options Considered
| Option | Pros | Cons |
|--------|------|------|
| ... | ... | ... |

## Decision
Chosen: **{option}**, because {justification}.

## Consequences
- {consequence 1}
- {consequence 2}

## Artifacts
- {commit/PR links when available}
```

### 6. Get Next ID

```bash
# Find highest existing AgDR number
ls docs/agdr/AgDR-*.md 2>/dev/null | sort -V | tail -1 | grep -oP 'AgDR-\K\d+'
# Increment by 1, or start at 0001
```

### 7. Return Decision

Output the decision so work can continue:

```
Decision: {chosen option}

AgDR-{NNNN} created at docs/agdr/AgDR-{NNNN}-{slug}.md

Proceeding with: {brief action}
```

## Rules

1. **Always create AgDR** - No decision without a record
2. **Context is minimal** - Only what influenced the decision
3. **Y-statement required** - One-line summary at top
4. **Options table required** - At least 2 options compared
5. **Justification required** - "because" clause mandatory
6. **Timestamp precise** - Full ISO-8601 with time
7. **Slug from title** - Lowercase, hyphens, max 50 chars
