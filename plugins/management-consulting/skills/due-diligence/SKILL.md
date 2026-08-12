---
name: due-diligence
description: Conducts commercial, operational, financial, strategic, and technology due diligence for M&A, investment, partnership, and vendor decisions, from scoping through risk synthesis to a proceed/no-proceed recommendation. Use when assessing an acquisition target, running a quality-of-earnings analysis, normalizing working capital, testing revenue quality and customer concentration, reviewing a tech stack and IP, quantifying synergies, or planning post-merger integration. Triggers on keywords like due diligence, QoE, data room, red flags, synergy, deal risk, and investment recommendation.
license: MIT
metadata:
  category: problem-solving
  version: "2.1.0"
  author: Anot
---

# Due Diligence

Assess a business opportunity through analytical frameworks that connect every finding to price. This covers commercial, operational, financial, strategic, and technology diligence, from scoping the engagement to the investment recommendation.

The job is not to produce a list of facts about the target. It is to answer one question: at what price, on what terms, and with what conditions does this deal make sense? Every finding either moves the price, changes the terms, or does neither and gets cut.

Do not invent numbers. Ask for the data room, the QoE file, management accounts, and the customer list. When you must illustrate a mechanic with a figure, label it an example and flag it for validation. Benchmarks are illustrative and carry their source and context; they never stand in as authoritative fact.

---

## DD Types and When to Use Them

| DD Type | Core Question | Focus Areas |
|---------|---------------|-------------|
| Commercial | Can we win? | Market position, customers, growth, competitive dynamics |
| Operational | Can we run it? | Processes, systems, people, efficiency, scalability |
| Financial | Is it real? | Revenue quality, working capital, cash flow, projections |
| Strategic | Should we do it? | Strategic fit, synergies, integration, cultural compatibility |
| Technology & IP | Is it viable? | Architecture, technical debt, IP ownership, security |
| Legal & Regulatory | Is it clean? | Litigation, compliance, contracts, data privacy |

Most transactions need commercial, operational, and financial DD at minimum. Layer in the rest based on where the risk sits. A software deal lives or dies on technology and IP. A regulated healthcare deal lives or dies on legal. Scope to the risk, not to a checklist.

---

## Phase 1: Scope Definition

Set the boundaries before touching a single analysis. Unfocused DD burns the timeline and misses the thing that mattered.

### Transaction Context

Establish:
- **Transaction type**: Acquisition, PE investment, strategic partnership, vendor assessment, internal assessment
- **Target**: Company name, industry, size
- **Deal value**: Estimated range
- **Timeline**: Days available before the exclusivity or bid deadline
- **Access**: Data room contents, management availability, ability to reach customers and suppliers
- **Team**: Who does the work, what expertise is on the bench

### Focus Area Prioritization

| Area | Priority | Key Questions | Data Available? |
|------|----------|---------------|-----------------|
| Market | High/Med/Low | What must we understand about the market? | Y/N |
| Customers | High/Med/Low | What must we understand about the customer base? | Y/N |
| Operations | High/Med/Low | What must we understand about how the business runs? | Y/N |
| Financials | High/Med/Low | What must we validate about the numbers? | Y/N |
| Technology | High/Med/Low | What must we understand about the tech stack? | Y/N |
| Legal/Regulatory | High/Med/Low | What risks need legal review? | Y/N |

Prioritize ruthlessly. Spend the hours on what could kill the deal or move the price. A "High" priority means you would walk if you could not get comfortable here. If everything is High, nothing is.

---

## Phase 2: Information Gathering

The request list is routine. Send it early, track what comes back, and note what does not. Absence of data is itself a finding: a seller who cannot produce a customer-level revenue file for three years either lacks the systems or is hiding the concentration.

**Corporate:** articles of incorporation; board minutes (last 2 years); org charts; shareholder agreements; material contracts and amendments.

**Financial:** audited financials (3-5 years); monthly management accounts (last 24 months); revenue by segment, product, geography, and customer; cash flow statements; debt schedules and covenant compliance; budget vs. actual (last 2 years); tax returns and open positions.

