---
name: fundraising-strategy-planner
description: Create comprehensive fundraising playbook covering timeline, investor targeting, outreach cadence, meeting progression, due diligence preparation, term sheet negotiation, and closing process. Run disciplined fundraising that maximizes leverage and closes on favorable terms.
version: 1.0.0
category: fundraising-operations
---

# fundraising-strategy-planner

**Mission**: Create a comprehensive fundraising strategy covering timeline, investor targeting, outreach cadence, meeting progression, due diligence, negotiation, and closing. Run a disciplined fundraising process that maximizes leverage, minimizes distraction, and closes your round on favorable terms.

---

## STEP 0: Pre-Generation Verification

Before generating HTML output, verify all placeholders are populated:

### Score Banner Placeholders
- [ ] `{{COMPANY_NAME}}` - Company name
- [ ] `{{ROUND_NAME}}` - Round type (Pre-Seed/Seed/Series A)
- [ ] `{{TIMESTAMP}}` - Generation timestamp
- [ ] `{{RAISE_AMOUNT}}` - Target raise amount (e.g., "$2.5M")
- [ ] `{{VALUATION}}` - Post-money valuation (e.g., "$12M")
- [ ] `{{TIMELINE_MONTHS}}` - Fundraising timeline (e.g., "5 mo")
- [ ] `{{TOTAL_INVESTORS}}` - Target investor count (e.g., "100")
- [ ] `{{TERM_SHEET_TARGET}}` - Term sheet goal (e.g., "2-3")
- [ ] `{{RUNWAY_MONTHS}}` - Current runway (e.g., "8 mo")

### Content Section Placeholders
- [ ] `{{EXECUTIVE_SUMMARY}}` - 4 exec cards (goals, traction, profile, outcomes)
- [ ] `{{TIMELINE_PHASES}}` - 4 timeline phase blocks with items
- [ ] `{{INVESTOR_TIERS}}` - 3 tier cards (Tier 1/2/3 counts and descriptions)
- [ ] `{{OUTREACH_STRATEGIES}}` - 2 outreach cards (warm intros, cold outreach)
- [ ] `{{FUNNEL_STAGES}}` - 6 funnel stages with counts and conversion rates
- [ ] `{{MEETING_STAGES}}` - 5 meeting stage items (intro → closing)
- [ ] `{{DATAROOM_CATEGORIES}}` - 4 data room category checklists
- [ ] `{{TERM_SHEET_TERMS}}` - 6 term sheet term cards
- [ ] `{{CLOSING_WEEKS}}` - 5 closing week items
- [ ] `{{DISCIPLINE_METRICS}}` - 4 discipline metric cards
- [ ] `{{NEXT_STEPS}}` - 6 prioritized next step items

### Chart Data Placeholders
- [ ] `{{TIMELINE_LABELS}}` - JSON array of phase names
- [ ] `{{TIMELINE_DATA}}` - JSON array of week durations
- [ ] `{{TIER_DATA}}` - JSON array [tier1, tier2, tier3] counts
- [ ] `{{FUNNEL_LABELS}}` - JSON array of funnel stage names
- [ ] `{{FUNNEL_DATA}}` - JSON array of funnel counts

---

## STEP 1: Detect Previous Context

### Ideal Context (All Present):
- **investor-pitch-deck-builder** → Pitch deck, fundraising amount, use of funds
- **investor-brief-writer** → One-pager, cold email templates, distribution strategy
- **financial-model-architect** → Financial projections, burn rate, runway
- **metrics-dashboard-designer** → Current traction metrics

### Partial Context (Some Present):
- **investor-pitch-deck-builder** → Fundraising ask and materials available
- **financial-model-architect** → Runway and cash flow projections available

### No Context:
- None of the above skills were run

---

## STEP 2: Context-Adaptive Introduction

### If Ideal Context:
> I found outputs from **investor-pitch-deck-builder**, **investor-brief-writer**, **financial-model-architect**, and **metrics-dashboard-designer**.
>
> I can reuse:
> - **Fundraising ask** (raising: [$X], round: [seed/Series A])
> - **Investor materials** (pitch deck, one-pager, cold email templates)
> - **Runway** ([X months] until you need capital)
> - **Traction metrics** (MRR: [$X], growth: [Y% MoM])
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
> I'll guide you through building your fundraising strategy from the ground up.

