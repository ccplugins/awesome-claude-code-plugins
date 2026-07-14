# Release: <feature-name>

| | |
|---|---|
| **Phase** | Keep |
| **Owner** | Release Manager (`/go-live`) |
| **Input** | `review.md` (`passed`), `qa.md` (`passed`) |
| **Status** | `preparing` \| `released` \| `aborted` |
| **Version** | vX.Y.Z |
| **Date** | YYYY-MM-DD |

## 1. Pre-Flight Checks

<!-- Verified immediately before releasing — not copied from earlier reports. -->

- [ ] `review.md` status is `passed`
- [ ] `qa.md` status is `passed`
- [ ] Full test suite green on the release commit
- [ ] Build succeeds from a clean checkout
- [ ] No uncommitted changes in the working tree

## 2. Changelog

<!-- User-facing language. What can they do now that they couldn't before? -->

### Added
-

### Changed
-

### Fixed
-

## 3. Release Actions

<!-- What was actually executed, with results. -->

| Action | Result |
|---|---|
| Version bump & tag | |
| PR / merge | |
| Deploy | |
| Post-release smoke check | |

## 4. Learnings (Keep!)

<!-- The K in SPARK: what does the team keep from this cycle? -->

- **What went well:**
- **What we'd do differently:**
- **Patterns worth reusing:** <!-- candidates for CLAUDE.md / project memory -->

---

## ✅ KEEP GATE

*All boxes checked → the loop is closed. The feature is done-done.*

- [ ] All pre-flight checks passed at release time
- [ ] Changelog written in user-facing language
- [ ] Release actions executed and verified (or `aborted` with reason)
- [ ] Learnings recorded
- [ ] Status set to `released`
