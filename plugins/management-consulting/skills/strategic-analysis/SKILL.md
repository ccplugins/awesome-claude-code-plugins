---
name: strategic-analysis
description: Structure complex business problems with hypothesis-driven MECE decomposition and named strategic frameworks (Five Forces, PESTLE, SWOT, 7S, VRIO, Balanced Scorecard, Ansoff, Growth-Share Matrix, Nine-Box, Three Horizons, Value Chain, Business Model Canvas, Strategy Canvas, Platform Strategy). Use when framing an ambiguous question, building issue trees, writing testable hypotheses, designing an analytical workplan, or running framework-based analysis for competitive positioning, market entry, growth strategy, organizational alignment, or portfolio allocation. For broad or high-stakes questions, apply two or more frameworks and synthesize across them. For narrow questions, one framework applied rigorously beats two applied superficially.
license: MIT
metadata:
  category: problem-solving
  version: "2.1.0"
  author: Anot
---

# Strategic Analysis

Structure complex problems, write testable hypotheses, and drive to recommendations a client can act on. Pick frameworks to fit the problem (not the reverse), fill every cell with reasoning and evidence, and synthesize across lenses. The value is in the connections between frameworks, not any single one.

Two failure modes to avoid. The first is the empty template: a framework filled with one-word cells and no argument. The second is analysis drift: elegant structure that never answers the question that was asked. Guard against both.

---

## The Problem-Solving Process

### Step 1: Define the Problem

Sharpen the question before touching any framework. A wrong problem solved perfectly is still wrong. This is where most engagements are won or lost, so spend real time here.

A complete definition covers four things:

- **The question**: what are we solving, in one sentence. If it takes three sentences, the problem is not defined yet.
- **The context**: industry dynamics, company position, timeframe, technology landscape, who decides.
- **Success criteria**: what a good answer looks like, how it gets measured, the constraints, the decision deadline.
- **Out of scope**: what we are explicitly not solving, and the boundaries that keep the work bounded.

Techniques to sharpen a fuzzy brief:

- **Jobs-to-be-Done**: what job is the client hiring this solution to do.
- **Pain-Priority Matrix**: rate pain points by frequency times impact, then attack the top-right.
- **Is / Is Not**: state what the problem is and what it looks like but isn't. The contrast exposes hidden scope.

Pressure-test before proceeding. Ask whether this is the right problem, whether the statement is specific enough to disprove, whether you are chasing symptoms or root causes, and what happens if the client does nothing. Also ask what data actually exists to support the work, because a beautiful hypothesis that cannot be tested with available data is a dead end.

When the client's stated problem and the real problem diverge, say so directly and reframe. A CEO who asks "how do we cut costs 15%" may actually have a revenue problem. Name it.

### Step 2: Structure the Problem

Decompose with MECE logic: mutually exclusive branches (no overlap) that are collectively exhaustive (nothing missing). Overlap double-counts. Gaps hide the answer.

Start from a proven decomposition and adapt it:

| Problem Type | Recommended Structure |
|---|---|
| Profitability decline | Revenue (price x volume) + Cost structure |
| Market entry | Market size x Achievable share + Entry requirements |
| Operational inefficiency | Throughput x Yield + Cycle time |
| Customer churn | Acquisition x Retention x Lifetime value |
| Growth strategy | Core business + Adjacent opportunities + Transformational bets |
| Digital transformation | Current state + Capability gaps + Technology options |

MECE in practice:

NOT MECE (overlapping): North America, Europe, Emerging markets, Developed markets. Europe and Developed markets double-count.

MECE: North America, Europe, Asia-Pacific, Latin America, Middle East and Africa.

NOT MECE (inconsistent categories): Product revenue, Service revenue, License revenue, Software. "Software" is a different cut than the others.

MECE: Product revenue, Service revenue, License revenue, Other revenue.

For digital and subscription businesses, cut by revenue model instead of product line: recurring revenue (subscriptions, SaaS), transaction revenue (usage-based, marketplace), professional services, ecosystem and partner revenue. The right cut is the one where the branches behave differently and the numbers are cleanly separable.

### Step 3: Prioritize Branches

Not every branch earns equal effort. Rank by lever size, data availability, impact, and time sensitivity. Favor branches you can test fast with minimum viable analysis. Kill low-value branches early and say why in one line so the team can revisit if the picture changes. Applying the 80/20 rule here is what keeps a study from ballooning.

### Step 4: Develop Hypotheses

