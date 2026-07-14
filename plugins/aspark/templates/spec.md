# Spec: <feature-name>

| | |
|---|---|
| **Phase** | Specify |
| **Owner** | Product Owner (`/story-time`), Designer (`/look-and-feel`) |
| **Status** | `draft` \| `design-checked` \| `approved` \| `rejected` |
| **Date** | YYYY-MM-DD |

## 1. Problem & Goal

<!-- The PO's interrogation result. Not what the user asked for — what they actually need. -->

- **Problem:** What hurts today? Who feels the pain?
- **Goal:** What outcome makes this feature a success?
- **Success signal:** How do we know it worked? (metric, observable behavior)
- **Why now:** What breaks or is lost if we don't build this?

## 2. Target Users

<!-- Concrete personas or roles. "Everyone" is not an answer. -->

## 3. Assumptions & Open Questions

<!-- Every assumption is a risk. Open questions block the gate until answered or explicitly accepted. -->

| # | Assumption / Question | Resolution |
|---|---|---|
| A1 | | |

## 4. User Stories

<!-- MoSCoW priority: Must / Should / Could / Won't. Every story needs testable acceptance criteria. -->

### US-1 (Must): <title>

> As a <role>, I want <capability>, so that <benefit>.

**Acceptance criteria:**

- [ ] AC-1.1: Given <context>, when <action>, then <observable result>.
- [ ] AC-1.2: …

## 5. Out of Scope

<!-- Explicitly cut. Prevents scope creep in /increment. -->

## 6. Design Review

<!-- Filled by /look-and-feel. Empty design review = gate stays red for UI-facing features. -->

- **Overall impression:**
- **Heuristics findings:** (visibility of status, consistency, error prevention, recognition over recall, …)
- **Accessibility notes:** (contrast, keyboard navigation, focus order, labels)
- **Design risks & required changes:**

---

## ✅ SPEC GATE

*All boxes checked → `/sprint-plan` may start. Any box open → back to `/story-time` or `/look-and-feel`.*

- [ ] Problem, goal and success signal are concrete (no buzzwords, no "everyone")
- [ ] Every story has testable Given/When/Then acceptance criteria
- [ ] Stories are prioritized (MoSCoW) and at least one is a Must
- [ ] Open questions are resolved or explicitly accepted as risk
- [ ] Out-of-scope section is filled (something was consciously cut)
- [ ] Design review done for UI-facing features (or marked N/A with reason)
- [ ] Status set to `approved` by the user
