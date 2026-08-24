---
name: financial-modeling
description: Builds financial models and business cases (ROI, NPV, IRR, payback, DCF valuation, scenario analysis, TCO, break-even) that support a specific investment decision. Use when developing an investment recommendation, comparing strategic options, quantifying the value of an initiative, building a go/no-go business case, running cost-benefit analysis, sizing total cost of ownership for build-vs-buy, or valuing a business unit. Covers standard workflows (ROI, cash flow projection, break-even, DCF) and advanced techniques (EVA, MIRR, real options, Monte Carlo, discount rate selection, AI and technology investment patterns).
license: MIT
metadata:
  category: problem-solving
  version: "2.1.0"
  author: Anot
---

# Financial Modeling

Build the business case that drives a decision. The model exists to answer one question: should the client do this, and if so, which version? Everything below serves that. A model that produces a precise number but no clear recommendation has failed.

Ask for real inputs before building. Do not fabricate cost figures, benefit estimates, or benchmarks. When a number is needed to demonstrate the mechanics, label it as an example and flag it for validation. When citing a benchmark, name the source and context and present it as illustrative, never as authoritative fact.

---

## Behavioral Principles

1. **Document every assumption.** For each one, state the source, the basis, and a confidence level (verified, estimated, or placeholder). Undocumented assumptions are the single largest cause of business cases that collapse under review.
2. **Be conservative by default.** Use realistic assumptions, not optimistic ones. A stretch goal is not a baseline. When a client pushes for aggressive numbers, keep the base case honest and put the aggressive version in an upside scenario with the risk flagged.
3. **Sensitivity beats precision.** A precise but wrong number is worse than an honest range. Find the 2-3 variables that drive roughly 80% of the outcome and test them. Report the range, not just the point.
4. **Always show alternatives.** Never present a single option. Include a do-nothing baseline and at least one alternative to the recommended path. A business case with one option is advocacy, not analysis.
5. **Separate facts from forecasts.** Distinguish historical actuals from projections everywhere they appear. Do not let a forecast inherit the credibility of a fact.
6. **Make it auditable.** A reviewer should trace any output back to its source assumption in under five minutes. If they cannot, the model is not finished.
7. **The number supports the decision.** If the analysis does not point to a clear recommendation, the framing is wrong. Reframe before you refine the math.

---

## Analysis Type Selection

Pick the analysis to the decision, not to habit. Most engagements need one or two of these, not all seven.

| Analysis Type | Use Case | Key Outputs |
|---|---|---|
| ROI Analysis | Quick assessment of a single investment | Return %, payback period |
| Business Case | Comprehensive go/no-go investment case | NPV, IRR, payback, recommendation |
| DCF Valuation | Valuing a company or business unit | Enterprise value, equity value |
| Scenario Analysis | Quantifying risk and range of outcomes | Best/base/worst NPV, probability-weighted NPV |
| Break-even Analysis | Volume or revenue threshold | Break-even point, margin of safety |
| TCO Comparison | Comparing competing solutions | Annualized cost, cost per user |
| EVA | Comparing performance across units | Value created vs. capital cost |

---

## ROI Analysis

For a fast read on a single investment against doing nothing:

- **Investment summary:** initial investment, ongoing investment per year, project life.
- **Benefits projection:** for each benefit category, project Year 1 through end of life with totals. Keep proven benefits and speculative benefits in separate lines.
- **Return metrics:** simple ROI against a stated benchmark, payback against an acceptable threshold, NPV (must be positive to proceed), and IRR (must clear the cost of capital).
- **Sensitivity:** name the 2-3 variables that move the result and show NPV at plus or minus 10% on each.

ROI alone rarely settles a real decision. Treat a positive ROI as a screen, then move to the full business case if the money is material.

---

## Business Case Development

This is the core deliverable. Structure it so an executive can decide from the first page and defend the decision from the rest.

