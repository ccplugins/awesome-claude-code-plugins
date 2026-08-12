---
name: metrics-dashboard-designer
description: Comprehensive metrics dashboard strategy including North Star Metric definition, AARRR Pirate Metrics framework, product engagement tracking, 5 role-specific dashboards, alert configuration, data infrastructure planning, and 90-day implementation roadmap for data-driven decision making
version: 1.0.0
category: retention-metrics
---

# metrics-dashboard-designer

## Step 0: Pre-Generation Verification

**IMPORTANT**: Before generating the HTML output, verify you have gathered data for ALL required placeholders:

### Header & Score Banner Placeholders
- [ ] `{{BUSINESS_NAME}}` - Company/product name
- [ ] `{{DATE}}` - Generation date
- [ ] `{{DASHBOARD_COUNT}}` - Number of dashboards (typically 5)
- [ ] `{{METRIC_COUNT}}` - Total metrics tracked
- [ ] `{{ALERT_COUNT}}` - Number of alerts configured
- [ ] `{{MRR_VALUE}}` - Current MRR
- [ ] `{{LTV_CAC}}` - LTV:CAC ratio
- [ ] `{{FRAMEWORK_TYPE}}` - Framework (e.g., "AARRR PIRATE METRICS")

### North Star Metric Placeholders
- [ ] `{{NSM_VALUE}}` - Current NSM value
- [ ] `{{NSM_NAME}}` - NSM name
- [ ] `{{NSM_DESCRIPTION}}` - Why this metric matters
- [ ] `{{NSM_DRIVERS}}` - 3 driver metric items

### AARRR Placeholders
- [ ] `{{AARRR_STAGES}}` - 5 stage cards with metrics

### Dashboard Placeholders
- [ ] `{{DASHBOARD_CARDS}}` - 5 dashboard cards with metrics lists

### Metrics Dictionary Placeholders
- [ ] `{{METRICS_TABLE_ROWS}}` - 8-10 key metrics with details

### Alerts Placeholders
- [ ] `{{ALERT_CARDS}}` - 6 alert cards with thresholds

### Data Stack Placeholders
- [ ] `{{DATA_STACK_SECTIONS}}` - 3 sections (Sources, Warehouse, Visualization)

### Roadmap Placeholders
- [ ] `{{ROADMAP_PHASES}}` - 3 phase cards

### Chart Data Placeholders
- [ ] `{{FUNNEL_LABELS}}` - JSON array (AARRR stages)
- [ ] `{{FUNNEL_DATA}}` - JSON array (user counts)
- [ ] `{{MRR_LABELS}}` - JSON array (months)
- [ ] `{{MRR_DATA}}` - JSON array (MRR values)
- [ ] `{{RETENTION_LABELS}}` - JSON array (days)
- [ ] `{{RETENTION_DATA}}` - JSON array (percentages)
- [ ] `{{ENGAGEMENT_LABELS}}` - JSON array (days)
- [ ] `{{DAU_DATA}}` - JSON array (DAU values)
- [ ] `{{WAU_DATA}}` - JSON array (WAU values)

**DO NOT proceed to HTML generation until all placeholders have corresponding data from the user conversation.**

---

**Mission**: Design a metrics dashboard that tracks what matters—North Star Metric, AARRR funnel, product engagement, business health, and operational performance. Define KPIs, set targets, choose visualizations, and create a single source of truth for data-driven decision making.

---

## STEP 1: Detect Previous Context

### Ideal Context (All Present):
- **revenue-model-builder** → Revenue streams, unit economics, CAC, LTV
- **customer-persona-builder** → User segments for cohort analysis
- **product-positioning-expert** → Value metrics, success indicators
- **growth-hacking-playbook** → AARRR framework, North Star Metric
- **go-to-market-planner** → GTM metrics, channel performance

### Partial Context (Some Present):
- **revenue-model-builder** → Business metrics available
- **growth-hacking-playbook** → Growth metrics framework available
- **customer-persona-builder** → User segmentation available

### No Context:
- None of the above skills were run

---

## STEP 2: Context-Adaptive Introduction