Form hypotheses early. A hypothesis focuses fact-finding and stops the team from boiling the ocean. Analysis without a hypothesis collects data for its own sake.

A good hypothesis is specific, testable with data you can get, and carries an action if proven. Write it as "we believe X because Y." Vague ("margins are a problem") is useless. Sharp ("gross margin fell 400bps because raw-material costs rose faster than we repriced") is testable and points to a fix.

For each hypothesis, define:

- **Current belief**: what we think is true.
- **Evidence needed**: what would prove or disprove it (name the disconfirming evidence too).
- **Data source**: where the evidence lives.
- **Quick test**: the fastest way to validate or kill it.
- **If true, then**: the recommendation it implies.

### Step 5: Conduct Analysis

Structure every workstream to test a specific hypothesis. If an analysis maps to no hypothesis, question why you are running it. For each workstream, name the hypothesis it tests, the method, the data inputs, and what the output will tell you.

Match method to situation:

| Situation | Recommended Analysis |
|---|---|
| Profit driver identification | Bridge analysis, variance analysis |
| Market sizing | Top-down, bottom-up, triangulated |
| Competitive assessment | Relative positioning, scenario analysis |
| Financial projections | Scenario modeling, sensitivity analysis |
| Process optimization | Time studies, root cause analysis, process mining |
| Customer insights | Segmentation, journey mapping, behavioral analysis |

### Step 6: Synthesize Findings

Synthesis is not summary. Summary lists what you found. Synthesis says what it means and answers the question. Structure it in three moves:

1. **What we learned**: findings that directly test the hypotheses.
2. **So what**: the implication of each finding for the client.
3. **The answer**: a direct response to the Step 1 question.

If you cannot state the answer in a sentence, the analysis is not finished.

### Step 7: Develop Recommendations

Translate findings into action. A finding without a recommendation leaves the client stranded. Each recommendation carries a rationale (why it addresses the problem), quantified impact, effort and resources required, timing, and an implementation approach. Vague advice ("improve customer focus") helps no one. Specific advice ("consolidate three overlapping loyalty programs into one by Q3, projected to cut admin cost 20%") gets executed.

---

## Issue Trees

### Hypothesis Tree

```
                    [Ultimate Question]

        +---------------+---------------+
        v               v               v
   [Hypothesis 1]  [Hypothesis 2]  [Hypothesis 3]
        |               |               |
   +----+----+     +----+----+     +----+----+
   v         v     v         v     v         v
  [Proof 1] [Proof 2] [Proof 1] [Proof 2] [Proof 1] [Proof 2]
        |               |               |
   [Quick Test]    [Quick Test]    [Quick Test]
```

Start with the ultimate question. Branch into competing hypotheses. Under each, list the proof points needed and the fastest test for each. Use this when you already have a point of view to pressure-test.

### Logic Tree

```
                 [Problem Statement]

        +---------------+---------------+
        v               v               v
   [Driver A]    [Driver B]     [Driver C]
        |               |
   +----+----+     +----+----+
   v         v     v         v
 [Factor 1] [Factor 2] [Factor 3] [Factor 4]
        |               |
   [Root Cause]    [Root Cause]
```

Decompose into causal drivers and keep branching until you hit an actionable root cause. Use this when the cause is unknown and you need to find it.

---

## Fact-Finding

**Data collection**: start with existing sources (internal databases, published reports, prior analyses) before commissioning new work. Check every dataset for completeness, accuracy, and relevance before trusting it. Triangulate across sources. Document every extrapolation and estimate so the team knows what is fact and what is inference.

**Interviews**: prepare questions tied to hypotheses. Listen 80%, ask follow-ups 20%. Capture direct quotes. Summarize back to confirm you heard it right.

**Analysis discipline**: show the methodology, check the math, run sensitivity to find which inputs actually move the answer, and stress-test conclusions against alternatives before committing.

When you use illustrative numbers to demonstrate a method, label them as examples and flag them for validation with real data. Present any benchmark as illustrative with its source and context, never as authoritative fact. Do not invent dollar figures or engagement history. When you lack firm data, frame conditionally: organizations that consolidate duplicate systems tend to see lower run-rate cost, but the actual figure depends on this client's baseline.

---

## Common Pitfalls

