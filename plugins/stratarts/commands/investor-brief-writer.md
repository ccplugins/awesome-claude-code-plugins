---
name: investor-brief-writer
description: Create compelling investor one-pagers and email briefs that capture attention and get meetings. Distill your pitch into scannable, high-impact documents with traction-focused cold emails and distribution strategy.
version: 1.0.0
category: fundraising-operations
---

# investor-brief-writer

**Mission**: Create a compelling investor brief (one-pager or executive summary) that captures attention, communicates your opportunity concisely, and gets investors to take a meeting. Distill your pitch deck into a scannable, high-impact document for email outreach and follow-ups.

---

## STEP 0: Pre-Generation Verification

Before generating HTML output, verify all placeholders are populated:

### Score Banner Placeholders
- [ ] `{{COMPANY_NAME}}` - Company name
- [ ] `{{ROUND_NAME}}` - Round type (Pre-Seed/Seed/Series A)
- [ ] `{{TIMESTAMP}}` - Generation timestamp
- [ ] `{{RAISE_AMOUNT}}` - Target raise amount (e.g., "$2.5M")
- [ ] `{{MRR}}` - Current MRR (e.g., "$85K")
- [ ] `{{GROWTH_RATE}}` - MoM growth rate (e.g., "22%")
- [ ] `{{CUSTOMERS}}` - Customer count (e.g., "156")
- [ ] `{{TAM}}` - Total addressable market (e.g., "$47B")
- [ ] `{{TARGET_INVESTORS}}` - Target investor count (e.g., "100")

### Content Section Placeholders
- [ ] `{{EXEC_SUMMARY_CARDS}}` - 4 exec summary cards (format, audience, distribution, differentiators)
- [ ] `{{TAGLINE}}` - Company tagline (1 line)
- [ ] `{{CONTACT_INFO}}` - Contact information (email, website, location)
- [ ] `{{ONEPAGER_SECTIONS}}` - 6-8 one-pager sections (problem, solution, market, advantage, traction, ask)
- [ ] `{{TRACTION_CARDS}}` - 4 traction metric cards with growth indicators
- [ ] `{{TEAM_CARDS}}` - 3 team member cards (name, title, bio)
- [ ] `{{EMAIL_SUBJECT}}` - Cold email subject line
- [ ] `{{EMAIL_BODY}}` - Cold email body (4 paragraphs)
- [ ] `{{EMAIL_TEMPLATES}}` - 3 email templates (warm intro, follow-up, post-meeting)
- [ ] `{{DISTRIBUTION_CARDS}}` - 3 distribution strategy cards
- [ ] `{{INVESTOR_ROWS}}` - 5-10 investor table rows
- [ ] `{{NEXT_STEPS}}` - 6 prioritized next step items

### Chart Data Placeholders
- [ ] `{{REVENUE_LABELS}}` - JSON array of month labels
- [ ] `{{REVENUE_DATA}}` - JSON array of MRR values

---

## STEP 1: Detect Previous Context

### Ideal Context (All Present):
- **investor-pitch-deck-builder** → Full pitch deck content (problem, solution, market, traction, team, ask)
- **problem-validation-study** → Problem statement, customer pain points
- **metrics-dashboard-designer** → Traction metrics (MRR, growth rate, customers)
- **financial-model-architect** → Financial projections, unit economics

### Partial Context (Some Present):
- **investor-pitch-deck-builder** → Pitch deck available
- **metrics-dashboard-designer** → Traction data available

### No Context:
- None of the above skills were run

---

## STEP 2: Context-Adaptive Introduction

### If Ideal Context:
> I found outputs from **investor-pitch-deck-builder**, **problem-validation-study**, **metrics-dashboard-designer**, and **financial-model-architect**.
>
> I can reuse:
> - **Pitch deck content** (problem, solution, market, traction, team, ask)
> - **Problem statement** ([X])
> - **Traction metrics** (MRR: [$X], growth: [Y% MoM], customers: [Z])
> - **Financial projections** (ARR forecast, unit economics)
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
> I'll guide you through writing your investor brief from the ground up.

---

## STEP 3: Questions (One at a Time, Sequential)

### Brief Format & Purpose

**Question BF1: What format will your investor brief take?**

**Format Options**:

### 1. One-Pager (Most Common)
- **Length**: 1 page (front only or front + back)
- **Use Case**: Email attachment, warm intros, quick reference after meetings
- **Sections**: Company overview, problem, solution, traction, team, ask (condensed to fit one page)

### 2. Executive Summary (2-3 Pages)
- **Length**: 2-3 pages
- **Use Case**: Detailed follow-up after initial meeting, due diligence prep
- **Sections**: Same as one-pager but with more detail, charts, and supporting data

### 3. Email Brief (Email Body)
- **Length**: 200-300 words (fits in email body without scrolling)
- **Use Case**: Cold outreach, warm intros (no attachment, just email text)
- **Sections**: Problem, solution, traction, ask (ultra-condensed)

**Your Format**: [Choose one — e.g., "One-pager for email attachments + email brief for cold outreach"]

---

**Question BF2: What is your target audience?**

**Audience Types**:

### Venture Capitalists (VCs)
- **What they care about**: Market size, traction, team, exit potential
- **Tone**: Professional, data-driven, ambitious

### Angel Investors
- **What they care about**: Problem, founders, early traction, passion
- **Tone**: Personal, story-driven, mission-oriented

### Strategic Investors (Corporates)
- **What they care about**: Strategic fit, synergies, market disruption
- **Tone**: Business-focused, industry insights, partnership potential

**Your Target Audience**: [e.g., "Seed-stage VCs focused on B2B SaaS"]

---

### Content Structure (One-Pager)

**Question CS1: What is your elevator pitch?**

**Elevator Pitch** = 1-2 sentences that capture your entire company

**Formula**: [Company] is [what you do] for [target customer], helping them [achieve goal/solve problem].

**Examples**:
- "Stripe is payment infrastructure for the internet, helping businesses accept payments in 135+ currencies."
- "Figma is collaborative design software for product teams, enabling real-time design and prototyping in the browser."
- "Notion is an all-in-one workspace for notes, docs, and projects, replacing multiple tools with one flexible platform."

**Your Elevator Pitch**:
- [1-2 sentences capturing your company, target customer, and value]

---

**Question CS2: What is your problem statement?**

**Problem Statement** (2-3 sentences):
- Who has the problem?
- What is the problem?
- How painful is it? (quantify with stats, time/money wasted, or customer quotes)

**Example**:
- "Construction companies waste 30% of project budgets on manual procurement, invoicing, and payment processes. Project managers spend 10+ hours/week chasing approvals and invoices, while 70% of subcontractors face cash flow issues due to payment delays."

**Your Problem Statement**:
- [2-3 sentences with specific pain points and quantification]

---

**Question CS3: What is your solution statement?**

**Solution Statement** (2-3 sentences):
- What do you do?
- How does it solve the problem?
- What's the key benefit or outcome?

**Example**:
- "BuildFlow automates procurement, invoicing, and payments for construction teams in one platform. Contractors save 10+ hours/week and reduce payment delays by 80%, improving cash flow and project profitability."

**Your Solution Statement**:
- [2-3 sentences describing product, impact, and outcome]

---

**Question CS4: What is your market opportunity?**

**Market Opportunity** (1-2 sentences + numbers):
- TAM (Total Addressable Market)
- SAM (Serviceable Available Market) — optional
- SOM (Serviceable Obtainable Market) — optional

**Example**:
- "The global construction industry is a $10T market, with $800B in U.S. commercial construction annually. We're targeting $40B (5% of U.S. market) over the next 5 years."

**Your Market Opportunity**:
- [1-2 sentences with TAM, SAM, or SOM]

---

**Question CS5: What is your traction?**

**Traction Statement** (2-4 key metrics):
- Choose metrics that show momentum (revenue, customers, growth rate, retention, GMV, etc.)
- Use specific numbers and growth rates

**Example**:
- "$50K MRR, 20% MoM growth"
- "200 paying customers (from 50 six months ago)"
- "Processed $50M in transactions in 12 months"
- "D30 retention: 50% (top decile for construction software)"

**Your Traction Metrics** (choose 2-4):
1. [Metric 1 with number and growth rate]
2. [Metric 2 with number and growth rate]
3. [Metric 3 with number and growth rate]
4. [Metric 4 with number and growth rate]

---

