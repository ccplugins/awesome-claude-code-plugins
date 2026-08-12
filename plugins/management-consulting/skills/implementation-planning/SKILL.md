---
name: implementation-planning
description: 'Translates a strategic recommendation into an investable, executable plan through option development, business case construction, roadmap design, and detailed implementation planning. Use when a recommendation exists and the work is to make it real: generating and scoring structurally different options, building financial projections with NPV and sensitivity analysis, sequencing phased roadmaps with dependencies, and defining workstreams, governance, RACI, and resourcing. Covers the full arc from "we have a recommendation" to "here is exactly how we execute it."'
license: MIT
metadata:
  category: engagement-delivery
  version: "2.1.0"
  author: Anot
---

# Implementation Planning

Turn a strategic recommendation into a concrete, funded, governed plan the organization can actually run. Four connected stages carry the work: generate and evaluate options, build the business case, design the roadmap, develop the implementation plan. For the ongoing oversight machinery (steering committees, status reporting, live risk management), see project-governance. This skill gets the plan approved and structured. That skill runs it.

Before you produce any of these deliverables, get the real inputs. Ask for the actual budget envelope, the real baseline metrics, the org's hurdle rate, the named constraints. When you must show a number you do not have, label it as an example and flag it for validation. Do not invent dollar figures, benchmarks, or engagement precedent. A business case built on fabricated numbers is worse than no business case, because it looks decided.

---

## The Strategy-to-Execution Arc

Most strategies fail in execution, not in formulation. The gap between "we should do X" and "X is happening" is where value gets destroyed. This skill closes that gap on purpose.

The four stages flow in order but rarely run cleanly front to back. Sometimes the path is unclear and you start with options. Sometimes the recommendation is already made and you jump to business case. Meet the work where it actually is.

```
  Strategic           Option            Business          Roadmap         Implementation
  Recommendation  ->  Development   ->  Case          ->  Design      ->  Plan
  "We should..."      "Here are         "Here's why       "Here's         "Here's exactly
                       the ways          it's worth it"     the order"      how we do it"
                       we could..."
```

---

## Stage 1: Strategic Option Development

Develop genuinely different options before committing to a path. Three flavors of the same idea is not a choice. Structurally different approaches are.

### Define the Decision

Clarify what is being decided before generating anything.

- **The question**: What exactly needs to be decided, in one sentence.
- **Current state**: Where the organization is today, with data.
- **Desired state**: Where it needs to be, and by when.
- **Constraints**: Budget ceiling, timeline hard stops, organizational capacity, regulatory boundaries.
- **Success criteria**: What matters most in the evaluation, and how much each criterion matters relative to the others.

Set weighted evaluation criteria upfront, before you look at any option. Weighting after you have a favorite is how you rig the answer.

| Criterion | Weight | Definition of Success |
|-----------|--------|----------------------|
| [Criterion 1] | X% | [What "good" looks like, in measurable terms] |
| [Criterion 2] | X% | [What "good" looks like] |
| [Criterion 3] | X% | [What "good" looks like] |
| Total | 100% | |

### Generate Options

Build 3-5 genuinely differentiated options. Each represents a distinct strategic posture, not an incremental variation. Always include "do nothing" as a baseline. It forces honest comparison and it is sometimes the right answer.

For each option, fill every field with real reasoning (2-3 sentences), not a placeholder:

- **Name and description**: What this option is, in plain language.
- **Approach**: The key moves and their sequence.
- **Pros and cons**: An honest assessment, not a pitch. If an option has a fatal flaw, name it here.
- **Resource requirements**: Investment, timeline, capabilities the option demands.
- **Risk profile**: What could go wrong, and how badly.

A good set spans the range: a conservative option, an aggressive one, and something between. If your options all look alike, you have not explored the space. Go back and stretch them.

### Evaluate Options

Score each option against the weighted criteria. Every cell needs a short justification, not a bare number.

