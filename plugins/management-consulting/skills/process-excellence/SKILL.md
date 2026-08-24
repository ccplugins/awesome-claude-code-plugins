---
name: process-excellence
description: Applies Lean Six Sigma to diagnose, redesign, and control business processes using the full DMAIC cycle (Define, Measure, Analyze, Improve, Control). Use when a process runs too slow, too costly, or too error-prone and someone needs a defensible root-cause analysis and improvement plan. Covers value stream mapping, SIPOC scoping, process mining from event logs, TIMWOODS waste identification, root cause analysis (5 Whys, fishbone, Pareto), statistical process control, and the financial case for change. Triggers on operational efficiency, cycle-time reduction, defect reduction, throughput, bottlenecks, and process standardization work.
license: MIT
metadata:
  category: engagement-delivery
  version: "2.1.0"
  author: Anot
---

# Process Excellence

Apply Lean Six Sigma to analyze, improve, and control business processes. Lean kills waste and improves flow. Six Sigma reduces variation and defects. Run them together: Lean makes the process faster, Six Sigma makes it reliable. One without the other leaves money on the table.

Before you produce anything, get real inputs. Ask for the process boundaries, baseline metrics, and event data. If the user cannot supply numbers, say so and mark every figure you use as an illustrative example that needs validation. A process analysis built on invented baselines is worse than no analysis, because it looks credible and points the team in the wrong direction.

## DMAIC Methodology

DMAIC (Define, Measure, Analyze, Improve, Control) is the structured path for improving an existing process. Each phase has a deliverable and a gate. Do not advance until the gate is cleared. The two phases where engagements live or die are Measure (bad baselines poison everything downstream) and Analyze (skipping to solutions is the single most common failure). Spend your judgment there. The rest is disciplined execution.

### Define

Articulate the opportunity before anyone proposes a fix.

**Problem statement**: Quantify the current problem in cycle time, cost, quality, or customer satisfaction. "Invoice approval is slow" is not a problem statement. "Invoice approval averages 6.2 days against a 2-day SLA, and 18% breach it" is. A vague problem produces a vague solution.

**Scope**: State what is in and what is out. Projects that try to fix the whole value chain fix nothing. Pick a start point and an end point and defend them.

**Success criteria**: Set measurable targets per metric. Record current state, target state, and the percentage improvement expected. If you cannot name the metric, you cannot claim the win.

**Project charter**:
- Problem statement with quantified impact
- Process boundaries (explicit start and end points)
- Success metrics with baselines and targets
- Timeline per DMAIC phase
- Team: process owner, sponsor, project lead, working members

**Digital context**: Assess automation potential, current digitization level, data availability, and RPA opportunity. This shapes both the analysis approach and the solution space. A process with clean event logs invites process mining. A paper-and-email process does not.

### Measure

Collect baseline data and map the process as it actually runs, not as the SOP claims it runs. These are two different processes. The gap between them is often the finding.

**Process mapping**: Build a SIPOC diagram first to fix boundaries, then map the detailed flow with every decision point and handoff. Handoffs are where time and quality leak, so mark each one.

**Baseline metrics**: For each key metric record the measurement method, sample size, current baseline, and sigma level. State the sample size out loud. A baseline drawn from 8 cases is a guess wearing a number.

**Data collection plan**: Specify each data point, its operational definition, collection method, frequency, and owner. Ambiguous definitions produce unreliable data. "Cycle time" means nothing until you say whether the clock includes queue time.

**Process capability**:
- Cp / Cpk (capability relative to specification limits)
- Stability assessment (in control vs. out of control)
- Common cause vs. special cause variation

Distinguish the two before you touch anything. Chasing special-cause events with process-wide changes makes the process worse.

### Analyze

Identify and validate the root causes of variation and waste. This is where discipline pays. The pressure to jump to solutions is strongest here and it is wrong every time. Prove the cause before you design the fix.

**Waste identification (TIMWOODS)**:

| Waste Type | What to Look For |
|------------|-----------------|
| Transportation | Unnecessary movement of materials or information between steps |
| Inventory | Work piling up between steps, excess WIP |
| Motion | Unnecessary movement of people (extra clicks, walking, searching) |
| Waiting | People or work idle, waiting for approvals, inputs, or capacity |
| Overproduction | Producing more, sooner, or faster than the next step requires |
| Overprocessing | Doing more work than the customer values |
| Defects | Errors requiring rework, correction, or scrap |
| Skills (underused) | People doing work below their capability, untapped expertise |

