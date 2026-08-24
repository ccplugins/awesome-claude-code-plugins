---
name: project-governance
description: "Set up and run the oversight structure for a consulting engagement: governance tiering, RACI and decision rights, steering committee cadence, stage gates, RAG status reporting, risk and issue registers, and closure handback. Use when standing up engagement governance, defining who decides what, right-sizing a PMO, building a risk register, writing a steering committee status report, or scoring and tracking project health. Covers the management lifecycle from charter sign-off through closure. For the delivery plan itself (workstreams, phasing, business case), see implementation-planning."
license: MIT
metadata:
  category: engagement-delivery
  version: "2.1.0"
  author: Anot
---

# Project Governance

Stand up and operate the oversight structure for a consulting engagement: clear decision-making, one accountable owner per call, and stakeholder alignment that holds when the work gets hard. This covers the management lifecycle from charter sign-off through status reporting, risk, issues, and closure handback. For the delivery plan itself (workstreams, phasing, business case), see implementation-planning.

Governance is a means, not a deliverable. Every artifact here earns its place by changing a decision or catching a problem early. If a report, meeting, or matrix does neither, cut it.

## Before you build anything

Ask the client for the real inputs first. You need the sponsor's name and appetite for involvement, the actual team roster, the contracted scope and budget, the client's existing PMO standards (many large clients mandate a template you must adopt), and any regulatory or audit requirements. Do not invent stakeholders, dollar figures, or milestone dates to fill a template. Where you show a number the client has not confirmed, label it as an example and flag it for validation. Governance built on fabricated inputs collapses the first time someone checks it against reality.

## Governance Structure Selection

Right-size to complexity. A 3-person advisory piece and a 50-person transformation need different machinery, and forcing heavy governance onto a small job is the most common way to make governance feel like overhead.

Three tiers cover most engagements. Pick the lightest one that still gives the sponsor real control.

| Tier | Structure | Cadence | Fits |
|------|-----------|---------|------|
| Light | Sponsor plus engagement manager | Weekly check-in, minimal formal docs | Focused advisory, small team, established relationship |
| Standard | Steering committee plus working team | Monthly steerco, bi-weekly working sessions, written status | Typical engagement, clear scope, moderate complexity |
| Complex | Executive sponsor, program director, steerco, workstream boards | Weekly program review, defined workstream interfaces | Enterprise transformation, multi-year program, high-risk initiative |

Selection factors: team size, stakeholder count, risk level, organizational culture, and regulatory requirements. Culture matters more than size. A 10-person engagement inside a heavily governed bank often needs Standard tier because the client's own controls demand it, while a 30-person job at a fast-moving founder-led firm may run fine on Light. Read the client, not just the headcount.

## Project Charter

The charter is the foundational document. Get sponsor sign-off before substantive work begins, because the charter is what you point to when scope drifts in month three.

Charter elements:
- Project name, sponsor, project director, engagement manager
- Start date and target end date
- Problem statement: the specific problem this solves, in one or two sentences
- Expected outcomes: what changes when this succeeds
- Strategic alignment: which organizational priority this serves
- Scope: in, out, assumptions, constraints (the "out" list prevents more disputes than the "in" list)
- Success criteria: specific and measurable, tied to the outcomes above
- Key milestones with target dates and dependencies
- Budget by category with budget, spent, and remaining columns
- Sign-off block for sponsor and project director

Write the scope boundaries as if you will litigate them, because you may have to. "Out of scope: system implementation, vendor selection, change management beyond leadership alignment" saves a hard conversation later.

## RACI Matrix

RACI clarifies who does what. One rule matters above the rest: exactly one Accountable person per activity. Two A's means nobody is accountable, because each assumes the other has it.

- R (Responsible): does the work
- A (Accountable): final decision authority, owns the outcome, one per activity
- C (Consulted): gives input before the work is done, two-way
- I (Informed): told after the fact, one-way

Build the RACI by engagement phase. Fill each cell with a role, not a name where roles rotate, and confirm the assignments with the people named. A RACI the team has not seen is a guess.

**Discovery**: conduct interviews (R: engagement manager, A: project lead), gather data, synthesize findings, review current state with the client.

**Analysis**: apply analytical frameworks, build financial models, develop and pressure-test options.

**Recommendations**: develop the strategy, build the business case, prepare the executive readout.

