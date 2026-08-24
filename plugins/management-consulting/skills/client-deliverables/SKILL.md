---
name: client-deliverables
description: Produces consulting-grade client deliverables (written reports and executive presentations) built on structured narrative (SCQA/SCR), the pyramid principle, action-titled sections, and evidence-backed recommendations. Use when creating strategic assessments, board decks, due diligence reports, PE investment committee (IC) memos, steering committee updates, recommendation documents, or any formal analysis that must drive an executive decision. Covers storylining, audience adaptation, exhibit design, and the choice between a document and a deck.
license: MIT
metadata:
  category: communication
  version: "2.1.0"
  author: Anot
---

# Client Deliverables

Formal consulting deliverables that carry a complex analysis to a decision. This covers work produced during and after an engagement, in two formats: written reports and executive presentations. For pitch decks and proposals aimed at winning work, use proposal-development instead.

The discipline is constant across both formats. Lead with the answer. Back every finding with traceable evidence. Structure the argument top-down so a busy reader reaches the recommendation already understanding why it holds.

## Before You Begin

Deliverables carry the firm's credibility. Every number must trace to a source. Settle four things before drafting:

- Purpose and audience: who reads this, and what do they already believe?
- The decision: what choice does this deliverable enable?
- Format: written report, deck, leave-behind, or a combination (see "Document or Deck" below).
- Evidence base: what analysis is done, and what data actually supports the findings?

Do not fabricate data points, citations, benchmark figures, or case results. When you need an illustrative number to show a format, label it: "Example, validate before use." When a real number is missing, use a placeholder and flag it: "Needs [specific data]. Placeholder based on [typical range]." Present any benchmark with its source and context. An unsourced benchmark invites challenge and erodes the whole document.

## Document or Deck

This is the first real decision, and people get it wrong constantly. The wrong format wastes days.

Choose a **written report** when the argument has dependencies that need prose to hold together, when the reader will engage alone and asynchronously, when the analysis must survive scrutiny months later, or when regulators or an IC expect a document of record. Reports carry nuance, caveats, and a full evidence trail.

Choose a **deck** when the deliverable exists to drive a decision in a room, when you will be present to narrate, or when the audience wants the argument in visual chunks they can react to live. Decks compress. They trade completeness for momentum.

The failure mode is the hybrid nobody asked for: a "deck" that is really a report crammed into slides (walls of text at 12pt, forwarded and unreadable) or a "report" that is a thin string of bullet fragments. If a single artifact must do both jobs, build one primary format well and bolt on the other deliberately: a deck with a genuine 1-page standalone executive summary, or a report with a 10-slide spoken summary (template in the presentations reference).

Rough sizing:

| Signal | Lean Report | Lean Deck |
|---|---|---|
| Reader is present when it lands | No | Yes |
| Argument has many interlocking parts | Yes | No |
| Must be defensible in 6 months | Yes | Sometimes |
| Decision needed in a live meeting | No | Yes |
| Audience reads alone, on their own time | Yes | No |

When genuinely unsure, draft the executive summary first (one page). If it stands on its own, you may not need the rest at deck length.

## Storylining: SCQA and SCR

Both formats run on the same narrative spine. Start with what the reader already accepts, introduce the tension, resolve it. The reader arrives at the recommendation understanding why it matters, so the recommendation reads as inevitable rather than asserted.

Reports use the full **SCQA**. Presentations use the compressed **SCR**, which drops the explicit Question (the Complication implies it) because a spoken format needs to move.

```
SITUATION    ->  "Here is where we are."
   |                Context the reader already agrees with.
   v
COMPLICATION ->  "Here is what changed or broke."
   |                What is now at risk, and what it costs.
   v
QUESTION     ->  "So what must we decide?"      [Reports only]
   |                The single question the deliverable answers.
   v
ANSWER /     ->  "Here is what we recommend."
RESOLUTION          The recommendation, stated flat.
```