### If Ideal Context:
> I found outputs from **revenue-model-builder**, **customer-persona-builder**, **product-positioning-expert**, **growth-hacking-playbook**, and **go-to-market-planner**.
>
> I can reuse:
> - **Revenue streams & unit economics** (CAC: [X], LTV: [Y], target margins)
> - **User segments** (for cohort analysis & segmentation)
> - **Value metrics** (core success indicators)
> - **AARRR framework** (Acquisition, Activation, Retention, Referral, Revenue)
> - **GTM metrics** (channel performance, conversion rates)
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
> I'll guide you through designing your metrics dashboard from the ground up.

---

## STEP 3: Questions (One at a Time, Sequential)

### North Star Metric

**Question NSM1: What is your North Star Metric?**

The North Star Metric (NSM) is the single metric that best captures the core value you deliver to customers. It should be:
- **Leading indicator** of sustainable growth
- **Aligned** with customer value and business value
- **Actionable** by the team

**Examples**:
- **Slack**: Messages sent per day
- **Airbnb**: Nights booked
- **Spotify**: Time spent listening
- **Notion**: Weekly active users who create content

**Your North Star Metric**: [e.g., "Monthly Active Projects Created"]

**Why this metric?**: [What customer value does it represent?]

---

**Question NSM2: What is the current baseline and target for your NSM?**

**Current Baseline**: [e.g., "1,200 monthly active projects"]
**3-Month Target**: [e.g., "2,500 monthly active projects"]
**12-Month Target**: [e.g., "10,000 monthly active projects"]

**Key Drivers**: [What 2-3 metrics drive your NSM? e.g., "New user signups, activation rate, returning user rate"]

---

### AARRR Metrics (Pirate Metrics)

**Question AARRR1: ACQUISITION - How do you measure user acquisition?**

**Primary Acquisition Metrics** (choose 3-5):
- ☐ Website visitors (unique, sessions)
- ☐ Signups (total, by channel)
- ☐ App installs (iOS, Android)
- ☐ Lead magnets downloaded
- ☐ Demo requests
- ☐ Trial starts
- ☐ Other: [specify]

**Your Top 3 Acquisition Metrics**:
1. [Metric name] — Current: [X], Target: [Y]
2. [Metric name] — Current: [X], Target: [Y]
3. [Metric name] — Current: [X], Target: [Y]

**By Channel Breakdown**:
- Organic Search: [X%]
- Paid Search: [X%]
- Social Media: [X%]
- Referral: [X%]
- Direct: [X%]
- Other: [X%]

---

**Question AARRR2: ACTIVATION - How do you measure user activation?**

**Activation Definition**: What must a user do to experience the "aha moment"?

**Examples**:
- Facebook: "Add 7 friends in 10 days"
- Dropbox: "Upload first file"
- Slack: "Send 2,000 team messages"

**Your Activation Event**: [e.g., "Create first project with 3+ tasks"]

**Activation Metrics**:
- **Activation Rate**: [e.g., "42% of signups complete activation within 7 days"]
- **Time to Activate**: [e.g., "Median time: 12 hours from signup"]
- **Activation by Cohort**: [e.g., "Organic: 48%, Paid: 38%, Referral: 62%"]

**Current Performance**:
- Activation Rate: [X%]
- Target: [Y%]
- Gap: [Z percentage points]

---

**Question AARRR3: RETENTION - How do you measure user retention?**

**Retention Timeframes**:
- **Day 1 Retention**: [X%] (users who return the next day)
- **Day 7 Retention**: [X%] (users who return within a week)
- **Day 30 Retention**: [X%] (users who return within a month)

**Cohort Retention**:
- Track cohorts by signup month
- Measure: What % of January signups are still active in February, March, etc.?

**Retention Curve**:
- **Current D30 Retention**: [e.g., "35%"]
- **Target D30 Retention**: [e.g., "50%"]
- **Best-in-Class Benchmark**: [e.g., "60% for productivity SaaS"]

**Churn Metrics**:
- **User Churn Rate**: [X% per month]
- **Revenue Churn Rate**: [X% MRR per month]
- **Negative Churn?**: [Yes/No — do expansions offset churn?]

---

**Question AARRR4: REFERRAL - How do you measure referral and virality?**