On small teams the R and the A are often the same person, and that is fine. On larger engagements separate them, so the person doing the work is not also the sole judge of whether it is good enough. When roles change mid-engagement, update the RACI the same week. A stale RACI creates false confidence, which is worse than no RACI at all.

## Decision Rights

Settle decision authority before the first disagreement, not during it. Verbal agreements fade, and they fade fastest across organizational boundaries where memory conveniently favors each side.

| Decision Type | Decider | Input Required | Process |
|---------------|---------|----------------|---------|
| Scope changes | Sponsor | EM, client lead | Change request |
| Methodology | Engagement manager | Team | Team decision |
| Deliverable content | Engagement manager | Client lead | Review and approve |
| Timeline adjustments | Engagement manager | Sponsor | Notification |
| Budget reallocation | Sponsor | EM | Approval required |
| Resource changes | Engagement manager | HR/PMO | Coordination |
| Go/no-go on recommendations | Engagement manager | Team | Team consensus |

Adapt this table to the actual client. The deciders above are a starting default, and a client with a strong PMO will pull several of these decisions to their side. Confirm each row with the sponsor rather than assuming.

### Escalation Path

| Issue Type | First Escalation | Second Escalation | Timeline |
|------------|------------------|-------------------|----------|
| Technical | EM to client lead | Sponsor | 48 hours |
| Schedule | EM to sponsor | Steering committee | 24 hours |
| Budget | EM to sponsor | Finance | 24 hours |
| Strategic | Sponsor to steering committee | Board | Immediate |

Escalate early. Surprises destroy trust faster than bad news delivered promptly, because a late surprise tells the sponsor you either missed it or hid it, and both are worse than the problem itself.

## Meeting Cadence

Keep the calendar light enough that people show up prepared. Every recurring meeting is a standing tax on the team's time, so justify each one.

### Steering Committee
- Frequency: monthly, or as the governance tier dictates
- Duration: 60-90 minutes
- Attendees: sponsor, client executive, partner, engagement manager
- Purpose: strategic direction, major decisions, risk review
- Agenda: status overview (5 min), decisions needed (15 min), deep dive (30 min), risks and issues (15 min), next steps (5 min)

The steerco exists to make decisions, so lead with the decisions you need and put the status update on one page behind it. A steerco that spends 60 minutes on status and 5 on decisions is a broadcast, not a governance body.

### Project Team
- Frequency: weekly
- Duration: 60 minutes
- Attendees: engagement manager, analysts, client lead
- Purpose: coordination, progress, blocker resolution
- Agenda: wins and blockers (10 min), workstream updates (30 min), decisions needed (10 min), next-week planning (10 min)

### Working Sessions
- Frequency: 2-3x per week as needed
- Duration: 60-90 minutes
- Attendees: whoever the specific work requires
- Purpose: analysis, drafting, problem-solving

### Status Updates
- Frequency: bi-weekly, written
- Distribution: extended stakeholders
- Format: standardized report (see Status Reporting)

## Stage Gate Framework

Stage gates are formal checkpoints where the project proves it is ready before it spends the next phase's budget. The gate is a decision point, not a status meeting. Someone with authority says go, redo, or stop.

**Gate 1: Plan Approval** (end of planning). Evidence: approved charter, completed RACI, detailed work plan, team assigned, approved budget, initial risk register.

**Gate 2: Issue Review** (end of analysis). Evidence: findings documented, options evaluated, draft recommendations clear, client aligned on direction.

**Gate 3: Design Approval** (end of design). Evidence: solution documented, business case validated with updated financials, implementation roadmap approved, change plan approved.

**Gate 4: Go-Live Review** (end of implementation). Evidence: deliverables accepted, benefits tracking live, control plan operational, lessons learned captured.

### Gate Decisions

| Decision | Meaning | Action |
|----------|---------|--------|
| GO | Approved to proceed | Move to next stage |
| GO WITH CONDITIONS | Approved with specific modifications | Document conditions, track to closure |
| REDO | Insufficient readiness | Address the named gaps, return to the gate |
| STOP | Terminate | Initiate closure procedures |

The gate only works if STOP is genuinely on the table. If every gate is a rubber stamp, drop the ceremony and stop pretending. A real gate has, at least once, sent someone back to redo work.