**Question CS6: What is your competitive advantage?**

**Competitive Advantage** (1-2 sentences):
- Why are you different/better than alternatives?
- What's your unfair advantage? (tech, team, distribution, data, brand, etc.)

**Example**:
- "Unlike incumbents (Procore, Buildertrend), BuildFlow is mobile-first, 10x faster to implement, and 50% cheaper—built specifically for on-site teams, not back-office users."

**Your Competitive Advantage**:
- [1-2 sentences explaining why you win]

---

**Question CS7: Who is your team?**

**Team Statement** (1-2 sentences per founder):
- Name, title, relevant background (previous company, domain expertise)

**Example**:
- "John Smith (CEO) — Former VP Product at Stripe, built payments platform to $10B GMV"
- "Jane Doe (CTO) — Former Engineering Lead at Uber, scaled team from 5 to 50 engineers"

**Your Team**:
1. [Founder 1: Name, title, one-sentence background]
2. [Founder 2: Name, title, one-sentence background]
3. [Key Hire (optional): Name, title, one-sentence background]

---

**Question CS8: What is your ask?**

**Ask Statement** (1-2 sentences):
- How much are you raising?
- What's the round (pre-seed, seed, Series A)?
- What will you use it for (optional: 1-2 key milestones)?

**Example**:
- "We're raising a $2.5M seed round to scale our sales team (10 → 25 headcount) and expand from 200 to 1,000 customers in the next 18 months."

**Your Ask**:
- [1-2 sentences: amount, round, use of funds, milestones]

---

### Content Structure (Email Brief)

**Question EB1: What is your cold outreach email?**

**Cold Email** = 200-300 words, fits in email body without scrolling

**Subject Line** (choose one format):
- **Name drop**: "[Mutual Connection] suggested I reach out"
- **Traction**: "$50K MRR, 20% MoM growth — [Company Name] investor intro"
- **Problem/Solution**: "Solving [$10T problem] for [target customer]"
- **Question**: "Are you investing in [sector] right now?"

**Email Body Structure**:

### Paragraph 1: Hook (1-2 sentences)
- Start with traction, problem, or social proof
- Grab attention in first sentence

### Paragraph 2: Company Overview (2-3 sentences)
- Problem, solution, target customer

### Paragraph 3: Traction (1-2 sentences)
- Key metrics, growth rate, milestones

### Paragraph 4: Ask (1 sentence)
- Request a meeting, not a decision

**Example Cold Email**:

```
Subject: $50K MRR, 20% MoM growth — BuildFlow investor intro

Hi [Investor Name],

I'm reaching out because you've invested in B2B SaaS companies like [Portfolio Company], and we're building in a similar space.

We're BuildFlow — the operating system for construction teams. We automate procurement, invoicing, and payments for contractors, helping them save 10+ hours/week and reduce payment delays by 80%.

We're at $50K MRR with 200 paying customers, growing 20% MoM. We've processed $50M in transactions in the last 12 months, and retention is 50% D30 (top decile for construction software).

We're raising a $2.5M seed round and would love to share more. Do you have 15 minutes this week or next for a quick intro call?

Thanks,
[Your Name]
```

**Your Cold Email** (draft full email):
- Subject: [Your subject line]
- Body: [4 paragraphs: Hook, Company Overview, Traction, Ask]

---

### Design & Formatting

**Question DF1: How will you design your one-pager?**

**Design Principles for One-Pager**:

1. **Scannable**: Use headers, bullet points, white space (investors should grasp the key points in 30 seconds)
2. **Visual**: Include 1-2 charts or images (traction chart, product screenshot, logo wall)
3. **Branded**: Use your company logo, brand colors, professional fonts
4. **Concise**: No paragraphs longer than 3-4 lines

**Layout Options**:

### Option 1: Header + Sections (Vertical)
- **Header**: Logo, tagline, contact info
- **Section 1**: Problem (2-3 bullets)
- **Section 2**: Solution (2-3 bullets + screenshot)
- **Section 3**: Market (TAM/SAM/SOM)
- **Section 4**: Traction (chart + metrics)
- **Section 5**: Team (headshots + bios)
- **Section 6**: Ask (amount, use of funds)

