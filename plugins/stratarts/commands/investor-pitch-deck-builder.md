---
name: investor-pitch-deck-builder
description: Create a compelling 10-15 slide investor pitch deck that tells your startup story, demonstrates market opportunity, proves traction, and makes a clear ask. Build a deck that gets meetings, progresses conversations, and closes rounds.
version: 1.0.0
category: fundraising-operations
---

# investor-pitch-deck-builder

**Mission**: Create a compelling investor pitch deck that tells your startup story, demonstrates market opportunity, proves traction, and makes a clear ask. Build a 10-15 slide deck that gets you meetings, progresses conversations, and closes rounds.

---

## STEP 0: Pre-Generation Verification

Before generating HTML output, verify all placeholders are populated:

### Score Banner Placeholders
- [ ] `{{COMPANY_NAME}}` - Company name
- [ ] `{{ROUND_NAME}}` - Round type (Pre-Seed/Seed/Series A)
- [ ] `{{TIMESTAMP}}` - Generation timestamp
- [ ] `{{RAISE_AMOUNT}}` - Target raise amount (e.g., "$2.5M")
- [ ] `{{VALUATION}}` - Post-money valuation (e.g., "$12M")
- [ ] `{{MRR}}` - Current MRR (e.g., "$85K")
- [ ] `{{TAM}}` - Total addressable market (e.g., "$47B")
- [ ] `{{SLIDE_COUNT}}` - Number of slides (e.g., "12")
- [ ] `{{PITCH_TIME}}` - Target pitch time (e.g., "12 min")

### Content Section Placeholders
- [ ] `{{EXEC_SUMMARY}}` - 4 exec summary cards (pitch, ask, why now, milestones)
- [ ] `{{SLIDE_CARDS}}` - 12 slide preview cards with thumbnails
- [ ] `{{SLIDE_DETAILS}}` - Detailed content for key slides (problem, solution, traction)
- [ ] `{{METRICS_CARDS}}` - 4 traction metric cards
- [ ] `{{COMPETITOR_MATRIX}}` - 2x2 competitive positioning grid
- [ ] `{{TEAM_CARDS}}` - 3 team member cards
- [ ] `{{FINANCIAL_TABLE}}` - 5-year projection table
- [ ] `{{FUNDS_CARDS}}` - 4 use of funds breakdown cards
- [ ] `{{DESIGN_CARDS}}` - 4 design/storytelling guidance cards
- [ ] `{{NEXT_STEPS}}` - 6 prioritized next step items

### Chart Data Placeholders
- [ ] `{{REVENUE_LABELS}}` - JSON array of month labels
- [ ] `{{REVENUE_DATA}}` - JSON array of MRR values
- [ ] `{{CUSTOMER_LABELS}}` - JSON array of quarter labels
- [ ] `{{CUSTOMER_DATA}}` - JSON array of customer counts
- [ ] `{{PROJECTION_LABELS}}` - JSON array of year labels
- [ ] `{{PROJECTION_DATA}}` - JSON array of ARR projections
- [ ] `{{FUNDS_LABELS}}` - JSON array of fund category names
- [ ] `{{FUNDS_DATA}}` - JSON array of fund percentages

---

## STEP 1: Detect Previous Context

### Ideal Context (All Present):
- **problem-validation-study** → Problem statement, customer pain points
- **customer-persona-builder** → Target customer, market size
- **product-positioning-expert** → Unique value proposition, differentiation
- **competitive-intelligence** → Competitive landscape, competitive advantages
- **revenue-model-builder** → Business model, unit economics, pricing
- **metrics-dashboard-designer** → Traction metrics, KPIs, growth rate
- **go-to-market-planner** → GTM strategy, customer acquisition
- **financial-model-architect** → Financial projections, runway, ask amount

### Partial Context (Some Present):
- **problem-validation-study** → Problem definition available
- **revenue-model-builder** → Business model available
- **metrics-dashboard-designer** → Traction data available

### No Context:
- None of the above skills were run

---

## STEP 2: Context-Adaptive Introduction

