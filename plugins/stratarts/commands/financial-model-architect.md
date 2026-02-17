---
name: financial-model-architect
description: Build comprehensive 3-5 year financial models projecting revenue, expenses, headcount, cash flow, and runway. Model unit economics, scenario planning, and path to profitability. Generate investor-ready HTML reports with detailed projections and charts.
version: 1.0.0
category: fundraising-operations
---

# financial-model-architect

**Mission**: Build a comprehensive 3-5 year financial model that projects revenue, expenses, headcount, cash flow, and runway. Model unit economics, scenario planning (base/upside/downside), and path to profitability. Create a single source of truth for financial planning and investor due diligence.

---

## STEP 0: Pre-Generation Verification

Before generating the HTML output, verify all required data is collected:

### Header & Score Banner
- [ ] `{{BUSINESS_NAME}}` - Company/product name
- [ ] `{{DATE}}` - Report generation date
- [ ] `{{FORECAST_YEARS}}` - Forecast period (e.g., "5-Year")
- [ ] `{{YEAR5_ARR}}` - Year 5 ARR projection (e.g., "$12M")
- [ ] `{{CURRENT_MRR}}` - Current MRR (e.g., "$85K")
- [ ] `{{RUNWAY}}` - Current runway (e.g., "18mo")
- [ ] `{{LTV_CAC}}` - LTV:CAC ratio (e.g., "4.2:1")
- [ ] `{{YEAR5_HEADCOUNT}}` - Year 5 headcount (e.g., "145")
- [ ] `{{RULE_OF_40}}` - Rule of 40 score (e.g., "75")

### Executive Summary
- [ ] `{{EXECUTIVE_SUMMARY}}` - 2-3 paragraphs with model overview and key assumptions
- [ ] `{{SUMMARY_METRICS}}` - 5 key metric cards (ARR, customers, burn, cash, headcount)

### Revenue Model
- [ ] `{{REVENUE_ASSUMPTIONS}}` - 4 assumption cards (ARPU, ARPU growth, starting churn, target churn)
- [ ] `{{REVENUE_ROWS}}` - 5 year rows with customers, ARPU, MRR, ARR, churn, NRR

### Cost Structure
- [ ] `{{COGS_ROWS}}` - 5 year rows with revenue, COGS, gross profit, gross margin
- [ ] `{{OPEX_YEAR_HEADERS}}` - Year column headers for OpEx table
- [ ] `{{OPEX_ROWS}}` - S&M, R&D, G&A rows with 5 year data + total row

### Headcount
- [ ] `{{HEADCOUNT_YEAR_HEADERS}}` - Year column headers
- [ ] `{{HEADCOUNT_ROWS}}` - Department rows (Eng, Product, Sales, Marketing, CS, G&A) + total

### Unit Economics
- [ ] `{{UNIT_ECON_CARDS}}` - 3 cards (CAC, LTV, LTV:CAC with formulas and benchmarks)
- [ ] `{{UNIT_ECON_ROWS}}` - 5 year rows with CAC, LTV, LTV:CAC, payback, magic #

### Cash Flow
- [ ] `{{CASHFLOW_METRICS}}` - 4 metric cards (burn, cash, runway, next raise)
- [ ] `{{CASHFLOW_ROWS}}` - 5 year rows with revenue, expenses, net burn, fundraising, cash balance

### Scenarios
- [ ] `{{SCENARIO_CARDS}}` - 3 scenario cards (base, upside, downside)
  - Each: name, probability, 5 metrics (ARR, customers, headcount, margin, cash)

### Profitability
- [ ] `{{PROFITABILITY_MILESTONES}}` - 3 milestones (gross profit, cash flow positive, net profit)
- [ ] `{{GROWTH_RATE}}` - Current ARR growth rate
- [ ] `{{NET_MARGIN}}` - Current net margin
- [ ] `{{RULE40_CLASS}}` - CSS class ("healthy" or "warning")
- [ ] `{{RULE40_ROWS}}` - 5 year rows with growth, margin, Rule of 40, status

### Charts
- [ ] `{{YEAR_LABELS}}` - JSON array of year labels
- [ ] `{{ARR_DATA}}` - JSON array of ARR values
- [ ] `{{EXPENSE_LABELS}}` - JSON array of expense categories
- [ ] `{{EXPENSE_DATA}}` - JSON array of expense amounts
- [ ] `{{CASH_DATA}}` - JSON array of cash balance values
- [ ] `{{HEADCOUNT_DATA}}` - JSON array of headcount values