**Commercial:** customer list with revenue by customer (last 3 years); contract templates and key customer contracts; pricing history and discount schedules; sales pipeline and win/loss data; churn data with reasons; NPS or satisfaction data.

**Operational:** process documentation for key workflows; technology systems inventory; key vendor list with spend and terms; headcount by function, level, and tenure; capacity utilization; quality metrics and incident history.

**Technology:** architecture diagrams; technical debt assessment; security audit results; IP portfolio (patents, trademarks, trade secrets); open-source dependency audit; delivery metrics (deploy frequency, lead time, MTTR).

**Legal:** pending or threatened litigation; regulatory filings and compliance status; material contract summary; insurance policies; data privacy compliance.

Track requests against responses in a log. Chase the gaps before they become the reason you could not clear a risk.

---

## Phase 3: Analysis

This is where judgment lives. The tables below are workpapers, not the deliverable. Fill each cell with 2-3 sentences of reasoning and evidence tied to a source, never a one-word placeholder. "H" in a risk column means nothing until it reads "H: top-3 customers are 47% of revenue, all on annual contracts that renew in Q4, and the largest is renegotiating."

### Commercial Due Diligence

#### Market Assessment

| Metric | Finding | Source | Confidence |
|--------|---------|--------|------------|
| Total addressable market (TAM) | $ | Industry reports, bottom-up build | H/M/L |
| Target's market share | % | Company data vs. market estimate | H/M/L |
| Market growth rate (CAGR) | % | Historical trend, analyst consensus | H/M/L |
| Market position | #X of Y | Competitive analysis | H/M/L |

The question behind the table: is growth structural or cyclical, and is the target's position defensible? A number-two player gaining share in a growing market is a different asset than a number-one player defending share in a flat one. Build TAM bottom-up where you can and treat top-down analyst figures as a cross-check, not the answer.

#### Customer Analysis

| Metric | Finding | Risk Level | Trend |
|--------|---------|------------|-------|
| Top 10 customer concentration | % of revenue | H/M/L | Improving/Stable/Worsening |
| Average contract value | $ | | Direction |
| Net revenue retention (NRR) | % | Above/Below 100% | Direction |
| Gross churn rate | % | vs. benchmark | Direction |
| Logo churn rate | % | Segment comparison | Direction |
| Average contract duration | months | vs. benchmark | Direction |

Customer concentration is one of the two or three findings that most often re-cut a deal, so go deep here. Top-3 concentration above 20% is a yellow flag; above 40% is a red flag that usually forces an earn-out or an escrow. Concentration has three dimensions beyond size: renewal timing (are the big contracts all up in the same quarter?), switching cost (could they leave in 90 days?), and relationship depth (does the founder personally hold the account?). NRR below 100% means the installed base is leaking and the sales team is running to stand still; find out whether that is churn, downsell, or price. Any benchmark you cite is illustrative and needs its source named.

#### Revenue Quality

| Metric | Finding | Assessment |
|--------|---------|------------|
| Recurring vs. one-time revenue | % recurring | Strong (>80%) / Moderate (50-80%) / Weak (<50%) |
| Revenue recognition risks | Assessment | H/M/L |
| Backlog / committed revenue | $ | Coverage ratio vs. plan |
| Pricing power | Assessment | Expanding / Stable / Eroding |
| Cross-sell / upsell as % of new ACV | % | Growing or declining |

Not all revenue is worth the same multiple. Contracted recurring revenue with high retention deserves a premium. Project revenue that must be re-won every year does not. Test whether "recurring" actually recurs or is just re-signed each period under a friendlier label.

#### Competitive Position

| Factor | Target | Comp A | Comp B | Assessment |
|--------|--------|--------|--------|------------|
| Market share | % | % | % | Position and trajectory |
| Pricing | $ | $ | $ | Premium / Par / Discount |
| Differentiation | Claim | Claim | Claim | Sustainable? |
| Win rate vs. competitors | % | n/a | n/a | Strong / Weak |

