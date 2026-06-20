# Copy-Paste Prompt Templates

> Copy each step as-is and just swap out the `{curly_braces}`. You can hand these prompts directly to an AI when assigning it work.

---

## [1] Read the issue (direct Bash)

```bash
gh issue view {number} --repo {owner}/{repo} --json title,body,state,labels,comments,url
```
→ If the body is ambiguous, **restate the user's intent in one sentence** before starting.

---

## [2] Map the code — Explore agent

```
Map how {feature} is currently implemented in {path}.
Report with file path + line number + a short code excerpt:
1. What does {screen/component} render right now (state/slots/structure)?
2. Where does {data} come from — which hook/query/endpoint, and what shape are the response fields?
3. Reusable {chart/card/shared} components — names and props
4. Side data hooks such as {branding/profile}
Return a structured map, not a full dump.
```

---

## [3] Verify the data — Explore agent (backend)

```
Trace end to end how {endpoint} is computed and scoped.
router → handler (auth/scope) → use case (filters) → repository (WHERE clause) → schema (columns/ownership).
Answer the key questions explicitly:
- Who is it scoped by? (userId? username? global?)
- What is included/excluded? (bots excluded? self excluded? public only?)
- What is the aggregation range? (profile only? including posts? everything?)
- Is there already data to build a time series / rate of change? (fields like daily[])
Return it structured with file + line number + WHERE-clause excerpts.
```

---

## [4] HTML mockup — working principles (instruction to yourself)

```
Build a single self-contained HTML file:
- States side by side inside a phone frame (e.g., collapsed/expanded)
- Compare 2–3 layout options, with 2 lines of rationale under each
- Inline CSS/SVG only, zero chart libraries
- Numbers in tabular-nums; emphasize with size/weight, not color (preserve the monotone theme)
- Include empty/initial states (zero data) as first-class too
Generate the .html with Write → deliver it with SendUserFile.
```

---

## [6] Faithful AS-IS/TO-BE reproduction — working principles

```
1. Read the actual component JSX with sed and extract the render functions (renderXxx), Tailwind classes, labels, and icon sizes.
2. Translate exactly what you extracted into HTML/CSS 1:1 (do not invent labels; stay faithful to the code, e.g., active = weight, not color).
3. Two columns: AS-IS (exactly as it is now) | TO-BE (swap in only the parts that change).
4. Mark what you are not touching with color tags: 🟦keep / 🟩new / 🟨changed.
5. Also agree on placement constraints via a top→bottom stack diagram.
```

---

## [7] Design doc .md — table of contents

```
Write to docs/02-design/{issue}-design.md:
1. Background/intent (one-line issue + user intent)
2. Layout decision (finalized mockup filename + ASCII structure diagram)
3. Data model (verified — table of definitions, sources, scope)
4. Implementation entry points (backend/frontend files, functions, routes + new API contract JSON)
5. Phases P1/P2/P3
6. Principles/risks (performance, no-modification guarantee, honesty)
```

---

## [8] Delegate implementation — language-specialist agent

```
Add {endpoint/feature} as new.
Contract: {method, path, response JSON}.
Data model: {confirmed tables, columns, ownership}.
Follow the handler/use case/repository/dto pattern of the existing {similar feature} exactly.
Register the route next to the existing {similar route}. Wrap errors (fmt.Errorf) and pass context.
Verification required (report results): {build command} + {test command}, and add one unit test.
Return a summary of changed/added files + endpoint path + response fields.
```

---

## Decision questions (to the user, one at a time)

```
- Layout: Option A ({summary}) vs Option B ({summary}) — which direction appeals to you?
- Time range: fixed "this week (7 days)" vs a today/week/month toggle?
- Rate-of-change color: monotone (▲ weight) vs up=green / down=red?
- Placement: above or below the existing {existing} should {new} go?
```