### Roadmap
- [ ] `{{ROADMAP_PHASES}}` - 4 phases (Revenue, Cost, Cash/Unit Econ, Validation)
  - Each phase: name, timing, 4 tasks

---

## STEP 1: Detect Previous Context

### Ideal Context (All Present):
- **revenue-model-builder** → Pricing, revenue streams, unit economics (CAC, LTV, ARPU)
- **metrics-dashboard-designer** → Current metrics (MRR, customers, growth rate)
- **investor-pitch-deck-builder** → Fundraising amount, use of funds, milestones
- **go-to-market-planner** → Customer acquisition strategy, CAC by channel

### Partial Context (Some Present):
- **revenue-model-builder** → Pricing and unit economics available
- **metrics-dashboard-designer** → Current traction metrics available

### No Context:
- None of the above skills were run

---

## STEP 2: Context-Adaptive Introduction

### If Ideal Context:
> I found outputs from **revenue-model-builder**, **metrics-dashboard-designer**, **investor-pitch-deck-builder**, and **go-to-market-planner**.
>
> I can reuse:
> - **Pricing & revenue streams** (pricing tiers, revenue model)
> - **Unit economics** (ARPU: [$X], CAC: [$Y], LTV: [$Z], LTV:CAC: [ratio])
> - **Current traction** (MRR: [$X], customers: [Y], growth rate: [Z% MoM])
> - **Fundraising plan** (raising: [$X], use of funds: [product/GTM/ops split])
> - **GTM strategy** (customer acquisition channels, CAC by channel)
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
> I'll guide you through building your financial model from the ground up.

---

## STEP 3: Questions (One at a Time, Sequential)

### Model Basics & Current State

**Question MB1: What is the baseline for your financial model?**

**Current State** (as of today):

**Revenue Metrics**:
- **MRR (Monthly Recurring Revenue)**: [$X or $0 if pre-revenue]
- **ARR (Annual Recurring Revenue)**: [$X or $0]
- **# of Paying Customers**: [X or 0]
- **ARPU (Average Revenue Per User)**: [$X/month or "TBD"]

**Cost Metrics**:
- **Monthly Burn Rate**: [$X/month — total expenses minus revenue]
- **Current Headcount**: [X employees]
- **Cash Balance**: [$X]
- **Runway**: [X months]

**Growth Metrics**:
- **MRR Growth Rate**: [X% MoM]
- **Customer Growth Rate**: [X% MoM]
- **Churn Rate**: [X% per month]

**Your Current State**:
- MRR: [$X]
- Customers: [X]
- Burn Rate: [$X/month]
- Cash Balance: [$X]
- Runway: [X months]

---

**Question MB2: What is your forecasting timeframe?**

**Forecasting Period**:
- ☐ **3 Years** (standard for seed/Series A)
- ☐ **5 Years** (standard for Series B+, more mature companies)
- ☐ **10 Years** (rare, only for long-term strategic planning)

**Your Timeframe**: [e.g., "5 years — 2024 to 2028"]

**Forecast Granularity**:
- ☐ **Monthly** (Year 1 only, then annual)
- ☐ **Quarterly** (Years 1-2, then annual)
- ☐ **Annual** (All years)

**Your Granularity**: [e.g., "Monthly for Year 1, quarterly for Year 2, annual for Years 3-5"]

---

### Revenue Projections

**Question RP1: What are your revenue assumptions?**

**Revenue Model** (from revenue-model-builder):
- **Primary Revenue Stream**: [e.g., "SaaS subscription"]
- **Pricing**: [e.g., "$99/mo per user"]
- **ARPU**: [e.g., "$150/month" (accounting for multi-user accounts)]

**Growth Assumptions**:

### Customer Growth
- **Starting Customers** (today): [e.g., "200 customers"]
- **Customer Growth Rate**:
  - Year 1: [e.g., "20% MoM → 3x growth → 600 customers"]
  - Year 2: [e.g., "10% MoM → 3x growth → 1,800 customers"]
  - Year 3: [e.g., "7% MoM → 2x growth → 3,600 customers"]
  - Year 4: [e.g., "5% MoM → 1.5x growth → 5,400 customers"]
  - Year 5: [e.g., "4% MoM → 1.5x growth → 8,100 customers"]

### ARPU Growth (expansion revenue)
- **Starting ARPU**: [e.g., "$150/month"]
- **ARPU Growth Rate**:
  - Year 1: [e.g., "5% YoY → $158/month"]
  - Year 2: [e.g., "5% YoY → $166/month"]
  - Year 3-5: [e.g., "3% YoY → $176, $181, $186/month"]

**Why ARPU grows**: [e.g., "Customers add more users, upgrade to higher tiers, purchase add-ons"]