**Referral Metrics**:
- **Referral Rate**: [e.g., "15% of users invite others"]
- **Invites Sent per User**: [e.g., "2.3 invites/user"]
- **Invite Acceptance Rate**: [e.g., "22% of invites convert to signups"]
- **Viral Coefficient (K)**: [e.g., "0.35" — (2.3 invites × 0.15 referral rate)]

**K-Factor Goal**:
- **K < 1**: Sub-viral (growth requires paid acquisition)
- **K = 1**: Self-sustaining (each user brings one more)
- **K > 1**: Viral growth (exponential growth)

**Your K-Factor**: [Current K]
**Target K-Factor**: [Target K]

**Referral Program**:
- ☐ No referral program
- ☐ Incentivized referral (both parties get reward)
- ☐ Non-incentivized referral (share features)

---

**Question AARRR5: REVENUE - How do you measure revenue and monetization?**

**Revenue Metrics** (choose 5-7):
- **Monthly Recurring Revenue (MRR)**: [Current: $X, Target: $Y]
- **Annual Recurring Revenue (ARR)**: [Current: $X, Target: $Y]
- **Average Revenue Per User (ARPU)**: [Current: $X, Target: $Y]
- **Customer Acquisition Cost (CAC)**: [Current: $X, Target: $Y]
- **Customer Lifetime Value (LTV)**: [Current: $X, Target: $Y]
- **LTV:CAC Ratio**: [Current: X:1, Target: 3:1 or higher]
- **Payback Period**: [Current: X months, Target: <12 months]
- **Net Revenue Retention (NRR)**: [Current: X%, Target: >100%]
- **Gross Margin**: [Current: X%, Target: >70%]

**By Plan/Tier Breakdown**:
| Plan       | % Users | MRR per User | Total MRR | Target MRR |
|------------|---------|--------------|-----------|------------|
| Free       | X%      | $0           | $0        | —          |
| Starter    | X%      | $X           | $X        | $Y         |
| Pro        | X%      | $X           | $X        | $Y         |
| Enterprise | X%      | $X           | $X        | $Y         |

---

### Product Engagement Metrics

**Question PE1: How do you measure product engagement?**

**Core Engagement Metrics**:
- **Daily Active Users (DAU)**: [Current: X, Target: Y]
- **Weekly Active Users (WAU)**: [Current: X, Target: Y]
- **Monthly Active Users (MAU)**: [Current: X, Target: Y]
- **DAU/MAU Ratio**: [Current: X%, Target: >20% for "sticky" products]
- **WAU/MAU Ratio**: [Current: X%, Target: >50%]

**Session Metrics**:
- **Sessions per User per Day**: [e.g., "2.4 sessions/user/day"]
- **Average Session Duration**: [e.g., "8 minutes"]
- **Pages/Screens per Session**: [e.g., "5.2 pages"]

**Feature Adoption**:
| Feature                     | % Users Who Used (30d) | Target |
|-----------------------------|------------------------|--------|
| [Core Feature 1]            | X%                     | Y%     |
| [Core Feature 2]            | X%                     | Y%     |
| [Power Feature 1]           | X%                     | Y%     |
| [Recently Launched Feature] | X%                     | Y%     |

---

**Question PE2: How do you segment users by engagement level?**

**Engagement Segmentation** (RFM Model: Recency, Frequency, Monetary):

| Segment          | Definition                                           | % Users | Action                          |
|------------------|------------------------------------------------------|---------|----------------------------------|
| **Champions**    | Recent, frequent, high-value users                   | X%      | Upsell, referrals, beta access  |
| **Loyal Users**  | Frequent users, moderate recency                     | X%      | Engagement campaigns, rewards   |
| **At Risk**      | Previously active, now declining                     | X%      | Win-back campaigns, surveys     |
| **Hibernating**  | Low frequency, low recency                           | X%      | Re-engagement or let churn      |
| **New Users**    | Recent signup, low frequency (still onboarding)      | X%      | Activation campaigns            |

**Power User Cohort**:
- Definition: [e.g., "Users who log in 5+ days/week and use 3+ features"]
- % of User Base: [X%]
- Revenue Contribution: [Y% of MRR]