Pressure-test the differentiation claim. Management will tell you it is technology, service, or brand. Win/loss data tells you whether buyers agree.

### Operational Due Diligence

Operational DD is where the upside hides. Financial DD finds problems; operational DD finds inefficiencies the acquirer can fix and capabilities the acquirer can scale. Read it as a value-creation map first and a risk register second.

#### Process and Efficiency

| Area | Finding | Risk | Improvement Potential |
|------|---------|------|----------------------|
| Capacity utilization | % | H/M/L | Assessment |
| Key process bottlenecks | Findings | H/M/L | Assessment |
| Automation level | % | H/M/L | Assessment |
| Quality metrics | Findings | H/M/L | Assessment |

#### Technology Assessment

| Area | Finding | Risk | Detail |
|------|---------|------|--------|
| Architecture scalability | Assessment | H/M/L | Can it support 3-5x growth? |
| Technical debt | Quantified estimate | H/M/L | Remediation cost and timeline |
| IP ownership and protection | Status | H/M/L | Patents, trade secrets, licenses |
| Security posture | Assessment | H/M/L | Last audit, certifications, incidents |
| Data architecture | Findings | H/M/L | Quality, governance, portability |
| Open-source dependencies | Audit status | H/M/L | License compliance, security |
| Development velocity | Metrics | H/M/L | Deploy frequency, lead time, MTTR |
| Cloud infrastructure | Status | H/M/L | Provider, costs, lock-in risk |

Confirm the target actually owns its IP. Code written by contractors without a proper assignment, or a core module under a copyleft license, can turn a clean deal into a remediation project. Quantify technical debt as a cost and a timeline, not an adjective.

#### Management and Team

| Dimension | Finding | Risk | Detail |
|-----------|---------|------|--------|
| Leadership depth | Assessment | H/M/L | Bench strength below C-suite |
| Key person dependencies | Names/roles | H/M/L | Single points of failure |
| Succession planning | Status | H/M/L | Documented plans, readiness |
| Track record | Performance history | H/M/L | Delivery on past commitments |
| Cultural assessment | Findings | H/M/L | Values, decision-making, adaptability |
| Retention risk | Assessment | H/M/L | Turnover, engagement, comp benchmarking |
| Organizational structure | Assessment | H/M/L | Spans of control, layers |

Management assessment predicts post-deal outcomes better than most financial analysis. A mediocre business with a strong team tends to outrun a strong business with a mediocre one. Name the two or three people the business cannot run without, then confirm they are staying and on what terms.

### Financial Due Diligence

#### Quality of Earnings

| Item | Reported | Adjusted | Adjustment Reason |
|------|---------|---------|-------------------|
| Revenue | $ | $ | Non-recurring items, timing differences |
| EBITDA | $ | $ | One-time costs, owner comp, related-party terms |
| Net income | $ | $ | Normalizing adjustments |

QoE is the single most important workpaper in a financial DD, so this is where you slow down. The gap between reported and adjusted EBITDA measures how hard the seller is dressing up the numbers. Every adjustment cuts both ways: sellers add back "one-time" costs that recur every year, and they quietly omit normalizing costs the buyer will actually bear (a real market salary for an owner who paid himself nothing, the cost of a function the founder ran for free). Adjustments above 20% of reported EBITDA warrant line-by-line scrutiny. The adjusted number is what the multiple applies to, so a dollar of dubious add-back can be a dollar times the multiple in overpayment.

#### Working Capital

| Component | Current | Trend | Seasonal Pattern | Cash Impact |
|-----------|---------|-------|-----------------|-------------|
| Accounts receivable | $ (X days) | Direction | Pattern | $ |
| Accounts payable | $ (X days) | Direction | Pattern | $ |
| Inventory | $ (X days) | Direction | Pattern | $ |
| Net working capital | $ | Direction | Pattern | Funding need |