### Churn Rate
- **Current Churn**: [e.g., "5% per month" or "60% annually"]
- **Churn Improvement**:
  - Year 1: [e.g., "5% → 4% per month (48% annually)"]
  - Year 2: [e.g., "4% → 3% per month (36% annually)"]
  - Year 3-5: [e.g., "Stable at 3% per month"]

**Why churn improves**: [e.g., "Better onboarding, product improvements, customer success team"]

**Your Revenue Assumptions** (fill in):
- Starting Customers: [X]
- Customer Growth (Y1-Y5): [X%, Y%, Z%]
- Starting ARPU: [$X]
- ARPU Growth (Y1-Y5): [X%, Y%, Z%]
- Churn Rate (Y1-Y5): [X%, Y%, Z%]

---

**Question RP2: What is your revenue forecast?**

**Revenue Projection Table** (calculate based on assumptions above):

| Year | Customers | ARPU     | MRR      | ARR      | Churn % |
|------|-----------|----------|----------|----------|---------|
| 2024 | 200       | $150     | $30K     | $360K    | 5%      |
| 2025 | 600       | $158     | $95K     | $1.1M    | 4%      |
| 2026 | 1,800     | $166     | $299K    | $3.6M    | 3%      |
| 2027 | 3,600     | $176     | $634K    | $7.6M    | 3%      |
| 2028 | 5,400     | $186     | $1M      | $12M     | 3%      |

**Revenue Waterfall** (MRR breakdown):

**Starting MRR**: [$X]
+ **New MRR** (from new customers): [+$X]
+ **Expansion MRR** (upsells, add-ons): [+$X]
- **Churned MRR** (lost customers): [-$X]
**Ending MRR**: [$X]

**Net Revenue Retention (NRR)**:
- NRR = (Starting MRR + Expansion MRR - Churned MRR) / Starting MRR
- Target: **>100% NRR** (expansion offsets churn)

**Your Revenue Forecast** (use template above, fill in numbers)

---

### Cost Structure & Expenses

**Question CS1: What are your cost of goods sold (COGS)?**

**COGS** = Direct costs to deliver your product/service

**SaaS COGS** (typical):
- ☐ **Hosting** (AWS, Google Cloud, etc.) — [e.g., "$5 per customer per month"]
- ☐ **Third-Party Services** (APIs, payment processing, etc.) — [e.g., "2% of revenue"]
- ☐ **Customer Support** (if support team scales with customers) — [e.g., "$10 per customer per month"]
- ☐ **Other**: [specify]

**Your COGS Components**:
1. [Component 1] — [Cost per customer or % of revenue]
2. [Component 2] — [Cost per customer or % of revenue]
3. [Component 3] — [Cost per customer or % of revenue]

**Gross Margin Target**: [e.g., "75%" — typical for SaaS is 70-85%]

**COGS Projection**:

| Year | Revenue | COGS    | Gross Profit | Gross Margin |
|------|---------|---------|--------------|--------------|
| 2024 | $360K   | $90K    | $270K        | 75%          |
| 2025 | $1.1M   | $275K   | $825K        | 75%          |
| 2026 | $3.6M   | $900K   | $2.7M        | 75%          |
| 2027 | $7.6M   | $1.9M   | $5.7M        | 75%          |
| 2028 | $12M    | $3M     | $9M          | 75%          |

---

**Question CS2: What are your operating expenses?**

**Operating Expenses (OpEx)** = All non-COGS expenses

**OpEx Categories**:

### 1. Sales & Marketing
- **Headcount**: Sales reps, SDRs, marketing, customer success
- **Programs**: Paid ads, content, events, tools (CRM, marketing automation)

### 2. Research & Development (Product & Engineering)
- **Headcount**: Engineers, product managers, designers
- **Tools**: Development tools, software licenses, hosting (non-COGS)

### 3. General & Administrative (G&A)
- **Headcount**: CEO, CFO, finance, legal, HR, operations
- **Programs**: Legal fees, accounting, insurance, office rent, tools

**Your OpEx Breakdown** (by year):

| Category         | 2024   | 2025   | 2026   | 2027   | 2028   |
|------------------|--------|--------|--------|--------|--------|
| Sales & Marketing| $200K  | $500K  | $1.2M  | $2.5M  | $4M    |
| R&D              | $300K  | $750K  | $1.5M  | $3M    | $5M    |
| G&A              | $100K  | $250K  | $500K  | $1M    | $1.5M  |
| **Total OpEx**   | **$600K** | **$1.5M** | **$3.2M** | **$6.5M** | **$10.5M** |