| Criterion | Weight | Option A | Option B | Option C | Do Nothing |
|-----------|--------|----------|----------|----------|------------|
| [Criterion 1] | X% | [1-5] | [1-5] | [1-5] | [1-5] |
| [Criterion 2] | X% | [1-5] | [1-5] | [1-5] | [1-5] |
| [Criterion 3] | X% | [1-5] | [1-5] | [1-5] | [1-5] |
| **Weighted Score** | **100%** | **X.X** | **X.X** | **X.X** | **X.X** |

Scoring guide: 5 = fully meets, 4 = substantially meets, 3 = partially meets, 2 = minimally meets, 1 = does not meet.

The score is an input, not a verdict. Assess each option qualitatively alongside it:

- **Strategic fit**: Does it align with where the organization is already heading?
- **Feasibility**: Can this organization, with these people, actually pull it off?
- **Stakeholder support**: Will the people who matter get behind it?
- **Reversibility**: How hard is it to course-correct if the option fails?

When the qualitative read contradicts the score, say so and explain which you trust. A high-scoring option the organization cannot absorb is not the winner.

### Scenario-Test the Recommendation

Stress-test the leading option under conditions it does not control. Test at minimum against optimistic, base, and pessimistic scenarios.

| Option | Optimistic | Base | Pessimistic |
|--------|-----------|------|-------------|
| Option A | [Performance] | [Performance] | [Performance] |
| Option B | [Performance] | [Performance] | [Performance] |

Run sensitivity on the criteria weights. Which weights, if shifted, flip the recommendation? If a small shift changes the answer, the decision is closer than the score suggests, and you should say that plainly rather than present a false margin.

### Make the Recommendation

State it without hedging. A complete recommendation has five parts:

1. **The choice**: Which option, stated flat.
2. **The rationale**: Why this one, grounded in the evaluation and the scenario test.
3. **The trade-offs**: What you give up by choosing it, and why that cost is acceptable.
4. **The fallback**: If this option becomes infeasible, the next-best alternative and the trigger that would switch you to it.
5. **Immediate next steps**: What happens this week to move forward.

---

## Stage 2: Business Case

The business case answers one question: is this worth doing? It has to convince decision-makers to fund the work and give them the financial frame to track value once it starts. This is where most of your quantitative judgment lives. Go deep here.

### Structure the Case

A business case that works carries these sections, roughly in this order:

1. Executive Summary (stands alone, one page)
2. Problem Statement and Cost of Inaction
3. Current State with Baseline Metrics
4. Proposed Solution and Future State
5. Financial Analysis
6. Implementation Overview
7. Risks and Mitigations
8. Recommendation

### Executive Summary

This is the decision brief. Many approvers read nothing else, so it has to hold the whole argument: the problem, the solution, the investment, the return, the recommendation.

- **The challenge**: 1-2 sentences on the problem.
- **The opportunity**: What the organization can achieve.
- **The investment**: Total capital and operating cost.
- **The return**: NPV, IRR, payback period, ROI.
- **The recommendation**: Proceed, do not proceed, or proceed with conditions.

### Problem Statement and Cost of Inaction