---

## STEP 3: Questions (One at a Time, Sequential)

### Fundraising Goals & Timeline

**Question FG1: What are your fundraising goals?**

**Fundraising Parameters**:
- **Amount Raising**: [e.g., "$2.5M"]
- **Round**: [Pre-Seed / Seed / Series A / Series B]
- **Valuation** (if applicable): [e.g., "$10M post-money valuation" or "Pricing round"]
- **Instrument**: [Priced equity / SAFE / Convertible note]

**Why this amount?**:
- [e.g., "18-24 months runway to hit Series A milestones: $5M ARR, 1,000 customers"]

**Your Fundraising Goals**:
- Amount: [$X]
- Round: [Stage]
- Valuation: [$Y post-money] or [Priced/SAFE/Note]
- Why: [Runway, milestones]

---

**Question FG2: What is your fundraising timeline?**

**Fundraising Timeline** (typical process: 3-6 months):

**Month 1: Preparation**
- Finalize pitch deck, one-pager, financial model
- Build investor target list (50-100 names)
- Secure warm intros from network
- Set fundraising launch date

**Month 2-3: Initial Outreach & Meetings**
- Send 10-20 outreach emails per week (warm intros + cold)
- Hold 20-30 intro meetings (15-30 minutes)
- Identify 5-10 interested investors for partner meetings

**Month 3-4: Partner Meetings & Due Diligence**
- Hold 5-10 partner meetings (full partnership)
- Share data room (financials, metrics, customer references)
- Investor calls with customers, team members
- Back-channel reference checks

**Month 4-5: Term Sheets & Negotiation**
- Receive 2-3 term sheets (ideally)
- Negotiate terms (valuation, board seats, pro-rata rights, etc.)
- Select lead investor
- Finalize legal documents

**Month 5-6: Closing**
- Legal due diligence (contracts, IP, employment agreements)
- Sign final documents
- Wire transfer
- Announce fundraise (press release, social media)

**Your Timeline** (adjust based on urgency):
- Start Date: [e.g., "January 1, 2025"]
- Target Close Date: [e.g., "June 30, 2025"]
- Total Duration: [e.g., "6 months"]

**Timeline Constraints**:
- Current Runway: [X months]
- Minimum Timeline (if urgent): [e.g., "3 months"]
- Maximum Timeline (if have runway): [e.g., "9 months"]

---

### Investor Targeting

**Question IT1: What is your ideal investor profile?**

**Investor Criteria**:

### 1. Stage Fit
- **Pre-Seed**: $100K-$500K checks, idea to MVP
- **Seed**: $500K-$2M checks, product-market fit to early traction
- **Series A**: $2M-$10M checks, scaling traction
- **Series B+**: $10M+ checks, mature business

**Your Stage**: [e.g., "Seed — looking for $500K-$1M checks"]

### 2. Sector Focus
- ☐ **Vertical SaaS** (industry-specific software)
- ☐ **Horizontal SaaS** (cross-industry tools)
- ☐ **B2B Marketplace**
- ☐ **Consumer / B2C**
- ☐ **Fintech**
- ☐ **Healthcare**
- ☐ **Infrastructure / Dev Tools**
- ☐ **Other**: [specify]

**Your Sector**: [e.g., "Vertical SaaS — construction tech"]

### 3. Geography
- ☐ **U.S. (Nationwide)**
- ☐ **Silicon Valley / SF Bay Area**
- ☐ **New York**
- ☐ **Los Angeles**
- ☐ **Boston**
- ☐ **Other U.S. Regions**
- ☐ **International** (Europe, Asia, etc.)

**Your Geography**: [e.g., "U.S. (Nationwide), preference for Silicon Valley funds"]

### 4. Portfolio Fit
- Do they have relevant portfolio companies? (good for intros, synergies)
- Do they have competitors in portfolio? (potential conflict)

**Your Portfolio Preferences**: [e.g., "Prefer funds with B2B SaaS portfolio, avoid funds with direct construction competitors"]

---

**Question IT2: How will you build your investor target list?**

**Investor Research Sources**:

### 1. AngelList
- Search by stage, sector, geography
- See portfolio, recent investments, team

### 2. Crunchbase
- Track recent investments in your sector
- Find investors who led similar rounds

### 3. LinkedIn
- Find investors via mutual connections
- See warm intro paths