- **Executive summary:** 2-3 sentences. The investment, the expected return, the recommendation.
- **Problem statement:** the problem this investment solves, stated in business terms, not solution terms.
- **Financial summary:** total investment, base-case NPV, IRR, payback, ROI. One glance, headline numbers only.
- **Investment details:** cost categories (capital, implementation, ongoing opex) projected across the analysis period.
- **Benefit projections:** revenue growth, cost reduction, risk mitigation, and other quantifiable benefits across the period. Model the ramp. Benefits rarely land at full scale in Year 1.
- **Cash flow analysis:** annual cash flows, discount factors, present values. Show the NPV build explicitly so a reviewer can reproduce it.
- **Assumptions:** every assumption, with the discount rate and analysis period called out. Label each verified, estimated, or placeholder.
- **Sensitivity analysis:** NPV, IRR, and a plain-language verdict under upside, base, and downside.
- **Risks and mitigations:** each risk with a quantified impact, likelihood (H/M/L), and a specific mitigation. "Monitor closely" is not a mitigation.
- **Recommendation:** go or no-go, with the rationale tied line by line to the analysis above.

When you populate any table in this deliverable, write 2-3 sentences of reasoning and evidence in each cell, not a one-word placeholder. A cell that reads "High" tells the reader nothing. A cell that reads "High: vendor concentration means a single renewal negotiation swings 40% of run-rate cost; mitigated by dual-sourcing the top two modules" earns its place.

---

## Assumptions and Sensitivity (where the real work lives)

Most business cases are won or lost here, so this section carries more weight than the mechanics above.

**Build the assumption register first, model second.** List each driver, its value, its source, its confidence, and the direction of its bias. A cost estimate from a signed vendor quote is verified. A benefit estimate from an analogous project is estimated. A benefit with no basis yet is a placeholder, and placeholders must be visible, not buried.

**Isolate the swing factors.** Rank drivers by how much a realistic move in each changes NPV. Adoption rate, ramp timing, and unit economics usually dominate. Discount rate and terminal assumptions dominate valuations. Once you know the top three, the rest of the model can be approximate without harming the decision.

**Test the range that matters.** Do not vary every input by a token plus or minus 10%. Vary each swing factor across its plausible real range: what does NPV do if adoption reaches 60% instead of 85%, if the ramp takes 18 months instead of 9? Present the break-point. The reader wants to know how wrong an assumption can be before the recommendation flips.

**Name the killers.** State plainly which single assumption, if wrong, breaks the case. If the whole recommendation rests on one optimistic adoption curve, say so in the executive summary. That is the honest thing to surface, and it is usually the thing a skeptical CFO asks first.

---

## DCF Valuation

For valuing a company or business unit:

- **Revenue projections:** revenue, growth rate, EBITDA, and margin from the current year through Year 5.
- **Terminal value:** method (Gordon Growth or Exit Multiple), terminal growth rate, exit multiple, and the resulting terminal value. Terminal value often carries the majority of enterprise value, so treat its inputs as swing factors, not footnotes.
- **WACC calculation:** debt and equity weights, their costs, and the resulting WACC.
- **Valuation sensitivity:** enterprise value in a matrix of WACC (plus or minus 1%) against terminal growth rate (plus or minus 1%). This matrix is the deliverable, not the single point estimate.

---

## Scenario Analysis

For quantifying the range of outcomes rather than pretending to a single one:

- **Scenario definitions:** upside, base, and downside, each with a description and a probability weight. Weights should sum to 1 and reflect judgment you can defend, not round numbers chosen for symmetry.
- **Scenario comparison:** revenue, costs, NPV, IRR, and payback under each.
- **Probability-weighted NPV:** each scenario's NPV times its weight, summed to an expected NPV.
- **Break-even analysis:** break-even revenue, break-even volume, and margin of safety.

Three point estimates understate the true spread of outcomes. When the investment is large enough to justify it, move to Monte Carlo (below).

---

## Economic Value Added (EVA)

**Formula:** EVA = NOPAT - (WACC x Capital Employed)

Where NOPAT is net operating profit after tax, WACC is the weighted average cost of capital, and capital employed is total assets minus current liabilities.