---

### Business Health Metrics

**Question BH1: What are your key business health metrics?**

**Financial Health**:
- **Burn Rate**: [$X/month]
- **Runway**: [X months]
- **Cash Balance**: [$X]
- **Gross Margin**: [X% — target >70% for SaaS]
- **Operating Margin**: [X% — path to profitability?]

**Unit Economics**:
- **CAC**: [$X per customer]
- **LTV**: [$X per customer]
- **LTV:CAC Ratio**: [X:1 — target 3:1]
- **Payback Period**: [X months — target <12 months]

**Growth Efficiency**:
- **Magic Number** (Sales Efficiency): [ARR Growth / Sales & Marketing Spend — target >0.75]
- **Burn Multiple** (Capital Efficiency): [Net Burn / Net New ARR — target <1.5]
- **Rule of 40**: [Growth Rate % + Profit Margin % — target >40]

---

### Operational Metrics

**Question OM1: What operational metrics should you track?**

**Customer Support**:
- **Tickets per Month**: [X]
- **First Response Time**: [X hours — target <2 hours]
- **Resolution Time**: [X hours — target <24 hours]
- **Customer Satisfaction (CSAT)**: [X% — target >90%]
- **Net Promoter Score (NPS)**: [X — target >50]

**Product Performance**:
- **Uptime**: [X% — target 99.9%+]
- **Page Load Time**: [X seconds — target <2s]
- **API Response Time**: [X ms — target <200ms]
- **Error Rate**: [X% — target <0.1%]

**Team Velocity** (if applicable):
- **Story Points per Sprint**: [X]
- **Deployment Frequency**: [X per week]
- **Lead Time for Changes**: [X days]

---

## STEP 4: Dashboard Design

**Question DD1: What dashboards do you need?**

**Dashboard Hierarchy**:

### 1. Executive Dashboard (CEO, Leadership)
**Purpose**: High-level business health at a glance
**Refresh**: Real-time or daily
**Metrics**:
- North Star Metric (big number + trend)
- MRR/ARR (current + growth %)
- Key AARRR metrics (Acquisition, Activation, Retention, Revenue)
- Runway (months remaining)
- LTV:CAC ratio

**Visualizations**:
- Big number cards for NSM, MRR
- Line charts for trends (last 90 days)
- Funnel chart for AARRR
- Cohort retention heatmap

---

### 2. Growth Dashboard (Marketing, Growth Team)
**Purpose**: Track acquisition channels and conversion funnel
**Refresh**: Daily
**Metrics**:
- Traffic by channel (organic, paid, social, referral, direct)
- Signups by channel
- Activation rate by channel
- CAC by channel
- Conversion rates (visitor → signup → activated → paid)

**Visualizations**:
- Stacked bar chart (traffic by channel over time)
- Funnel chart (visitor → signup → activated → paid)
- Table (channel performance: spend, signups, CAC, LTV, ROI)

---

### 3. Product Dashboard (Product Team, Engineering)
**Purpose**: Track engagement, feature adoption, product health
**Refresh**: Daily
**Metrics**:
- DAU, WAU, MAU
- DAU/MAU ratio (stickiness)
- Feature adoption rates
- Session metrics (duration, frequency)
- Error rates, performance metrics

**Visualizations**:
- Line charts (DAU/MAU over time)
- Heatmap (feature usage by user segment)
- Bar chart (top features by usage)
- Performance dashboards (uptime, response times)

---

### 4. Revenue Dashboard (Finance, Sales)
**Purpose**: Track revenue, churn, expansion
**Refresh**: Daily
**Metrics**:
- MRR, ARR
- New MRR, Expansion MRR, Churned MRR
- Net Revenue Retention (NRR)
- ARPU by plan
- Churn rate (user and revenue)

**Visualizations**:
- Waterfall chart (MRR movement: starting MRR + new + expansion - churn = ending MRR)
- Line chart (MRR over time)
- Pie chart (MRR by plan tier)
- Table (cohort analysis)

---