| Pitfall | Why It Hurts | Fix |
|---|---|---|
| Defining the problem too broadly | Diffuses the analysis, no branch gets solved | Narrow scope iteratively |
| Jumping to solutions | Misses root causes | Follow the process |
| Collecting all available data | Burns time and budget | Prioritize by hypothesis |
| Confirming existing beliefs | Biases the answer | Actively hunt disconfirming evidence |
| Findings with no recommendation | Leaves the client without action | Always translate to action |
| Over-engineering the analysis | Delays the insight | Apply 80/20 |

---

## Framework Selection Guide

| Question | Primary Framework | Complementary Pairing |
|---|---|---|
| How attractive is our industry? | Five Forces | PESTLE, Value Chain |
| How should we compete? | Competitive Positioning | Strategy Canvas, VRIO |
| How is our organization aligned? | 7S Framework | Balanced Scorecard |
| What is our competitive advantage? | VRIO | Value Chain, Five Forces |
| How should we grow? | Ansoff Matrix | Growth-Share Matrix, Three Horizons |
| What external factors affect us? | PESTLE | Five Forces, SWOT |
| What are our strengths and weaknesses? | SWOT | PESTLE (external), VRIO (internal) |
| How should we enter a new market? | Market Entry | Five Forces, PESTLE |
| What is our business model? | Business Model Canvas | Value Chain, Platform Strategy |
| How do we create value? | Value Chain | Business Model Canvas, Competitive Positioning |
| How do we measure performance? | Balanced Scorecard | 7S Framework |
| How should we allocate resources? | Growth-Share Matrix | Nine-Box, Three Horizons |
| What are our strategic options? | Strategy Canvas | Three Horizons, Ansoff Matrix |
| How do we build a platform? | Platform Strategy | Business Model Canvas, Five Forces |

Fill every framework cell with 2-3 sentences of reasoning and evidence, not a rating alone. "High" tells the client nothing. "High: buyer power is concentrated in three retailers controlling 60% of volume, and they renegotiate terms annually" tells them where the risk sits and why.

---

## External Analysis Frameworks

### Five Forces

**Purpose**: assess industry attractiveness and competitive intensity.

For each force (New Entrants, Buyer Power, Supplier Power, Substitutes, Competitive Rivalry), rate it High/Medium/Low with a justification, then build a table with columns: Factor | Assessment | Implication. Include 4-6 factors per force and cover the digital dimensions that classic Five Forces misses: network effects as an entry barrier, digital switching costs, platform supplier power, digital substitutes, winner-take-all dynamics. Close with an Industry Attractiveness Summary (overall profit potential) and Strategic Implications (how to compete, where to position, how to blunt the unfavorable forces).

### PESTLE

**Purpose**: analyze the external macro-environment.

For each dimension (Political, Economic, Social, Technological, Legal, Environmental), build a table with columns: Factor | Trend | Impact (H/M/L) | Timeframe (S/M/L) | Strategic Response. Include 2-4 factors per dimension. Close with the top 3 trends ranked by strategic impact. Resist listing every macro trend. Rank ruthlessly.

### SWOT

**Purpose**: assess strategic position across internal strengths and weaknesses and external opportunities and threats.

Build four tables (Strengths, Weaknesses, Opportunities, Threats) with columns: Factor | Evidence | Strategic Significance (H/M/L). Include 3-5 factors per quadrant, each grounded in evidence rather than a generic claim ("strong brand" is not evidence; "brand commands a 12% price premium in tracked studies" is). Then build a Cross-Quadrant Strategy Matrix, which is where SWOT earns its keep:

- **SO**: use strengths to capture opportunities.
- **WO**: fix weaknesses that block opportunities.
- **ST**: use strengths to counter threats.
- **WT**: mitigate weaknesses exposed to threats.

Close with the 2-3 highest-priority actions.

---

## Internal Analysis Frameworks

### 7S Framework

**Purpose**: assess organizational alignment and capability.

Build two tables: Hard Elements (Strategy, Structure, Systems) and Soft Elements (Shared Values, Style, Staff, Skills), each with columns: Element | Current State | Target State | Gap | Priority. For each of the seven, give 2-3 current-state observations and the key gap. Close with an Alignment Assessment (which elements align, which conflict, what the misalignment costs) and 3-5 prioritized actions. Misalignment between strategy and the soft elements is usually the real story, so probe there.

### VRIO

**Purpose**: assess competitive advantage and how durable it is.

Build a table with columns: Resource/Capability | Valuable? | Rare? | Costly to Imitate? | Organized to Capture? | Competitive Implication. Map the logic:

- Not Valuable = Competitive Disadvantage
- V only = Competitive Parity
- V+R = Temporary Advantage
- V+R+I+O = Sustained Advantage