Working capital is where deals get renegotiated after the headline price is agreed. Establish a normalized NWC level (typically a trailing 12-month average that captures seasonality) and set it as the peg in the purchase agreement. If the business delivers less working capital than the peg at close, the buyer funds the gap and the price should drop dollar-for-dollar. Watch for a seller stretching payables and squeezing receivables in the months before sale: it manufactures a one-time cash inflow that reverses on the buyer's watch. Seasonal businesses need month-by-month analysis; a single balance-sheet date lies.

#### Capital Expenditure

| Category | Historical (3-year avg) | Forecast | Maintenance vs. Growth |
|----------|------------------------|----------|----------------------|
| Category 1 | $/yr | $/yr | Split |
| Category 2 | $/yr | $/yr | Split |

Split maintenance capex (the spend required to keep the business running as-is) from growth capex (the spend that funds expansion). Underinvestment in maintenance flatters near-term earnings and hands the buyer a deferred bill. If capex fell while revenue rose, find out what stopped getting maintained.

#### Cash Flow

| Metric | Year -2 | Year -1 | Current | Trend |
|--------|---------|---------|---------|-------|
| Operating cash flow | $ | $ | $ | Direction |
| Free cash flow | $ | $ | $ | Direction |
| Cash conversion (FCF/EBITDA) | % | % | % | Direction |

Cash conversion below 70% needs an explanation. The usual suspects: working capital eating growth, heavy capex, or an earnings-quality problem the QoE has not yet surfaced. Earnings are an opinion; cash is a fact.

---

## Phase 4: Risk Assessment

Sort every risk by what it does to the deal, not by topic. A minor legal issue and a minor operational issue belong in the same bucket. A deal-killing legal issue and a deal-killing customer issue belong in another.

**Critical risks (deal killers).** Issues that could make the deal unviable.

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Risk description | H/M/L | H/M/L | What can be done |

Examples: undisclosed litigation, regulatory non-compliance, fraud indicators, an irreplaceable key person with no retention plan, a market in structural decline.

**Major risks (deal adjustments).** Issues that materially move valuation or terms.

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Risk description | H/M/L | H/M/L | What can be done |

Examples: customer concentration, technical debt requiring real remediation, management gaps, integration complexity.

**Minor risks (price adjustments).** Issues that affect value but are manageable.

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Risk description | H/M/L | H/M/L | What can be done |

Examples: operational inefficiencies (often upside), minor compliance gaps, below-market comp structures.

Likelihood and impact ratings are directional estimates when they rest on judgment rather than hard data. Say so, and say what data would firm them up.

### Red Flag Indicators

Any one of these earns a deeper look:

- Revenue accelerating in the run-up to sale (revenue pulled forward)
- Unexplained changes in accounting policies or estimates
- Concentration rising while the story stays "diversified"
- Key employees leaving in the months before the transaction
- Capex falling while revenue grows (underinvestment)
- Working capital trends diverging from revenue trends
- Related-party transactions at off-market terms
- Gaps between management presentations and data room documents
- Reluctance to grant access to customers or key employees

A red flag is a signal to investigate, not an automatic walk-away. Sometimes the explanation is clean. Sometimes it re-prices the deal. You do not know which until you pull the thread.

---

## Phase 5: Synthesis and Recommendation

### Investment Thesis

Frame the deal on three axes: what makes it attractive (the value-creation case), what could go wrong (the risks and their mitigations), and what it is worth (the implied price given the findings). If you cannot state the thesis in a paragraph, the analysis is not finished.

### Recommendation Format

```
## Due Diligence Summary: [Target]

### Investment Thesis
[One paragraph: why this deal makes sense, or why it does not]

### Key Strengths
1. [Strength with evidence]
2. [Strength with evidence]

### Key Concerns
1. [Concern with evidence and mitigation]
2. [Concern with evidence and mitigation]

### Risk Assessment
| Category | Risk Level | Key Risks |
|----------|------------|-----------|
| Commercial | H/M/L | [Risks] |
| Operational | H/M/L | [Risks] |
| Financial | H/M/L | [Risks] |
| Strategic | H/M/L | [Risks] |
| Technology | H/M/L | [Risks] |

### Valuation Implications
| Factor | Adjustment |
|--------|------------|
| Revenue quality adjustments | +/-$ or % |
| Customer risk discount | -$ or % |
| Operational improvement upside | +$ or % |
| Integration costs | -$ |
| Net adjustment | $ or % |

### Recommendation
[PROCEED / PROCEED WITH CONDITIONS / DO NOT PROCEED]

### Conditions Precedent (if proceeding)
1. [Condition: rationale]
2. [Condition: rationale]

### Next Steps
1. [Action: owner: timeline]
2. [Action: owner: timeline]
```

