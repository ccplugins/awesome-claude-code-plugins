---
name: operational-playbook-creator
description: Create comprehensive operational playbook documenting organizational structure, processes, meeting rhythms, communication protocols, OKRs, tools, onboarding, and culture. Build the operating system that scales your team from 10 to 1,000+ employees.
---

# operational-playbook-creator

**Mission**: Create a comprehensive operational playbook documenting how your company runs—organizational structure, processes, meeting rhythms, communication protocols, culture, goal-setting, decision-making, tools, and onboarding. Build the operating system that scales your team from 10 to 100 to 1,000+ employees.

---

## STEP 0: Pre-Generation Verification

**MANDATORY: Complete this checklist BEFORE generating output.**

### Information Requirements
- [ ] Company name and stage confirmed
- [ ] Current headcount and organizational structure documented
- [ ] Core values (3-5) defined with behavioral descriptions
- [ ] Mission and vision statements available
- [ ] Meeting rhythm preferences understood (cadence, duration, participants)
- [ ] Communication tool preferences identified (Slack vs Teams, etc.)
- [ ] OKR/goal-setting framework preference confirmed
- [ ] Tool stack inventory available
- [ ] Onboarding timeline expectations set

### Output Format Verification
- [ ] HTML template located at `html-templates/operational-playbook-creator.html`
- [ ] Score banner metrics: Headcount, Departments, Core Processes, Meetings, Tools, Y1 Target
- [ ] All 10 sections have content ready:
  1. Company Foundation (mission, vision, 3-5 values)
  2. Organizational Structure (org chart + headcount growth chart)
  3. Core Processes (4 department processes minimum)
  4. Meeting Rhythms (daily, weekly, bi-weekly, monthly, quarterly)
  5. Communication Protocols (channels + SLA cards)
  6. OKRs & Goals (3 objectives with 2-3 KRs each)
  7. Tools & Systems (10-15 tools with categories)
  8. Onboarding Playbook (5-stage timeline)
  9. Company Culture & Rituals (6 rituals across cadences)
  10. Next Steps (6 prioritized action items)
- [ ] Chart.js data prepared for headcount growth chart
- [ ] All placeholder markers identified for replacement

### Quality Gates
- [ ] Processes are specific, not generic (includes timing, owners, SLAs)
- [ ] Values include behavioral definitions (what it looks like in practice)
- [ ] Meeting rhythms are realistic (not excessive for company size)
- [ ] Onboarding covers Pre-Day 1 through Day 30
- [ ] OKRs follow proper format (qualitative O, quantitative KRs)

**If any checkbox is incomplete, gather missing information before proceeding.**

---

## STEP 1: Detect Previous Context

### Ideal Context (All Present):
- **financial-model-architect** → Headcount plan, organizational growth roadmap
- **metrics-dashboard-designer** → KPIs, success metrics, dashboard structure
- **go-to-market-planner** → Sales process, customer success playbook
- **product-positioning-expert** → Company mission, vision, values

### Partial Context (Some Present):
- **financial-model-architect** → Headcount plan available
- **metrics-dashboard-designer** → KPIs and metrics framework available

### No Context:
- None of the above skills were run

---

## STEP 2: Context-Adaptive Introduction

### If Ideal Context:
> I found outputs from **financial-model-architect**, **metrics-dashboard-designer**, **go-to-market-planner**, and **product-positioning-expert**.
>
> I can reuse:
> - **Headcount plan** (current: [X], Year 1: [Y], by department)
> - **KPIs** (North Star Metric, AARRR metrics, success criteria)
> - **Sales process** (prospecting, demo, close, customer success)
> - **Mission/Vision** (company purpose and direction)
>
> **Proceed with this data?** [Yes/Start Fresh]

### If Partial Context:
> I found outputs from some upstream skills: [list which ones].
>
> I can reuse: [list specific data available]
>
> **Proceed with this data, or start fresh?**

### If No Context:
> No previous context detected.
>
> I'll guide you through creating your operational playbook from the ground up.

---

## STEP 3: Questions (One at a Time, Sequential)

### Company Foundation

**Question CF1: What are your mission, vision, and values?**

