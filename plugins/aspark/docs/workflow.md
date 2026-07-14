# The SPARK Workflow — Deep Dive

This document describes the mechanics behind the loop: how artifacts hand
over between phases, what the gates check, who is allowed to decide what,
and how the feedback loops work. Read the [README](../README.md) first for
the big picture.

## The Artifact Chain

Every feature lives in `.spark/<feature-name>/` inside the target project.
Each phase produces exactly one artifact, and each artifact declares which
input it requires — including the status that input must have:

```
 spec.md ──▶ plan.md ──▶ (code) ──▶ review.md ──▶ qa.md ──▶ release.md
 approved    approved    tasks done   passed       passed     released
```

| Artifact | Written by | Requires | Terminal status |
|---|---|---|---|
| `spec.md` | `/story-time` + `/look-and-feel` | the idea | `approved` (or `rejected`) |
| `plan.md` | `/sprint-plan` | spec `approved` | `approved` |
| the code | `/increment` | plan `approved` | all tasks `done` |
| `review.md` | `/peer-review` | tasks `done`, build green | `passed` |
| `qa.md` | `/demo-day` | review `passed`, running app | `passed` |
| `release.md` | `/go-live` | review + qa `passed` | `released` (or `aborted`) |

Because the artifacts carry the state, the loop is **resumable**: any later
session (or `/spark`) reads the statuses and continues at the first gate
that isn't closed. There is no hidden state outside `.spark/`.

## Gates

Every template ends in a gate checklist. A gate is closed when every box is
genuinely true — and gates enforce three invariants:

1. **No phase starts on an open gate.** `/sprint-plan` refuses a draft spec;
   `/go-live` refuses open QA blockers. There is no "just this once".
2. **Only the human approves.** Agents draft, check and recommend — but
   `approved`, waivers and the publish go are always the user's, given
   explicitly in the conversation. An earlier approval never carries over
   to a later gate.
3. **Overrides are recorded, not silent.** The user *may* overrule a gate
   (e.g. waive a Major finding). The override, its reason, and who gave it
   go into the artifact — the trail stays honest.

## The Feedback Loops

Findings never get "fixed in place" by the role that found them — they route
back through the developer, and the finding phase re-runs:

```
                    ┌────────────── findings ──────────────┐
                    ▼                                       │
 /sprint-plan ──▶ /increment ──▶ /peer-review ──▶ /demo-day ──▶ /go-live
       ▲                │  ▲                          │
       │                │  └───────── bugs ───────────┘
       └── plan wrong ──┘
```

- **Reviewer** fixes only obvious, low-risk issues itself (recorded as
  `fixed`); everything else goes to `/increment` fix-mode, then re-review.
- **QA** fixes nothing, ever. Bugs go to `/increment`, then `/demo-day`
  re-tests the fix *and* the flows around it.
- **Plan wrong?** `/increment` never improvises architecture. It stops, and
  the loop returns to `/sprint-plan` (revision) or `/story-time`.
- **Escalation:** `/spark` counts rounds — after three failed rounds of the
  same phase it stops and puts the situation to the user, because at that
  point the plan or the spec is the problem, not the code.

## Who Does What — and What They May Not

| Role | Owns | Explicitly may not |
|---|---|---|
| Product Owner | the *why* and *what*; scope; stories | write solutions; approve their own spec |
| Designer | design quality of the spec/UI | invent scope; touch non-design spec sections |
| Engineering Manager | the *how*; architecture; task cut | change the spec; approve their own plan |
| Developer (`/increment`) | the code | deviate from the plan; scope-creep |
| Reviewer | the review verdict; obvious fixes | waive own findings; refactor at will |
| QA Tester | the QA verdict, in a real browser | fix code; pass anything unobserved |
| Release Manager | the release; the learnings | release over a red gate; publish without the user's go |

The separations are the point: the QA tester who patched the app would test
their own work; the reviewer who waives their own finding reviews nothing.

## Conventions

- **Feature names** are short kebab-case (`weekly-stats-dashboard`), used as
  the directory name under `.spark/`.
- **Statuses** are lowercase, in the artifact's header table. Skills keep
  them accurate at all times — they are the loop's state machine.
- **Severities** everywhere: `Blocker` > `Major` > `Minor` (> `Nit` in code
  review). Blockers always block their gate; Majors need an explicit,
  recorded user waiver; Minors are accepted or fixed at the user's choice.
- **Templates** live in the plugin (`templates/`); artifacts are always
  instantiated into the target project, never edited in the plugin.
- **English** for all artifacts, code and reports — regardless of the
  conversation language.