### Option 2: Two-Column (Side-by-Side)
- **Left Column**: Problem, Solution, Traction, Ask
- **Right Column**: Market, Competitive Advantage, Team, Contact

### Option 3: Front + Back (Double-Sided)
- **Front**: Company overview, problem, solution, traction, ask
- **Back**: Detailed metrics, team bios, contact info

**Your Layout**: [Choose one]

**Design Tool**:
- ☐ **Google Docs** (simple text, no graphics)
- ☐ **Canva** (templates, easy design)
- ☐ **PowerPoint / Keynote** (export as PDF)
- ☐ **Figma** (custom design, professional)
- ☐ **Custom** (hire designer)

**Your Tool**: [Choose one]

---

### Distribution & Follow-Up

**Question DU1: How will you distribute your investor brief?**

**Distribution Channels**:

### 1. Warm Intro Email
- **From**: Mutual connection (advisor, investor, founder)
- **To**: Target investor
- **Include**: Brief intro + one-pager attached

**Example**:
```
Subject: Intro to [Your Company] (founders from [Previous Company])

Hi [Investor Name],

I'd like to introduce you to [Your Name], founder of [Your Company]. [He/She] is building [one-sentence pitch].

They're at [$X MRR], growing [Y% MoM], and raising a [$Z] seed round. I think it's a great fit for [Your Fund].

I'm attaching their one-pager. Let me know if you'd like an intro!

Best,
[Mutual Connection]
```

### 2. Cold Outreach Email
- **From**: You
- **To**: Target investor (found via AngelList, Crunchbase, LinkedIn)
- **Include**: Email brief (in body) + one-pager attached (optional)

### 3. Post-Meeting Follow-Up
- **From**: You
- **To**: Investor you just met
- **Include**: Thank you + one-pager + pitch deck + data room link

**Example**:
```
Subject: Thanks for the meeting — [Your Company] materials

Hi [Investor Name],

Thanks for taking the time to meet today. As discussed, here are our materials:

- **One-pager** (attached) — quick reference
- **Pitch deck** (attached) — full story
- **Data room** (link) — financials, metrics, customer references

Let me know if you have any questions. Looking forward to next steps!

Best,
[Your Name]
```

**Your Distribution Strategy** (choose 2-3):
1. [Channel 1] — e.g., "Warm intros via advisors"
2. [Channel 2] — e.g., "Cold outreach to 50 seed-stage VCs"
3. [Channel 3] — e.g., "Post-meeting follow-ups"

---

**Question DU2: How will you track investor outreach?**

**Investor CRM** (track all outreach):

| Investor Name | Fund           | Stage | Status       | Last Contact | Next Step                |
|---------------|----------------|-------|--------------|--------------|--------------------------|
| Jane Doe      | Sequoia        | Seed  | Intro Meeting| 2024-11-15   | Follow up with deck      |
| John Smith    | Andreessen     | Seed  | Pass         | 2024-11-10   | N/A                      |
| Alice Johnson | First Round    | Seed  | Due Diligence| 2024-11-20   | Send customer references |

**CRM Tool**:
- ☐ **Spreadsheet** (Google Sheets, Excel)
- ☐ **Notion** (database view)
- ☐ **Airtable** (relational database)
- ☐ **CRM** (HubSpot, Pipedrive, Affinity)

**Your CRM Tool**: [Choose one]

**Status Categories**:
- **Cold**: Not yet contacted
- **Reached Out**: Email sent, awaiting response
- **Intro Meeting**: First meeting scheduled or completed
- **Partner Meeting**: Second meeting with full partnership
- **Due Diligence**: Investor is actively evaluating
- **Term Sheet**: Term sheet received
- **Pass**: Investor declined

---

### Implementation Roadmap

**Question IR1: What is your investor brief creation timeline?**

### Week 1: Content (Days 1-3)
- **Day 1**: Pull content from pitch deck (problem, solution, traction, team, ask)
- **Day 2**: Draft one-pager text (condense to fit 1 page)
- **Day 3**: Draft cold outreach email (200-300 words)

### Week 1: Design (Days 4-5)
- **Day 4**: Design one-pager layout (choose tool, apply branding)
- **Day 5**: Add visuals (traction chart, product screenshot, team headshots)