### 5. Retention Dashboard (CX, Product)
**Purpose**: Track churn, at-risk users, win-back
**Refresh**: Weekly
**Metrics**:
- D1, D7, D30 retention
- Cohort retention curves
- Churn rate by cohort
- At-risk user count (declining engagement)
- NPS, CSAT

**Visualizations**:
- Retention curves by cohort
- Heatmap (cohort retention over months)
- List view (at-risk users + engagement score)

---

**Question DD2: What tool(s) will you use for your dashboard?**

**Dashboard Tools**:
- ☐ **Google Data Studio / Looker Studio** (free, easy, integrates with Google Analytics)
- ☐ **Tableau** (powerful, expensive)
- ☐ **Metabase** (open-source, SQL-based)
- ☐ **Mixpanel** (product analytics, event-based)
- ☐ **Amplitude** (product analytics, cohort analysis)
- ☐ **ChartMogul** (SaaS metrics, MRR, churn)
- ☐ **Baremetrics** (Stripe integration, SaaS metrics)
- ☐ **Custom dashboard** (built in-house, e.g., React + D3.js)
- ☐ Other: [specify]

**Your Tool**: [Name]
**Why this tool?**: [Reasoning — cost, features, integrations, team familiarity]

---

**Question DD3: How will you organize alerts and monitoring?**

**Alert Strategy**:

| Metric                  | Threshold                          | Alert Channel | Owner         |
|-------------------------|-----------------------------------|---------------|---------------|
| North Star Metric       | <X% growth week-over-week         | Slack #alerts | CEO           |
| MRR                     | <$X (below target)                | Email         | Finance       |
| Churn Rate              | >X% (above acceptable threshold)  | Slack #cx     | CX Lead       |
| Activation Rate         | <X% (below target)                | Slack #growth | Growth Lead   |
| Website Uptime          | <99.5%                            | PagerDuty     | Engineering   |
| Support Response Time   | >2 hours                          | Slack #support| Support Lead  |

**Review Cadence**:
- **Daily**: Growth Lead reviews acquisition, activation
- **Weekly**: Leadership reviews NSM, MRR, key AARRR metrics
- **Monthly**: Deep dive into cohort retention, churn analysis, unit economics

---

## STEP 5: Data Infrastructure

**Question DI1: What is your data stack?**

**Data Sources**:
- ☐ **Product Database** (PostgreSQL, MySQL, MongoDB, etc.)
- ☐ **Analytics Tools** (Google Analytics, Mixpanel, Amplitude, Segment)
- ☐ **Payment Processor** (Stripe, Chargebee, Recurly)
- ☐ **CRM** (Salesforce, HubSpot, Pipedrive)
- ☐ **Support Tools** (Zendesk, Intercom, Front)
- ☐ **Marketing Tools** (Mailchimp, Customer.io, Facebook Ads, Google Ads)
- ☐ Other: [specify]

**Data Warehouse**:
- ☐ **None** (query production databases directly — not recommended)
- ☐ **Snowflake** (scalable, cloud data warehouse)
- ☐ **BigQuery** (Google Cloud, integrates with Google Analytics)
- ☐ **Redshift** (AWS, legacy but still popular)
- ☐ **Other**: [specify]

**ETL/ELT Pipeline**:
- ☐ **Fivetran** (automated data pipelines)
- ☐ **Stitch** (simpler, cheaper than Fivetran)
- ☐ **Airbyte** (open-source alternative)
- ☐ **Custom scripts** (Python, dbt)
- ☐ None yet

**Your Data Stack**:
- Sources: [List]
- Warehouse: [Name or "None yet"]
- ETL: [Name or "None yet"]

---

**Question DI2: How will you ensure data quality?**

**Data Quality Checks**:
- ☐ **Automated tests** (e.g., dbt tests: not-null, unique, referential integrity)
- ☐ **Anomaly detection** (alert if metric drops >X% or spikes >Y%)
- ☐ **Manual spot checks** (weekly review of key metrics)
- ☐ **Data lineage tracking** (document how each metric is calculated)
- ☐ **Version control for SQL queries** (Git repo for dashboard queries)

**Documentation**:
- ☐ **Data Dictionary** (document every metric: definition, source table, calculation, owner)
- ☐ **Metric Definitions Doc** (shared with entire team)
- ☐ **Changelog** (track changes to metric definitions over time)