Quantify the problem. "We are losing money" is not a problem statement. "We are losing $4.2M annually in customer churn driven by post-sale service failures" is (that figure is illustrative; replace it with the client's actual number and cite the source).

| Pain Point | Annual Impact | Frequency | Trend |
|------------|--------------|-----------|-------|
| [Pain 1] | $[Amount] | [How often] | [Improving / worsening] |
| [Pain 2] | $[Amount] | [How often] | [Improving / worsening] |

Then calculate the cost of inaction explicitly. What happens over 3-5 years if nothing changes? This is the baseline the investment is measured against, and it is often the strongest part of the case. A problem that quietly compounds is more persuasive than a benefit that has to be believed.

| Cost of Inaction | Year 1 | Year 2 | Year 3 | Cumulative |
|------------------|--------|--------|--------|------------|
| [Cost driver 1] | $X | $X | $X | $X |
| [Cost driver 2] | $X | $X | $X | $X |
| **Total** | **$X** | **$X** | **$X** | **$X** |

### Current State Baseline

Establish measurable baselines. You cannot show improvement without a starting point, and a case with no baseline invites the challenge that the benefit was never real.

| Metric | Current Value | Industry Benchmark | Gap |
|--------|--------------|-------------------|-----|
| [Metric 1] | [Value] | [Benchmark, with source] | [Gap] |
| [Metric 2] | [Value] | [Benchmark, with source] | [Gap] |

Treat every benchmark as illustrative until sourced. Note where it came from and the context it applies to. A benchmark from a different industry or company size is a talking point, not evidence.

### Financial Analysis

The core of the case. Build it in layers so each number is traceable.

**Investment Required** (what gets spent):

| Category | Year 0 | Year 1 | Year 2 | Year 3 | Total |
|----------|--------|--------|--------|--------|-------|
| Capital expenditure | $X | $X | $X | $X | $X |
| Implementation costs | $X | $X | | | $X |
| Change management | $X | $X | | | $X |
| Training | $X | $X | | | $X |
| Contingency (10-15%) | $X | $X | $X | $X | $X |
| **Total Investment** | **$X** | **$X** | **$X** | **$X** | **$X** |

**Benefits Realization** (what comes back). Separate the types, because approvers trust cost reductions more than top-line projections, and they should.

| Benefit | Type | Year 1 | Year 2 | Year 3 | Total |
|---------|------|--------|--------|--------|-------|
| [Revenue benefit] | Top-line | $X | $X | $X | $X |
| [Cost reduction] | Bottom-line | $X | $X | $X | $X |
| [Risk avoidance] | Quantified risk | $X | $X | $X | $X |
| [Productivity gain] | Efficiency | $X | $X | $X | $X |
| **Total Benefits** | | **$X** | **$X** | **$X** | **$X** |

**Return Metrics**:

| Metric | Value | Hurdle Rate | Assessment |
|--------|-------|-------------|------------|
| NPV | $XX | > $0 | [Pass / Fail] |
| IRR | XX% | [Org hurdle] | [Pass / Fail] |
| Payback Period | X years | [Org threshold] | [Pass / Fail] |
| ROI | XX% | [Org threshold] | [Pass / Fail] |

Use the organization's real hurdle rate. If you do not have it, say so and mark the assessment as pending rather than assuming a rate that makes the case pass.

**Sensitivity Analysis** (how robust the numbers are):

| Variable | -20% | Base Case | +20% | Swing |
|----------|------|-----------|------|-------|
| Benefits realization | $XX | $XX | $XX | $XX |
| Cost overrun | $XX | $XX | $XX | $XX |
| Timeline delay | $XX | $XX | $XX | $XX |
| Adoption rate | $XX | $XX | $XX | $XX |

The variable with the biggest swing is where management attention belongs, and it is usually adoption. A model that only survives at 100% adoption is not robust. State the adoption assumption the case depends on and whether it is realistic given the change history here.

**Total Cost of Ownership** (the real long-term cost, past the project window):

| Component | Years 1-3 | Years 4-5 | Years 6-10 | Total |
|-----------|-----------|-----------|------------|-------|
| Initial investment | $X | | | $X |
| Ongoing licensing / ops | $X | $X | $X | $X |
| Maintenance | $X | $X | $X | $X |
| Training & support | $X | $X | $X | $X |
| **TCO** | **$X** | **$X** | **$X** | **$X** |

### Risk Assessment

| Risk | Likelihood | Impact | Mitigation | Residual Risk |
|------|------------|--------|------------|---------------|
| [Risk 1] | [H/M/L] | [H/M/L] | [What we will do] | [After mitigation] |
| [Risk 2] | [H/M/L] | [H/M/L] | [What we will do] | [After mitigation] |

When likelihood or impact ratings rest on judgment rather than data, flag them as directional estimates. A residual-risk column that is all green after mitigation is not credible. Leave the risks that stay real, and say so.

---

## Stage 3: Roadmap Design

The roadmap answers: what happens when, and in what order? It turns the approved business case into a sequenced plan with phases, milestones, and dependencies. The judgment here is sequencing. Why this before that, and what it costs you to get it wrong.

### Define the Planning Horizon

- **Time horizon**: 1, 3, or 5 years, matched to the initiative's scope.
- **Number of phases**: Usually 3-4. More phases means less clarity per phase.
- **Phase logic**: What drives the order? Dependencies, risk reduction, value delivery, or organizational readiness? Name the driver, because it determines everything downstream.

### Design Phase Structure

Each phase needs a clear objective, a reason it comes in this position, and criteria for moving to the next one.

```
## Phase 1: [Name] ([Duration])

### Objective
[What this phase achieves and why it comes first]

### Key Initiatives
| Initiative | Description | Priority | Dependencies |
|------------|-------------|----------|--------------|
| [Initiative 1] | [What it involves] | [High/Med] | [What must come first] |
| [Initiative 2] | [What it involves] | [High/Med] | [What must come first] |

### Deliverables
- [Concrete deliverable 1]
- [Concrete deliverable 2]

### Success Criteria
| Criterion | Target | How Measured |
|-----------|--------|-------------|
| [Criterion 1] | [Specific target] | [Measurement method] |
| [Criterion 2] | [Specific target] | [Measurement method] |
```

Repeat for each phase. Common patterns, and when each fits:

- **Foundation / Build / Scale**: You need infrastructure before you can build and proof before you can scale.
- **Quick Wins / Core Transformation / Optimization**: Early momentum matters for stakeholder buy-in.
- **Design / Pilot / Rollout**: Uncertainty is high and you need to test before committing real money.

### Map Dependencies

Dependencies drive the critical path. Map them before you set dates, or the dates will be fiction.

**Critical Dependencies** (a delay here delays everything):

| Initiative | Depends On | Impact if Delayed | Mitigation |
|------------|------------|-------------------|------------|
| [Initiative] | [Predecessor] | [What breaks] | [What we will do] |

**Resource Dependencies** (shared people across workstreams): name which teams or individuals are committed to more than one initiative at once. That overlap is where plans quietly break.

**External Dependencies** (outside your control): vendor deliveries, regulatory approvals, market conditions. For each, note the lead time and who owns chasing it.

### Milestone Planning

Define milestones that mark real progress, not calendar dates that pass on their own.

| Milestone | Target Date | Phase | Success Criteria | Dependencies |
|-----------|-------------|-------|------------------|--------------|
| M1 | [Date] | Phase 1 | [How we know we are there] | [What must be done] |
| M2 | [Date] | Phase 1 | [How we know we are there] | [M1] |
| M3 | [Date] | Phase 2 | [How we know we are there] | [M2] |

Good milestones are observable (you can tell whether they happened), meaningful (they represent progress, not elapsed time), and decision-relevant (they inform go / no-go choices).

### Resource Requirements by Phase

| Resource Category | Phase 1 | Phase 2 | Phase 3 | Total |
|-------------------|---------|---------|---------|-------|
| FTEs | X | X | X | X |
| Capital | $X | $X | $X | $X |
| Operating | $X | $X | $X | $X |

---

## Stage 4: Implementation Plan

The most granular level. It turns the roadmap into workstreams with named owners, specific deliverables, and the governance mechanisms that keep them honest.

### Define Workstreams

Break implementation into logical workstreams. Each one should be:

- **Independently manageable**: one lead, clear scope.
- **Small enough to track**: 2-4 week deliverable cycles.
- **Large enough to matter**: a real body of work, not a task list.

| Workstream | Description | Lead | Key Deliverables | Dependencies |
|------------|-------------|------|-----------------|--------------|
| [WS 1] | [What it covers] | [Name] | [Deliverables] | [Other WS] |
| [WS 2] | [What it covers] | [Name] | [Deliverables] | [Other WS] |
| [WS 3] | [What it covers] | [Name] | [Deliverables] | [Other WS] |

### Develop Detailed Timeline

Build the timeline phase by phase, with milestones and named owners:

```
## Phase 1: [Name] ([Duration])
Objective: [What we achieve]

| Milestone | Target | Dependencies | Owner |
|-----------|--------|--------------|-------|
| [M1] | [Date] | [None] | [Name] |
| [M2] | [Date] | [M1] | [Name] |

## Phase 2: [Name] ([Duration])
Objective: [What we achieve]

| Milestone | Target | Dependencies | Owner |
|-----------|--------|--------------|-------|
| [M3] | [Date] | [M2] | [Name] |
| [M4] | [Date] | [M3] | [Name] |
```

### Critical Path

Identify the longest dependency chain, because it sets the end date.

- [Activity A] -> [Activity B] -> [Activity C] -> [Final milestone]
- Any slip on the critical path pushes the project end date by the same amount.
- Non-critical activities have float. Quantify it for each, so you know exactly where you have slack and where you have none.

Protect the critical path first. When resourcing gets tight, it takes priority over everything with float.

### RACI Matrix

Define who does what. One accountable owner per deliverable. Shared accountability is no accountability.

| Activity / Deliverable | Sponsor | Program Lead | WS Lead | Team | Client SMEs |
|------------------------|---------|--------------|---------|------|-------------|
| [Deliverable 1] | A | R | C | I | C |
| [Deliverable 2] | I | A | R | R | C |
| [Key decision] | A | R | C | I | I |

- **R** = Responsible (does the work)
- **A** = Accountable (one per activity, owns the outcome)
- **C** = Consulted (input before the decision)
- **I** = Informed (told after the decision)

Rules: exactly one "A" per activity. At least one "R". Keep "C" small to avoid bottlenecks. "A" and "I" should not be the same person for the same activity.

### Resource Allocation

| Role | Workstream | FTE | Duration | Skills Required |
|------|------------|-----|----------|----------------|
| [Role 1] | [WS 1] | X.X | [Time] | [Skills] |
| [Role 2] | [WS 2] | X.X | [Time] | [Skills] |

Budget by workstream:

| Workstream | Labor | External | Other | Total |
|------------|-------|----------|-------|-------|
| [WS 1] | $X | $X | $X | $X |
| [WS 2] | $X | $X | $X | $X |
| Contingency (10-15%) | | | | $X |
| **Total** | **$X** | **$X** | **$X** | **$X** |

### Governance Structure

**Meeting Cadence**:

| Forum | Frequency | Attendees | Purpose | Duration |
|-------|-----------|-----------|---------|----------|
| Steering Committee | Bi-weekly | Sponsor, Program Lead, WS Leads | Decisions, escalations | 60 min |
| Program Review | Weekly | Program Lead, WS Leads | Progress, risks, dependencies | 45 min |
| Workstream Standup | 2-3x/week | WS Lead, Team | Task coordination, blockers | 15 min |

**Phase Gates** (stop premature transitions):

| Gate | Transition | Entry Criteria | Exit Criteria | Approver |
|------|-----------|----------------|---------------|----------|
| G1 | Foundation -> Build | [Requirements defined, team staffed] | [Assessment complete, design approved] | [Sponsor] |
| G2 | Build -> Deploy | [Solutions developed, tested] | [Pilot successful, rollout plan approved] | [Sponsor] |
| G3 | Deploy -> Operate | [Full rollout complete] | [Adoption targets met, handover done] | [Sponsor] |

**Escalation Path**:

- **Level 1**: WS Lead resolves within 24 hours.
- **Level 2**: Program Lead resolves within 48 hours.
- **Level 3**: Steering Committee resolves at the next meeting, or an emergency session for anything that cannot wait.

**Change Control**:

| Change Type | Approval Required | Process |
|-------------|-------------------|---------|
| Minor scope change | Program Lead | Document, assess impact, approve / reject |
| Major scope change | Steering Committee | Formal change request, impact analysis, SteerCo decision |
| Timeline shift (< 2 weeks) | Program Lead | Update plan, notify stakeholders |
| Timeline shift (> 2 weeks) | Steering Committee | Root cause analysis, recovery plan, SteerCo approval |
| Budget variance (< 10%) | Program Lead | Document, adjust within contingency |
| Budget variance (> 10%) | Steering Committee | Business case for additional funding |

### Risk and Contingency

| Risk | Impact | Probability | Mitigation | Owner |
|------|--------|-------------|------------|-------|
| [Risk 1] | [H/M/L] | [H/M/L] | [Specific action] | [Name] |
| [Risk 2] | [H/M/L] | [H/M/L] | [Specific action] | [Name] |

Write contingency plans for the high-impact risks as explicit triggers:

- If [trigger condition], then [specific response].
- If [trigger condition], then [specific response].

A contingency plan without a named trigger never fires, because no one agrees on when the moment has arrived.

---

## Working Across Stages

### When to Start Where

Not every engagement needs all four stages. Match the entry point to the situation.

| Situation | Start At | Skip |
|-----------|----------|------|
| Decision not made, multiple paths open | Stage 1 (Options) | Nothing |
| Recommendation exists, needs funding approval | Stage 2 (Business Case) | Stage 1 |
| Approved and funded, needs execution plan | Stage 3 (Roadmap) | Stages 1-2 |
| Roadmap exists, needs operational detail | Stage 4 (Implementation) | Stages 1-3 |
| Existing plan needs restructuring | Diagnose first, then the right stage | Depends |

### Connecting the Stages

Each stage feeds the next, and the handoff is where plans lose fidelity. Keep it tight.

- **Options -> Business Case**: The recommended option becomes the proposed solution. Option evaluation criteria feed the risk assessment.
- **Business Case -> Roadmap**: The approved investment envelope constrains the roadmap. The benefits realization timeline shapes the phasing.
- **Roadmap -> Implementation Plan**: Phase structure becomes the implementation timeline. Milestones become governance checkpoints.

### Information That Flows Forward

| From | To | What Carries Over |
|------|----|-------------------|
| Options | Business Case | Recommended option, investment estimate, risk profile, trade-offs accepted |
| Business Case | Roadmap | Approved budget, benefits timeline, key risks, success metrics |
| Roadmap | Implementation | Phase structure, milestones, dependencies, resource envelope |

---

## Key Principles

- **Quantify everything.** "Significant savings" convinces no one. A specific figure with a source does.
- **Be honest about trade-offs.** Every option has downsides. Hiding them destroys credibility the first time one surfaces.
- **One accountable owner per deliverable.** Shared accountability is no accountability.
- **The executive summary stands alone.** It is often the only thing that gets read.
- **Build in contingency.** 10-15% on both timeline and budget. Things go wrong.
- **Sequence quick wins early.** They build momentum and buy patience for the hard work later.
- **The critical path drives everything.** Know it, protect it, track it.
- **Enforce phase gates.** Hold them even under pressure to move faster, because skipping a gate is how a pilot's problems reach full rollout.
- **A roadmap is a living document.** Review and update it on a set cadence.
- **Match ambition to capacity.** An aggressive plan the organization cannot absorb is worse than a modest one it can execute.
- **Always include "do nothing" as a baseline.** It forces honest comparison and it is sometimes right.
- **Connect every initiative to a strategic objective.** If you cannot, question why it is in the plan.