**Mission** = Why we exist (the problem we solve)
- [e.g., "Empower construction teams to build faster and more profitably"]

**Vision** = Where we're going (our 10-year goal)
- [e.g., "Become the operating system for the $10T construction industry"]

**Values** (3-5 core values that guide decisions):
1. [Value 1] — [What it means in practice]
2. [Value 2] — [What it means in practice]
3. [Value 3] — [What it means in practice]

**Example Values**:
- **"Customer obsession"** → We talk to 10 customers per week, not per quarter
- **"Move fast"** → Ship features in days, not months
- **"Own it"** → No "that's not my job" — everyone owns outcomes

**Your Mission, Vision, Values**:
- Mission: [Why we exist]
- Vision: [10-year goal]
- Values: [3-5 values with definitions]

---

### Organizational Structure

**Question OS1: What is your current organizational structure?**

**Organizational Chart** (current state):

```
CEO/Founder
│
├── CTO / VP Engineering
│   ├── Engineering Manager (Backend)
│   │   └── Engineers (3)
│   └── Engineering Manager (Frontend)
│       └── Engineers (2)
│
├── VP Product
│   ├── Product Manager
│   └── Designer
│
├── VP Sales
│   ├── Sales Manager
│   │   └── Account Executives (3)
│   └── SDRs (2)
│
├── VP Marketing
│   ├── Content Marketing Manager
│   └── Demand Gen Manager
│
└── COO / Head of Ops
    ├── Customer Success Manager (2)
    ├── Finance/Accounting
    └── HR/Operations
```

**Your Org Chart** (draw current structure):
- [CEO/Founders]
- [Department 1] — [Headcount]
- [Department 2] — [Headcount]
- [etc.]

**Total Headcount**: [X people]

---

**Question OS2: What is your target organizational structure in 12 months?**

**Future Org Chart** (12 months from now):

**Planned Hires** (from financial-model-architect):
- Engineering: [X new hires]
- Product: [X new hires]
- Sales: [X new hires]
- Marketing: [X new hires]
- Customer Success: [X new hires]
- G&A: [X new hires]

**Total Future Headcount**: [X people]

**New Roles to Create**:
1. [Role 1] — [Why needed?] — [Hire by when?]
2. [Role 2] — [Why needed?] — [Hire by when?]
3. [Role 3] — [Why needed?] — [Hire by when?]

---

### Process Documentation

**Question PD1: What are your core processes?**

**Core Processes by Department**:

### Engineering Process
- **Sprint Cadence**: [e.g., "2-week sprints"]
- **Planning**: [e.g., "Sprint planning Monday 9am, 2 hours"]
- **Daily Standups**: [e.g., "Daily at 10am, 15 minutes"]
- **Code Review**: [e.g., "All PRs require 2 approvals"]
- **Deployment**: [e.g., "Deploy to production Friday 4pm"]
- **Incident Response**: [e.g., "Pagerduty on-call rotation, 15-minute SLA"]

### Product Process
- **Product Discovery**: [e.g., "10 customer interviews per week"]
- **Roadmap Planning**: [e.g., "Quarterly roadmap, prioritized by RICE score"]
- **Feature Spec**: [e.g., "PRD template: problem, solution, success metrics, mocks"]
- **Launch Process**: [e.g., "Internal beta → external beta → GA over 2 weeks"]

### Sales Process
- **Lead Qualification**: [e.g., "BANT framework (Budget, Authority, Need, Timeline)"]
- **Sales Stages**: [e.g., "Lead → Qualified → Demo → Proposal → Negotiation → Closed"]
- **Demo Script**: [e.g., "30-minute demo deck, tailored to persona"]
- **Proposal**: [e.g., "Custom proposal within 48 hours of demo"]
- **Contract Negotiation**: [e.g., "Legal review for >$50K deals"]
- **Onboarding Handoff**: [e.g., "AE introduces CS Manager within 24 hours of close"]