### 4. Fund Websites
- Review investment thesis, portfolio, team
- Find partner focus areas (e.g., "Jane Doe focuses on fintech, John Smith focuses on SaaS")

### 5. Referrals from Network
- Ask advisors, other founders, employees for intros

**Target List Size**:
- **Tier 1** (Best fit): 20 investors — prioritize warm intros
- **Tier 2** (Good fit): 30 investors — mix of warm and cold
- **Tier 3** (Possible fit): 50 investors — cold outreach

**Total**: 100 investors

**Your Investor List Building Process**:
- Sources: [e.g., "AngelList, Crunchbase, LinkedIn, advisor referrals"]
- List Size: [e.g., "100 investors — 20 Tier 1, 30 Tier 2, 50 Tier 3"]

---

### Outreach Strategy

**Question OS1: How will you prioritize warm intros vs. cold outreach?**

**Warm Intro Strategy**:

**Warm Intro = Introduction from mutual connection** (advisor, investor, founder, employee)

**Why warm intros win**:
- **10x higher response rate** (50-70% vs. 5-10% for cold)
- **Faster process** (skip intro meeting, go straight to partner meeting)
- **Higher close rate** (mutual connection vouches for you)

**How to get warm intros**:
1. **Map your network**: List advisors, investors, founders, employees, customers
2. **Cross-reference with target investors**: Which investors do your network connections know?
3. **Request intros**: Email mutual connection with investor brief, ask for intro

**Example Intro Request Email**:
```
Subject: Intro to [Investor Name]?

Hi [Mutual Connection],

Hope you're well! We're raising a $2.5M seed round for [Company] and I saw that you know [Investor Name] at [Fund].

I'd love an intro if you think we'd be a good fit. Here's our one-pager (attached) — we're at $50K MRR, 20% MoM growth, and building [one-sentence pitch].

Let me know if you're comfortable making an intro!

Thanks,
[Your Name]
```

**Your Warm Intro Strategy**:
- Network Connections: [e.g., "10 advisors, 5 investors, 20 founders"]
- Target: [e.g., "Get warm intros to 15-20 Tier 1 investors"]

---

**Question OS2: What is your cold outreach strategy?**

**Cold Outreach Strategy**:

**Cold Outreach = Direct email to investor** (no mutual connection)

**When to use cold outreach**:
- After exhausting warm intro paths
- For Tier 2 and Tier 3 investors
- For speed (warm intros can take 2-4 weeks)

**Cold Email Best Practices**:
1. **Personalize**: Reference their portfolio, recent investment, or sector focus
2. **Lead with traction**: Put strongest metric in subject line and first sentence
3. **Be concise**: 200-300 words max
4. **Clear ask**: Request 15-minute intro call, not investment

**Cold Outreach Cadence**:
- **Email 1**: Initial outreach (Day 0)
- **Email 2**: Follow-up (Day 5-7) — "Just bumping this up in your inbox"
- **Email 3**: Final follow-up (Day 10-14) — "Last email — is this a fit?"

**Response Rates**:
- Email 1: 5-10% response rate
- Email 2: +2-3% response rate
- Email 3: +1-2% response rate
- **Total**: 8-15% response rate

**Your Cold Outreach Strategy**:
- Target: [e.g., "Send 10-20 cold emails per week to Tier 2 and Tier 3 investors"]
- Follow-up: [e.g., "3 emails spaced 5-7 days apart"]

---

### Meeting Progression

**Question MP1: How will you structure your fundraising funnel?**

**Fundraising Funnel**:

| Stage                  | # of Investors | Conversion Rate | Next Stage            |
|------------------------|----------------|-----------------|-----------------------|
| **Outreach**           | 100            | —               | —                     |
| **Intro Meeting**      | 30             | 30%             | 30% move to partner   |
| **Partner Meeting**    | 10             | 33%             | 50% move to DD        |
| **Due Diligence**      | 5              | 50%             | 60% give term sheet   |
| **Term Sheet**         | 3              | 60%             | Close 1-2 investors   |
| **Closed**             | 2              | 67%             | —                     |

**Your Funnel** (adjust based on round and stage):
- Outreach: [100 investors]
- Intro Meetings: [30 meetings]
- Partner Meetings: [10 meetings]
- Due Diligence: [5 investors]
- Term Sheets: [2-3 term sheets]
- Close: [1-2 investors — lead + follow-on]