**OpEx as % of Revenue**:
- Early stage: 150-300% of revenue (burning cash to grow)
- Growth stage: 100-150% of revenue (path to profitability)
- Mature stage: 50-70% of revenue (profitable)

---

### Headcount Planning

**Question HC1: What is your headcount plan?**

**Headcount by Department**:

| Department       | Today | Y1   | Y2   | Y3   | Y4   | Y5   |
|------------------|-------|------|------|------|------|------|
| Engineering      | 3     | 8    | 15   | 25   | 40   | 60   |
| Product          | 1     | 2    | 4    | 7    | 10   | 15   |
| Sales            | 2     | 5    | 12   | 25   | 40   | 60   |
| Marketing        | 1     | 3    | 6    | 10   | 15   | 20   |
| Customer Success | 1     | 3    | 7    | 15   | 25   | 35   |
| G&A (Ops, Finance)| 1    | 3    | 6    | 10   | 15   | 20   |
| **Total**        | **9** | **24** | **50** | **92** | **145** | **210** |

**Average Salary by Department** (including benefits, taxes, overhead):

| Department       | Avg Annual Salary |
|------------------|-------------------|
| Engineering      | $150K             |
| Product          | $140K             |
| Sales            | $120K (base + commission) |
| Marketing        | $100K             |
| Customer Success | $80K              |
| G&A              | $120K             |

**Total Personnel Cost** (headcount × avg salary):

| Year | Headcount | Avg Salary | Total Personnel Cost |
|------|-----------|------------|----------------------|
| 2024 | 9         | $120K      | $1.1M                |
| 2025 | 24        | $120K      | $2.9M                |
| 2026 | 50        | $120K      | $6M                  |
| 2027 | 92        | $120K      | $11M                 |
| 2028 | 145       | $120K      | $17.4M               |

---

**Question HC2: When will you hire each role?**

**Hiring Roadmap** (next 12-24 months):

### Q1 2024
- [Hire 1] — e.g., "Senior Engineer (backend)"
- [Hire 2] — e.g., "Account Executive (sales)"

### Q2 2024
- [Hire 3] — e.g., "Product Designer"
- [Hire 4] — e.g., "Customer Success Manager"

### Q3 2024
- [Hire 5] — e.g., "Engineering Manager"
- [Hire 6] — e.g., "SDR (sales development rep)"

### Q4 2024
- [Hire 7] — e.g., "Marketing Manager"
- [Hire 8] — e.g., "Senior Engineer (frontend)"

**Your Hiring Roadmap** (fill in next 4 quarters)

---

### Cash Flow & Burn Rate

**Question CF1: What is your burn rate and runway?**

**Burn Rate** = Total monthly expenses - Revenue

**Burn Rate Calculation**:

| Month    | Revenue | Total Expenses | Burn Rate | Cash Balance | Runway (months) |
|----------|---------|----------------|-----------|--------------|-----------------|
| Jan 2024 | $30K    | $80K           | -$50K     | $500K        | 10 months       |
| Feb 2024 | $32K    | $82K           | -$50K     | $450K        | 9 months        |
| Mar 2024 | $35K    | $85K           | -$50K     | $400K        | 8 months        |
| [...]    | [...]   | [...]          | [...]     | [...]        | [...]           |

**Runway** = Cash Balance / Monthly Burn Rate

**Your Burn Rate** (current):
- Revenue: [$X/month]
- Expenses: [$Y/month]
- Burn Rate: [$Z/month]
- Cash Balance: [$X]
- Runway: [X months]

---

**Question CF2: How will fundraising impact your runway?**

**Fundraising Scenario**:

**Before Fundraising**:
- Cash Balance: [$X]
- Monthly Burn: [$Y]
- Runway: [X months]

**After Fundraising** (assuming you raise [$Z]):
- Cash Balance: [$X + $Z]
- Monthly Burn: [$Y] (will increase as you hire)
- Runway: [X months]

**Use of Funds** (from investor-pitch-deck-builder):
- Product/Engineering: [X%] → [$X] → [Hire X engineers]
- Sales & Marketing: [Y%] → [$Y] → [Hire Y sales/marketing]
- Operations: [Z%] → [$Z] → [Hire Z ops/finance]

**Post-Fundraising Burn Rate**:
- New hires: [+$X/month in salaries]
- New programs: [+$Y/month in marketing spend]
- **New Monthly Burn**: [$Z/month]
- **New Runway**: [X months — target 18-24 months to next round]

**Your Post-Fundraising Plan** (fill in)

---

### Unit Economics & Key Metrics

**Question UE1: What are your unit economics?**

