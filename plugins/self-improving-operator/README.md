# Self-Improving Operator

Claude Code plugin for proactive project ownership.

This plugin helps Claude Code keep pushing a project forward instead of stopping after one narrow edit.

It encodes a repeatable loop:

- inspect the real current state
- choose one high-leverage unfinished gap
- make one bounded improvement
- verify with direct evidence
- refresh handoff notes when the truth changes

## Included components

- `skills/improve-project/SKILL.md`
- `skills/operator-playbook/SKILL.md`
- `agents/self-improving-operator-executor.md`

## Usage

Invoke the main skill from Claude Code:

```text
/self-improving-operator:improve-project improve the onboarding flow and verify it
```

## Canonical repository

[wd041216-bit/claude-code-self-improving-operator](https://github.com/wd041216-bit/claude-code-self-improving-operator)

## License

Apache-2.0