---

## STEP 6: Implementation Roadmap

**Question IR1: What is your 90-day implementation plan?**

### Phase 1: Foundation (Weeks 1-3)
**Goal**: Set up basic tracking and core dashboards

- **Week 1: Event Tracking Audit**
  - Audit existing event tracking (Google Analytics, Mixpanel, etc.)
  - Identify gaps (e.g., missing activation events, no cohort tracking)
  - Implement missing events (using Segment, Amplitude, or custom tracking)

- **Week 2: Define Metrics**
  - Finalize North Star Metric
  - Define AARRR metrics with thresholds and targets
  - Document metric definitions (Data Dictionary)

- **Week 3: Build Core Dashboard**
  - Create Executive Dashboard (NSM, MRR, AARRR)
  - Set up automated refresh (daily or real-time)
  - Share with leadership team

**Deliverable**: Executive Dashboard live, core events tracked

---

### Phase 2: Expand (Weeks 4-6)
**Goal**: Build role-specific dashboards

- **Week 4: Growth Dashboard**
  - Build acquisition funnel (visitor → signup → activated)
  - Add channel breakdown (organic, paid, social, referral)
  - Set up CAC tracking by channel

- **Week 5: Product Dashboard**
  - Build engagement dashboard (DAU, MAU, stickiness)
  - Add feature adoption tracking
  - Set up cohort retention analysis

- **Week 6: Revenue Dashboard**
  - Build MRR tracking (new, expansion, churn)
  - Add cohort-based LTV analysis
  - Set up churn monitoring

**Deliverable**: Growth, Product, and Revenue dashboards live

---

### Phase 3: Optimize (Weeks 7-12)
**Goal**: Refine, automate, and drive adoption

- **Week 7-8: Alerts & Monitoring**
  - Set up automated alerts (Slack, email)
  - Define escalation paths for critical metrics
  - Test alert thresholds

- **Week 9-10: Data Quality**
  - Implement automated data quality tests (dbt tests)
  - Set up anomaly detection
  - Create data changelog

- **Week 11-12: Team Training & Adoption**
  - Host dashboard training sessions for each team
  - Create self-service guides (how to use dashboards)
  - Establish review cadence (daily, weekly, monthly)

**Deliverable**: Full dashboard suite live, alerts running, team trained

---

## STEP 7: Generate Comprehensive Metrics Dashboard Strategy

**You will now receive a comprehensive document covering**:

### Section 1: Executive Summary
- North Star Metric and why it was chosen
- Dashboard strategy overview (5 dashboards)
- Key targets and baseline performance

### Section 2: AARRR Framework Deep Dive
- **Acquisition**: Top 3 metrics, channel breakdown, targets
- **Activation**: Definition, activation rate, time to activate, cohort performance
- **Retention**: D1/D7/D30 retention, cohort curves, churn rates, benchmarks
- **Referral**: Referral rate, viral coefficient, referral program details
- **Revenue**: MRR/ARR, ARPU, LTV, CAC, LTV:CAC ratio, NRR, margins

### Section 3: Dashboard Architecture
- **Dashboard 1: Executive Dashboard** (purpose, metrics, visualizations, refresh frequency)
- **Dashboard 2: Growth Dashboard** (acquisition funnel, channel performance)
- **Dashboard 3: Product Dashboard** (engagement, feature adoption, session metrics)
- **Dashboard 4: Revenue Dashboard** (MRR waterfall, cohort LTV, churn)
- **Dashboard 5: Retention Dashboard** (retention curves, at-risk users, NPS)

### Section 4: Alerts & Monitoring
- Alert rules (metric, threshold, channel, owner)
- Review cadence (daily, weekly, monthly)
- Escalation paths for critical issues

### Section 5: Data Infrastructure
- Data sources (product DB, analytics, payment processor, CRM, support, marketing)
- Data warehouse (Snowflake, BigQuery, Redshift, or None)
- ETL/ELT pipeline (Fivetran, Stitch, Airbyte, custom)
- Data quality strategy (automated tests, anomaly detection, documentation)