**Unit Economics** = Economics of acquiring and retaining one customer

**Key Metrics**:

1. **CAC (Customer Acquisition Cost)**:
   - CAC = (Sales + Marketing Spend) / # of New Customers
   - Your CAC: [$X]
   - Benchmark: [Varies by industry — SaaS B2B: $500-$5K, B2C: $50-$500]

2. **LTV (Lifetime Value)**:
   - LTV = (ARPU × Gross Margin) / Churn Rate
   - Your LTV: [$X]
   - Example: ($150 × 75%) / 3% monthly churn = $3,750

3. **LTV:CAC Ratio**:
   - LTV:CAC = LTV / CAC
   - Your LTV:CAC: [X:1]
   - Benchmark: **>3:1** (healthy), **1:1** (unprofitable), **>5:1** (underinvesting in growth)

4. **Payback Period**:
   - Payback = CAC / (ARPU × Gross Margin)
   - Your Payback: [X months]
   - Benchmark: **<12 months** (good), **<6 months** (excellent)

5. **Magic Number** (Sales Efficiency):
   - Magic Number = (Net New ARR in Q) / (S&M Spend in Prior Q)
   - Your Magic Number: [X]
   - Benchmark: **>0.75** (good), **>1.0** (excellent)

6. **Burn Multiple** (Capital Efficiency):
   - Burn Multiple = Net Burn / Net New ARR
   - Your Burn Multiple: [X]
   - Benchmark: **<1.5** (good), **<1.0** (excellent)

**Your Unit Economics** (fill in):
- CAC: [$X]
- LTV: [$X]
- LTV:CAC: [X:1]
- Payback Period: [X months]
- Magic Number: [X]
- Burn Multiple: [X]

---

**Question UE2: How will unit economics improve over time?**

**Unit Economics Roadmap**:

| Year | CAC    | LTV    | LTV:CAC | Payback (mo) | Why Improving?                                   |
|------|--------|--------|---------|--------------|--------------------------------------------------|
| 2024 | $1,000 | $3,000 | 3:1     | 9 months     | Baseline                                         |
| 2025 | $900   | $3,500 | 3.9:1   | 7 months     | Better sales efficiency, lower churn             |
| 2026 | $800   | $4,000 | 5:1     | 6 months     | Product-led growth, improved retention           |
| 2027 | $700   | $4,500 | 6.4:1   | 5 months     | Brand awareness, word-of-mouth, NRR >100%        |
| 2028 | $600   | $5,000 | 8.3:1   | 4 months     | Scale efficiencies, mature product               |

**How to improve unit economics**:
- **Reduce CAC**: Product-led growth, inbound marketing, partnerships, brand awareness
- **Increase LTV**: Improve retention, upsell/cross-sell, expand into higher-ARPU customers
- **Increase Gross Margin**: Negotiate better hosting rates, improve product efficiency

---

### Scenario Planning

**Question SP1: What are your scenario assumptions?**

**Scenario Planning** = Model 3 scenarios (Base Case, Upside, Downside)

**Base Case** (50% probability — most likely outcome):
- Revenue growth: [X% YoY]
- Churn: [Y%]
- CAC: [$Z]
- Fundraising: [Raise $X in Y months]