### If Ideal Context:
> I found outputs from **problem-validation-study**, **customer-persona-builder**, **product-positioning-expert**, **competitive-intelligence**, **revenue-model-builder**, **metrics-dashboard-designer**, **go-to-market-planner**, and **financial-model-architect**.
>
> I can reuse:
> - **Problem statement** ([X])
> - **Target customer** ([Y])
> - **Value proposition** ([Z])
> - **Competitive landscape** (competitors: [A, B, C])
> - **Business model** (revenue streams, pricing, unit economics)
> - **Traction metrics** (MRR: [$X], growth: [Y% MoM], customers: [Z])
> - **GTM strategy** (channels, CAC, LTV)
> - **Financial projections** (revenue forecast, burn rate, runway)
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
> I'll guide you through building your investor pitch deck from the ground up.

---

## STEP 3: Questions (One at a Time, Sequential)

### Pitch Deck Basics

**Question PDB1: What round are you raising?**

**Fundraising Stage**:
- ☐ **Pre-Seed** ($250K - $1M) — idea to MVP, finding product-market fit
- ☐ **Seed** ($1M - $5M) — product-market fit, scaling early traction
- ☐ **Series A** ($5M - $15M) — proven business model, scaling GTM
- ☐ **Series B** ($15M - $50M) — scaling operations, expanding markets
- ☐ **Series C+** ($50M+) — mature company, aggressive growth or M&A

**Your Round**: [e.g., "Seed — raising $2.5M"]

**Your Ask**:
- **Amount Raising**: [e.g., "$2.5M"]
- **Valuation** (if applicable): [e.g., "$10M post-money valuation"]
- **Use of Funds**: [What will you use the money for? e.g., "60% product, 30% GTM, 10% ops"]

---

**Question PDB2: What is your fundraising narrative?**

**The Story Arc** (every great pitch follows this structure):

1. **Problem**: The world has a problem (customer pain point)
2. **Solution**: You've built something that solves it (product/service)
3. **Market**: The opportunity is huge (TAM, SAM, SOM)
4. **Traction**: You've proven it works (metrics, customers, revenue)
5. **Vision**: You're going to win (competitive advantage, team, roadmap)
6. **Ask**: You need capital to accelerate (how much, what for)

**Your 1-Sentence Pitch** (the "elevator pitch"):
- [e.g., "We're building the Stripe for construction, enabling $10T in transactions annually"]

**Your 3-Sentence Pitch** (the "Twitter pitch"):
- Problem: [e.g., "Construction companies waste 30% of project budgets on manual processes"]
- Solution: [e.g., "We automate procurement, invoicing, and payments in one platform"]
- Traction: [e.g., "We've processed $50M in transactions for 200+ contractors in 12 months"]

---

### Slide-by-Slide Content

**Question S1: TITLE SLIDE — What is your company tagline?**

**Title Slide Elements**:
- **Company Name**: [Your company name]
- **Tagline**: [One sentence — what you do, for whom]
  - Example: "Stripe for construction" or "Figma for data teams"
- **Contact**: [Your name, title, email]
- **Round**: [e.g., "Seed Round — $2.5M"]

**Your Tagline**: [e.g., "The operating system for construction teams"]

---

**Question S2: PROBLEM SLIDE — What problem are you solving?**

**Problem Statement** (3-5 bullet points):
- Keep it customer-centric (not "the market lacks X", but "customers struggle with X")
- Use concrete examples, stats, or quotes
- Show pain intensity (time wasted, money lost, frustration)

**Example**:
- "Construction companies waste 30% of project budgets on manual processes"
- "Project managers spend 10+ hours/week chasing invoices and approvals"
- "Payment delays cause cash flow issues for 70% of subcontractors"

**Your Problem Statement** (3-5 bullets):
1. [Problem 1] — [stat or quote]
2. [Problem 2] — [stat or quote]
3. [Problem 3] — [stat or quote]

**Visual** (if available):
- Photo of frustrated customer
- Chart showing cost/time waste
- Quote from customer interview

---

**Question S3: SOLUTION SLIDE — What is your solution?**

**Solution Statement** (2-3 sentences):
- How do you solve the problem?
- What is your product/service?
- What makes it different/better?

**Example**:
- "BuildFlow automates procurement, invoicing, and payments for construction teams in one platform"
- "Contractors save 10+ hours/week and reduce payment delays by 80%"

**Your Solution Statement**:
- [2-3 sentences describing your product/service and impact]

**Visual** (critical for this slide):
- Product screenshot
- Product demo video (embedded or link)
- Before/After comparison