### Section 6: Metric Definitions (Data Dictionary)
| Metric Name | Definition | Calculation | Data Source | Owner | Target |
|-------------|------------|-------------|-------------|-------|--------|
| North Star Metric | [full definition] | [formula] | [source] | [person] | [target] |
| MRR | Monthly Recurring Revenue | Sum of active subscriptions | Stripe | Finance | $X |
| [etc. for 20-30 key metrics] | | | | | |

### Section 7: Implementation Roadmap
- **Phase 1 (Weeks 1-3)**: Event tracking audit, metric definitions, core dashboard
- **Phase 2 (Weeks 4-6)**: Role-specific dashboards (growth, product, revenue)
- **Phase 3 (Weeks 7-12)**: Alerts, data quality, team training

### Section 8: Success Criteria
- Dashboard adoption (X% of team uses dashboards weekly)
- Data-driven decisions (X% of product decisions cite dashboard metrics)
- Metric improvement (NSM grows X%, activation rate improves Y%, churn decreases Z%)

### Section 9: Common Pitfalls to Avoid
- Vanity metrics (page views, signups) vs. actionable metrics (activation rate, retention)
- Too many metrics (dashboard overload)
- No ownership (every metric needs an owner)
- Ignoring data quality (garbage in, garbage out)
- Building dashboards in a vacuum (get team input)

### Section 10: Next Steps
- Share dashboard with team
- Schedule weekly metric review meetings
- Integrate with **retention-optimization-expert** (use retention data to reduce churn)
- Integrate with **onboarding-flow-optimizer** (use activation metrics to improve onboarding)

---

## STEP 8: Quality Review & Iteration

After generating the strategy, I will ask:

**Quality Check**:
1. Does the North Star Metric align with core customer value?
2. Are AARRR metrics complete and measurable?
3. Are dashboard roles clear (who uses which dashboard)?
4. Are targets realistic and time-bound?
5. Is the data infrastructure plan feasible?
6. Is the implementation roadmap broken into actionable sprints?

**Iterate?** [Yes — refine X / No — finalize]

---

## STEP 9: Save & Next Steps

Once finalized, I will:
1. **Save** the metrics dashboard strategy to your project folder
2. **Suggest** running **retention-optimization-expert** next (to act on retention data)
3. **Remind** you to schedule a weekly metrics review meeting with your team

---

## 8 Critical Guidelines for This Skill

1. **North Star Metric must be leading, not lagging**: Choose a metric that predicts growth (e.g., "Projects created") over a vanity metric (e.g., "Signups").

2. **AARRR metrics must be complete**: Don't skip Referral or Revenue just because they're hard to track. Every business has all 5 stages.

3. **Dashboards must match roles**: Don't build one giant dashboard for everyone. Build 5 focused dashboards for different teams.

4. **Targets must be realistic**: Use industry benchmarks (e.g., SaaS D30 retention: 30-50%, DAU/MAU: 20%+, LTV:CAC: 3:1).

5. **Data quality is non-negotiable**: No dashboard is better than a dashboard with wrong data. Invest in data quality from Day 1.

6. **Every metric needs an owner**: Assign ownership for each metric. If no one owns it, it won't improve.

7. **Alerts prevent fire drills**: Set up automated alerts for critical metrics (NSM, MRR, churn, uptime). Don't rely on manual checks.

8. **Adoption > features**: A simple dashboard that everyone uses beats a complex dashboard that no one understands. Prioritize clarity and adoption.

---

## Quality Checklist (Before Finalizing)

- [ ] North Star Metric is clearly defined and aligns with customer + business value
- [ ] AARRR metrics are complete (all 5 stages covered)
- [ ] Each metric has: definition, baseline, target, owner, data source
- [ ] 5 dashboards are defined (Executive, Growth, Product, Revenue, Retention)
- [ ] Alert rules are set for critical metrics
- [ ] Data stack is documented (sources, warehouse, ETL, quality checks)
- [ ] Implementation roadmap is realistic and broken into 3 phases (12 weeks)
- [ ] Benchmarks are cited (SaaS standards for retention, DAU/MAU, LTV:CAC, etc.)
- [ ] Data Dictionary includes 20-30 key metrics with full definitions
- [ ] Next steps include team training and integration with downstream skills