**Upside Case** (20% probability — optimistic):
- Revenue growth: [X% YoY — higher than base]
- Churn: [Y% — lower than base]
- CAC: [$Z — lower than base]
- Fundraising: [Raise more, faster, or don't need to raise]

**Downside Case** (30% probability — pessimistic):
- Revenue growth: [X% YoY — lower than base]
- Churn: [Y% — higher than base]
- CAC: [$Z — higher than base]
- Fundraising: [Raise less, slower, or can't raise]

**Your Scenarios** (fill in assumptions for each):

| Assumption             | Base Case | Upside Case | Downside Case |
|------------------------|-----------|-------------|---------------|
| Revenue Growth (YoY)   | 3x        | 5x          | 2x            |
| Churn Rate             | 4%        | 3%          | 6%            |
| CAC                    | $1,000    | $800        | $1,500        |
| Fundraising Amount     | $2.5M     | $4M         | $1.5M         |
| Fundraising Timeline   | 6 months  | 3 months    | 9 months      |

---

**Question SP2: What is your financial forecast for each scenario?**

**Scenario Comparison Table** (Year 5 results):

| Metric              | Base Case | Upside Case | Downside Case |
|---------------------|-----------|-------------|---------------|
| ARR                 | $12M      | $25M        | $6M           |
| Customers           | 5,400     | 10,000      | 3,000         |
| Gross Margin        | 75%       | 78%         | 72%           |
| Net Margin          | -10%      | +15%        | -25%          |
| Cash Balance        | $2M       | $8M         | $500K         |
| Headcount           | 145       | 220         | 90            |
| Runway (if negative)| —         | —           | 6 months      |

**Scenario Analysis** (for investors):
- **Base Case**: We hit $12M ARR, breakeven in Year 6, strong position for Series B
- **Upside Case**: We hit $25M ARR, profitable in Year 5, market leader
- **Downside Case**: We hit $6M ARR, need bridge round or cut burn to extend runway

---

### Path to Profitability

**Question PP1: When will you be profitable?**

**Profitability Milestones**:

### 1. Gross Profit (Revenue - COGS)
- **When**: [Year X, Quarter X]
- **What changes**: [e.g., "Scale efficiencies, negotiate better hosting rates"]

### 2. Cash Flow Positive (Revenue > Total Expenses)
- **When**: [Year X, Quarter X]
- **What changes**: [e.g., "Revenue scales faster than expenses, sales efficiency improves"]

### 3. Net Profit (Accounting profitability)
- **When**: [Year X, Quarter X]
- **What changes**: [e.g., "OpEx stabilizes as % of revenue, mature business model"]

**Your Path to Profitability**:
- Gross Profit: [Year X]
- Cash Flow Positive: [Year X]
- Net Profit: [Year X]

**Profitability Levers** (how to get there faster):
1. [Lever 1] — e.g., "Increase ARPU by 20% via upsells"
2. [Lever 2] — e.g., "Reduce CAC by 30% via product-led growth"
3. [Lever 3] — e.g., "Reduce churn by 50% via improved onboarding"

---

**Question PP2: What is your Rule of 40 trajectory?**

**Rule of 40** = Growth Rate + Profit Margin
- **>40%**: Healthy SaaS business
- **<40%**: Unbalanced (growing too fast at expense of margin, or too slow/unprofitable)

**Rule of 40 Calculation**:

| Year | ARR Growth | Net Margin | Rule of 40 | Healthy? |
|------|------------|------------|------------|----------|
| 2024 | 200%       | -80%       | 120        | ✅ Yes   |
| 2025 | 200%       | -50%       | 150        | ✅ Yes   |
| 2026 | 200%       | -20%       | 180        | ✅ Yes   |
| 2027 | 100%       | 0%         | 100        | ✅ Yes   |
| 2028 | 60%        | +15%       | 75         | ✅ Yes   |

**Your Rule of 40 Trajectory** (fill in table above)

---

### Financial Statements

**Question FS1: What financial statements will you generate?**

**Core Financial Statements**:

### 1. Income Statement (P&L — Profit & Loss)
- **Revenue** (MRR × 12 = ARR)
- **COGS** (hosting, support, etc.)
- **Gross Profit** (Revenue - COGS)
- **Operating Expenses** (S&M, R&D, G&A)
- **EBITDA** (Earnings Before Interest, Taxes, Depreciation, Amortization)
- **Net Income** (EBITDA - Interest - Taxes - D&A)

### 2. Cash Flow Statement
- **Operating Cash Flow** (cash from operations)
- **Investing Cash Flow** (CapEx, acquisitions)
- **Financing Cash Flow** (fundraising, debt)
- **Net Change in Cash**
- **Ending Cash Balance**

### 3. Balance Sheet
- **Assets** (cash, accounts receivable, equipment)
- **Liabilities** (accounts payable, debt, deferred revenue)
- **Equity** (shareholder equity, retained earnings)

**Your Financial Statements** (which ones will you build?):
- ☐ Income Statement (P&L) — **Required**
- ☐ Cash Flow Statement — **Required**
- ☐ Balance Sheet — Optional (required for Series A+ due diligence)

**Tool**:
- ☐ **Excel / Google Sheets** (most common)
- ☐ **Financial modeling software** (Causal, Forecastr, etc.)
- ☐ **Accounting software with forecasting** (QuickBooks, Xero)

**Your Tool**: [Choose one]

---

### Implementation Roadmap

**Question IR1: What is your financial model build timeline?**

### Phase 1: Revenue Model (Week 1)
- **Day 1-2**: Define revenue assumptions (customer growth, ARPU, churn)
- **Day 3-4**: Build revenue projections (MRR, ARR, waterfall)
- **Day 5**: Calculate NRR, gross margin

### Phase 2: Cost Model (Week 2)
- **Day 1-2**: Define COGS assumptions (hosting, support, etc.)
- **Day 3-4**: Define OpEx assumptions (headcount, programs)
- **Day 5**: Build expense projections (by department, by month/quarter/year)

### Phase 3: Cash Flow & Unit Economics (Week 3)
- **Day 1-2**: Build cash flow statement (burn rate, runway, fundraising)
- **Day 3-4**: Calculate unit economics (CAC, LTV, LTV:CAC, payback)
- **Day 5**: Build scenario models (base, upside, downside)

### Phase 4: Validation & Documentation (Week 4)
- **Day 1-2**: Validate assumptions with team (finance, sales, product)
- **Day 3**: Build path to profitability analysis (Rule of 40, breakeven date)
- **Day 4**: Document assumptions (write memo explaining all assumptions)
- **Day 5**: Create investor-ready outputs (summary slides, charts, sensitivity analysis)

---

## STEP 4: Generate Comprehensive Financial Model

**You will now receive a comprehensive document covering**:

### Section 1: Executive Summary
- Current state (MRR, customers, burn rate, runway)
- 5-year forecast summary (ARR by year, headcount, cash balance)
- Key assumptions (growth rate, churn, CAC, LTV)
- Path to profitability (when cash flow positive, Rule of 40 trajectory)

### Section 2: Revenue Model
- Revenue assumptions (customer growth, ARPU growth, churn improvement)
- Revenue projections (5-year table: customers, ARPU, MRR, ARR)
- Revenue waterfall (starting MRR + new + expansion - churn = ending MRR)
- Net Revenue Retention (NRR) analysis

### Section 3: Cost Model
- COGS assumptions and projections (gross margin: 70-85%)
- OpEx breakdown (S&M, R&D, G&A by year)
- Headcount plan (by department, by year, with avg salaries)
- Hiring roadmap (next 4 quarters)

### Section 4: Cash Flow & Burn Rate
- Monthly burn rate calculation (revenue - total expenses)
- Runway analysis (current and post-fundraising)
- Cash flow statement (operating, investing, financing cash flows)
- Fundraising impact (use of funds, new runway)

### Section 5: Unit Economics
- CAC, LTV, LTV:CAC ratio, payback period
- Magic Number (sales efficiency), Burn Multiple (capital efficiency)
- Unit economics improvement roadmap (Year 1-5)
- How to improve (reduce CAC, increase LTV, improve margins)

### Section 6: Scenario Planning
- Base Case (50% probability)
- Upside Case (20% probability)
- Downside Case (30% probability)
- Scenario comparison table (Year 5 ARR, customers, margins, cash, headcount)

### Section 7: Path to Profitability
- Profitability milestones (gross profit, cash flow positive, net profit)
- Profitability levers (increase ARPU, reduce CAC, reduce churn)
- Rule of 40 trajectory (growth rate + profit margin)

### Section 8: Financial Statements
- Income Statement (P&L) — 5-year projections
- Cash Flow Statement — 5-year projections
- Balance Sheet (optional) — 5-year projections

### Section 9: Investor-Ready Outputs
- Summary slides (for pitch deck appendix)
- Key metrics dashboard (ARR, customers, burn, runway, unit economics)
- Sensitivity analysis (what if growth is 20% higher/lower?)

### Section 10: Next Steps
- Finalize financial model this week
- Review with CFO/finance advisor
- Share with investors during due diligence
- Update quarterly as actuals come in

---

## STEP 5: Quality Review & Iteration

After generating the strategy, I will ask:

**Quality Check**:
1. Are revenue assumptions realistic (benchmarked against comparable companies)?
2. Are unit economics healthy (LTV:CAC > 3:1, payback < 12 months)?
3. Does the model show a path to profitability (Rule of 40 > 40)?
4. Is the cash flow projection accurate (does it account for fundraising and burn?)?
5. Are all assumptions documented (can someone else understand the model)?
6. Is the model flexible (can you easily adjust assumptions and see impact)?

**Iterate?** [Yes — refine X / No — finalize]

---

## STEP 6: Save & Next Steps

Once finalized, I will:
1. **Save** the financial model to your project folder (Excel/Google Sheets)
2. **Suggest** reviewing with a CFO or finance advisor before sharing with investors
3. **Remind** you to update the model quarterly as actuals come in

---

## 8 Critical Guidelines for This Skill

1. **Assumptions > outputs**: Investors care more about your assumptions than your projections. Document every assumption clearly.

2. **Be realistic, not optimistic**: Conservative assumptions build credibility. Overly optimistic projections kill trust.

3. **Unit economics must work**: If LTV:CAC < 3:1 or payback > 12 months, fix your business model before fundraising.

4. **Model 3 scenarios**: Base, upside, downside. Shows you've thought through risks and opportunities.

5. **Update quarterly**: A financial model is a living document. Update it every quarter with actuals.

6. **Show path to profitability**: Investors want to see when you'll be cash flow positive (ideally within 18-24 months of current round).

7. **Rule of 40 > 40**: Growth rate + profit margin should exceed 40%. If not, you're either growing too slowly or burning too much.

8. **Sensitivity analysis**: Show how changes in key assumptions (growth rate, churn, CAC) impact the model. Proves you understand the business.

---

## Quality Checklist (Before Finalizing)

- [ ] Current state baseline is accurate (MRR, customers, burn rate, cash balance)
- [ ] Revenue assumptions are documented (customer growth, ARPU, churn)
- [ ] 5-year revenue projection is complete (MRR, ARR, NRR)
- [ ] COGS and gross margin assumptions are defined (target 70-85%)
- [ ] OpEx breakdown is complete (S&M, R&D, G&A by year)
- [ ] Headcount plan is realistic (by department, with avg salaries)
- [ ] Cash flow projection shows burn rate and runway
- [ ] Unit economics are healthy (LTV:CAC > 3:1, payback < 12 months)
- [ ] 3 scenarios are modeled (base, upside, downside)
- [ ] Path to profitability is clear (when cash flow positive, Rule of 40 trajectory)
- [ ] All assumptions are documented (can someone else understand the model?)

---

## Integration with Other Skills

**Upstream Skills** (reuse data from):
- **revenue-model-builder** → Pricing, revenue streams, unit economics (ARPU, CAC, LTV)
- **metrics-dashboard-designer** → Current traction metrics (MRR, customers, growth rate, churn)
- **investor-pitch-deck-builder** → Fundraising amount, use of funds, milestones
- **go-to-market-planner** → Customer acquisition strategy, CAC by channel, sales cycle

**Downstream Skills** (use this data in):
- **investor-pitch-deck-builder** → Financial projections slide (use 5-year forecast)
- **investor-brief-writer** → Include financial highlights in executive summary
- **fundraising-strategy-planner** → Use burn rate and runway to determine fundraising timeline
- **operational-playbook-creator** → Use headcount plan to inform hiring and org structure

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
   html-templates/financial-model-architect.html
   ```

### How to Use Templates

1. Read `VERIFICATION-CHECKLIST.md` first - contains canonical CSS patterns that MUST be copied exactly
2. Read `base-template.html` - contains all shared CSS, layout structure, and Chart.js configuration
3. Read `financial-model-architect.html` - contains skill-specific content sections, CSS extensions, and chart scripts
4. Replace all `{{PLACEHOLDER}}` markers with actual analysis data
5. Merge the skill-specific CSS into `{{SKILL_SPECIFIC_CSS}}`
6. Merge the content sections into `{{CONTENT_SECTIONS}}`
7. Merge the chart scripts into `{{CHART_SCRIPTS}}`

---

## HTML Output Verification

Before delivering the HTML report, verify:

### Structure Verification
- [ ] Header follows canonical StratArts pattern with skill name and timestamp
- [ ] Score banner displays 6 key metrics (Year 5 ARR, Current MRR, Runway, LTV:CAC, Y5 Headcount, Rule of 40)
- [ ] All 10 sections present with proper content
- [ ] Footer includes StratArts branding and regeneration guidance

### Chart Verification (4 Charts Required)
- [ ] **ARR Growth Chart** (Bar) - 5-year revenue progression
- [ ] **Expense Breakdown Chart** (Doughnut) - Year 5 OpEx by category
- [ ] **Cash Flow Chart** (Line) - Monthly cash balance trajectory
- [ ] **Headcount Growth Chart** (Bar) - 5-year team growth by department

### Content Verification
- [ ] Revenue projections show all 5 years with MRR, ARR, YoY growth, NRR
- [ ] COGS and gross margin calculated correctly (target 70-85%)
- [ ] OpEx breakdown by S&M, R&D, G&A with percentages
- [ ] Headcount plan includes departments, roles, avg salaries
- [ ] Unit economics include CAC, LTV, LTV:CAC, payback period, Magic Number, Burn Multiple
- [ ] All 3 scenarios present (base, upside, downside) with probability weights
- [ ] Path to profitability includes milestones and Rule of 40 trajectory
- [ ] All assumptions are documented and reasonable

### Visual Verification
- [ ] Dark theme applied (#0a0a0a background, #1a1a1a containers)
- [ ] Emerald accent (#10b981) used consistently
- [ ] Tables are readable with proper contrast
- [ ] Charts render correctly with Chart.js v4.4.0
- [ ] All sections have proper spacing and visual hierarchy

---

**End of Skill**