**Key Features** (3-5 bullet points):
1. [Feature 1] — [What it does, why it matters]
2. [Feature 2] — [What it does, why it matters]
3. [Feature 3] — [What it does, why it matters]

---

**Question S4: MARKET OPPORTUNITY — How big is the market?**

**Market Sizing** (TAM, SAM, SOM):

- **TAM (Total Addressable Market)**: Total market demand for your solution (if everyone in the world who could use it, did use it)
  - Example: "Construction industry = $10T global market"

- **SAM (Serviceable Available Market)**: Portion of TAM you can realistically target with your product/service
  - Example: "U.S. commercial construction = $800B"

- **SOM (Serviceable Obtainable Market)**: Portion of SAM you can realistically capture in the next 3-5 years
  - Example: "Targeting 5% of U.S. commercial construction = $40B"

**Your Market Sizing**:
- **TAM**: [e.g., "$10T global construction market"]
- **SAM**: [e.g., "$800B U.S. commercial construction"]
- **SOM**: [e.g., "$40B (5% of SAM) over next 5 years"]

**Market Trends** (2-3 bullet points):
- What tailwinds support your business? (e.g., "Digital transformation in construction accelerating post-COVID")
- [Trend 1]
- [Trend 2]

**Visual**: Concentric circles (TAM → SAM → SOM) or bar chart

---

**Question S5: BUSINESS MODEL — How do you make money?**

**Revenue Model** (1-2 sentences + pricing table):

**Your Revenue Streams** (choose 1-3):
- ☐ **Subscription (SaaS)**: Monthly/annual recurring revenue
- ☐ **Transaction Fee**: % of GMV (Gross Merchandise Value)
- ☐ **Marketplace**: Commission on transactions
- ☐ **Licensing**: Per-user or per-deployment fee
- ☐ **Freemium**: Free tier + paid upgrades
- ☐ **Usage-Based**: Pay-per-API call, per-GB, etc.
- ☐ **Services**: Professional services, implementation, training

**Your Primary Revenue Model**: [e.g., "Subscription (SaaS) — $99/mo per user"]

**Pricing Table** (if applicable):

| Plan       | Price       | Target Customer     |
|------------|-------------|---------------------|
| Starter    | $99/mo      | Solo contractors    |
| Pro        | $299/mo     | Small teams (5-20)  |
| Enterprise | Custom      | Large firms (50+)   |

**Unit Economics** (critical for investors):
- **ARPU** (Average Revenue Per User): [$X/month]
- **CAC** (Customer Acquisition Cost): [$X]
- **LTV** (Customer Lifetime Value): [$X]
- **LTV:CAC Ratio**: [X:1 — target 3:1 or higher]
- **Gross Margin**: [X% — target 70%+ for SaaS]
- **Payback Period**: [X months — target <12 months]

**Your Unit Economics**:
- ARPU: [$X]
- CAC: [$X]
- LTV: [$X]
- LTV:CAC: [X:1]
- Gross Margin: [X%]

---

**Question S6: TRACTION SLIDE — What have you achieved so far?**

**Traction** = Proof that your business is working (the most important slide for investors)

**Traction Metrics** (choose 3-5 that best demonstrate growth):

**For Early-Stage (Pre-Seed, Seed)**:
- ☐ **Revenue**: MRR, ARR (e.g., "$50K MRR, 20% MoM growth")
- ☐ **Customers**: # of paying customers (e.g., "200 paying customers")
- ☐ **User Growth**: # of users, signups, activations (e.g., "5,000 users, 40% MoM growth")
- ☐ **Product Metrics**: DAU, WAU, MAU, retention (e.g., "D30 retention: 50%")
- ☐ **GMV** (for marketplaces): Gross Merchandise Value (e.g., "$50M GMV processed")
- ☐ **Pilots/LOIs**: Signed pilots or letters of intent (e.g., "10 enterprise pilots signed")

**For Growth-Stage (Series A+)**:
- ☐ **Revenue Growth**: MRR/ARR growth chart (e.g., "ARR: $5M → $10M in 12 months")
- ☐ **Customer Growth**: Logo count (e.g., "500 → 1,200 customers in 12 months")
- ☐ **Net Revenue Retention**: NRR (e.g., "120% NRR — customers expanding")
- ☐ **Market Share**: % of target market captured (e.g., "5% market share in U.S.")