Close by naming which resources deliver sustained advantage, which need development, and what actually stops a competitor from copying them. The imitation barrier is the crux; be concrete about it.

### Balanced Scorecard

**Purpose**: translate strategy into measurable objectives across four perspectives.

For each perspective (Financial, Customer, Internal Process, Learning and Growth), build a table with columns: Objective | Measure | Target | Initiative | Status. Include 3-4 objectives per perspective. Objectives must cascade: Learning and Growth capabilities enable Internal Process excellence, which drives Customer outcomes, which produce Financial results. Close with a Strategy Map narrative tracing the cause-effect chain and flagging any broken link in the logic.

---

## Strategy Formulation Frameworks

### Growth-Share Matrix

**Purpose**: analyze the portfolio and allocate cash.

Build a table with columns: Business Unit | Market Growth Rate (%) | Relative Market Share | Quadrant (Star/Question Mark/Cash Cow/Dog) | Strategy (Invest/Hold/Harvest/Divest). Close with Portfolio Implications (cash-flow dynamics, investment needs, rebalancing) and 3-4 prioritized moves.

### Ansoff Matrix

**Purpose**: analyze growth paths by risk.

State the current position (products, markets, revenue). Build a summary table with columns: Strategy | Risk Level | Opportunity | Key Consideration. For each of the four (Market Penetration, Product Development, Market Development, Diversification), assess approach, opportunity size, risk, and investment required. Close with a Recommended Strategy: primary choice and rationale, secondary option, and investment needs. Diversification carries the highest risk; do not wave the client toward it without a clear reason.

### Nine-Box Matrix

**Purpose**: prioritize a multi-business portfolio with more nuance than four quadrants allow.

Plot units on a 3x3 grid (Market Attractiveness vs Competitive Position). Build a table with columns: Business Unit | Market Attractiveness (H/M/L) | Competitive Position (H/M/L) | Strategy (Invest/Select/Harvest/Divest). Close with investment-allocation implications.

### Three Horizons

**Purpose**: balance defending the core against building the future.

Build an initiative table per horizon:

- **H1 (0-12 months)**: defend and grow the core. Columns: Initiative | Impact | Investment | Timeline
- **H2 (1-3 years)**: scale emerging businesses. Columns: Initiative | Market Size | Investment | Timeline
- **H3 (3-7+ years)**: create future options. Columns: Option | Potential | Risk | Investment

Close with the investment split across horizons and the key risk in each. Starving H2 and H3 to fund H1 is the most common failure; call it out if the numbers show it.

---

## Competitive Strategy Frameworks

### Competitive Positioning

**Purpose**: choose a defensible competitive position.

Assess the current position across three dimensions (Target Scope, Cost Advantage, Differentiation). Evaluate each generic strategy (Cost Leadership, Differentiation, Focus) on suitability conditions, required capabilities, and key risks. Close with a Recommended Strategy: chosen position, rationale, how to achieve it, and how to defend it. The stuck-in-the-middle trap is real; a position that is neither low-cost nor differentiated loses on both fronts.

### Strategy Canvas

**Purpose**: visualize differentiation by comparing value curves.

Identify 6-10 factors the industry competes on (price, quality, features, service, brand, convenience). Build a table with columns: Competing Factor | Our Company (1-5) | Competitor A (1-5) | Competitor B (1-5) | Industry Average (1-5). Mark where your curve diverges (differentiation) and where it converges (parity). Apply the blue-ocean moves: which factors to eliminate, reduce, raise, or create. Close with a Differentiation Assessment and a recommended Target Value Curve. A curve that tracks the industry average everywhere is a signal you are competing on execution alone, which is a warning, not a strategy.

### Value Chain

**Purpose**: find where value and cost actually sit.

Build two tables: Primary Activities (Inbound Logistics, Operations, Outbound Logistics, Marketing and Sales, Service) and Support Activities (Procurement, Technology, HR, Infrastructure), each with columns: Activity | Description | Value Created | Cost | Competitive Advantage (H/M/L). Close with Value Chain Linkages (how activities reinforce each other), Cost Analysis, and Differentiation Sources. The linkages between activities are usually harder to copy than any single activity, so spend your depth there.

---

## Additional Frameworks

### Business Model Canvas

**Purpose**: map and stress-test the whole business model.