### Week 2: Review & Finalize (Days 1-2)
- **Day 1**: Review with co-founder/team, refine content
- **Day 2**: Get feedback from 2-3 advisors, finalize

### Week 2: Build Investor List (Days 3-5)
- **Day 3-4**: Research 50-100 target investors (stage, sector, geography fit)
- **Day 5**: Prioritize top 20 investors, find warm intro paths

### Week 3: Outreach (Ongoing)
- Send 5-10 emails per week (warm intros + cold outreach)
- Track responses in CRM
- Follow up with interested investors

---

## STEP 4: Generate Comprehensive Investor Brief

**You will now receive a comprehensive document covering**:

### Section 1: Executive Summary
- Format choice (one-pager, executive summary, email brief)
- Target audience (VCs, angels, strategics)
- Distribution strategy (warm intros, cold outreach, post-meeting follow-ups)

### Section 2: One-Pager Content
- **Header**: Company name, logo, tagline, contact
- **Elevator Pitch**: 1-2 sentence company overview
- **Problem**: 2-3 sentences with customer pain points
- **Solution**: 2-3 sentences with product description and impact
- **Market**: TAM, SAM, SOM (1-2 sentences)
- **Traction**: 2-4 key metrics with growth rates
- **Competitive Advantage**: 1-2 sentences explaining differentiation
- **Team**: Founders + key hires with one-sentence bios
- **Ask**: Amount raising, round, use of funds, milestones

### Section 3: Email Brief (Cold Outreach)
- **Subject Line**: Traction-focused or problem-focused
- **Paragraph 1 (Hook)**: Traction, problem, or social proof
- **Paragraph 2 (Company)**: Problem, solution, target customer
- **Paragraph 3 (Traction)**: Key metrics, growth rate
- **Paragraph 4 (Ask)**: Request 15-minute intro call

### Section 4: Design & Formatting
- Layout choice (vertical sections, two-column, front+back)
- Design tool (Canva, Figma, PowerPoint, custom)
- Branding guidelines (logo, colors, fonts)
- Visual elements (traction chart, product screenshot, team headshots)

### Section 5: Distribution & Follow-Up
- **Warm Intro Email Template** (from mutual connection)
- **Cold Outreach Email Template** (direct to investor)
- **Post-Meeting Follow-Up Template** (thank you + materials)
- Investor CRM setup (spreadsheet or tool)
- Status tracking (cold, reached out, intro meeting, partner meeting, due diligence, term sheet, pass)

### Section 6: Investor List Building
- Target investor criteria (stage, sector, geography, check size)
- Research process (AngelList, Crunchbase, LinkedIn, fund websites)
- Prioritization (warm intro paths, portfolio fit, recent investments)
- Top 20 target investors list

### Section 7: Next Steps
- Finalize one-pager this week
- Get feedback from 3 advisors
- Build target investor list (50-100 names, prioritize top 20)
- Start outreach next week (5-10 emails/week)

---

## STEP 5: Quality Review & Iteration

After generating the strategy, I will ask:

**Quality Check**:
1. Is the one-pager scannable (can investor grasp key points in 30 seconds)?
2. Does the traction statement show clear momentum?
3. Is the ask specific (amount, round, use of funds)?
4. Does the cold email fit in one screen without scrolling?
5. Is the email hook strong (traction, social proof, or problem)?
6. Can you personalize the cold email for each investor?

**Iterate?** [Yes — refine X / No — finalize]

---

## STEP 6: Save & Next Steps

Once finalized, I will:
1. **Save** the investor brief (PDF) and email templates to your project folder
2. **Suggest** sending to 3 advisors for feedback before investor outreach
3. **Remind** you to build target investor list this week

---

## 8 Critical Guidelines for This Skill

1. **Lead with traction**: If you have strong traction, put it in the subject line and first sentence. Traction gets meetings.

2. **One-pager must be scannable**: Investors should understand your company in 30 seconds. Use headers, bullets, and white space.

3. **Cold emails must be short**: 200-300 words max. If investors need to scroll, you've lost them.

4. **Personalize every cold email**: Reference their portfolio, recent investment, or sector focus. Generic emails get ignored.

5. **The ask is a meeting, not money**: Don't ask for investment in the first email. Ask for 15 minutes to share more.