**Your Traction Metrics** (choose 3-5):
1. [Metric 1] — [Value + growth rate]
2. [Metric 2] — [Value + growth rate]
3. [Metric 3] — [Value + growth rate]

**Visual** (critical):
- **"Hockey stick" chart** (revenue, users, or GMV over time)
- **Cohort retention curve** (if strong retention)
- **Logo wall** (if you have recognizable customers)

**Milestones** (recent achievements — 3-5 bullets):
- [Milestone 1] — e.g., "Launched product in Q1 2024"
- [Milestone 2] — e.g., "Hit $100K MRR in Q3 2024"
- [Milestone 3] — e.g., "Signed first Fortune 500 customer in Q4 2024"

---

**Question S7: PRODUCT DEMO — How will you show your product?**

**Product Demo Options**:
- ☐ **Live Demo** (during pitch — risky but impressive if it works)
- ☐ **Video Demo** (2-3 minutes — embedded in deck or link)
- ☐ **Screenshots** (3-5 key screens showing core workflows)
- ☐ **Interactive Prototype** (Figma, InVision link)
- ☐ **No Demo** (if product is too complex or too early)

**Your Demo Approach**: [Choose one]

**Key Screenshots** (if using screenshots — 3-5):
1. [Screen 1] — [What it shows — e.g., "Dashboard: Real-time project overview"]
2. [Screen 2] — [What it shows — e.g., "Invoicing: One-click payment approvals"]
3. [Screen 3] — [What it shows — e.g., "Analytics: Budget tracking and forecasting"]

**Demo Talking Points** (what to highlight — 3-5):
1. [Point 1] — e.g., "10x faster than manual spreadsheets"
2. [Point 2] — e.g., "Real-time collaboration for distributed teams"
3. [Point 3] — e.g., "Mobile-first for on-site usage"

---

**Question S8: COMPETITIVE LANDSCAPE — Who are your competitors?**

**Competitive Positioning** (show 2-4 competitors + you):

**Competitor 1**: [Name — e.g., "Procore"]
- Strengths: [e.g., "Market leader, enterprise-focused"]
- Weaknesses: [e.g., "Expensive, complex, legacy UI"]

**Competitor 2**: [Name — e.g., "Buildertrend"]
- Strengths: [e.g., "Popular with residential builders"]
- Weaknesses: [e.g., "Limited features for commercial construction"]

**Competitor 3**: [Name — e.g., "Manual spreadsheets + QuickBooks"]
- Strengths: [e.g., "Familiar, low cost"]
- Weaknesses: [e.g., "Error-prone, time-consuming, no real-time collaboration"]

**Your Company**:
- **Competitive Advantages** (why you win — 3-5 bullets):
  1. [Advantage 1] — e.g., "10x faster implementation (days vs. months)"
  2. [Advantage 2] — e.g., "50% cheaper than incumbents"
  3. [Advantage 3] — e.g., "Mobile-first design for on-site teams"

**Visual**: **2x2 Matrix** (plot you + competitors on two axes)
- Example axes: "Price" (low → high) vs. "Ease of Use" (hard → easy)
- You should be in the top-left or bottom-right (differentiated position)

---

**Question S9: GO-TO-MARKET STRATEGY — How do you acquire customers?**

**GTM Strategy** (2-3 primary channels):

**Your Channels** (choose 2-4):
- ☐ **Outbound Sales** (cold email, cold calls, LinkedIn outreach)
- ☐ **Inbound Marketing** (content, SEO, paid ads)
- ☐ **Product-Led Growth** (free trial, freemium, viral loops)
- ☐ **Partnerships** (integrations, resellers, channel partners)
- ☐ **Community / Word-of-Mouth** (referrals, user communities)
- ☐ **Events / Trade Shows** (industry conferences, demos)

**Your Primary GTM Channels** (rank by importance):
1. [Channel 1] — [e.g., "Outbound sales to commercial contractors"]
2. [Channel 2] — [e.g., "Inbound marketing via content (SEO, case studies)"]
3. [Channel 3] — [e.g., "Partnerships with construction software companies"]

**GTM Metrics**:
- **CAC (Customer Acquisition Cost)**: [$X]
- **Sales Cycle**: [X days/weeks/months]
- **Conversion Rate**: [X% from lead to customer]
- **Payback Period**: [X months]