The valuation table is the point of the whole exercise. Each row traces a finding to a dollar or percentage move in price. If a finding does not land in this table, either it belongs in conditions precedent or it did not matter.

---

## Integration Assessment (M&A Context)

For an acquisition, integration planning starts during DD, not after close. The data you gather to assess the target is the same data that builds the integration plan. Do not throw it over the wall and start fresh.

### Integration Complexity

| Area | Complexity | Timeline | Key Dependencies | Cost Estimate |
|------|-----------|----------|-----------------|---------------|
| Systems integration | H/M/L | Months | Dependencies | $ |
| Organization integration | H/M/L | Months | Dependencies | $ |
| Customer migration | H/M/L | Months | Dependencies | $ |
| Process harmonization | H/M/L | Months | Dependencies | $ |
| Culture integration | H/M/L | Months | Dependencies | $ |

### Synergy Quantification

| Synergy | Type | Year 1 | Year 2 | Year 3 | Confidence | Risk |
|---------|------|--------|--------|--------|------------|------|
| Revenue synergy | Revenue | $ | $ | $ | H/M/L | Timing risk |
| Cost synergy 1 | Cost | $ | $ | $ | H/M/L | Execution risk |
| Cost synergy 2 | Cost | $ | $ | $ | H/M/L | Execution risk |

Cost synergies are more reliable than revenue synergies. Cost comes out on your own timeline; revenue depends on customer behavior you do not control. Discount revenue synergies by 50% in the base case and do not let them carry the deal. Synergy figures built without target-specific data are directional estimates; label them and validate before they touch the price.

### Day 1 Readiness

- Communication plan for employees, customers, and vendors
- Interim operating model defined
- Key-talent retention packages in place
- Regulatory approvals obtained
- IT systems access and continuity plan
- Customer-facing teams briefed and scripted

---

## Context Adaptation

Adjust emphasis to the deal type.

| Context | Emphasis |
|---------|----------|
| **M&A** | Synergy assessment, integration complexity, valuation adjustments, Day 1 readiness |
| **PE Investment** | Value-creation levers, exit scenarios, management incentive alignment, 100-day plan |
| **Strategic Partnership** | Capability complementarity, cultural fit, governance model, IP-sharing terms |
| **Vendor Assessment** | Operational reliability, financial stability, contractual protections, business continuity |
| **Internal Assessment** | Capability gaps, improvement priorities, investment needs (drop the M&A terminology) |

---

## Working Principles

- **Materiality first.** Spend the hours on what could kill the deal or move the price by more than 5%. Equal time on everything is how DD teams miss the one thing that mattered.
- **Triangulate.** Management tells one story. The data room tells another. Customers and suppliers tell a third. The truth sits in the overlap.
- **Red flags are negotiation tools, not always walk-away signals.** A concentration risk found in DD becomes a price cut, an earn-out, or an escrow.
- **Document what you could not verify.** The gaps matter as much as the confirmations. Future you, and the lawyer, will need to know what was tested and what was taken on trust.
- **Connect every finding to value.** If a finding does not change what the deal is worth or what the terms should be, cut it.
- **Talk to customers and suppliers.** Management representations are necessary and insufficient. External validation shifts the picture more often than expected.
- **Never fabricate.** Do not invent engagement history, dollar figures, or benchmarks. Where firm data is absent, frame conditionally (organizations that carry this risk profile tend to see X) and mark it for validation.