Interpretation is binary at the sign. Positive EVA creates value for shareholders. Negative EVA destroys it, even when accounting profit looks healthy, because the capital tied up costs more than it returns.

Use EVA when:

- Comparing divisions of very different sizes on a like-for-like basis.
- Testing whether growth is actually creating value or just consuming capital.
- Setting targets that charge managers for the capital they use.
- Screening acquisition targets: does the target earn above its cost of capital, or does it only look profitable?

---

## Discount Rate Selection (a judgment call, not a lookup)

The discount rate quietly decides more marginal cases than any other input, so choose it deliberately and defend it.

### Factors

| Factor | Consideration | Impact on Rate |
|---|---|---|
| Cost of capital | Company WACC | Baseline |
| Risk level | Project risk vs. company average | Adjust up or down |
| Industry | Industry return norms | Benchmark |
| Inflation | Expected inflation | Include |
| Market conditions | Current interest rates | Adjust |
| Technology risk | AI and implementation uncertainty | Adjust up |

### Typical Ranges by Risk Level

These ranges are directional, not authoritative. They orient a first pass. Anchor the actual rate to the client's real WACC and the specific risk of the initiative, and note where your figure came from.

| Risk Level | Discount Rate Range | Examples |
|---|---|---|
| Low | 5-8% | Core operations, efficiency gains |
| Medium | 8-12% | Growth initiatives |
| High | 12-20% | New market entry |
| Very high | 20%+ | New ventures, early R&D |
| Platform/AI | 15-25% | Digital transformation, AI investments |

### Guidance

- When genuinely uncertain, round the rate up. Rejecting a good project costs less than funding a bad one.
- If a project clears the bar only at a low discount rate, label it explicitly as sensitive to cost-of-capital assumptions and show what happens when the rate rises.
- Show NPV at several rates as standard practice (WACC, WACC+2%, WACC+5%). One rate hides the fragility. Three rates reveal it.

---

## Total Cost of Ownership (TCO)

### Cost Categories

**Direct costs** (by year): acquisition, implementation, operation, maintenance, upgrade and replacement.

**Indirect costs:** training, productivity loss during rollout, support overhead, compliance and certification.

**Hidden costs** (the ones that sink build-vs-buy comparisons because nobody lines them up):

- Data migration and integration.
- Dual-running during transition.
- Switching costs from vendor lock-in.
- Technical debt as it accumulates.
- Opportunity cost of the internal team's time.

**TCO summary:** total TCO, annualized TCO, cost per user per year, and the comparison against alternatives.

The hidden costs are where a naive TCO goes wrong. A vendor's sticker price looks cheaper until you add two years of dual-running and a migration. Force those lines into the model even when they are hard to estimate. A flagged estimate beats a silent omission.

### TCO vs. Simple ROI

- **Use TCO** to compare competing solutions (build vs. buy, vendor A vs. vendor B).
- **Use ROI** to evaluate a single investment against doing nothing.
- **Use both** when the decision splits into "should we do this?" and "how should we do it?"

---

## Advanced Valuation Concepts

### Modified IRR (MIRR)

Standard IRR assumes interim cash flows get reinvested at the IRR itself, which is usually unrealistic and inflates the return. MIRR fixes this by naming two rates:

- **Financing rate:** the cost to fund the project, typically WACC.
- **Reinvestment rate:** what interim cash flows actually earn, typically the cost of capital or a conservative market rate.

Reach for MIRR when cash flows change sign more than once (which can produce multiple IRR solutions) or when you want a return figure the CFO will not dispute.

### Real-Options Valuation

Traditional NPV undervalues projects that carry embedded flexibility, because it treats a staged bet as if the whole commitment were locked in on day one. Real-options thinking adds value for:

- **Option to expand:** invest small now, scale if it works.
- **Option to abandon:** cut losses when early results disappoint.
- **Option to defer:** wait for better information before committing.
- **Option to switch:** change inputs, outputs, or technology mid-course.

