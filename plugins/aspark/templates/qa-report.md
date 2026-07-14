# QA Report: <feature-name>

| | |
|---|---|
| **Phase** | Review (hands-on) |
| **Owner** | QA Tester (`/demo-day`) |
| **Input** | Running app (URL), `.spark/<feature-name>/spec.md` (the acceptance criteria) |
| **Status** | `in-testing` \| `failed` \| `passed` |
| **Date** | YYYY-MM-DD |

## 1. Test Environment

- **App URL:**
- **Browser / viewport(s):** <!-- test desktop AND mobile viewport for UI features -->
- **Test data / accounts used:**

## 2. Acceptance Criteria Verification

<!-- One row per AC from the spec. Every AC gets clicked through in the real browser — no "should work". -->

| AC | Steps performed | Expected | Observed | Result |
|---|---|---|---|---|
| AC-1.1 | | | | ✅ pass / ❌ fail |

## 3. Exploratory Findings

<!-- Beyond the ACs: what happens on double-click, empty input, refresh mid-action, back button, slow network? -->

| # | Severity | Steps to reproduce | Expected vs. observed | Status |
|---|---|---|---|---|
| B1 | Blocker / Major / Minor | | | open / fixed / accepted |

## 4. Console & Network

<!-- Errors/warnings in the browser console, failed requests observed during testing. Empty section = checked and clean. -->

## 5. Verdict

<!-- Would you demo this to a stakeholder right now? If not, it fails. -->

---

## ✅ QA GATE

*All boxes checked → `/go-live` may start. Any box open → back to `/increment`, then re-run `/demo-day`.*

- [ ] Every Must-story acceptance criterion verified in the real browser and passed
- [ ] No open Blocker or Major bugs (Minor bugs listed and accepted by the user)
- [ ] Browser console free of errors on the tested flows
- [ ] Tested on all agreed viewports
- [ ] Status set to `passed`