---

**Question MP2: What happens at each meeting stage?**

### Stage 1: Intro Meeting (15-30 minutes)
**Who attends**: You + 1 partner from the fund
**Goal**: Gauge interest, pitch company, get to partner meeting
**What you present**: Pitch deck (condensed to 10-15 minutes)
**What they ask**: Market size, traction, competitive landscape, team
**Success**: Partner says "Let's schedule a partner meeting"

### Stage 2: Partner Meeting (45-60 minutes)
**Who attends**: You + full partnership (3-6 partners)
**Goal**: Deep dive into business, build conviction, get to due diligence
**What you present**: Full pitch deck (20-30 minutes) + Q&A
**What they ask**: Unit economics, retention, roadmap, hiring plan, fundraising history
**Success**: Partners say "We'd like to move forward with due diligence"

### Stage 3: Due Diligence (1-2 weeks)
**Who attends**: You + investor team + various stakeholders
**Goal**: Validate claims, assess risks, build conviction to give term sheet
**What they do**:
- Review data room (financials, metrics, contracts, cap table)
- Customer reference calls (talk to 3-5 customers)
- Back-channel references (talk to people you've worked with)
- Technical due diligence (for technical products)
**Success**: Investor gives term sheet

### Stage 4: Term Sheet & Negotiation (1-2 weeks)
**Who attends**: You + investor + lawyers
**Goal**: Negotiate terms, finalize deal
**What you negotiate**: Valuation, board seats, pro-rata rights, liquidation preference, drag-along rights
**Success**: Sign term sheet

### Stage 5: Closing (2-4 weeks)
**Who attends**: You + investor + lawyers
**Goal**: Legal due diligence, finalize documents, wire funds
**What happens**: Legal review of contracts, IP, employment agreements, final signatures, wire transfer
**Success**: Money in bank

---

### Due Diligence Preparation

**Question DD1: What materials will you prepare for due diligence?**

**Data Room Contents**:

### 1. Financial Documents
- ☐ **Financial Model** (3-5 year projections)
- ☐ **Historical Financials** (P&L, cash flow, balance sheet — last 2-3 years)
- ☐ **Cap Table** (current ownership, option pool, vesting schedule)
- ☐ **Budget** (current year spend plan)
- ☐ **Bank Statements** (last 3-6 months)

### 2. Metrics & KPIs
- ☐ **Metrics Dashboard** (MRR, customers, churn, CAC, LTV, retention)
- ☐ **Cohort Analysis** (retention by cohort, NRR)
- ☐ **Unit Economics** (CAC, LTV, LTV:CAC, payback period)

### 3. Customer & Product
- ☐ **Customer List** (top 20 customers by revenue)
- ☐ **Customer References** (5-10 referenceable customers)
- ☐ **Product Roadmap** (next 12 months)
- ☐ **Product Demo** (video or live demo access)

### 4. Legal & Compliance
- ☐ **Incorporation Documents** (certificate of incorporation, bylaws)
- ☐ **Contracts** (customer contracts, vendor contracts, partnership agreements)
- ☐ **IP** (patents, trademarks, IP assignment agreements)
- ☐ **Employment Agreements** (all employees, offer letters, NDAs)
- ☐ **Board Meeting Minutes** (last 12 months)

### 5. Team & Organization
- ☐ **Org Chart** (current team structure)
- ☐ **Team Bios** (extended backgrounds, LinkedIn profiles)
- ☐ **Hiring Plan** (next 12 months, by role)

**Your Data Room** (check all that apply):
- [Financial documents]
- [Metrics & KPIs]
- [Customer & product]
- [Legal & compliance]
- [Team & organization]

**Data Room Tool**:
- ☐ **Google Drive** (folder with view-only access)
- ☐ **Dropbox**
- ☐ **DocSend** (track who viewed what, expiring links)
- ☐ **Notion** (organized database)

**Your Tool**: [Choose one]

---

**Question DD2: How will you prepare customer references?**

**Customer Reference Process**:

### Step 1: Identify Referenceable Customers (5-10)
- Choose happy customers (NPS 9-10, long-term users, high engagement)
- Mix of company sizes, use cases, industries
- Avoid at-risk or churned customers

### Step 2: Request Permission
- Email: "Hi [Customer], we're raising a round and investors may want to speak with references. Would you be open to a 15-minute call if asked?"
- Offer incentive (e.g., "We'll give you early access to [new feature]")

### Step 3: Prep Customer
- Share investor questions in advance (see below)
- Brief call to align on talking points

### Step 4: Provide to Investors
- Give investor list of 5-10 references (name, title, company, email)
- Investor picks 3-5 to call

**Common Investor Questions for Customer References**:
1. How did you find [Company]?
2. What problem does [Company] solve for you?
3. How often do you use [Product]?
4. What would you do if [Company] didn't exist?
5. Have you recommended [Company] to others?
6. What's one thing [Company] could improve?
7. On a scale of 1-10, how likely are you to renew?

**Your Customer Reference Plan**:
- # of References: [e.g., "10 referenceable customers"]
- How to Prep: [e.g., "Email + 15-minute prep call"]

---

### Negotiation Strategy

**Question NS1: What terms will you negotiate?**

**Key Term Sheet Terms**:

### 1. Valuation
- **Pre-money valuation**: Company value before investment
- **Post-money valuation**: Company value after investment
- **Formula**: Post-money = Pre-money + Investment Amount
- **Example**: $7.5M pre-money + $2.5M investment = $10M post-money
- **Your ownership**: Investment / Post-money = 2.5M / 10M = 25% to investors

**Your Valuation**:
- Pre-money: [$X]
- Investment: [$Y]
- Post-money: [$Z]
- Investor Ownership: [X%]

### 2. Board Composition
- Typical seed: 3-person board (1 founder, 1 investor, 1 independent)
- Typical Series A: 5-person board (2 founders, 2 investors, 1 independent)

**Your Board**:
- Current: [e.g., "2 founders"]
- Post-Round: [e.g., "3 people — 2 founders + 1 investor seat"]

### 3. Pro-Rata Rights
- **Pro-rata right**: Investor can invest in future rounds to maintain ownership %
- **Why investors want it**: Protect against dilution in hot companies
- **Why founders accept it**: Standard, helps with follow-on funding

### 4. Liquidation Preference
- **1x non-participating** (standard, founder-friendly): Investors get 1x their money back, then common shareholders split the rest
- **1x participating** (investor-friendly): Investors get 1x back PLUS their % of remaining proceeds
- **2x or higher** (highly investor-friendly, avoid): Investors get 2x+ their money back

**Your Liquidation Preference**: [e.g., "1x non-participating (standard)"]

### 5. Option Pool
- **Option pool**: Shares reserved for future employee stock options
- Typically 10-20% of post-money cap table
- **Pre-money option pool**: Created before investment (dilutes founders only)
- **Post-money option pool**: Created after investment (dilutes everyone)

**Your Option Pool**:
- Size: [e.g., "15% of post-money cap table"]
- Timing: [Pre-money or Post-money]

---

**Question NS2: How will you handle multiple term sheets?**

**Term Sheet Negotiation Strategy**:

### Scenario 1: Zero Term Sheets (Tough Position)
- **What to do**: Lower valuation, increase outreach, improve traction
- **Timeline**: Extend fundraising process, cut burn to extend runway

### Scenario 2: One Term Sheet (Weak Leverage)
- **What to do**: Negotiate politely but firmly (focus on valuation, board seat, option pool)
- **Timeline**: Accelerate process, but don't rush into bad terms

### Scenario 3: Multiple Term Sheets (Strong Leverage)
- **What to do**: Create urgency, negotiate best terms, pick best partner (not just highest valuation)
- **Timeline**: Set deadline (e.g., "We're deciding by Friday"), move fast

**How to Pick Lead Investor** (if multiple term sheets):
1. **Brand/Reputation**: Top-tier fund (Sequoia, a16z, Accel) vs. emerging fund?
2. **Value-Add**: Network, recruiting, follow-on capital, domain expertise?
3. **Founder-Friendly**: Reputation with other founders (ask back-channels)
4. **Terms**: Valuation, board seat, liquidation preference, option pool
5. **Chemistry**: Do you trust this person? Will they support you in hard times?

**Your Term Sheet Strategy** (if multiple):
- How to evaluate: [e.g., "Prioritize value-add and chemistry over valuation"]
- How to decide: [e.g., "Pick top 2, final call with both partners, decide by Friday"]

---

### Closing the Round

**Question CR1: What is your closing checklist?**

**Closing Checklist** (2-4 weeks):

### Week 1: Term Sheet Signed
- ☐ Sign term sheet with lead investor
- ☐ Announce lead investor (if public)
- ☐ Close other investors (follow-on checks)

### Week 2: Legal Due Diligence
- ☐ Investor lawyers review all contracts, IP, employment agreements
- ☐ Address any legal issues (clean up cap table, update contracts, etc.)

### Week 3: Document Drafting
- ☐ Draft Stock Purchase Agreement (SPA)
- ☐ Draft Investor Rights Agreement
- ☐ Draft Voting Agreement
- ☐ Draft Right of First Refusal (ROFR) Agreement

### Week 4: Signatures & Wiring
- ☐ All parties sign final documents
- ☐ Investor wires funds
- ☐ Issue new stock certificates
- ☐ Update cap table

### Post-Close:
- ☐ Announce fundraise (press release, blog post, social media)
- ☐ Thank all investors who participated
- ☐ Send update to investors who passed (maintain relationship)

**Your Closing Timeline**: [e.g., "4 weeks from term sheet to close"]

---

### Fundraising Discipline

**Question FD1: How will you stay disciplined during fundraising?**

**Fundraising Discipline Principles**:

### 1. Set a Deadline
- Don't let fundraising drag on for 9-12 months
- Set hard deadline: [e.g., "Fundraise must close by June 30 or we cut burn and focus on traction"]

### 2. Limit CEO Time
- **Max 50% of CEO time** on fundraising (rest on product, customers, team)
- Delegate investor meetings to co-founder when possible

### 3. Batch Investor Meetings
- Don't take meetings one-by-one over 6 months
- **Compress meetings into 4-6 weeks** (creates urgency, FOMO)

### 4. Track Everything
- Use CRM to track every investor, meeting, status, next step
- Review funnel weekly: How many intro meetings → partner meetings → term sheets?

### 5. Have a Plan B
- What if fundraising fails? Cut burn? Bridge round? Revenue-based financing?

**Your Discipline Plan**:
- Deadline: [e.g., "Close by June 30 or pivot to Plan B"]
- CEO Time Limit: [e.g., "Max 50% of time on fundraising"]
- Meeting Batching: [e.g., "Compress all meetings into 6-week window"]
- Plan B: [e.g., "Cut burn by 30%, extend runway to 18 months, try again in 6 months"]

---

### Implementation Roadmap

**Question IR1: What is your 90-day fundraising execution plan?**

### Month 1: Preparation (Weeks 1-4)
- **Week 1**: Finalize pitch deck, one-pager, financial model
- **Week 2**: Build investor target list (100 investors, prioritize Tier 1)
- **Week 3**: Secure 10-15 warm intros from network
- **Week 4**: Prepare data room, customer references
- **Goal**: Ready to launch outreach Week 5

### Month 2: Initial Outreach (Weeks 5-8)
- **Week 5**: Send 15 warm intro requests + 10 cold emails
- **Week 6**: Hold 10-15 intro meetings
- **Week 7**: Send 15 more outreach emails, hold 10-15 more intro meetings
- **Week 8**: Follow up with all intro meetings, identify 5-10 partner meetings
- **Goal**: 20-30 intro meetings, 5-10 partner meetings scheduled

### Month 3: Partner Meetings & Due Diligence (Weeks 9-12)
- **Week 9-10**: Hold 5-10 partner meetings
- **Week 11**: 2-3 investors move to due diligence, share data room
- **Week 12**: Investor customer calls, back-channel references
- **Goal**: 2-3 term sheets by end of Week 12

### Month 4: Term Sheet & Closing (Weeks 13-16)
- **Week 13**: Receive 2-3 term sheets, evaluate and negotiate
- **Week 14**: Select lead investor, sign term sheet
- **Week 15-16**: Legal due diligence, document drafting, signatures
- **Goal**: Close round, announce fundraise

---

## STEP 4: Generate Comprehensive Fundraising Strategy

**You will now receive a comprehensive document covering**:

### Section 1: Executive Summary
- Fundraising goals (amount, round, valuation, timeline)
- Investor targeting (50-100 investors, prioritized by tier)
- Outreach strategy (warm intros, cold outreach, cadence)
- Expected funnel (100 outreach → 30 intro meetings → 10 partner meetings → 5 DD → 3 term sheets → close)

### Section 2: Timeline & Milestones
- Month 1: Preparation (materials, target list, warm intros, data room)
- Month 2: Initial outreach (20-30 intro meetings)
- Month 3: Partner meetings & due diligence (5-10 partner meetings, 2-3 DD)
- Month 4: Term sheet & closing (negotiate, sign, close)

### Section 3: Investor Targeting
- Ideal investor profile (stage, sector, geography, portfolio fit)
- Investor research sources (AngelList, Crunchbase, LinkedIn, fund websites, network)
- Target list (100 investors: 20 Tier 1, 30 Tier 2, 50 Tier 3)

### Section 4: Outreach Strategy
- Warm intro strategy (map network, request intros, 50-70% response rate)
- Cold outreach strategy (10-20 emails/week, 3 follow-ups, 8-15% response rate)
- Email templates (intro request, cold email, follow-ups)

### Section 5: Meeting Progression
- Intro meeting (15-30 min, gauge interest)
- Partner meeting (45-60 min, deep dive)
- Due diligence (1-2 weeks, data room, customer calls, references)
- Term sheet (negotiate terms)
- Closing (legal DD, signatures, wire)

### Section 6: Due Diligence Preparation
- Data room contents (financials, metrics, customers, legal, team)
- Data room tool (Google Drive, DocSend, Notion)
- Customer references (5-10 referenceable customers, prep process)

### Section 7: Negotiation Strategy
- Key terms (valuation, board, pro-rata, liquidation preference, option pool)
- How to handle zero, one, or multiple term sheets
- How to pick lead investor (brand, value-add, chemistry, terms)

### Section 8: Closing Checklist
- Week 1: Sign term sheet
- Week 2: Legal due diligence
- Week 3: Document drafting
- Week 4: Signatures & wiring
- Post-close: Announce fundraise

### Section 9: Fundraising Discipline
- Set deadline (don't let fundraising drag on)
- Limit CEO time (max 50% on fundraising)
- Batch investor meetings (compress into 4-6 weeks)
- Track everything (CRM, weekly funnel review)
- Plan B (if fundraising fails)

### Section 10: Next Steps
- Finalize investor target list this week
- Request warm intros next week
- Launch outreach in Week 3
- Track progress weekly

---

## STEP 5: Quality Review & Iteration

After generating the strategy, I will ask:

**Quality Check**:
1. Is the timeline realistic (3-6 months)?
2. Is the target list large enough (100 investors)?
3. Is the outreach strategy balanced (warm intros > cold)?
4. Is the funnel realistic (30% intro → partner conversion)?
5. Is the due diligence prep complete (data room, customer references)?
6. Is the negotiation strategy clear (how to handle multiple term sheets)?

**Iterate?** [Yes — refine X / No — finalize]

---

## STEP 6: Save & Next Steps

Once finalized, I will:
1. **Save** the fundraising strategy to your project folder
2. **Suggest** building investor target list this week
3. **Remind** you to set a hard deadline and stick to it

---

## 8 Critical Guidelines for This Skill

1. **Warm intros > cold outreach**: 10x higher response rate. Exhaust your network before going cold.

2. **Batch investor meetings**: Compress all meetings into 4-6 weeks to create urgency and FOMO.

3. **Always be closing**: Don't let fundraising drag on for 9+ months. Set a hard deadline and stick to it.

4. **Expect 3-5% conversion**: 100 outreach → 30 intro meetings → 10 partner meetings → 3 term sheets → close 1-2 investors.

5. **Prepare for due diligence**: Have data room and customer references ready before first meeting.

6. **Multiple term sheets = leverage**: Aim for 2-3 term sheets to negotiate best terms and pick best partner.

7. **Value-add > valuation**: Pick investor for network, expertise, and chemistry, not just highest valuation.

8. **Limit CEO time**: Max 50% of CEO time on fundraising. Rest on product, customers, and team.

---

## Quality Checklist (Before Finalizing)

- [ ] Fundraising goals are clear (amount, round, valuation, timeline)
- [ ] Investor target list has 100 investors (20 Tier 1, 30 Tier 2, 50 Tier 3)
- [ ] Warm intro strategy is defined (map network, request intros)
- [ ] Cold outreach strategy is defined (10-20 emails/week, 3 follow-ups)
- [ ] Meeting progression is clear (intro → partner → DD → term sheet → close)
- [ ] Data room is prepared (financials, metrics, customers, legal, team)
- [ ] Customer references are identified (5-10 referenceable customers)
- [ ] Negotiation strategy is defined (how to handle multiple term sheets)
- [ ] Closing checklist is complete (4-week timeline)
- [ ] Fundraising discipline is established (deadline, CEO time limit, batching, Plan B)

---

## Integration with Other Skills

**Upstream Skills** (reuse data from):
- **investor-pitch-deck-builder** → Pitch deck, fundraising amount, use of funds, milestones
- **investor-brief-writer** → One-pager, cold email templates, distribution strategy
- **financial-model-architect** → Financial projections, burn rate, runway, cash flow
- **metrics-dashboard-designer** → Traction metrics (MRR, growth rate, customers, retention)

**Downstream Skills** (use this data in):
- **operational-playbook-creator** → Post-fundraise execution plan (hiring, product roadmap, GTM scaling)

---

## HTML Editorial Template Reference

**CRITICAL**: When generating HTML output, you MUST read and follow the skeleton template files AND the verification checklist to maintain StratArts brand consistency.

### Template Files to Read (IN ORDER)

1. **Verification Checklist** (MUST READ FIRST):
   ```
   html-templates/VERIFICATION-CHECKLIST.md
   ```

2. **Base Template** (shared structure):
   ```
   html-templates/base-template.html
   ```

3. **Skill-Specific Template** (content sections & charts):
   ```
   html-templates/fundraising-strategy-planner.html
   ```

### How to Use Templates

1. Read `VERIFICATION-CHECKLIST.md` first - contains canonical CSS patterns that MUST be copied exactly
2. Read `base-template.html` - contains all shared CSS, layout structure, and Chart.js configuration
3. Read `fundraising-strategy-planner.html` - contains skill-specific content sections, CSS extensions, and chart scripts
4. Replace all `{{PLACEHOLDER}}` markers with actual analysis data
5. Merge the skill-specific CSS into `{{SKILL_SPECIFIC_CSS}}`
6. Merge the content sections into `{{CONTENT_SECTIONS}}`
7. Merge the chart scripts into `{{CHART_SCRIPTS}}`

---

## HTML Output Verification

Before delivering the HTML report, verify:

### Structure Verification
- [ ] Header follows canonical StratArts pattern with skill name and timestamp
- [ ] Score banner displays 6 key metrics (Raise Amount, Valuation, Timeline, Investors, Term Sheet Goal, Runway)
- [ ] All 11 sections present with proper content
- [ ] Footer includes StratArts branding and regeneration guidance

### Chart Verification (3 Charts Required)
- [ ] **Timeline Gantt Chart** (Horizontal Bar) - Phase durations in weeks
- [ ] **Investor Tier Chart** (Doughnut) - Tier 1/2/3 distribution
- [ ] **Funnel Chart** (Horizontal Bar) - Outreach → Closed conversion

### Content Verification
- [ ] Executive summary covers goals, traction, investor profile, expected outcomes
- [ ] Timeline shows 4 phases (preparation, outreach, DD, closing)
- [ ] Investor tiers total 100 investors (20 Tier 1 + 30 Tier 2 + 50 Tier 3)
- [ ] Outreach strategy covers both warm intros and cold outreach with response rates
- [ ] Funnel shows realistic conversion rates (30% intro, 33% partner, 50% DD, 60% term sheet)
- [ ] Meeting stages cover all 5 phases (intro → partner → DD → term sheet → closing)
- [ ] Data room checklist has 4 categories with 5 items each
- [ ] Term sheet terms include valuation, board, liquidation, option pool, pro-rata
- [ ] Closing checklist covers 4 weeks + post-close
- [ ] Discipline metrics include deadline, CEO time limit, meeting window, Plan B

### Visual Verification
- [ ] Dark theme applied (#0a0a0a background, #1a1a1a containers)
- [ ] Emerald accent (#10b981) used consistently
- [ ] Tier colors correct (Tier 1: emerald, Tier 2: amber, Tier 3: gray)
- [ ] Charts render correctly with Chart.js v4.4.0
- [ ] Timeline phases have proper arrow connectors

---

**End of Skill**