Apply it when investments are staged (R&D, pilots), when uncertainty is high enough that flexibility has real worth, when a platform's future use cases are unknown, or when a base-case NPV is negative but close and optionality might tip it. Do not use it to rescue a genuinely bad project by inventing options that management will never exercise.

### Monte Carlo Simulation

For major investments, three point scenarios understate the true spread. Monte Carlo gives you the distribution:

- Assign probability distributions to the key assumptions rather than three fixed points.
- Run thousands of iterations to produce a distribution of outcomes.
- Report the probability of positive NPV, the expected NPV, and the 5th and 95th percentile range.
- Use the output to rank which assumptions drive the variance, then tighten those inputs first.

---

## AI and Technology Investment Modeling (different economics, different traps)

AI and technology investments do not behave like traditional capital projects, and modeling them with a capex mindset produces the wrong answer. This section runs deep because it is where recent business cases most often go wrong.

### Cost Patterns

- **Cloud infrastructure:** operating expense that scales with usage, not fixed capital. Model it as a variable cost tied to volume, and stress the volume assumption.
- **Data costs:** acquisition, cleaning, labeling, and storage. Routinely underestimated. Budget them as a real line, because "we already have the data" almost always hides a cleaning project.
- **AI and ML talent:** scarce and expensive. Model as an ongoing cost, not a one-time hire, and expect retention pressure to raise it.
- **Technical debt:** accumulates when unmanaged. Include a remediation budget rather than discovering it in Year 2.

### Benefit Patterns

- **Automation savings:** high confidence, straightforward to quantify. Anchor the case here.
- **Prediction and decision quality:** medium confidence. Model as a measurable reduction in error rate, tied to a dollar value per error avoided.
- **Personalization uplift:** measurable through A/B testing, but the adoption curve governs when it arrives.
- **Platform and network effects:** hard to model with any precision. Put them in scenarios, not in the base case.

### Modeling Guidance

- Split proven benefits (automation) from speculative ones (network effects) into separate lines, and never let the speculative ones carry the recommendation.
- Discount speculative benefits at a higher rate than proven ones. They are riskier, so treat them that way.
- Model the adoption curve explicitly. AI benefits rarely reach full scale in Year 1, and a case that assumes they do is optimistic by construction.
- Include a technology-pivot scenario where the chosen approach has to change. In a fast-moving space, the probability of a pivot is not zero, and pretending otherwise overstates the base case.

---

## Forecasting Techniques

- **Driver-based forecasting:** build from operational drivers (units, prices, headcount) rather than top-down growth rates. More transparent and far easier to audit and defend.
- **Predictive analytics:** use ML for demand forecasting only when the historical data is deep and clean enough to support it.
- **Scenario generation:** ground scenarios in historical variance, not just a symmetric optimistic and pessimistic pair.
- **Anomaly detection:** flag inputs that sit outside historical ranges. An out-of-range assumption is usually a typo or a hidden optimism, and catching it early saves a rebuild.

---

## Model Standards

### Structure

- One source of truth for assumptions. A single assumptions section, referenced everywhere, changed in one place.
- Inputs and outputs visibly separated.
- Scenario switches that update the whole model from one control.
- Sensitivity tables linked live to the key outputs.

### Quality Controls

- An audit trail for changes to assumptions.
- Cell-level comments on any formula that is not self-evident.
- Error checks that catch circular references, broken links, and out-of-range values before the reviewer does.

### Presentation

- An executive summary that fits on one page.
- A clean drill-down from headline metrics to supporting detail.
- Sensitivity tables next to the headline numbers, not exiled to an appendix. If the range matters, and it does, it belongs where the reader sees it.

---

## Key Principles

- The number is never the point. The business case supports a decision.
- Finance and strategy work together. A number without a story does not move anyone.
- Sensitivity analysis matters more than a precise point forecast.
- Stress-test every case against a realistic downside, not a token one.
- Be ready to defend every assumption on its source and basis.
- If you cannot explain it simply, you do not understand it well enough yet.
