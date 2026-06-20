---
name: design-from-code
description: Workflow skill that turns one issue/requirement into a design in the order "verify real code & data → iterate faithful HTML mockups → design doc (.md) → delegate implementation." When designing a change to existing UI, it reads the actual component source and data model instead of imagining them, and reproduces the current screen pixel-for-pixel. Triggers (EN) "design this", "make a mockup", "how should this feature look", "add ~ to the existing screen"; (KO) "설계해줘", "시안 만들어줘", "이 기능 어떻게 보여줄지", "기존 화면에 ~ 추가".
---

# design-from-code — design mockups grounded in real source

> One line: **lock facts with code → agree via HTML → nail it in a `.md` → ship by delegating.**
> The key difference: mockups are not *imagined*. They are reproduced down to the pixel and the number by **reading the real component JSX and data queries.**

## When to use

- Designing a change that **adds or modifies something** in an existing screen/component (e.g. "add a metrics card to the bottom bar")
- **UI re-layout / emphasis** requests like "it's hard to see / I want it shown like this"
- Exposing data (numbers, stats) on screen when you need to **pin down exactly what each number counts**
- When the user says "mockup first / show me in HTML"

## When NOT to use

- Pure backend/CLI work, changes with no UI
- A simple, already-agreed bug fix (no mockup needed)

## Core principles (these override every other decision)

1. **No guessing — read the code.** "How does this stat work?" is wrong ~100% of the time if you imagine it. Trace handler→query→schema all the way down, confirm it as *fact*, then design. → `references/data-model-verification.md`
2. **Reproduce the real component faithfully.** Before any new mockup, draw the **current state (AS-IS) exactly as the real JSX renders it**. Schematic drawings cause misunderstandings. → `references/code-fidelity-reproduction.md` (★ the heart of this skill)
3. **Pictures over prose.** Iterate with self-contained HTML you can see and fix. Bump the version (v2, v3…) on every round of feedback. → `references/html-mockup-recipe.md`
4. **Confirm one decision at a time.** "A vs B?" → "7-day window?" → "monotone color?" — ask narrowly.
5. **Mark keep / new / changed.** When "leave the rest as-is" is a requirement, use 🟦keep / 🟩new / 🟨changed color tags to show what you are *not* touching.
6. **Empty / initial state is first-class.** Always design the data-zero (new user) screen alongside the populated one.
7. **Delegate the build, but verification is mandatory.** Close it out with build / type-check / tests.

## The 8-step workflow

| # | Step | Key tools | Detail |
|---|------|-----------|--------|
| 1 | Read the issue verbatim | `Bash` + `gh issue view` | Don't open GitHub via WebFetch (auth fails) |
| 2 | Map the code | `Agent(Explore)` ×N | Get just the conclusions for related components/hooks/schema |
| 3 | **Verify the data** | `Bash` (grep/sed) + Explore | handler→use-case→repository→schema. `references/data-model-verification.md` |
| 4 | HTML mockup v1 | `Write` (.html) + `SendUserFile` | Phone frame, 2–3 options, per-state, inline SVG. `references/html-mockup-recipe.md` |
| 5 | User confirmation | reply / `AskUserQuestion` | Confirm one at a time; v2, v3 per feedback |
| 6 | **Faithful AS-IS/TO-BE** | `Bash` (read JSX with sed) + `Write` | Extract real render fns/classes/labels → HTML. `references/code-fidelity-reproduction.md` |
| 7 | Design doc `.md` | `Write` | Approved mockup + verified data model + build entry points + phases |
| 8 | Delegate + verify | `Agent` (language expert) + direct | Delegate with the contract & verify commands baked in; close with build/tests |

## Reference files

- `references/code-fidelity-reproduction.md` — **★ concrete technique for reading the real component with sed and reproducing it 1:1 in HTML** (worked `renderSeg` example)
- `references/data-model-verification.md` — how to trace the data model all the way down (events-table username-attribution example)
- `references/html-mockup-recipe.md` — recipe for self-contained HTML (phone frame, inline-SVG charts, design tokens, empty state)
- `references/prompt-templates.md` — copy-paste prompts for each step
- `examples/issue-976-walkthrough.md` — the full flow of a real case (v1→v5, including the point where the user corrected "top/bottom is reversed")

## Common mistakes (checklist)

- [ ] Wrote data behavior from a **guess** → did you confirm it in code?
- [ ] Mockup is **schematic** so it differs from reality → did you read the real JSX and reproduce classes & labels?
- [ ] Asked several decisions at once and caused confusion → did you confirm one at a time?
- [ ] "Keep existing" was the requirement but it's unclear what stays untouched → did you add keep/new/changed tags?
- [ ] Forgot the empty / initial state (data-zero) → did you include the empty-state design?
- [ ] Pulled in a chart library for the graph → did you use inline SVG instead?
- [ ] Skipped build/type-check after implementing → did you close it out with verification commands?
