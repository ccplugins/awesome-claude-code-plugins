---
name: wf-compose
description: "Propose a weft workflow from conversation context. Scans skills, identifies gaps, builds template with loops."
argument-hint: "[description] [--from template-name]"
allowed-tools: [Bash, Read, Write, Glob, Grep]
---

# Compose a Weft Workflow

Read the conversation context, scan available skills, identify gaps, and propose a v2 workflow template with loops and skill blocks.

## Arguments
$ARGUMENTS

## Modes

| Usage | Behavior |
|-------|----------|
| `/wf-compose "review, fix, iterate until clean"` | One-shot: propose from description |
| `/wf-compose` (no args) | Interactive: ask "What are you trying to accomplish?" |
| `/wf-compose --from feature-workflow` | Start from existing template, modify based on context |

## Step 1: Gather Context

Understand what the user is trying to do:

1. Review the recent conversation for intent (what task, what repo, what outcome).
2. Check git state:
   ```bash
   git branch --show-current 2>/dev/null
   git diff --stat 2>/dev/null | tail -5
   ```
3. Check if a weft workflow is already active:
   ```bash
   python3 "${CLAUDE_PLUGIN_ROOT}/core/cli.py" status 2>/dev/null
   ```
4. If `--from <template>` was provided, load it as the starting point:
   ```bash
   python3 "${CLAUDE_PLUGIN_ROOT}/core/cli.py" preview <template>
   ```

## Step 2: Scan Skill Registry

Build a map of what skills are available:

1. Read the local skills registry, if any (path varies by setup):
   ```bash
   cat "${CLAUDE_SKILLS_REGISTRY:-$HOME/.claude/skills-registry.json}" 2>/dev/null
   ```
2. List weft templates:
   ```bash
   python3 "${CLAUDE_PLUGIN_ROOT}/core/cli.py" start
   ```
3. Categorize skills by function (examples — substitute what you have available):
   - **Review**: staff-review, arch-review, code-review, differential-review
   - **Fix/Polish**: fix-polish, refactor, simplify
   - **Test**: infra-test, webapp-testing
   - **Plan**: aot-plan, spec-first
   - **Research**: perplexity, context7, research-loop
   - **Deploy**: deploy-service, pr-ready

## Step 3: Gap Analysis

Compare what the user described against available skills:

1. Extract skill references from the user's description (explicit names like "/staff-review" or implicit like "review code", "test it", "deploy").
2. For each referenced skill, check if it exists in the registry.
3. For missing skills, present options:
   ```
   Missing skill: /devils-advocate
   Options:
   1. Create a stub skill (I'll generate a skeleton)
   2. Use /staff-review instead (similar purpose)
   3. Skip this step
   ```
4. Wait for user choice on each gap before proceeding.

## Step 4: Generate Template

Build a v2 template JSON:

1. Map each step in the user's described workflow to a template step.
2. For each step, set:
   - `name`: kebab-case identifier
   - `skill`: the matching skill name (e.g., "/staff-review"), or null if manual
   - `on_fail`: "retry" for review/test steps, "block" for critical gates, "continue" for optional steps
   - `guards`: add logical guards (e.g., no `git push` before review)
   - `description`: one-line summary of what the step does

3. For iterative segments (user said "until", "repeat", "loop", "iterate"):
   - Identify the loop boundary (which steps repeat)
   - Set `loop_back_to` on the last step of the loop, pointing to the first
   - Set `max_iterations` (default 3, or what the user specified)
   - Set `exit_condition` from the user's description (natural language)

4. Add `schema_version: 2` to the template root.

## Step 5: Present to User

Show the proposed workflow in two formats:

### ASCII Diagram

Draw the workflow as a flow diagram showing loops:

```
  ┌────────────┐     ┌───────────────┐     ┌─────────────┐
  │   review    │────>│  fix-issues   │────>│  run-tests   │
  │ /staff-rev  │     │ /fix-polish   │     │              │
  └────────────┘     └───────────────┘     └──────┬──────┘
        ^                                         │
        │        ↻ until clean (max 3)            │
        └─────────────────────────────────────────┘
                          │ done
                          v
                   ┌─────────────┐
                   │    ship     │
                   │  /pr-ready  │
                   └─────────────┘
```

For linear segments, use a simple arrow chain:
```
  setup ──> plan ──> implement ──> verify
```

### JSON Preview

Show the full template JSON, formatted for readability.

### Prompt

Ask the user:
```
Approve this workflow? (approve / edit / cancel)
- approve: Save template and optionally start it
- edit: Describe what to change
- cancel: Discard
```

## Step 6: Save and Start

On **approve**:
1. Save the template:
   ```bash
   echo '<json>' | python3 "${CLAUDE_PLUGIN_ROOT}/core/cli.py" save-template
   ```
2. Ask: "Start this workflow now? (y/n)"
3. If yes: invoke `/wf-start <template-name>`

On **edit**:
1. Ask what to change
2. Modify the template
3. Go back to Step 5 (re-present)

On **cancel**:
1. Discard and confirm

## Design Rules

- Every step with a matching skill gets a `skill` field. This is metadata — Claude reads it from context.md and knows which skill to invoke.
- Loops are defined by `loop_back_to` on the last step of the repeating segment. The state machine handles the rest.
- `exit_condition` is evaluated by Claude (natural language), not by scripts. Keep conditions specific and observable: "no MEDIUM+ issues" not "code is good enough".
- `max_iterations` defaults to 3. If the user says "until done" without a cap, set it to 5 and note the cap.
- Guards should prevent premature actions: no `git push` before review, no deploy before tests.
- Template names are kebab-case. If the user doesn't name it, derive from the description.
