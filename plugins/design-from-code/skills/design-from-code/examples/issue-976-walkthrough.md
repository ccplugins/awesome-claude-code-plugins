# Worked Example — Issue #976 (Mobile Bottom Brand Status)

> The complete flow of applying this skill to a real issue. Recorded as-is, including why the mockup went from v1 through v5 and the exact points where the user corrected course.

## Requirement (Issue, original text)
> "On the mobile bottom, instead of content that's hard to see, show information (numbers) that appeal psychologically, and make them big. Posts published, visitors, likes. A weekly graph showing the rate of change. Add a branding element."

Target = the bottom sheet `MobileBottomBar`.

---

## Application, Step by Step

### [1] Read the issue
`gh issue view 976 ...` → restated intent: "Big numbers in the bottom bar (published / visitors / likes) + a weekly rate-of-change graph + branding."

### [2] Map the code (Explore ×1)
→ peek = nav icons + the ＋ FAB; full = secondary menu, recent posts, calendar, brand metrics (the bottom 3 tiles), and footer. Found the reusable component `Sparkline.tsx`. Data comes from `fetchSummary` (currently days=1).

### [3] Verify the data (direct sed + Explore)
Traced handler → use case → repository → schema. **Confirmed facts**:
- `events` has no author_id → **attribution is by the `username` string**.
- `WHERE username=$1 AND device_type<>'bot' AND is_self=false`.
- If there's no `doc`, it's **the home page plus all posts, summed**. A `daily[]` time series exists.
- Likes live only in `likes` and there's no aggregation API → **a new endpoint is needed**.
- There's no per-day time series for likes → decided to disable the graph tab.
→ This verification let us answer the user's question "Do visitors include both home and posts?" **with evidence from the code**.

### [4]–[6] HTML mockup iterations (v1→v5) — ★user feedback drove the direction
| Version | Change | Trigger |
|---------|--------|---------|
| v1 | Compared two options: option A (hero) and option B (3 numbers) | First presentation |
| v2 | Locked in option B + data-model panel + added an **empty state** | "Like option B / visitors not available yet" |
| v3 | Introduced AS-IS vs TO-BE (keep / new / changed tags) | "Re-propose by combining existing + new on top of the current bar" |
| v4 | **Read the actual JSX** to reproduce faithfully (renderSeg, the ＋ FAB circle, the 5-cell grid, the date calendar) | "More accurate, please" |
| v5 | Corrected to **pin the menu at the top / status below the menu** | "The menu is the bottom bar, so it goes at the very top, with the proposal below it" |

→ **Lesson**: faithful code reproduction in v4 (§code-fidelity) sharply raised accuracy, and in v5 the user corrected the top/bottom placement. Because we locked things down narrowly, one at a time, it converged fast.

### [7] Design document
`docs/02-design/issue-976-mobile-bottom-brand-status-design.md` — the locked-in v5 + the verified data model + implementation starting points + P1/P2/P3.

### [8] Implementation + verification
- Backend (delegated to a backend specialist): `GET /<resource>/likes-summary?days=N` → `{total,current,previous}`. go build + 33 tests PASS.
- Frontend (done directly): days=1→14, the likes query, the status card (first child of the body, empty state), absorbing the existing metrics module. build 0 errors, net-new tsc 0 errors.
- Menu and existing modules left untouched.

---

## Meta Lessons Taken From This Case

1. **Data verification builds user trust.** Answering "Do visitors include both home and posts?" from the code let the design proceed without snags.
2. **Faithful reproduction is the key to mockup accuracy.** The "this is accurate" reaction came at v3 (schematic) → v4 (code reproduction).
3. **Spatial constraints like placement get lost in words.** A diagram + locking things down one at a time fixed it by v5.
4. **Empty states from the start.** With real visitors at 0, the empty state was actually the top-priority screen.
5. **Playwright is a supporting tool.** It all failed due to environment issues, but reading the source carefully was enough.