**Customer Acquisition Roadmap** (next 12 months):
- Q1: [Goal — e.g., "Launch outbound sales team (2 AEs, 1 SDR)"]
- Q2: [Goal — e.g., "Launch SEO content strategy (50 articles)"]
- Q3: [Goal — e.g., "Sign 3 channel partnerships"]
- Q4: [Goal — e.g., "Hit $1M ARR"]

---

**Question S10: TEAM SLIDE — Who is building this?**

**Team Members** (3-6 people — founders + key hires):

**Founder 1**: [Name]
- **Title**: [e.g., "CEO & Co-Founder"]
- **Background**: [One sentence — previous company, relevant experience]
  - Example: "Former VP Product at Stripe, built payments platform to $10B GMV"
- **Why this person?**: [What makes them uniquely qualified?]

**Founder 2**: [Name]
- **Title**: [e.g., "CTO & Co-Founder"]
- **Background**: [One sentence]
  - Example: "Former Engineering Lead at Uber, scaled team from 5 to 50 engineers"
- **Why this person?**: [What makes them uniquely qualified?]

**Key Hire 1**: [Name — if applicable]
- **Title**: [e.g., "Head of Sales"]
- **Background**: [One sentence]
  - Example: "Former VP Sales at Salesforce, closed $50M+ in ARR"

**Your Team**:
1. [Founder 1] — [Name, Title, Background, Why]
2. [Founder 2] — [Name, Title, Background, Why]
3. [Key Hire 1] — [Name, Title, Background, Why]

**Advisors / Investors** (if you have notable ones):
- [Advisor 1] — [e.g., "Former CEO of [Company], now advising on GTM"]
- [Investor 1] — [e.g., "Sequoia Capital (Seed investor)"]

**Visual**: Headshots + LinkedIn logos (past companies)

---

**Question S11: FINANCIAL PROJECTIONS — What are your financial projections?**

**Financial Projections** (next 3-5 years):

| Metric            | 2024 | 2025 | 2026 | 2027 | 2028 |
|-------------------|------|------|------|------|------|
| Revenue (ARR)     | $500K| $2M  | $8M  | $20M | $50M |
| Customers         | 200  | 600  | 2K   | 5K   | 10K  |
| Gross Margin      | 60%  | 70%  | 75%  | 78%  | 80%  |
| Burn Rate (monthly)| $100K| $200K| $300K| $400K| —    |
| Headcount         | 10   | 25   | 60   | 120  | 200  |

**Key Assumptions** (3-5 bullets explaining your projections):
1. [Assumption 1] — e.g., "Average customer spends $300/month"
2. [Assumption 2] — e.g., "CAC of $1,000, 12-month payback period"
3. [Assumption 3] — e.g., "80% annual retention, 120% net revenue retention"

**Your Projections** (fill in table above based on financial model)

**Path to Profitability**:
- When will you be cash-flow positive? [e.g., "Q4 2026"]
- When will you be profitable? [e.g., "2027"]

---

**Question S12: THE ASK — What are you raising and what for?**

**The Ask** (be specific):

**Amount Raising**: [e.g., "$2.5M Seed Round"]

**Use of Funds** (breakdown by category):
| Category           | % of Funds | $ Amount | What For                                  |
|--------------------|------------|----------|-------------------------------------------|
| Product/Engineering| 50%        | $1.25M   | Hire 5 engineers, ship features X, Y, Z   |
| Sales & Marketing  | 35%        | $875K    | Hire 3 AEs, 2 SDRs, launch paid marketing |
| Operations         | 10%        | $250K    | Hire COO, finance/legal, ops infrastructure|
| Runway/Buffer      | 5%         | $125K    | 6-month buffer                            |

**Milestones** (what will you achieve with this capital — next 12-18 months):
1. [Milestone 1] — e.g., "Hit $2M ARR (4x growth)"
2. [Milestone 2] — e.g., "Expand from 200 → 1,000 customers"
3. [Milestone 3] — e.g., "Launch enterprise tier and sign 10 enterprise customers"
4. [Milestone 4] — e.g., "Build out GTM team (10 → 25 headcount)"

**Runway** (how long will this funding last?):
- [e.g., "18 months runway to Series A"]

---