Build the Situation from facts the audience will nod at. If they argue with your Situation, you have lost the room before the Complication. Make the Complication cost something concrete: a number, a deadline, a competitor moving. That tension is what earns attention for the Answer.

### The Pyramid Principle

Every deliverable runs top-down, whether it is a 5-page brief or a 50-slide strategy deck.

```
                    +---------------+
                    |    Answer     |  <- State this first.
                    +-------+-------+
               +------------+------------+
         +-----+-----+ +----+---+ +------+------+
         | Argument 1| | Arg 2  | | Argument 3  |  <- 2-3 supporting reasons (MECE).
         +-----+-----+ +----+---+ +------+------+
           +---+---+    +--+--+     +----+----+
           |E1 |E2 |    |E3|E4|     |E5 |E6  |  <- Evidence under each.
           +---+---+    +--+--+     +----+----+
```

- **The Answer** is one sentence. If the audience remembers nothing else, this is it.
- **Supporting arguments** are 2-3, no more. They must be mutually exclusive and collectively exhaustive (MECE): no overlap, no gaps.
- **Evidence** sits under each argument. Every fact connects to the argument directly above it. A fact that supports nothing gets cut.

Apply the pyramid at every level: the deliverable as a whole, each section or slide, each paragraph or bullet.

### Action Headlines

The single highest-leverage habit in consulting deliverables. Every section heading (reports) and every slide title (presentations) is a complete sentence stating the takeaway, never a topic label.

- Bad: "Market Analysis"
- Good: "The addressable market has contracted 15% since 2023, driven by regulatory change in three segments."
- Bad: "Revenue Overview"
- Good: "Revenue fell 12% on mid-market churn, and the trend accelerated in Q3."

Read the headlines alone, top to bottom. They should tell the whole story with the exhibits removed. If you cannot write the action headline for a section, that section has no point yet. Fix the thinking, then write.

## Audience Adaptation

Who reads it changes what leads, what gets cut, and how much methodology survives.

| Audience | What They Want | How to Deliver |
|---|---|---|
| CEO / Board | The decision, strategic and risk implications | Lead with the recommendation, quantify impact, address the top risk, tie to shareholder value |
| CFO | Financial proof, ROI, assumptions | Detailed financials, sensitivity, conservative estimates |
| COO | Feasibility, resources | Operating plan, resource load, timeline |
| CTO | Technical viability | Architecture assessment, scalability, integration risk |
| Steering Committee | Progress, decisions, blockers | Status vs. plan, decision items, escalations |
| Mixed / Large Group | Alignment and a clear ask | One simple message, clean visuals, explicit next step |

Three moves cover most cases:

- **Executive audiences**: answer and impact first. Push methodology to backup. Spend the airtime on decisions and trade-offs, not on how you did the work.
- **Technical audiences**: show the method, the assumptions, and the sensitivity. Use precise terms, but still define the specialized ones.
- **Mixed audiences**: progressive disclosure. Headline, then support, then full data at the back, so each reader stops where their interest ends.

## Exhibits and Data Storytelling

An exhibit makes one point. If it makes two, split it. The reader should get the point from the title and the annotation without decoding the axes.

- Lead with the most compelling data point. Do not bury the headline inside a table.
- Show change, not state. A delta or trend lands harder than a snapshot.
- Use comparison to give scale. "3x the industry average" beats "15%."
- Connect every number to a consequence. Each figure should answer "and that means what?"
- Quantify the cost of inaction. It makes the Complication concrete.

Pick the chart from the relationship, not from habit:

| Data Relationship | Chart |
|---|---|
| Comparison across categories | Bar (horizontal when many categories) |
| Trend over time | Line |
| Part-to-whole | Stacked bar or waterfall (pie sparingly, max 4-5 slices) |
| Correlation | Scatter |
| Distribution | Histogram or box plot |
| Financial bridge (revenue to EBITDA, cost drivers) | Waterfall |
| Which variable matters most | Tornado |
| Scenario comparison | Side-by-side bar or conditional-format table |