### Customer Success Process
- **Onboarding**: [e.g., "Kickoff call Day 0, check-ins Day 3, 7, 14, 30"]
- **Quarterly Business Review (QBR)**: [e.g., "QBR for all customers >$10K ARR"]
- **Health Score Monitoring**: [e.g., "Weekly review of at-risk customers (health score <50)"]
- **Renewal**: [e.g., "Outreach 60 days before renewal, confirm 30 days before"]

### Marketing Process
- **Content Creation**: [e.g., "Publish 2 blog posts per week, 1 case study per month"]
- **Demand Gen**: [e.g., "Weekly webinar, monthly event, quarterly conference"]
- **Lead Routing**: [e.g., "Inbound leads routed to SDR within 5 minutes"]

**Your Core Processes** (document top 5-10):
1. [Process 1] — [Department] — [What happens]
2. [Process 2] — [Department] — [What happens]
3. [etc.]

---

### Meeting Rhythms

**Question MR1: What are your company-wide meeting rhythms?**

**Meeting Cadence**:

### Daily
- **Daily Standup** (Engineering, Product)
  - Time: [e.g., "10am, 15 minutes"]
  - Who: [e.g., "Engineering + Product team"]
  - Format: [e.g., "What I did yesterday, what I'm doing today, blockers"]

### Weekly
- **Monday Leadership Meeting** (CEO + Department Heads)
  - Time: [e.g., "Monday 9am, 1 hour"]
  - Who: [e.g., "CEO, CTO, VP Product, VP Sales, VP Marketing, COO"]
  - Agenda: [e.g., "Review metrics, discuss priorities, address blockers"]

- **Friday Wins** (All-Company)
  - Time: [e.g., "Friday 4pm, 30 minutes"]
  - Who: [e.g., "Entire company"]
  - Format: [e.g., "Each team shares 1-2 wins from the week"]

### Bi-Weekly
- **Sprint Planning** (Engineering, Product)
  - Time: [e.g., "Every other Monday, 2 hours"]
  - Who: [e.g., "Engineering + Product team"]
  - Format: [e.g., "Review last sprint, plan next sprint, commit to deliverables"]

- **Sprint Retro** (Engineering, Product)
  - Time: [e.g., "Every other Friday, 1 hour"]
  - Who: [e.g., "Engineering + Product team"]
  - Format: [e.g., "What went well, what didn't, action items for next sprint"]

### Monthly
- **All-Hands** (Entire Company)
  - Time: [e.g., "First Wednesday of month, 1 hour"]
  - Who: [e.g., "Entire company"]
  - Agenda: [e.g., "Company metrics, department updates, customer spotlight, Q&A"]

- **Board Meeting** (Board of Directors)
  - Time: [e.g., "Last Friday of month, 2 hours"]
  - Who: [e.g., "Board members + CEO + CFO"]
  - Materials: [e.g., "Board deck (sent 48 hours in advance)"]

### Quarterly
- **Quarterly Planning** (Leadership)
  - Time: [e.g., "Last week of quarter, 4 hours"]
  - Who: [e.g., "Leadership team"]
  - Output: [e.g., "Q+1 OKRs, roadmap, hiring plan, budget"]

- **Quarterly Offsite** (Entire Company)
  - Time: [e.g., "First week of quarter, 1 day"]
  - Who: [e.g., "Entire company"]
  - Format: [e.g., "Team building, vision, strategy, breakouts"]

**Your Meeting Rhythms** (document 5-10 key meetings):
1. [Meeting 1] — [Cadence] — [Who] — [Duration] — [Purpose]
2. [Meeting 2] — [Cadence] — [Who] — [Duration] — [Purpose]
3. [etc.]

---

**Question MR2: What are your meeting best practices?**

**Meeting Best Practices**:

### 1. Always Have an Agenda
- Sent 24 hours in advance
- Clear objectives (decision, brainstorm, update)