**Question S13: APPENDIX — What supporting slides will you include?**

**Appendix Slides** (optional slides for Q&A or follow-up):

Common appendix slides:
- ☐ **Customer Testimonials / Case Studies**
- ☐ **Product Roadmap** (next 12 months)
- ☐ **Detailed Financial Model** (5-year P&L, cash flow)
- ☐ **Market Research / Customer Validation** (surveys, interviews)
- ☐ **Competitive Analysis Deep Dive** (feature comparison table)
- ☐ **Go-to-Market Deep Dive** (channel strategy, sales playbook)
- ☐ **Technology / IP** (architecture, patents, defensibility)
- ☐ **Team Bios** (extended backgrounds, advisors)
- ☐ **Press / Media Coverage** (articles, awards)

**Your Appendix Slides** (choose 3-5):
1. [Slide 1] — e.g., "Customer testimonials from 3 enterprise customers"
2. [Slide 2] — e.g., "12-month product roadmap"
3. [Slide 3] — e.g., "Detailed 5-year financial model"

---

### Pitch Deck Design & Storytelling

**Question PDD1: What is your deck design approach?**

**Design Principles**:
1. **Simple & Clean**: Minimal text, lots of white space, large fonts
2. **Visual-First**: Use charts, screenshots, photos (not walls of text)
3. **Consistent Branding**: Use your brand colors, fonts, logo throughout
4. **One Idea Per Slide**: Each slide should have one clear message

**Design Tool**:
- ☐ **Google Slides** (simple, collaborative, free)
- ☐ **PowerPoint** (professional, widely used)
- ☐ **Keynote** (Apple, best for design)
- ☐ **Pitch** (modern, built for pitch decks)
- ☐ **Canva** (templates, easy design)
- ☐ **Custom** (designer-made, fully branded)

**Your Tool**: [Choose one]

**Template or Custom**:
- ☐ Use template (e.g., Sequoia pitch deck template, YC pitch deck template)
- ☐ Custom design (hire designer, fully branded)

---

**Question PDD2: How will you structure your narrative?**

**Narrative Arc** (the story flow of your pitch):

1. **Hook** (Title + Problem): Grab attention with a bold claim or surprising stat
2. **Setup** (Problem + Market): Establish the pain and opportunity
3. **Solution** (Solution + Product): Introduce your product as the hero
4. **Proof** (Traction + Business Model): Show it's working
5. **Vision** (Competitive + GTM + Team): Show you'll win
6. **Ask** (Financials + Ask): Close with the opportunity to join you