Analyze all nine blocks in a table with columns: Block | Current State | Strengths | Vulnerabilities. The blocks: Customer Segments, Value Propositions, Channels, Customer Relationships, Revenue Streams, Key Resources, Key Activities, Key Partnerships, Cost Structure. Assess how the blocks reinforce or fight each other. Close with Model Coherence (where blocks align vs conflict), Sustainability (which blocks are hardest to replicate), and Evolution Opportunities (where a shift could reshape the model).

### Market Entry

**Purpose**: evaluate and select an entry strategy for a new geography or segment.

Assess attractiveness in a table with columns: Factor | Assessment | Data Source | Implication, covering market size, growth rate, competitive intensity, regulatory barriers, and cultural factors. Evaluate entry modes (organic build, acquisition, joint venture, partnership, licensing, export) in a table with columns: Entry Mode | Investment Required | Risk Level | Speed to Market | Control Level | Recommendation. Close with a Recommended Entry Strategy, the sequencing, and the key success factors. Speed and control usually trade off against each other; name which the client should prioritize and why.

### Platform Strategy

**Purpose**: assess and design a platform business.

Identify the platform type (marketplace, innovation, social, hybrid). Map the ecosystem with columns: Participant Type | Role | Value Created | Value Captured | Incentive to Join. Assess network effects (same-side, cross-side, data) and their strength. Evaluate the economics: subsidized side vs monetized side, multi-homing risk, winner-take-all dynamics. Close with Platform Design (governance, openness, monetization), Growth Strategy (solving the chicken-and-egg problem, building liquidity), and Defensibility. The chicken-and-egg cold-start problem sinks most platforms; if the client has no answer for it, that is the finding.

---

## Market and Competitive Analysis

Structure market work in three layers.

**Market sizing**: use TAM, SAM, and SOM. Triangulate top-down against bottom-up and reconcile the gap. Distinguish market size from the opportunity you can actually address. Document historical CAGR and forecast growth with the drivers behind each. When you must estimate, label the estimate and flag it for validation with primary data.

**Competitive landscape**: map competitors by share, revenue, growth, and positioning. Profile the key players on strengths, weaknesses, strategy, and threat level. Assess positioning on the dimensions customers actually value (price, quality, reach, innovation). Watch for emerging competitors and adjacent-market entrants, because the incumbent map misses the disruptor.

**Synthesis**: identify opportunities with sizing, timing, and strategic fit; identify threats with likelihood, impact, and mitigation; assess which advantages are durable and why. Quantify wherever you can. Specificity builds credibility.

---

## Framework Synthesis

This is where the engagement is won. Individual frameworks give structure. The connections between them give insight. When you run several frameworks on one situation, organize the synthesis this way.

**External landscape**: industry attractiveness (Five Forces, overall profit potential), key trends (PESTLE top 3 with timeline and impact), and where competitive power is shifting.

**Internal position**: organizational alignment (7S gaps), competitive advantage (VRIO, what is truly durable), value creation (Value Chain, where you win).

**Growth options**: current portfolio (Growth-Share), growth strategy (Ansoff, risk-adjusted), future pipeline (Three Horizons, whether H2 and H3 are funded).

**Cross-framework synthesis** (the core of the work):

- **Converging findings**: where two or more frameworks agree. These are your high-confidence insights.
- **Contradictions**: where frameworks disagree. This demands a judgment call and often hides the most important insight. Do not smooth it over. Explore it.
- **Blind spots**: what no framework captures (culture, timing, personalities, luck).
- **Highest-leverage insight**: the single most important finding across everything. Name it in one sentence.

**Implementation priorities**:

- Phase 1 (0-6 months): quick wins that build momentum and prove the thesis.
- Phase 2 (6-18 months): capability building.
- Phase 3 (18+ months): long-term positioning.

---

## Key Principles

- Hypothesis-driven work saves time by focusing the fact-finding. Structure first, data second.
- MECE trees are reusable. Build a library of common decompositions.
- Always return to the Step 1 question. Do not let the analysis drift.
- Recommendations must be actionable and quantified. "High" is weaker than "High, roughly $15M of revenue at risk."
- The quality of the problem definition caps the quality of the answer.
- Iterate. The first structure is rarely the final one.
- Broad or high-stakes question: apply at least two frameworks and synthesize. Narrow question: one framework applied rigorously beats two applied superficially.
- Fill every cell with 2-3 sentences of reasoning and evidence. Empty templates are worthless.
- When frameworks conflict, dig into the contradiction. That is usually where the real insight lives.
- Ask the client for real inputs. When you must illustrate with numbers, label them as examples and flag for validation. Never fabricate figures or engagement history.
