---
name: Bug report
about: Something in the harness (agent, hook, skill) isn't behaving as documented
title: "[Bug] "
labels: bug
assignees: ''
---

## Describe the bug

A clear description of what went wrong (e.g. a hook blocked something it shouldn't
have, an agent used the wrong model tier, a skill failed to trigger).

## Which layer is affected?

- [ ] Agent (which one: )
- [ ] Hook (which one: )
- [ ] Skill (which one: )
- [ ] Docs (CLAUDE.md / README)

## Consumer project type

- [ ] Next.js App Router
- [ ] Vite + React (TanStack Router)
- [ ] Vite + React (React Router 7)
- [ ] Monorepo
- [ ] Other:

## Steps to reproduce

1.
2.
3.

## Expected behavior

What you expected to happen.

## Actual behavior

What actually happened. Paste relevant stderr/stdout from the hook or agent output if
available.

## Environment

- fe-rail version:
- Claude Code version:
- OS:
- Package manager (npm/pnpm/yarn/bun):

## Additional context

`FE_RAIL_HOOK_PROFILE` / `FE_RAIL_DISABLED_HOOKS` values if non-default, and anything
else relevant.