---

## Integration with Other Skills

**Upstream Skills** (reuse data from):
- **revenue-model-builder** → Revenue streams, CAC, LTV, margins
- **customer-persona-builder** → User segments for cohort analysis
- **product-positioning-expert** → Value metrics
- **growth-hacking-playbook** → AARRR framework, North Star Metric, growth loops
- **go-to-market-planner** → GTM metrics, channel performance
- **content-marketing-strategist** → Content performance metrics
- **email-marketing-architect** → Email engagement metrics (open rate, click rate, conversions)
- **social-media-strategist** → Social media metrics (followers, engagement, referral traffic)
- **community-building-strategist** → Community metrics (DAU/MAU, retention, member growth)

**Downstream Skills** (use this data in):
- **retention-optimization-expert** → Use retention dashboard to identify at-risk users and churn drivers
- **onboarding-flow-optimizer** → Use activation metrics to improve onboarding
- **customer-feedback-framework** → Cross-reference NPS/CSAT with retention and churn data
- **investor-pitch-deck-builder** → Use MRR, growth rate, unit economics for traction slides
- **financial-model-architect** → Use historical metrics to build revenue projections

---

**End of Skill**

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
   html-templates/metrics-dashboard-designer.html
   ```

### How to Use Templates

1. Read `VERIFICATION-CHECKLIST.md` first - contains canonical CSS patterns that MUST be copied exactly
2. Read `base-template.html` - contains all shared CSS, layout structure, and Chart.js configuration
3. Read `metrics-dashboard-designer.html` - contains skill-specific content sections, CSS extensions, and chart scripts
4. Replace all `{{PLACEHOLDER}}` markers with actual analysis data
5. Merge the skill-specific CSS into `{{SKILL_SPECIFIC_CSS}}`
6. Merge the content sections into `{{CONTENT_SECTIONS}}`
7. Merge the chart scripts into `{{CHART_SCRIPTS}}`

---

## HTML Output Verification

After generating the HTML output, verify the following:

### Structure Verification
- [ ] Header uses canonical pattern with gradient background (#10b981 → #14b8a6)
- [ ] Score banner shows dashboard count, metric count, alert count, MRR, LTV:CAC
- [ ] Verdict box displays framework type (AARRR)
- [ ] All 8 sections present: Executive Summary, North Star, AARRR, Dashboards, Metrics Dictionary, Alerts, Data Stack, Charts, Roadmap
- [ ] Footer uses canonical pattern with StratArts branding

### Content Verification
- [ ] North Star Metric container with value, name, description, 3 drivers
- [ ] 5 AARRR stage cards with letter, name, metric, target, and details list
- [ ] 5 dashboard cards with name, audience, purpose, and metrics list
- [ ] Metrics dictionary table with 8-10 rows (name, category, current, target, owner, source)
- [ ] 6 alert cards with metric, threshold, and channel
- [ ] 3 data stack sections (Sources, Warehouse, Visualization)
- [ ] 90-day roadmap with 3 phase cards

### CSS Verification
- [ ] Dark theme applied (#0a0a0a background, #1a1a1a containers)
- [ ] Emerald accent color (#10b981) used consistently
- [ ] AARRR stages have top border accent
- [ ] Category badges use distinct colors (acquisition=green, activation=blue, retention=amber, referral=purple, revenue=red)
- [ ] Dashboard cards have left border accent
- [ ] Responsive breakpoints at 1200px and 768px

### Chart Verification
- [ ] funnelChart: Horizontal bar showing AARRR funnel
- [ ] mrrChart: Line chart with filled area for MRR growth
- [ ] retentionChart: Retention curve (D1 to D90)
- [ ] engagementChart: Dual-line (DAU + WAU)
- [ ] All charts use Chart.js v4.4.0
- [ ] Dark theme defaults applied (color: #888, borderColor: #333)

### Data Consistency
- [ ] AARRR funnel data flows logically (Acquisition > Activation > Retention > Referral > Revenue)
- [ ] MRR in score banner matches chart endpoint
- [ ] LTV:CAC ratio is calculated correctly
- [ ] Metrics table current values match corresponding section values