## Status Reporting

This is where governance earns or loses the sponsor's trust. Spend real effort here.

### RAG Methodology

| Status | Definition | Action |
|--------|------------|--------|
| GREEN | On track, no significant issues | Continue normal monitoring |
| AMBER | Concerns identified, mitigation in place | Monitor closely, escalate if it worsens |
| RED | Critical issue, intervention needed | Immediate escalation, recovery plan |

The failure mode is watermelon status: green on the outside, red on the inside. It happens when teams treat AMBER as an admission of failure rather than an early warning. Reward the first person who calls a justified AMBER, because they just bought the sponsor time to help. A project that goes straight from GREEN to RED had a reporting problem, not just a delivery problem.

### Status Report Structure

Cover these sections, in this order, in two pages. Steering committee members read the first paragraph and skim the rest, so the executive summary carries the report.

**Executive summary**: three sentences maximum. Overall RAG, the one thing going well, the one thing you need help with. If a steerco member reads only this, they know where the project stands and what you need from them.

**Status dashboard**: RAG plus trend (improving, stable, declining) for schedule, budget, scope, quality, and resources. The trend arrow matters as much as the color. GREEN and declining deserves a sentence of explanation.

**Progress this period**: deliverables completed, key achievements, work in progress with completion percentages. Percentages must be defensible, not vibes. "Financial model 60% complete" should mean 3 of 5 modules built, not a feeling.

**Milestone status**: each milestone with target date, forecast date, status, and variance. Use symbols (achieved, at risk, missed) so the reader scans it in seconds.

**Budget status**: total, spent to date, percent spent against percent complete, forecast at completion, variance. This comparison is the single most useful line in the report. A project 50% through budget but 30% complete is heading for an overrun, and the sponsor needs to see it while there is still runway to act.

**Burn rate analysis**: planned against actual spend by period. Diverging lines flag trouble before the totals do.

**Risks and issues**: top risks with probability, impact, and mitigation. Open issues with severity, owner, and due date. Issues resolved this period, so the sponsor sees the team clearing them.

**Forward look**: next-period priorities, upcoming milestones, decisions required, and dependencies you are waiting on.

**Governance**: steerco notes, escalations, change log.

### Reporting Discipline
- Be honest with the RAG. Greenwashing delays the help you need and burns credibility when it surfaces.
- Escalate RED the day you find it. Do not save it for the next scheduled report.
- Quantify progress. "Good progress" is not a status.
- Report what changed since last time, not the full history again.
- Cap the executive summary at three sentences.
- Send at the same time each period. Predictability is itself a trust signal.
- Track prior action items explicitly, open and closed.
- Report outcomes delivered, not tasks performed. "Board approved the target operating model" beats "held 4 workshops".

## Risk Management

The second place to go deep. A risk register that is filled in once and never revisited is theater. The value is in the weekly discipline of updating it.

### Risk Identification

| Category | Scope |
|----------|-------|
| Strategic | Market shifts, competitor moves, regulatory change |
| Financial | Cost overrun, currency, funding uncertainty |
| Operational | Process failure, key-person dependency, supply chain |
| Technical | Technology gaps, integration, cybersecurity |
| Regulatory | Compliance, legal exposure, data privacy |
| Schedule | Delays, dependencies, resource availability |
| Quality | Defects, scope creep, acceptance disputes |

Techniques: team brainstorming, expert judgment, SWOT, checklists from comparable past projects, pre-mortem reasoning backward from a hypothetical failure, and horizon scanning for emerging threats. The pre-mortem is the highest-yield of these. Ask the team to imagine the project has failed and explain why, and the risks people were too polite to raise in a status meeting come out.

### Risk Assessment

Score every risk on probability and impact, 1 to 5 each. These bands are a working default. Tune them to the engagement, and where the client has their own risk scale, adopt it rather than imposing a second one.

Probability (1-5):
- 5 Very High: over 80% likely
- 4 High: 60-80%
- 3 Medium: 40-60%
- 2 Low: 20-40%
- 1 Very Low: under 20%

Impact (1-5):
- 5 Very High: over 30% schedule delay, over 20% cost overrun, or major quality failure
- 4 High: 15-30% delay, 10-20% overrun, significant quality issues
- 3 Medium: 5-15% delay, 5-10% overrun, moderate quality issues
- 2 Low: under 5% delay, under 5% overrun, minor quality issues
- 1 Very Low: minimal across all dimensions