Walk the actual process against this list. In service processes, Waiting and Overprocessing usually dominate. Name the specific step where each waste shows up, not the category in the abstract.

**Root cause tools**:

5 Whys: Start from the problem statement and ask "why" until you reach a cause the team can actually act on. Three to five iterations is typical. If the answer is "human error" or "the market," you stopped too early. Push to a cause inside the team's control.

Fishbone (Ishikawa): Sort candidate causes into People, Process, Machine, Material, Environment, Measurement. Use it to force breadth so the team does not fixate on the first plausible story.

**Hypothesis testing**: For each suspected cause, write a hypothesis, a test method, and an acceptance criterion. Validate with data. Intuition names suspects. Data convicts them.

**Pareto analysis**: Rank causes by contribution to the problem. Roughly 20% of causes tend to drive 80% of the impact, though the split varies by process and you should verify it rather than assume it. Fix the vital few. Ignore the trivial many until the vital few are gone.

### Improve

Design and deploy the fix.

**Solution evaluation matrix**: Score each candidate on impact, effort, cost, and risk. Separate the high-impact, low-effort wins (do these now) from the structural changes (plan these). A matrix full of medium scores means you have not thought hard enough about the differences.

**Pilot before rollout**: Test in a controlled setting first. Measure pilot results against baseline and target. A solution that works on the slide and fails on the floor is not a solution. The pilot is where you find out which it is.

**Implementation planning**: Phase the rollout with activities, owners, timelines, and dependencies. Budget for training and communication alongside the technical change. Most process improvements fail on adoption, not on design.

**Full rollout**:
- Training for every affected role
- Communication to stakeholders
- Phased schedule with go / no-go checkpoints
- Support model through the transition

### Control

Sustain the gain. Without control mechanisms, processes drift back toward their old state within months. Organizations that skip the Control phase tend to lose most of the improvement inside a year, which is why the phase exists at all.

**Control plan**: For each critical output define the measurement, the control method (control chart, checklist, automated alert), the monitoring frequency, and the response when the process goes out of control.

**Control charts**: Match the chart to the data:
- X-bar R / X-bar S: variable data, subgroups
- I-MR: variable data, individual measurements
- P-chart: proportion defective
- C-chart: count of defects

Define the Upper Control Limit (UCL), Lower Control Limit (LCL), and Center Line (CL) from the data, not from the spec. Control limits describe what the process does. Spec limits describe what the customer wants. Confusing the two is a classic error.

**Standard work documentation**: Update flows, work instructions, SOPs, and training to reflect the improved process. If it is not documented, it drifts.

**Response protocol**: Write specific triggers and responses. When metric X crosses threshold Y, person Z takes action A within time T. Vague ownership means no response.

**Handover checklist**:
- Control charts deployed and understood
- Response plan documented and tested
- Process owner trained on monitoring
- SOPs updated and accessible
- Training complete for all operators
- Dashboard live and accurate
- Lessons learned captured

## Value Stream Mapping

Value stream mapping shows the end-to-end flow of materials and information required to deliver a product or service. Its power is in one ratio: value-added time against total lead time.

**Map the current state**:
1. Walk the process from the customer backward to the supplier
2. Record cycle time, changeover time, and WIP at each step
3. Split value-added from non-value-added time
4. Find bottlenecks (highest cycle time relative to takt time)
5. Mark inventory accumulation points
6. Compute total lead time vs. value-added time

**Per-step metrics**: cycle time (C/T), WIP, changeover time, uptime, batch size.

**Summary metrics**: total lead time, total value-added time, percentage value-added. In many service processes, value-added time runs under 5% of total lead time. Treat that 5% figure as a directional benchmark, not a target: verify it against the client's own map. The other 95% is the opportunity.

**Future state**: Design for continuous flow. Cut steps that add no value. Pull work through the system instead of pushing it. The future-state map should show shorter lead time, lower WIP, and a higher value-added percentage than the current state, with the delta quantified.

## Process Mining

Process mining reads event log data from IT systems to discover, monitor, and improve the process as it actually executes. It is the fastest way to expose the gap between documented and real behavior at scale.

### When to Use It

