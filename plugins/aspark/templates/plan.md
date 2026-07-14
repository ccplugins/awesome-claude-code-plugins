# Plan: <feature-name>

| | |
|---|---|
| **Phase** | Plan |
| **Owner** | Engineering Manager (`/sprint-plan`) |
| **Input** | `.spark/<feature-name>/spec.md` (must be `approved`) |
| **Status** | `draft` \| `approved` |
| **Date** | YYYY-MM-DD |

## 1. Architecture Decision

<!-- Mini-ADR. The EM decides — but shows the alternatives that were rejected and why. -->

- **Context:** What technical situation does the spec put us in?
- **Decision:** The chosen approach, in two or three sentences.
- **Alternatives considered:**
  | Alternative | Why rejected |
  |---|---|
  | | |
- **Consequences:** What becomes easier, what becomes harder?

## 2. Affected Components

<!-- Files, modules, services, external dependencies. New dependencies need a justification. -->

## 3. Task Breakdown

<!-- Ordered. Every task maps to a story from the spec and has its own definition of done.
     /increment works through this table top to bottom — nothing else — and keeps Status current. -->

| # | Task | Story | Depends on | Status | Definition of Done |
|---|---|---|---|---|---|
| T1 | | US-1 | – | `todo` | |
| T2 | | US-1 | T1 | `todo` | |

## 4. Test Strategy

<!-- What gets unit tests, what gets integration tests, what is left to /demo-day in the browser. -->

## 5. Risks & Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| | | |

---

## ✅ PLAN GATE

*All boxes checked → `/increment` may start. Any box open → back to `/sprint-plan`.*

- [ ] Spec status is `approved` (never plan against a draft)
- [ ] Architecture decision includes rejected alternatives (a decision without alternatives is a guess)
- [ ] Every task maps to a user story — no orphan tasks, no story without tasks
- [ ] Every task has a checkable definition of done
- [ ] Task order respects dependencies
- [ ] Test strategy covers every Must story
- [ ] Status set to `approved` by the user