### 2. Start and End On Time
- No exceptions (respect everyone's time)

### 3. Designate a Meeting Owner
- Responsible for agenda, facilitation, notes, action items

### 4. Document Decisions & Action Items
- Every meeting ends with: What was decided? Who owns what by when?

### 5. Default to Async Communication
- Don't schedule a meeting if it can be an email, Slack message, or Loom video

**Your Meeting Best Practices** (choose 3-5):
1. [Best practice 1]
2. [Best practice 2]
3. [etc.]

---

### Communication Protocols

**Question CP1: What are your communication channels and usage?**

**Communication Tools**:

### Slack (or equivalent)
- **Channels**:
  - `#general` → Company-wide announcements
  - `#engineering` → Engineering team discussions
  - `#product` → Product team discussions
  - `#sales` → Sales team discussions
  - `#marketing` → Marketing team discussions
  - `#customer-success` → CS team discussions
  - `#wins` → Customer wins, closed deals, shipped features
  - `#random` → Off-topic, fun, team bonding
  - `#support` → Customer support tickets
  - `#alerts` → System alerts, incidents

- **Response Time SLAs**:
  - 🔴 **Urgent** (P0 incident): <15 minutes
  - 🟡 **High Priority**: <2 hours
  - 🟢 **Normal**: <24 hours

### Email
- **When to use**: External communication (customers, partners, investors), formal documentation
- **When NOT to use**: Internal quick questions (use Slack instead)

### Project Management (Jira, Linear, Asana, etc.)
- **When to use**: Track engineering tasks, product roadmap, sprint planning
- **Process**: All work tracked as tickets, no "shadow work"

### Documentation (Notion, Confluence, Google Docs, etc.)
- **When to use**: Long-form documentation (processes, playbooks, meeting notes)
- **Process**: Link to docs in Slack (not copy-paste), keep docs up to date

**Your Communication Protocols**:
- Primary Tool: [e.g., "Slack"]
- Channels: [List 5-10 key channels]
- Response SLAs: [Urgent/High/Normal timelines]
- Email Usage: [When to use]
- Documentation Tool: [e.g., "Notion"]

---

**Question CP2: What is your asynchronous communication philosophy?**

**Async Communication Principles**:

### 1. Default to Async
- Write it down first (doc, Slack, Loom video)
- Only schedule meetings for decisions, brainstorms, or complex discussions

### 2. Write Clear Context
- Assume reader has no context
- Use headers, bullet points, TL;DR

### 3. Respect Time Zones (if distributed team)
- No expectation to respond outside working hours
- Use Slack scheduled send for off-hours messages

### 4. Record Key Meetings
- Use Loom, Zoom recording for those who can't attend
- Share recording + notes in Slack or docs

**Your Async Communication Philosophy**:
- [Principle 1]
- [Principle 2]
- [etc.]

---

### Goal-Setting & OKRs

**Question GS1: How do you set and track goals?**

**Goal-Setting Framework**:

### OKRs (Objectives & Key Results)
- **Objective**: Qualitative goal (what you want to achieve)
- **Key Results**: Quantitative metrics (how you measure success)

**Example OKR**:
- **Objective**: Become the leading construction software for mid-market contractors
- **Key Result 1**: Reach $5M ARR (currently $1M)
- **Key Result 2**: Sign 50 new customers (currently 200 total)
- **Key Result 3**: Achieve 120% Net Revenue Retention

**OKR Cadence**:
- Set quarterly OKRs (by department and company-wide)
- Review weekly in leadership meeting
- Grade OKRs end of quarter (0.0-1.0 scale, 0.7 = success)

**Your Goal-Setting Framework**:
- Framework: [OKRs / KPIs / Other]
- Cadence: [Quarterly / Annual]
- Review Frequency: [Weekly / Monthly]

---

**Question GS2: What are your company OKRs for this quarter?**

**Company OKRs (Q[X] 2024)**:

**Objective 1**: [What you want to achieve]
- **KR1**: [Metric: baseline → target]
- **KR2**: [Metric: baseline → target]
- **KR3**: [Metric: baseline → target]

**Objective 2**: [What you want to achieve]
- **KR1**: [Metric: baseline → target]
- **KR2**: [Metric: baseline → target]

**Objective 3**: [What you want to achieve]
- **KR1**: [Metric: baseline → target]
- **KR2**: [Metric: baseline → target]

**Example**:

**Objective 1**: Accelerate revenue growth
- **KR1**: Grow MRR from $50K to $100K (+100%)
- **KR2**: Sign 100 new customers (+50%)
- **KR3**: Improve activation rate from 40% to 60%

**Your Company OKRs**:
- [Objective 1] → [KR1, KR2, KR3]
- [Objective 2] → [KR1, KR2]
- [Objective 3] → [KR1, KR2]

---

### Decision-Making Framework

**Question DM1: What is your decision-making framework?**

**Decision-Making Principles**:

### 1. Type 1 vs. Type 2 Decisions (Amazon framework)
- **Type 1** (One-way doors): Hard to reverse (hiring, fundraising, major pivots) → Slow, deliberate, leadership decides
- **Type 2** (Two-way doors): Easy to reverse (A/B tests, feature experiments, pricing tests) → Fast, autonomous, anyone can decide

### 2. Disagree and Commit
- Everyone voices opinion
- Once decision is made, everyone commits (even if they disagreed)

### 3. Decision Owner
- Every decision has a clear owner (not committee-driven)
- Owner consults stakeholders, but ultimately decides

### 4. Decision Log
- Document major decisions (what, why, who, when)
- Helps onboard new team members, avoid re-litigating decisions

**Your Decision-Making Framework**:
- [Framework 1] — e.g., "Type 1 vs. Type 2 decisions"
- [Framework 2] — e.g., "Disagree and commit"
- [Framework 3] — e.g., "Decision owner (not committee)"

---

### Tools & Systems

**Question TS1: What tools and systems do you use?**

**Tool Stack**:

### Communication
- **Slack**: Team communication
- **Zoom**: Video calls
- **Email**: External communication

### Product & Engineering
- **GitHub**: Code repository
- **Linear / Jira**: Project management, sprint planning
- **Figma**: Design
- **AWS / GCP**: Hosting
- **PagerDuty**: On-call, incident management

### Sales & Marketing
- **Salesforce / HubSpot**: CRM
- **Outreach / SalesLoft**: Sales engagement
- **Intercom / Zendesk**: Customer support
- **Marketo / HubSpot**: Marketing automation
- **Google Analytics / Mixpanel**: Product analytics

### Operations & Finance
- **Notion / Confluence**: Documentation, playbooks
- **Google Workspace**: Email, docs, sheets
- **QuickBooks / Xero**: Accounting
- **Gusto / Rippling**: Payroll, HR
- **DocuSign**: E-signatures

**Your Tool Stack** (list 10-15 key tools):
1. [Tool 1] — [Category] — [What it's used for]
2. [Tool 2] — [Category] — [What it's used for]
3. [etc.]

---

### Onboarding Playbook

**Question OP1: What is your employee onboarding process?**

**Onboarding Timeline**:

### Pre-Day 1 (1 week before)
- ☐ Send welcome email with Day 1 logistics (time, location, what to bring)
- ☐ Set up accounts (email, Slack, GitHub, etc.)
- ☐ Ship laptop and equipment
- ☐ Add to org chart, Slack channels, email lists

### Day 1
- ☐ **9am**: Welcome meeting with manager (tour, intros, expectations)
- ☐ **10am**: IT setup (laptop, accounts, tools)
- ☐ **11am**: HR paperwork (I-9, benefits, equity docs)
- ☐ **12pm**: Lunch with team
- ☐ **2pm**: Company overview (mission, vision, values, strategy)
- ☐ **3pm**: Product demo (deep dive into what we build)
- ☐ **4pm**: Q&A with CEO/Founder

### Week 1
- ☐ **Day 2**: Shadow a customer call (sales demo or customer success check-in)
- ☐ **Day 3**: Meet 1-on-1 with each department head (15 minutes each)
- ☐ **Day 4**: Read key docs (strategy, product roadmap, OKRs)
- ☐ **Day 5**: First project assigned (small, achievable, with mentorship)

### Week 2-4
- ☐ **Week 2**: Complete first meaningful contribution (ship code, close deal, publish content)
- ☐ **Week 3**: Talk to 3-5 customers (understand their pain points, use cases)
- ☐ **Week 4**: 30-day check-in with manager (feedback, adjust onboarding)

### Day 30
- ☐ **30-Day Review**: Manager + HR check-in (how's it going, what's working, what's not)

**Your Onboarding Process** (customize timeline):
- Pre-Day 1: [Tasks]
- Day 1: [Schedule]
- Week 1: [Milestones]
- Week 2-4: [Milestones]
- Day 30: [Review]

---

**Question OP2: What resources do you provide to new hires?**

**Onboarding Resources**:

### 1. Employee Handbook
- Company history, mission, vision, values
- Org chart, team directory
- Benefits, PTO policy, expense policy
- Code of conduct, harassment policy

### 2. Product Knowledge Base
- Product overview, roadmap, release notes
- Customer personas, use cases
- Competitive landscape

### 3. Process Documentation
- Engineering: Sprint process, code review, deployment
- Sales: Sales process, demo deck, objection handling
- Customer Success: Onboarding playbook, QBR template

### 4. Onboarding Buddy
- Assign a "buddy" (peer mentor) for first 30 days
- Buddy answers questions, provides context, does coffee chats

**Your Onboarding Resources**:
- [Resource 1] — e.g., "Employee handbook (Notion doc)"
- [Resource 2] — e.g., "Product knowledge base (Confluence)"
- [Resource 3] — e.g., "Onboarding buddy program"

---

### Company Culture

**Question CC1: What are your cultural norms and rituals?**

**Cultural Rituals**:

### Daily
- **Slack #wins Channel**: Share customer wins, closed deals, shipped features

### Weekly
- **Friday Wins**: 30-minute all-hands, each team shares 1-2 wins
- **Donut Coffee Chats**: Slack bot randomly pairs team members for virtual coffee

### Monthly
- **All-Hands Meeting**: Company metrics, department updates, Q&A
- **Team Lunch**: In-person or virtual (company pays)

### Quarterly
- **Offsite**: 1-day team building, strategy session
- **Hackathon**: 2 days to build anything (ship side projects, experiment)

### Annual
- **Company Retreat**: 2-3 days off-site (team building, strategy)
- **Holiday Party**: Celebrate end of year

**Your Cultural Rituals** (choose 5-10):
1. [Ritual 1] — [Cadence] — [What happens]
2. [Ritual 2] — [Cadence] — [What happens]
3. [etc.]

---

### Implementation Roadmap

**Question IR1: What is your 90-day playbook rollout plan?**

### Month 1: Document Foundation (Weeks 1-4)
- **Week 1**: Document mission, vision, values
- **Week 2**: Create org chart (current + 12-month plan)
- **Week 3**: Document core processes (5-10 key processes)
- **Week 4**: Define meeting rhythms (daily, weekly, monthly, quarterly)

### Month 2: Communication & Tools (Weeks 5-8)
- **Week 5**: Set up communication protocols (Slack channels, response SLAs)
- **Week 6**: Document tool stack (who uses what, why, how)
- **Week 7**: Define OKRs for current quarter (company + department)
- **Week 8**: Create decision-making framework (Type 1/2 decisions, owners)

### Month 3: Onboarding & Culture (Weeks 9-12)
- **Week 9**: Build onboarding playbook (Day 1, Week 1, Day 30)
- **Week 10**: Create onboarding resources (handbook, knowledge base, buddy program)
- **Week 11**: Document cultural rituals (daily, weekly, monthly, quarterly)
- **Week 12**: Launch playbook, share with team, get feedback

---

## STEP 4: Generate Comprehensive Operational Playbook

**You will now receive a comprehensive document covering**:

### Section 1: Company Foundation
- Mission, vision, values (why we exist, where we're going, how we operate)
- Company history and origin story
- Strategic priorities (next 12 months)

### Section 2: Organizational Structure
- Current org chart (departments, headcount, reporting structure)
- 12-month org chart (planned hires, new roles)
- Role definitions (responsibilities, expectations, success criteria)

### Section 3: Process Documentation
- Engineering process (sprints, code review, deployment, incident response)
- Product process (discovery, roadmap, specs, launches)
- Sales process (lead qualification, demo, proposal, close, handoff)
- Customer Success process (onboarding, QBRs, renewals)
- Marketing process (content, demand gen, lead routing)

### Section 4: Meeting Rhythms
- Daily standups (Engineering, Product)
- Weekly leadership meeting (metrics, priorities, blockers)
- Bi-weekly sprint planning and retros (Engineering, Product)
- Monthly all-hands (company metrics, updates, Q&A)
- Quarterly planning (OKRs, roadmap, budget)

### Section 5: Communication Protocols
- Communication tools (Slack, email, project management, documentation)
- Channel structure (#general, #engineering, #sales, #wins, #alerts)
- Response time SLAs (urgent <15min, high <2hr, normal <24hr)
- Async communication philosophy (default to async, write clear context, respect time zones)

### Section 6: Goal-Setting & OKRs
- Goal-setting framework (OKRs, quarterly cadence, weekly reviews)
- Current quarter OKRs (company-wide + department-level)
- OKR grading (0.0-1.0 scale, 0.7 = success)

### Section 7: Decision-Making Framework
- Type 1 vs. Type 2 decisions (one-way vs. two-way doors)
- Disagree and commit (voice opinion, then commit)
- Decision owners (clear ownership, not committees)
- Decision log (document major decisions)

### Section 8: Tools & Systems
- Communication (Slack, Zoom, email)
- Product & Engineering (GitHub, Linear, Figma, AWS, PagerDuty)
- Sales & Marketing (Salesforce, Outreach, Intercom, Mixpanel)
- Operations & Finance (Notion, Google Workspace, QuickBooks, Gusto)

### Section 9: Onboarding Playbook
- Pre-Day 1 (welcome email, account setup, equipment)
- Day 1 schedule (welcome, IT setup, HR, company overview, Q&A)
- Week 1 milestones (shadow call, meet dept heads, read docs, first project)
- Week 2-4 milestones (first contribution, talk to customers, 30-day review)
- Onboarding resources (handbook, knowledge base, buddy program)

### Section 10: Company Culture
- Cultural norms (how we work, communicate, make decisions)
- Daily rituals (#wins Slack channel)
- Weekly rituals (Friday wins, coffee chats)
- Monthly rituals (all-hands, team lunch)
- Quarterly rituals (offsite, hackathon)
- Annual rituals (company retreat, holiday party)

### Section 11: Next Steps
- Finalize playbook this month
- Share with team, get feedback, iterate
- Update quarterly as company scales
- Use playbook to onboard all new hires

---

## STEP 5: Quality Review & Iteration

After generating the strategy, I will ask:

**Quality Check**:
1. Is the mission/vision/values clear and inspiring?
2. Are core processes documented (engineering, sales, CS, marketing)?
3. Are meeting rhythms realistic and not excessive?
4. Are communication channels and SLAs clear?
5. Is the onboarding playbook comprehensive (Day 1, Week 1, Day 30)?
6. Are cultural rituals defined (daily, weekly, monthly, quarterly)?

**Iterate?** [Yes — refine X / No — finalize]

---

## STEP 6: Save & Next Steps

Once finalized, I will:
1. **Save** the operational playbook to your shared documentation (Notion, Confluence, etc.)
2. **Suggest** sharing with entire team and getting feedback
3. **Remind** you to update quarterly as company scales

---

## 8 Critical Guidelines for This Skill

1. **Document everything**: If it's not written down, it doesn't exist. Processes in people's heads don't scale.

2. **Keep it simple**: Playbooks should be scannable, not novels. Use bullet points, templates, examples.

3. **Living document**: Playbooks are never "done". Update quarterly as you learn what works and what doesn't.

4. **Default to async**: Don't schedule meetings that can be emails, Slack messages, or Loom videos.

5. **Clear ownership**: Every process, decision, and meeting needs a clear owner. No committees.

6. **Culture is what you do, not what you say**: Values are meaningless if not practiced. Document how values show up in daily work.

7. **Onboarding makes or breaks**: First 30 days determine employee success. Invest heavily in onboarding playbook.

8. **Fewer meetings, better meetings**: Every meeting needs agenda, owner, notes, and action items. Otherwise, cancel it.

---

## Quality Checklist (Before Finalizing)

- [ ] Mission, vision, and values are documented and inspire the team
- [ ] Org chart shows current structure and 12-month growth plan
- [ ] 5-10 core processes are documented (engineering, product, sales, CS, marketing)
- [ ] Meeting rhythms are defined (daily, weekly, monthly, quarterly)
- [ ] Communication channels and response SLAs are clear
- [ ] OKRs are set for current quarter (company + department level)
- [ ] Decision-making framework is defined (Type 1/2, disagree & commit, owners)
- [ ] Tool stack is documented (10-15 key tools with usage)
- [ ] Onboarding playbook covers Day 1, Week 1, Week 2-4, Day 30
- [ ] Cultural rituals are defined (daily, weekly, monthly, quarterly, annual)

---

## Integration with Other Skills

**Upstream Skills** (reuse data from):
- **financial-model-architect** → Headcount plan, organizational growth roadmap, hiring timeline
- **metrics-dashboard-designer** → KPIs, North Star Metric, AARRR metrics, dashboard structure
- **go-to-market-planner** → Sales process, customer success playbook, GTM metrics
- **product-positioning-expert** → Company mission, vision, strategic positioning
- **customer-feedback-framework** → Customer success process (NPS, CSAT, feedback loops)

**Downstream Skills** (use this data in):
- **New employee onboarding** → Use playbook to onboard all new hires
- **Investor updates** → Reference OKRs, team structure, and culture in board meetings
- **Scaling operations** → Use playbook as foundation for scaling from 10 → 100 → 1,000 employees

---

## HTML Output Verification

**MANDATORY: Verify these elements before delivering HTML output.**

### Template Compliance
- [ ] Used skeleton template from `html-templates/operational-playbook-creator.html`
- [ ] All `{{PLACEHOLDER}}` markers replaced with actual data
- [ ] No template syntax visible in final output
- [ ] Company name appears in header, title, and throughout document

### Score Banner Verification
Six metrics displayed correctly:
- [ ] **Headcount**: Current team size (integer)
- [ ] **Departments**: Number of functional areas (integer)
- [ ] **Core Processes**: Number of documented processes (integer)
- [ ] **Meetings**: Number of meeting types defined (integer)
- [ ] **Tools**: Number of tools in stack (integer)
- [ ] **Y1 Target**: Target headcount in 12 months (integer)

### Section Content Verification
- [ ] Section 1: Mission, vision, and 3-5 values with behavioral descriptions
- [ ] Section 2: Org chart with hierarchical structure + headcount growth chart renders
- [ ] Section 3: 4+ department processes with specific timing/owners/SLAs
- [ ] Section 4: 8+ meeting types across daily/weekly/bi-weekly/monthly/quarterly
- [ ] Section 5: 6+ Slack channels + 3 SLA response time tiers
- [ ] Section 6: 3 OKRs with 2-3 measurable key results each
- [ ] Section 7: 10-15 tools with icons, names, and use cases
- [ ] Section 8: 5-stage onboarding timeline (Pre-Day 1 through Day 30)
- [ ] Section 9: 6 rituals spanning daily to annual cadences
- [ ] Section 10: 6 prioritized next steps with timing

### Chart.js Verification
- [ ] `headcountChart` renders bar chart with growth timeline
- [ ] Labels array: `['Current', 'Q1', 'Q2', 'Q3', 'Q4']` (or similar)
- [ ] Data values show realistic growth trajectory
- [ ] Chart.js v4.4.0 CDN loads correctly

### Visual Quality
- [ ] Dark theme consistent (bg: #0a0a0a, cards: #1a1a1a, accent: #10b981)
- [ ] All sections have numbered headers (1-10)
- [ ] Responsive layout works on mobile (test 640px width)
- [ ] No horizontal scrolling on any device
- [ ] Footer displays "StratArts" branding

### Final Validation
- [ ] HTML file opens correctly in browser
- [ ] No JavaScript console errors
- [ ] Chart renders with correct data
- [ ] All links functional (if any)
- [ ] Print preview acceptable

**Reference Implementation**: `skills/fundraising-operations/operational-playbook-creator/test-template-output.html`

---

**End of Skill**