**Storytelling Tips**:
- Start with a personal story (why did you start this company?)
- Use customer stories (real examples of impact)
- Show, don't tell (use visuals, demos, not text)
- End with a clear ask (don't make investors guess)

**Your Opening Hook** (first 30 seconds):
- [What will you say to grab attention? e.g., "Construction is a $10T industry that still runs on spreadsheets and paper. We're changing that."]

---

### Implementation Roadmap

**Question IR1: What is your pitch deck creation timeline?**

### Phase 1: Content (Week 1)
- **Day 1-2**: Gather data from upstream skills (problem, solution, market, traction, etc.)
- **Day 3-4**: Draft slide-by-slide content (bullet points, no design yet)
- **Day 5**: Review with co-founder/team, refine content

### Phase 2: Design (Week 2)
- **Day 1-2**: Choose design tool and template (or hire designer)
- **Day 3-4**: Design slides (apply brand, add visuals, create charts)
- **Day 5**: Review with co-founder/team, refine design

### Phase 3: Practice (Week 3)
- **Day 1-2**: Practice pitch with team (aim for 10-15 minutes)
- **Day 3**: Get feedback from advisors/mentors
- **Day 4**: Refine deck based on feedback
- **Day 5**: Final practice (record yourself, time yourself)

### Phase 4: Send & Pitch (Week 4+)
- **Week 4**: Send deck to investors, book intro meetings
- **Week 5+**: Pitch investors, iterate based on questions/feedback

---

## STEP 4: Generate Comprehensive Investor Pitch Deck

**You will now receive a comprehensive document covering**:

### Section 1: Executive Summary
- Fundraising round and ask (e.g., "Seed — $2.5M")
- One-sentence pitch (elevator pitch)
- Three-sentence pitch (problem, solution, traction)
- Use of funds breakdown (product, GTM, ops)

### Section 2: Slide-by-Slide Content
**Slide 1: Title** (company name, tagline, round, contact)
**Slide 2: Problem** (3-5 customer pain points with stats/quotes)
**Slide 3: Solution** (product description, key features, screenshots)
**Slide 4: Market Opportunity** (TAM, SAM, SOM, market trends)
**Slide 5: Business Model** (revenue streams, pricing, unit economics)
**Slide 6: Traction** (key metrics, hockey stick chart, milestones)
**Slide 7: Product Demo** (screenshots or video link)
**Slide 8: Competitive Landscape** (2x2 matrix, competitive advantages)
**Slide 9: Go-to-Market** (channels, CAC, sales cycle, roadmap)
**Slide 10: Team** (founders, key hires, advisors, backgrounds)
**Slide 11: Financials** (5-year projections, assumptions, path to profitability)
**Slide 12: The Ask** (amount, use of funds, milestones, runway)
**Slide 13+: Appendix** (testimonials, roadmap, detailed financials)

### Section 3: Design & Storytelling
- Design principles (simple, visual-first, consistent, one idea per slide)
- Design tool and template choice
- Narrative arc (hook, setup, solution, proof, vision, ask)
- Opening hook (first 30 seconds)
- Storytelling tips (personal story, customer stories, show don't tell)

### Section 4: Practice & Delivery
- Practice schedule (Week 1: Content, Week 2: Design, Week 3: Practice)
- Pitch timing (10-15 minutes for deck, 5-10 minutes for Q&A)
- Common investor questions and answers
- Follow-up materials (send deck, exec summary, data room access)

### Section 5: Investor Outreach Strategy
- Target investor list (20-50 investors aligned with stage, sector, geography)
- Warm intro strategy (leverage network, mutual connections, advisors)
- Cold outreach (email template for cold outreach)
- Meeting progression (intro meeting → partner meeting → due diligence → term sheet)

### Section 6: Next Steps
- Finalize deck this week
- Practice pitch with 3 advisors
- Build target investor list (20-50 names)
- Start outreach next week

---

## STEP 5: Quality Review & Iteration

After generating the strategy, I will ask:

**Quality Check**:
1. Does the deck tell a compelling story (problem → solution → traction → vision → ask)?
2. Is the traction slide strong (hockey stick chart, clear metrics)?
3. Are unit economics healthy (LTV:CAC > 3:1, gross margin > 70%)?
4. Is the ask clear (amount, use of funds, milestones)?
5. Is the design clean and visual (not text-heavy)?
6. Can you pitch this deck in 10-15 minutes?

**Iterate?** [Yes — refine X / No — finalize]

---

## STEP 6: Save & Next Steps

Once finalized, I will:
1. **Save** the investor pitch deck content to your project folder
2. **Suggest** running **financial-model-architect** next (to build detailed financial projections)
3. **Remind** you to practice your pitch with advisors before investor meetings

---

## 8 Critical Guidelines for This Skill

1. **Traction is the most important slide**: Investors bet on momentum. Show clear, undeniable growth (hockey stick chart).

2. **Problem > Solution**: Spend more time on the problem than the solution. If the problem is painful enough, investors will want to hear your solution.

3. **Show, don't tell**: Use visuals (charts, screenshots, photos) instead of text. Investors want to see, not read.

4. **Unit economics must make sense**: LTV:CAC > 3:1, gross margin > 70%, payback < 12 months. If your economics don't work, fix them before fundraising.

5. **Be specific with the ask**: Don't say "raising $2-5M". Say "raising $2.5M at $10M post-money valuation for 18 months runway."

6. **Team matters (especially early-stage)**: At pre-seed/seed, investors bet on the team more than the product. Show why you're uniquely qualified to win.

7. **Pitch in 10-15 minutes**: Investors have short attention spans. Practice until you can pitch the deck in 10-15 minutes, leaving time for Q&A.

8. **Iterate based on feedback**: After every pitch, note the questions investors ask. Update your deck to address those questions proactively.

---

## Quality Checklist (Before Finalizing)

- [ ] Deck tells a clear story (problem → solution → market → traction → vision → ask)
- [ ] Problem slide has 3-5 specific customer pain points with stats/quotes
- [ ] Solution slide has product screenshots or demo video
- [ ] Market slide has TAM, SAM, SOM with sources
- [ ] Business model slide has unit economics (ARPU, CAC, LTV, LTV:CAC, gross margin)
- [ ] Traction slide has hockey stick chart with 3-5 key metrics
- [ ] Competitive slide has 2x2 matrix showing differentiation
- [ ] Team slide has founders + key hires with relevant backgrounds
- [ ] Financial slide has 3-5 year projections with key assumptions
- [ ] Ask slide is specific (amount, use of funds, milestones, runway)
- [ ] Design is clean and visual (not text-heavy)
- [ ] Deck can be pitched in 10-15 minutes

---

## Integration with Other Skills

**Upstream Skills** (reuse data from):
- **problem-validation-study** → Problem statement, customer pain points, quotes
- **customer-persona-builder** → Target customer, market size (TAM/SAM/SOM)
- **product-positioning-expert** → Unique value proposition, differentiation, competitive advantages
- **competitive-intelligence** → Competitive landscape, competitor strengths/weaknesses
- **revenue-model-builder** → Business model, pricing, unit economics (ARPU, CAC, LTV, margins)
- **metrics-dashboard-designer** → Traction metrics (MRR, growth rate, retention, NPS)
- **go-to-market-planner** → GTM strategy, channels, customer acquisition roadmap
- **financial-model-architect** → Financial projections, burn rate, runway, path to profitability
- **team** → Founder backgrounds, key hires, advisors

**Downstream Skills** (use this data in):
- **financial-model-architect** → Detailed 5-year financial model for appendix
- **investor-brief-writer** → Executive summary for email outreach
- **fundraising-strategy-planner** → Investor outreach strategy, meeting progression
- **operational-playbook-creator** → Use of funds breakdown informs hiring and ops plan

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
   html-templates/investor-pitch-deck-builder.html
   ```

### How to Use Templates

1. Read `VERIFICATION-CHECKLIST.md` first - contains canonical CSS patterns that MUST be copied exactly
2. Read `base-template.html` - contains all shared CSS, layout structure, and Chart.js configuration
3. Read `investor-pitch-deck-builder.html` - contains skill-specific content sections, CSS extensions, and chart scripts
4. Replace all `{{PLACEHOLDER}}` markers with actual analysis data
5. Merge the skill-specific CSS into `{{SKILL_SPECIFIC_CSS}}`
6. Merge the content sections into `{{CONTENT_SECTIONS}}`
7. Merge the chart scripts into `{{CHART_SCRIPTS}}`

---

## HTML Output Verification

Before delivering the HTML report, verify:

### Structure Verification
- [ ] Header follows canonical StratArts pattern with skill name and timestamp
- [ ] Score banner displays 6 key metrics (Raise, Valuation, MRR, TAM, Slides, Pitch Time)
- [ ] All 10 sections present with proper content
- [ ] Footer includes StratArts branding and regeneration guidance

### Chart Verification (4 Charts Required)
- [ ] **Revenue Growth Chart** (Line) - MRR hockey stick over 12 months
- [ ] **Customer Growth Chart** (Bar) - Quarterly customer count
- [ ] **5-Year Projection Chart** (Bar) - ARR by year
- [ ] **Use of Funds Chart** (Doughnut) - Fund allocation breakdown

### Content Verification
- [ ] Executive summary covers pitch, ask, why now, milestones
- [ ] Slide overview shows all 12 slide thumbnails with titles
- [ ] Key slides have detailed content (problem, solution, traction at minimum)
- [ ] Traction metrics show 4 key metrics with growth indicators
- [ ] Competitive matrix is 2x2 with company in differentiated quadrant
- [ ] Team section includes 3 founders/key hires with bios
- [ ] Financial table shows 5-year projections (ARR, customers, margin, headcount)
- [ ] Use of funds breakdown totals 100% with descriptions
- [ ] Design section covers principles, narrative arc, opening hook, timeline

### Visual Verification
- [ ] Dark theme applied (#0a0a0a background, #1a1a1a containers)
- [ ] Emerald accent (#10b981) used consistently
- [ ] Slide preview cards have proper 16:9 aspect ratio
- [ ] Charts render correctly with Chart.js v4.4.0
- [ ] All sections have proper spacing and visual hierarchy

---

**End of Skill**