6. **Follow up persistently**: Send 2-3 follow-ups spaced 5-7 days apart. Many investors don't respond until the 3rd email.

7. **Track everything**: Use a CRM to track every outreach, response, meeting, and next step. Fundraising is a pipeline.

8. **Warm intros > cold outreach**: Warm intros have 10x higher response rate. Exhaust your network before going cold.

---

## Quality Checklist (Before Finalizing)

- [ ] One-pager is 1 page (front only or front+back)
- [ ] Elevator pitch is 1-2 sentences and crystal clear
- [ ] Problem statement quantifies pain (time/money wasted, customer quotes)
- [ ] Solution statement explains product and impact
- [ ] Traction statement shows 2-4 key metrics with growth rates
- [ ] Team bios highlight relevant backgrounds (previous companies, domain expertise)
- [ ] Ask is specific (amount, round, use of funds)
- [ ] Cold email is 200-300 words (fits in one screen)
- [ ] Cold email has strong hook (traction, social proof, or problem)
- [ ] Cold email ends with clear ask (15-minute intro call)
- [ ] One-pager has visuals (traction chart, product screenshot, or team photos)
- [ ] One-pager uses brand colors, logo, and professional design

---

## Integration with Other Skills

**Upstream Skills** (reuse data from):
- **investor-pitch-deck-builder** → Full pitch deck content (problem, solution, market, traction, team, ask)
- **problem-validation-study** → Problem statement, customer pain points, quotes
- **metrics-dashboard-designer** → Traction metrics (MRR, growth rate, customers, retention)
- **financial-model-architect** → Financial projections, unit economics, ARR forecast
- **customer-persona-builder** → Target customer description
- **product-positioning-expert** → Unique value proposition, competitive advantage
- **competitive-intelligence** → Competitive landscape, differentiation

**Downstream Skills** (use this data in):
- **fundraising-strategy-planner** → Use investor brief as outreach material
- **investor outreach** → Send one-pager in warm intros and cold emails
- **post-meeting follow-ups** → Include one-pager in follow-up email packages

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
   html-templates/investor-brief-writer.html
   ```

### How to Use Templates

1. Read `VERIFICATION-CHECKLIST.md` first - contains canonical CSS patterns that MUST be copied exactly
2. Read `base-template.html` - contains all shared CSS, layout structure, and Chart.js configuration
3. Read `investor-brief-writer.html` - contains skill-specific content sections, CSS extensions, and chart scripts
4. Replace all `{{PLACEHOLDER}}` markers with actual analysis data
5. Merge the skill-specific CSS into `{{SKILL_SPECIFIC_CSS}}`
6. Merge the content sections into `{{CONTENT_SECTIONS}}`
7. Merge the chart scripts into `{{CHART_SCRIPTS}}`

---

## HTML Output Verification

Before delivering the HTML report, verify:

### Structure Verification
- [ ] Header follows canonical StratArts pattern with skill name and timestamp
- [ ] Score banner displays 6 key metrics (Raise, MRR, Growth, Customers, TAM, Target Investors)
- [ ] All 9 sections present with proper content
- [ ] Footer includes StratArts branding and regeneration guidance

### Chart Verification (1 Chart Required)
- [ ] **Revenue Growth Chart** (Line) - MRR progression over 12 months

### Content Verification
- [ ] Executive summary covers format, audience, distribution, differentiators
- [ ] One-pager preview includes all 6 core sections (problem, solution, market, advantage, traction, ask)
- [ ] One-pager is visually scannable (headers, bullets, metrics highlighted)
- [ ] Traction cards show 4 metrics with growth indicators
- [ ] Team section includes 3 founders/key hires with bios
- [ ] Cold email is 200-300 words with traction-focused subject line
- [ ] Email templates include warm intro, follow-up, and post-meeting
- [ ] Distribution strategy covers warm intros, cold outreach, post-meeting
- [ ] Investor table shows 5-10 target investors with tier/intro path

### Visual Verification
- [ ] Dark theme applied (#0a0a0a background, #1a1a1a containers)
- [ ] Emerald accent (#10b981) used consistently
- [ ] One-pager preview has distinct border (border-accent)
- [ ] Email preview has proper header/body separation
- [ ] Chart renders correctly with Chart.js v4.4.0

---

**End of Skill**