- Large processes with many variants and exceptions
- ERP or workflow logs available for extraction
- Need to see actual behavior vs. the documented flow
- Conformance checking against regulatory or policy requirements
- Hunting automation candidates in high-volume, low-variation paths

### What to Report

**Discovery**: number of path variants, average case duration, and the deviation points where cases leave the intended flow. A process meant to have 3 paths that shows 340 variants is telling you something.

**Conformance**: compliance rate, count and percentage of deviating cases, and the root cause of deviation. Ask the key question: are these deviations deliberate workarounds (the real process is smarter than the SOP) or genuine errors (the process is broken)? The answer changes the recommendation entirely.

**Process intelligence**: bottlenecks (where cases wait longest), rework loops (where cases move backward), and idle time (where cases sit).

## SIPOC Analysis

SIPOC sets process boundaries before detailed mapping. It answers: who supplies what, through which high-level steps, producing what outputs, for whom?

| Element | Question |
|---------|----------|
| **S**uppliers | Who provides inputs to this process? |
| **I**nputs | What enters the process (materials, information, triggers)? |
| **P**rocess | What are the 5-7 high-level steps? |
| **O**utputs | What does the process produce? |
| **C**ustomers | Who receives the outputs? |

Use SIPOC in Define to align the team on scope. It prevents scope creep and confirms you are mapping the right process before anyone invests in a detailed map.

## Standard Work

Standard work documents the current best method. It is the floor for improvement, not the ceiling.

**Elements**:
- Takt time: customer demand rate (available time / customer demand)
- Cycle time: time to complete one unit (must be at or below takt time)
- WIP limit: maximum work in progress allowed
- Work sequence: ordered steps with time and quality checks at each

**Principles**:
- Takt time sets the pace. If cycle time at any station exceeds takt time, that station is the bottleneck.
- WIP limits expose constraints. Cap the WIP, and wherever work still piles up is the constraint.
- Standardize, then improve. You can only improve what is standardized, because without a standard you have nothing to measure change against.

## Process Performance Dashboard

Track three metric categories to read process health.

**Efficiency**: cycle time, throughput, utilization. How fast and how productively the process runs.

**Quality**: defect rate, first pass yield (FPY), customer complaints. Whether the output is acceptable.

**Cost**: cost per unit, scrap cost, rework cost. What the performance means in money.

Use RAG status (Green = on target, Yellow = at risk, Red = off target). Show baseline, current, and target for each metric so the direction of travel is visible, not just the current position. A red metric moving toward target is a different story from a red metric holding still, and the dashboard should tell them apart.

## Financial Impact

Translate every improvement into money. A process win with no dollar figure will not survive the next budget cycle. Build the number from the client's actual labor rates, volumes, and costs. When you must illustrate the method with example figures, label them as illustrative and flag them for validation before anything reaches a steering committee.

| Category | How to Calculate |
|----------|-----------------|
| Cost savings (annual) | Reduction in labor, materials, rework, waste |
| Revenue impact | Increased throughput, reduced lead time enabling more sales |
| One-time implementation cost | Training, systems, consulting, pilot costs |
| ROI | (Annual savings - Implementation cost) / Implementation cost |
| Payback period | Implementation cost / Monthly savings |

State assumptions next to every number. A savings figure without its assumptions is a number nobody can defend in the room.

## Filling In the Deliverable

When you produce any table above (charter, waste analysis, solution matrix, control plan, financial model), write 2-3 sentences of reasoning and evidence in each cell. Do not leave one-word placeholders. "Waiting: high" is not analysis. "Waiting: cases sit an average of 3.1 days in the credit-check queue against 4 hours of actual work, driven by a single reviewer covering three regions" is. Every cell should carry the reasoning a reviewer needs to trust the conclusion.

## Principles

- Start with data. Never assume. Measure the current state before proposing anything.
- Value is defined by the customer, not by internal convenience.
- Eliminate waste first, then optimize what remains.
- Standardize before improving. You can only improve what is standardized.
- Think systemically. A change in one step moves the load somewhere else.
- Engage the people doing the work. They know the process, and they will run the change.
- Pilot before rollout. Prove it small before you scale it.
- Control to sustain. Improvements without control revert within months.
- If you are not measuring, you are not improving. And if your measurements are wrong, you are improving the wrong thing.