Chart standards, both formats: the title states the finding; the source is noted; the key point is highlighted (bold, color, or a callout); colors stay consistent across the deliverable; chartjunk (3D, heavy gridlines, decoration) is removed. In a live deck, one chart per slide and no table over five rows. Detailed exhibit and chart-construction recipes live in the presentations reference.

### Sensitivity, Handled Honestly

When projections carry uncertainty, show it rather than assert a single number. Two workhorses:

A **tornado chart** ranks variables by how much they swing the outcome. The top 2-3 bars are where management attention belongs.

```
Variable            | NPV Impact Range
Adoption rate       |=====[----BASE----]==========|  +/- $12M
Benefit timeline    |=======[--BASE--]========|      +/- $8M
Implementation cost |========[-BASE-]======|         +/- $5M
Discount rate       |=========[BASE]=====|           +/- $3M
```

A **scenario table** communicates the overall risk profile across base, upside, and downside, each with its two key drivers, its returns, and a probability weighting. Always state the break-even: "The case stays positive even if benefits land [X]% below plan." Any probability or weighting you assign without hard data is a directional estimate. Label it as one. Full scenario-table structure and decision-trigger templates are in the written-reports reference.

## Writing Standards

These apply to prose in reports and to text on slides (denser on slides). This is where an AI tell hides, so hold the line.

| Element | Standard |
|---|---|
| Sentence length | Vary it. Most under 25 words. Short ones to land a point. |
| Paragraph length | Max 4 sentences in reports; bullets on slides |
| Headlines | Complete-sentence takeaways, never topic labels |
| Numbers | Quantify wherever the data allows |
| Dates | Specify them; never "soon," "later," "in the near term" |
| Names | Full names for people and organizations |
| Jargon | Cut it or define it |

Voice: active and committed. "We recommend" beats "It is recommended." Drop hedge words (perhaps, might, may) unless the uncertainty is real, in which case name it plainly. "We believe X because Y" is stronger than "X could potentially be considered."

**Before and after.** The pattern is always the same: replace throat-clearing with the conclusion, hedges with data, abstractions with specifics.

Vague and passive:
> "It is believed that there may be potential opportunities for significant improvement in certain areas of operational processes, which could lead to enhanced performance outcomes going forward."

Direct and quantified:
> "Three process changes cut order fulfillment from 14 days to 5, saving $2.3M a year in working capital."

Buried lead:
> "After extensive analysis of the competitive landscape, examining trends across segments and reviewing internal capabilities, our team concluded that acquiring TargetCo represents a compelling strategic opportunity."

Bottom line up front:
> "Acquire TargetCo for EUR 85M. It closes our APAC distribution gap and turns EBITDA-accretive by Year 2. Three factors support this."

## Quality Assurance

Before finalizing anything, confirm:

- The executive summary or first slide stands alone and gives the full picture in five minutes.
- Every finding has evidence; every recommendation has rationale.
- Every number is sourced; every term is defined.
- The conclusion matches the evidence, and the whole deliverable answers the original question.
- Recommendations with real uncertainty carry a scenario or sensitivity view.
- Every recommended action has a named owner and a date.
- Benchmarks are attributed. "Per [Source], the benchmark is X" beats "industry benchmarks suggest." With no published source, write "based on our analysis" or "directional estimate based on [basis]."

## References

Load the reference that matches the format you are building:

- Building a written report (report types, section templates, IC memo, document structure, multi-author coordination): read [references/written-reports.md](references/written-reports.md).
- Building an executive presentation (deck structure, slide anatomy and exhibit recipes, board decks, pre-wiring, backup, Q&A, live edits, the one-page memo): read [references/executive-presentations.md](references/executive-presentations.md).
- Generating an actual .pptx file rather than a markdown outline: read [references/pptx-generation.md](references/pptx-generation.md) for slide masters, anatomy rules, and pptxgenjs layout patterns. Default to `LAYOUT_WIDE` (13.33" x 7.5") for consulting decks.
