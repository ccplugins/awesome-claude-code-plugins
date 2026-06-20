# Data-Model Verification

> Confirm "exactly what does this number count?" **in code**. Designing on guesswork is 100% wrong.
> If the design surfaces stats/numbers on screen, finish this step *before* drawing any mockup.

---

## 1. Trace Path (backend-first)

```
router registration  →  handler (auth · scope derivation)  →  use case (filters)  →  repository (WHERE clause)  →  schema (columns · attribution)
```

What to read at each step:
- **Router**: endpoint path · method · auth middleware.
- **Handler**: Who is it scoped to? (userID? token?) Which parameters (days, doc)?
- **Use case**: What does it filter by? userID→username conversion, etc.
- **Repository**: the actual SQL `WHERE` clause. **What it includes/excludes**.
- **Schema**: Whose *content* is this stat attributed to? (author_id? username? doc_uuid?)

---

## 2. Practical Commands

```bash
# Where the endpoint is registered
grep -rn "<resource>/summary\|/<resource>" server/internal --include="*.go" | grep -iE "Get|Post|route"

# Read the handler closely (auth · scope)
sed -n '1,60p' server/internal/<feature>/handler/summary_handler.go

# Use case (filter derivation)
sed -n '1,60p' server/internal/<feature>/usecase/summary.go

# Repository WHERE clause (the crux)
grep -nE "WHERE|Username|device_type|is_self|COUNT|GROUP BY" \
  server/internal/<feature>/repository/query_repository.go

# Schema (attribution columns)
sed -n '1,80p' server/<orm>/schema/event.go
```

If parallel investigation is needed, delegate to `Agent(subagent_type: Explore)` with a "trace it end to end" prompt (→ `prompt-templates.md`).

---

## 3. Questions You Must Settle in One Line

| Question | Example answer (this case) |
|------|------------------|
| Scoped by whom? | `WHERE username=$1` — the owner's handle (no author_id; attributed by username string) |
| What's included/excluded? | `device_type<>'bot'` (excludes bots) + `is_self=false` (excludes the owner) |
| What range is summed? | If no `doc`, **sum the home (/@handle) + all posts (/@handle/<slug>)** |
| Is there time-series / rate-of-change data? | `daily[]` (visitors per day) exists → fetch with days=14, split into last 7 / previous 7 |
| Unique vs. cumulative? | `unique_visitors = COUNT(DISTINCT visitor_id)` |

→ **Settled output (one line)**: "Visitors = unique visitors across my entire public surface, excluding bots and the owner, summing home + all posts."

---

## 4. Diagnosing "Looks Like There's No Data"

When a number shows 0, distinguish **a tracing gap from genuinely absent data**:
- Check the beacon's firing condition (consent gate `isTrackingAllowed()`, etc.) — no consent means no collection.
- Whether the endpoint was committed/deployed (`git log -- <file>`).
- Whether there's genuinely no traffic (new user) — in this case, solve it with an **empty-state design** (not a tracking problem).

---

## 5. Don't "Invent" Time-Series or Rate-of-Change From Nonexistent Data

- Some metrics have a daily time series (visitors `daily[]`); some don't (likes).
- For metrics without a time series, **disable the graph tab** or expose only "total + change." **No fake flat graphs** (honesty).
- Rate of change = sum for this period vs. sum for the immediately preceding equal period. If data exists for only one side, omit the rate of change.

---

## 6. If New Data Is Needed → Define the Contract First

If a metric is missing from the existing API (e.g., likes total), **settle the endpoint contract (JSON) first**, then delegate the implementation.
```
GET /api/<resource>/likes-summary?days=N  (owner-authenticated)
→ { "total": 342, "current": 57, "previous": 41 }
  total=all time, current=last N days, previous=the N days before that (for rate of change)
```
With a contract in place, frontend and backend can proceed in parallel.