Risk score is probability times impact. These percentage bands are directional estimates, not measured probabilities. Treat the score as a way to rank and triage, not as a precise forecast, and never present it to a client as if the underlying likelihood were known data.

| Score | Class | Action |
|-------|-------|--------|
| 19-25 | CRITICAL | Immediate action, steering committee visibility |
| 10-18 | HIGH | Priority mitigation, active management |
| 5-9 | MEDIUM | Active monitoring, mitigation plan in place |
| 1-4 | LOW | Accept and monitor |

### Risk Response

| Strategy | When to Use |
|----------|-------------|
| Avoid | Change the plan to remove the risk. For high-impact, high-probability risks where avoidance is feasible |
| Mitigate | Cut the probability or the impact. The default choice. Define specific actions with owners and deadlines |
| Transfer | Move the risk to a party better placed to carry it: insurance, outsourcing, contract terms |
| Accept | Acknowledge and watch. When mitigation costs more than the expected loss, or probability is very low |

For every risk above LOW, document three things: mitigation actions with owners and dates, the contingency if it materializes anyway, and the cost of mitigation weighed against the cost of occurrence. That last comparison is what tells you whether to mitigate or accept. Do not spend $50k mitigating a $10k risk.

### Risk Monitoring
- Weekly: the project manager checks trigger indicators on active risks
- Monthly: full-team review, add new risks, update scores and statuses
- Quarterly: steerco deep dive on trends and strategic risks

For each significant risk, define the early-warning signal (the specific thing you will see before it hits), how you will monitor it, and how often. "Vendor slips a delivery date" is a signal. "Things feel behind" is not. Track total risks, high and critical counts, closed, and new over time, because a rising count of high risks is itself a risk worth reporting.

## Issue Management

Issues are risks that have already materialized, or problems that need resolving now. The line between a risk and an issue is tense: one might happen, the other is happening.

Severity:
- Critical: the project cannot proceed. Immediate action.
- High: significant impact on outcomes. Escalate.
- Medium: moderate impact. Handle within normal cadence.
- Low: minor. Address in the normal course of work.

Track each issue with ID, description, severity, status (open, in progress, resolved), date created, owner, and due date. Every open issue has exactly one owner with a name and a date. An issue owned by "the team" is owned by no one and will still be open next month.

## Hybrid Delivery Framework

Many engagements blend agile and waterfall. This is a pragmatic call, not a fashion statement, and the blend should follow the work rather than a methodology preference.

When to use which:
- Waterfall for workstreams with fixed requirements and sequential dependencies
- Agile for workstreams with evolving requirements or iterative design
- Hybrid when different workstreams genuinely differ in character

Sprints run inside phases. Each sprint ships an increment, and phase gates still apply at phase boundaries. Governance elements:
- Steerco reviews at phase boundaries (waterfall cadence)
- Status reporting at sprint cadence, weekly
- Scope managed through backlog grooming (agile)
- Quality controlled through a Definition of Done per sprint

The trap is running two governance systems in parallel and doubling everyone's meeting load. Pick one reporting rhythm and one backlog, and let the phase gates be the only place the waterfall structure asserts itself.

## Project Closure

From a governance standpoint, closure requires three things: the final status report delivered, steerco sign-off obtained, and decision rights formally handed back to the client. Do the handback explicitly, in writing, so there is no ambiguity about when the engagement's authority ends and the client owns the outcome. For the full closure methodology (deliverable handover, knowledge transfer, lessons learned, financial reconciliation), see the project-closeout skill.

## Principles

- Governance enables, it does not restrict. If it is not adding value, it is adding overhead. Redesign it.
- One accountable owner per decision. Two A's in a RACI means nobody is accountable.
- Document explicitly. Verbal agreements fade, fastest across organizational lines.
- Escalate early. Surprises destroy trust faster than bad news delivered promptly.
- Living documents over shelf-ware. A RACI nobody updates creates false confidence.
- Right-size to complexity. Light governance for light projects, heavy only when the risk warrants it.
- Settle decision rights before the first disagreement, not during it.
- Be honest with the RAG. Greenwashing delays resolution and erodes credibility.
- Close properly. The last impression carries as much weight as the first.
