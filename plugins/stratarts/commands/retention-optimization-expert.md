---
name: retention-optimization-expert
description: Reduce churn and improve retention through cohort analysis, at-risk user identification, win-back campaigns, and customer success strategies. Generate comprehensive HTML reports with retention curves, health scores, churn analysis, and 90-day implementation roadmaps.
version: 1.0.0
category: retention-metrics
---

# retention-optimization-expert

**Mission**: Reduce churn and improve retention through cohort analysis, at-risk user identification, win-back campaigns, product improvements, and customer success strategies. Turn one-time users into lifelong customers.

---

## STEP 0: Pre-Generation Verification

Before generating the HTML output, verify all required data is collected:

### Header & Score Banner
- [ ] `{{BUSINESS_NAME}}` - Company/product name
- [ ] `{{DATE}}` - Report generation date
- [ ] `{{D30_RETENTION}}` - 30-day retention rate (e.g., "38%")
- [ ] `{{D7_RETENTION}}` - 7-day retention rate (e.g., "52%")
- [ ] `{{CHURN_RATE}}` - Monthly churn rate (e.g., "6.2%")
- [ ] `{{AT_RISK_PERCENT}}` - Percentage of at-risk users (e.g., "18%")
- [ ] `{{HEALTH_GREEN}}` - Percentage of healthy users (e.g., "62%")
- [ ] `{{CURVE_TYPE}}` - Short curve type (e.g., "Steep Drop + Plateau")

### Executive Summary
- [ ] `{{EXECUTIVE_SUMMARY}}` - 2-3 paragraphs with retention overview, key interventions
- [ ] `{{CURVE_TYPE_FULL}}` - Full curve description (e.g., "Steep Drop, Then Plateau (Good)")
- [ ] `{{CURVE_DESCRIPTION}}` - Explanation of what the curve means for the business

### Cohort Analysis
- [ ] `{{COHORT_ROWS}}` - 4+ cohort rows with M0-M6 retention percentages
  - Each row: cohort name, M0 (100%), M1, M2, M3, M6 with color classes

### Segment Retention
- [ ] `{{SEGMENT_CARDS}}` - 3-4 user segments
  - Each card: segment name, D30 retention, churn rate

### At-Risk Identification
- [ ] `{{RISK_INDICATORS}}` - 4-5 at-risk criteria
  - Each indicator: icon, title, description of criteria

### Health Score
- [ ] `{{HEALTH_GREEN}}` - Healthy percentage (80-100 score)
- [ ] `{{HEALTH_YELLOW}}` - At-risk percentage (50-79 score)
- [ ] `{{HEALTH_RED}}` - Churn risk percentage (<50 score)
- [ ] `{{HEALTH_FACTORS}}` - 5 health score factors with weights

### Win-Back Campaign
- [ ] `{{WINBACK_TIERS}}` - 4 escalating tiers
  - Each tier: name, day range, 2-4 actions

### Churn Reasons
- [ ] `{{CHURN_ROWS}}` - 5-6 churn reasons
  - Each row: reason, percentage, addressable status, action plan

### Retention Loops
- [ ] `{{LOOP_CARDS}}` - 2-3 retention loops
  - Each card: loop type, description, 3-4 cycle steps

### Customer Success
- [ ] `{{CS_MODEL_NAME}}` - CS model name (e.g., "Hybrid Model")
- [ ] `{{CS_MODEL_RATIO}}` - CSM to account ratios
- [ ] `{{TOUCHPOINT_PHASES}}` - 3 phases (Onboarding, Ongoing, Renewal)
  - Each phase: name, 4-5 touchpoints

### Charts
- [ ] `{{RETENTION_LABELS}}` - JSON array of time periods (D0, D1, D7, etc.)
- [ ] `{{RETENTION_DATA}}` - JSON array of retention percentages
- [ ] `{{COHORT_LABELS}}` - JSON array of cohort names
- [ ] `{{COHORT_DATA}}` - JSON array of M3 retention rates
- [ ] `{{CHURN_LABELS}}` - JSON array of churn reason labels
- [ ] `{{CHURN_DATA}}` - JSON array of churn percentages
- [ ] `{{HEALTH_DATA}}` - JSON array [healthy%, at-risk%, churn-risk%]

### Success Metrics
- [ ] `{{METRIC_CARDS}}` - 5 key metrics with baseline and target values

### Roadmap
- [ ] `{{ROADMAP_PHASES}}` - 4 phases (Analyze, Intervene, Improve, Monitor)
  - Each phase: name, timing, goal, 4-5 tasks

---

## STEP 1: Detect Previous Context

### Ideal Context (All Present):
- **metrics-dashboard-designer** → Retention metrics, cohort data, churn rates
- **customer-persona-builder** → User segments, behavioral patterns
- **product-positioning-expert** → Value delivered, success indicators
- **onboarding-flow-optimizer** → Activation rates, early retention data
- **customer-feedback-framework** → Churn reasons, exit surveys, NPS

### Partial Context (Some Present):
- **metrics-dashboard-designer** → Retention metrics available
- **customer-persona-builder** → User segmentation available
- **onboarding-flow-optimizer** → Onboarding data available

### No Context:
- None of the above skills were run

---

## STEP 2: Context-Adaptive Introduction

### If Ideal Context:
> I found outputs from **metrics-dashboard-designer**, **customer-persona-builder**, **product-positioning-expert**, **onboarding-flow-optimizer**, and **customer-feedback-framework**.
>
> I can reuse:
> - **Retention metrics** (D1/D7/D30 retention: [X%], churn rate: [Y%], cohort curves)
> - **User segments** ([Segment A], [Segment B], [Segment C])
> - **Value delivered** (core features that drive retention)
> - **Activation rates** ([X%] of users activated within 7 days)
> - **Churn reasons** (top 3: [Reason 1], [Reason 2], [Reason 3])
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
> I'll guide you through optimizing retention from the ground up.

---

## STEP 3: Questions (One at a Time, Sequential)

### Current Retention Baseline

**Question RB1: What is your current retention performance?**

**Retention Metrics**:
- **Day 1 Retention**: [X%] (users who return the next day)
- **Day 7 Retention**: [X%] (users who return within a week)
- **Day 30 Retention**: [X%] (users who return within a month)
- **6-Month Retention**: [X%] (users still active after 6 months)

**Churn Metrics**:
- **User Churn Rate**: [X% per month]
- **Revenue Churn Rate**: [X% MRR per month]
- **Logo Churn Rate**: [X% customers per month] (B2B companies)

**Industry Benchmarks** (for context):
- **Consumer Apps**: D30 retention 20-30%
- **SaaS Products**: D30 retention 30-50%, monthly churn <5%
- **Social Networks**: D30 retention 40-60%
- **E-commerce**: 6-month retention 20-40%

**Your Performance vs. Benchmark**:
- Current D30 Retention: [X%]
- Benchmark D30 Retention: [Y%]
- Gap: [Z percentage points]

---

**Question RB2: What does your retention curve look like?**

**Retention Curve Analysis**:

Plot retention over time (Day 0, Day 1, Day 7, Day 14, Day 30, Day 60, Day 90...):

```
100% ┤
     │●
 75% ┤ ●
     │  ●
 50% ┤   ●_______________
     │                   ●●●●●● [plateau = retained users]
 25% ┤
     │
  0% └───────────────────────────────────────────
     0   7   14   30   60   90   120  [days]
```

**Retention Curve Type**:
- ☐ **Steep drop, then plateau** (good — you retain a core user base)
- ☐ **Continuous decline** (bad — users keep leaving, no plateau)
- ☐ **Gradual decline, small plateau** (okay — some retention, needs improvement)

**Your Curve**: [Describe shape, when plateau occurs, plateau level]

**Critical Retention Milestones**:
- **Day 1 → Day 7**: [X% retention — early drop-off period]
- **Day 7 → Day 30**: [X% retention — product-market fit test]
- **Day 30 → Day 90**: [X% retention — habit formation period]

---

### Cohort Analysis

**Question CA1: How does retention vary by cohort?**

**Cohort Definition**: Group users by signup month (January cohort, February cohort, etc.)

**Cohort Retention Table**:

| Cohort    | M0 (Signup) | M1   | M2   | M3   | M6   | M12  |
|-----------|-------------|------|------|------|------|------|
| Jan 2024  | 100%        | 42%  | 35%  | 30%  | 25%  | 20%  |
| Feb 2024  | 100%        | 45%  | 38%  | 32%  | 27%  | —    |
| Mar 2024  | 100%        | 48%  | 40%  | 34%  | —    | —    |
| Apr 2024  | 100%        | 50%  | 42%  | —    | —    | —    |

**Cohort Insights**:
- Are newer cohorts retaining better? [Yes/No — if yes, what changed?]
- Which cohort has the highest retention? [Month + retention %]
- Which cohort has the lowest retention? [Month + retention %]

**Cohort Improvement Trend**:
- ☐ **Improving** (newer cohorts retain better — product/onboarding improvements working)
- ☐ **Flat** (cohorts retain similarly — no major changes)
- ☐ **Declining** (newer cohorts retain worse — product quality or ICP drift)

---

**Question CA2: How does retention vary by user segment?**

**Segment Retention Comparison**:

| Segment                | D30 Retention | Churn Rate | Why the difference?                          |
|------------------------|---------------|------------|----------------------------------------------|
| [Segment A]            | X%            | Y%         | [e.g., "Power users, use product daily"]     |
| [Segment B]            | X%            | Y%         | [e.g., "Casual users, weekly usage"]         |
| [Segment C]            | X%            | Y%         | [e.g., "Trial users, haven't upgraded"]      |
| [By Acquisition Source]| —             | —          | —                                            |
| Organic Search         | X%            | Y%         | [Higher intent, better fit]                  |
| Paid Search            | X%            | Y%         | [Lower intent, higher churn]                 |
| Referral               | X%            | Y%         | [Best retention — referred by friends]       |
| Social Media           | X%            | Y%         | [Impulse signups, lower retention]           |

**Best Retaining Segment**: [Which segment?]
**Worst Retaining Segment**: [Which segment?]

**Action**:
- Double down on acquiring users similar to best-retaining segment
- Improve onboarding for worst-retaining segment or stop acquiring them

---

### Churn Prediction & At-Risk Users

**Question CP1: Can you identify at-risk users before they churn?**

**At-Risk User Definition** (users showing declining engagement):

**Leading Indicators of Churn** (2-4 weeks before churn):
1. **Declining Login Frequency**: [e.g., "User logged in 10x last month, only 3x this month"]
2. **Reduced Feature Usage**: [e.g., "User stopped using core feature X"]
3. **Lower Session Duration**: [e.g., "Average session dropped from 8 min to 2 min"]
4. **Support Tickets**: [e.g., "User submitted 3+ bug reports"]
5. **Payment Issues**: [e.g., "Credit card declined, didn't update"]
6. **No Activity in X Days**: [e.g., "No login in 14+ days"]

**Your At-Risk Criteria** (choose 3-5):
1. [Indicator 1] — e.g., "No login in 14 days"
2. [Indicator 2] — e.g., "Session frequency dropped >50%"
3. [Indicator 3] — e.g., "Didn't use core feature in last 30 days"

**At-Risk User Count**:
- Total Active Users: [X]
- At-Risk Users (meeting 2+ criteria): [Y]
- % At Risk: [Z%]

---

**Question CP2: What is your plan to re-engage at-risk users?**

**Win-Back Campaign** (multi-channel, escalating touchpoints):

### Tier 1: Subtle Re-Engagement (Days 7-14 inactive)
- **Email 1**: "We miss you! Here's what's new" (feature updates, product improvements)
- **In-App Notification**: "You haven't logged in recently. Come back for [incentive]"
- **Push Notification** (if mobile app): "Your [X] is waiting for you"

### Tier 2: Value Reminder (Days 15-21 inactive)
- **Email 2**: "Remember why you signed up? Here's how [Product] helps with [pain point]"
- **Case Study**: "How [Customer Name] achieved [result] with [Product]"
- **Personal Outreach** (for high-value users): CEO/CSM sends personal email

### Tier 3: Incentive (Days 22-30 inactive)
- **Email 3**: "We'd love to have you back. Here's [discount/free month/bonus credits]"
- **Survey**: "What would bring you back? We're listening" (with incentive for completing)

### Tier 4: Last Chance (Days 30+ inactive)
- **Email 4**: "Last chance to keep your data. Account will be deactivated in 7 days"
- **Phone Call** (for enterprise): CSM calls to understand churn reason and offer solutions

**Win-Back Channels** (choose 3-5):
- ☐ Email (sequence of 3-4 emails)
- ☐ In-app notifications
- ☐ Push notifications (mobile)
- ☐ SMS (high-value users only)
- ☐ Retargeting ads (Facebook, Google)
- ☐ Personal outreach (phone, LinkedIn)

**Win-Back Success Metrics**:
- **Open Rate**: [Target: >25%]
- **Click Rate**: [Target: >10%]
- **Reactivation Rate**: [Target: >5% of inactive users return]

---

### Churn Reasons & Exit Analysis

**Question CR1: Why do users churn?**

**Exit Survey** (trigger when user cancels or becomes inactive):

**Question 1**: Why are you leaving?
- ☐ Too expensive
- ☐ Didn't see value / wasn't using it
- ☐ Missing features I need
- ☐ Found a better alternative
- ☐ Too complicated / hard to use
- ☐ Poor customer support
- ☐ Technical issues / bugs
- ☐ Other: [open text]

**Question 2**: What would have kept you as a customer?
- [Open text]

**Question 3**: Would you consider returning in the future?
- ☐ Yes, if [condition]
- ☐ No

**Churn Reason Breakdown** (based on exit surveys + data analysis):

| Churn Reason                    | % of Churned Users | Addressable? | Action Plan                                 |
|---------------------------------|--------------------|--------------|---------------------------------------------|
| Didn't see value / low usage    | X%                 | ✅ Yes       | Improve onboarding, activation              |
| Too expensive                   | X%                 | ✅ Yes       | Introduce lower-tier plan, annual discount  |
| Missing features                | X%                 | ✅ Yes       | Build top-requested features                |
| Found better alternative        | X%                 | ⚠️ Maybe    | Competitive analysis, differentiate         |
| Too complicated                 | X%                 | ✅ Yes       | Simplify UI, improve help docs              |
| Poor support                    | X%                 | ✅ Yes       | Hire more support, reduce response time     |
| Technical issues                | X%                 | ✅ Yes       | Fix bugs, improve performance               |
| Company shut down / no longer needed | X%            | ❌ No        | Unavoidable churn                           |

**Top 3 Addressable Churn Reasons**:
1. [Reason 1] — [Action plan]
2. [Reason 2] — [Action plan]
3. [Reason 3] — [Action plan]

---

**Question CR2: How can you reduce involuntary churn?**

**Involuntary Churn** = Users who churn due to failed payments (not because they wanted to leave)

**Payment Failure Reasons**:
- Expired credit card
- Insufficient funds
- Bank decline (fraud alert)
- Card changed (lost/stolen)

**Dunning Campaign** (recover failed payments):

### Failed Payment Day 0:
- **Email 1**: "Payment failed. Please update your payment method" (link to billing page)
- **In-app banner**: "Action required: Update payment method"

### Day 3:
- **Email 2**: "Reminder: Your payment failed. Update card to keep access"
- **Grace period**: Keep product access for 7-14 days

### Day 7:
- **Email 3**: "Final reminder: Update payment or service will be suspended in 3 days"
- **SMS** (optional): "Your [Product] account will be suspended. Update payment now"

### Day 10:
- **Suspend Service**: Downgrade to free plan or suspend account
- **Email 4**: "Account suspended. Update payment to restore access"

**Smart Dunning Tactics**:
- **Retry Schedule**: Retry failed payment 3 times (Day 0, Day 3, Day 7)
- **Alternative Payment Methods**: Offer PayPal, bank transfer, crypto
- **Update Card Before Expiry**: Email users 30 days before card expires

**Involuntary Churn Rate**:
- Current: [X% of total churn]
- Target: [<20% of total churn]

---

### Retention Loops & Product Improvements

**Question RL1: What retention loops can you build?**

**Retention Loop** = A repeating cycle that brings users back to the product

**Examples**:

1. **Content Drip Loop** (e.g., Duolingo, Netflix)
   - New content released regularly (daily lessons, weekly episodes)
   - Push notification: "Your [new content] is ready"
   - User returns → consumes content → waits for next drop

2. **Social Loop** (e.g., LinkedIn, Facebook)
   - User posts content
   - Followers engage (likes, comments)
   - Push notification: "[Friend] commented on your post"
   - User returns → engages → posts again

3. **Progress Loop** (e.g., Strava, MyFitnessPal)
   - User logs progress (workout, meal, habit)
   - App shows streaks, achievements, leaderboards
   - User returns to maintain streak → logs progress → cycle continues

4. **Collaboration Loop** (e.g., Slack, Figma, Notion)
   - User invites team members
   - Team collaborates in product
   - Notifications: "[@mention] left a comment"
   - User returns → collaborates → cycle continues

5. **Email Digest Loop** (e.g., Substack, Reddit)
   - User subscribes to digest (daily, weekly)
   - Email: "Here's what you missed this week"
   - User clicks → returns to product → subscribes again

**Your Retention Loop(s)** (choose 1-3):
1. **[Loop Type]**: [How it works — trigger → action → return]
2. **[Loop Type]**: [How it works]
3. **[Loop Type]**: [How it works]

**Implementation Plan**:
- Loop 1: [What needs to be built? Timeline?]
- Loop 2: [What needs to be built? Timeline?]

---

**Question RL2: What product improvements will reduce churn?**

**Churn-Reducing Product Changes** (based on churn reasons and user feedback):

| Churn Reason                     | Product Improvement                                    | Priority | Timeline |
|----------------------------------|-------------------------------------------------------|----------|----------|
| "Didn't see value / low usage"   | Improve onboarding, add activation checklist          | High     | 4 weeks  |
| "Missing feature X"              | Build feature X (top-requested)                       | High     | 8 weeks  |
| "Too complicated"                | Simplify UI, add tooltips, create video tutorials     | Medium   | 6 weeks  |
| "Technical issues"               | Fix top 5 bugs, improve performance                   | High     | 2 weeks  |
| "Poor support"                   | Hire 2 support reps, reduce response time to <2 hours| Medium   | 4 weeks  |

**Quick Wins** (implement in next 30 days):
1. [Improvement 1] — e.g., "Add onboarding checklist (3 tasks to activation)"
2. [Improvement 2] — e.g., "Fix top 3 bugs causing user frustration"
3. [Improvement 3] — e.g., "Send weekly email digest to inactive users"

**Long-Term Bets** (implement in next 90 days):
1. [Improvement 1] — e.g., "Build top-requested feature (X)"
2. [Improvement 2] — e.g., "Redesign core workflow to reduce friction"
3. [Improvement 3] — e.g., "Add social features (commenting, sharing)"

---

### Customer Success Strategy

**Question CS1: What is your customer success strategy?**

**Customer Success Model** (choose based on ARPU and scale):

| ARPU          | Model                        | CS Ratio          | Touchpoints                                      |
|---------------|------------------------------|-------------------|--------------------------------------------------|
| <$100/mo      | **Tech-Touch** (automated)   | 1 CSM : ∞ users   | Email, in-app, chatbot, self-service resources   |
| $100-$500/mo  | **Hybrid** (light-touch)     | 1 CSM : 100-200   | Quarterly check-ins, email, webinars, resources  |
| $500-$2k/mo   | **High-Touch** (proactive)   | 1 CSM : 50-100    | Monthly QBRs, onboarding, ongoing support        |
| >$2k/mo       | **White-Glove** (dedicated)  | 1 CSM : 10-30     | Dedicated CSM, weekly check-ins, custom success plan |

**Your Model**: [Tech-Touch / Hybrid / High-Touch / White-Glove]

**Customer Success Touchpoints**:

### Onboarding (Days 0-30):
- **Day 0**: Welcome email + onboarding checklist
- **Day 3**: Check-in email: "How's onboarding going? Need help?"
- **Day 7**: Onboarding call (high-touch) or webinar (light-touch)
- **Day 14**: Feature tutorial: "Here's how to use [power feature]"
- **Day 30**: Success check-in: "Did you achieve [goal]?"

### Ongoing Success (Month 2+):
- **Monthly**: Usage report: "Here's your activity this month"
- **Quarterly**: QBR (Quarterly Business Review) — review goals, usage, ROI
- **Ad Hoc**: Trigger-based outreach (e.g., usage drops, feature launch, renewal coming up)

### Renewal/Expansion (30-60 days before renewal):
- **Renewal campaign**: "Your contract renews in 60 days. Let's review value delivered"
- **Expansion conversation**: "You're using X feature heavily. Have you considered Y feature?"

**Customer Health Score** (predict churn risk):

| Factor                        | Weight | Healthy | At Risk | Churn Risk |
|-------------------------------|--------|---------|---------|------------|
| Login Frequency               | 30%    | 10+ /mo | 3-9 /mo | <3 /mo     |
| Feature Usage (core features) | 25%    | 80%+    | 40-79%  | <40%       |
| Support Tickets (open)        | 15%    | 0-1     | 2-3     | 4+         |
| NPS Score                     | 15%    | 9-10    | 7-8     | 0-6        |
| Payment Status                | 15%    | Current | Late    | Failed     |

**Health Score Calculation**:
- **Green (80-100)**: Healthy, potential for expansion
- **Yellow (50-79)**: At risk, requires proactive outreach
- **Red (<50)**: Churn risk, urgent intervention

**Current Health Score Distribution**:
- Green: [X%] of customers
- Yellow: [Y%] of customers
- Red: [Z%] of customers

---

**Question CS2: How will you scale customer success?**

**Scaling Customer Success** (as you grow from 100 → 1,000 → 10,000 customers):

### Phase 1: Manual (0-100 customers)
- **1 CSM** handles all customers
- Personal touch: emails, calls, QBRs
- Learn what works, document best practices

### Phase 2: Semi-Automated (100-1,000 customers)
- **Segment customers** (high-value = high-touch, low-value = tech-touch)
- **Automate touchpoints** (email sequences, in-app messages, webinars)
- **Hire 2-3 CSMs** for high-value accounts

### Phase 3: Fully Scaled (1,000+ customers)
- **CSM team by segment**: Enterprise (white-glove), Mid-Market (high-touch), SMB (tech-touch)
- **Self-service resources**: Help center, video tutorials, community forum
- **Proactive monitoring**: Health score dashboard, automated alerts for at-risk accounts

**Your Scaling Plan**:
- Current customer count: [X]
- Current CSM count: [Y]
- Next hire milestone: [When you reach Z customers, hire CSM #N]

---

### Implementation Roadmap

**Question IR1: What is your 90-day retention optimization plan?**

### Phase 1: Analyze (Weeks 1-3)
**Goal**: Understand why users churn and identify at-risk segments

- **Week 1: Cohort Analysis**
  - Pull cohort retention data (M0, M1, M3, M6, M12)
  - Identify best-retaining and worst-retaining cohorts
  - Segment retention by acquisition source, user persona, plan tier

- **Week 2: Churn Reason Analysis**
  - Implement exit survey (trigger on cancellation)
  - Interview 10-20 churned users (qualitative insights)
  - Categorize churn reasons (addressable vs. unavoidable)

- **Week 3: At-Risk User Identification**
  - Define at-risk criteria (3-5 leading indicators)
  - Build at-risk user list (dashboard or export)
  - Calculate health scores for all active users

**Deliverable**: Retention analysis report with top 3 churn drivers and at-risk user list

---

### Phase 2: Intervene (Weeks 4-6)
**Goal**: Launch win-back campaigns and reduce involuntary churn

- **Week 4: Win-Back Campaign**
  - Build 4-email win-back sequence (Days 7, 14, 21, 30 inactive)
  - Set up automated triggers (email service provider)
  - Launch campaign for currently inactive users

- **Week 5: Dunning Campaign**
  - Build dunning email sequence (payment failed → 3 reminders → suspend)
  - Set up retry schedule (retry 3x over 10 days)
  - Launch campaign for users with failed payments

- **Week 6: Personal Outreach (High-Value Users)**
  - Identify top 20% of at-risk users by revenue
  - Assign CSM to reach out (email, call, or LinkedIn)
  - Offer solutions: feature training, discount, custom plan

**Deliverable**: Win-back and dunning campaigns live, 20% of at-risk high-value users contacted

---

### Phase 3: Improve Product (Weeks 7-12)
**Goal**: Build retention loops and fix top churn drivers

- **Week 7-8: Quick Wins**
  - Implement onboarding checklist (improve activation)
  - Fix top 3 bugs causing churn
  - Add email digest (weekly summary for inactive users)

- **Week 9-10: Retention Loop**
  - Design retention loop (content drip, social, progress, collaboration)
  - Build loop triggers and notifications
  - Launch loop to 10% of users (A/B test)

- **Week 11-12: Feature Improvements**
  - Build top-requested feature (reduces "missing feature" churn)
  - Simplify core workflow (reduces "too complicated" churn)
  - Improve performance (reduces "technical issues" churn)

**Deliverable**: Retention loop live, top churn drivers addressed via product improvements

---

### Phase 4: Monitor & Iterate (Ongoing)
**Goal**: Track retention metrics and continuously optimize

- **Weekly**: Review at-risk user list, reach out to red-health-score users
- **Monthly**: Review cohort retention, churn rate, win-back campaign performance
- **Quarterly**: Deep dive into churn reasons, prioritize product improvements

**Success Metrics** (track over 90 days):
- **D30 Retention**: [Baseline → Target — e.g., 35% → 45%]
- **Churn Rate**: [Baseline → Target — e.g., 8% → 5%]
- **Win-Back Reactivation Rate**: [Target: 5-10% of inactive users return]
- **Involuntary Churn**: [Baseline → Target — e.g., 30% of churn → <20% of churn]
- **Health Score**: [% of users in Green — e.g., 60% → 75%]

---

## STEP 4: Generate Comprehensive Retention Optimization Strategy

**You will now receive a comprehensive document covering**:

### Section 1: Executive Summary
- Current retention performance (D1/D7/D30, churn rate)
- Retention curve shape and critical drop-off points
- Top 3 churn drivers and action plans

### Section 2: Cohort Analysis Deep Dive
- Cohort retention table (M0, M1, M3, M6, M12)
- Cohort improvement trend (improving, flat, declining)
- Segment retention comparison (by persona, acquisition source, plan tier)
- Best-retaining and worst-retaining segments

### Section 3: Churn Prediction & At-Risk Users
- At-risk user criteria (3-5 leading indicators)
- At-risk user count and % of user base
- Customer health score model (5 factors, weighted)
- Health score distribution (Green, Yellow, Red)

### Section 4: Win-Back & Dunning Campaigns
- **Win-Back Campaign**: 4-tier email sequence (Days 7, 14, 21, 30 inactive)
- **Dunning Campaign**: Payment failure recovery (Day 0, 3, 7, 10)
- Win-back channels (email, in-app, push, SMS, retargeting, personal outreach)
- Success metrics (open rate, click rate, reactivation rate)

### Section 5: Churn Reason Analysis
- Exit survey questions (3 key questions)
- Churn reason breakdown (% of churned users, addressable?, action plan)
- Top 3 addressable churn reasons with action plans
- Involuntary churn strategy (dunning, grace period, alternative payments)

### Section 6: Retention Loops & Product Improvements
- **Retention Loops** (1-3 loops: content drip, social, progress, collaboration, email digest)
- **Quick Wins** (implement in 30 days: onboarding checklist, bug fixes, email digest)
- **Long-Term Bets** (implement in 90 days: build top feature, redesign workflow, add social features)

### Section 7: Customer Success Strategy
- Customer success model (tech-touch, hybrid, high-touch, white-glove)
- Touchpoints (onboarding Days 0-30, ongoing success, renewal/expansion)
- Customer health score calculation (5 factors, Green/Yellow/Red)
- Scaling plan (manual → semi-automated → fully scaled)

### Section 8: Implementation Roadmap
- **Phase 1 (Weeks 1-3)**: Cohort analysis, churn reason analysis, at-risk user identification
- **Phase 2 (Weeks 4-6)**: Win-back campaign, dunning campaign, personal outreach
- **Phase 3 (Weeks 7-12)**: Quick wins, retention loop, feature improvements
- **Phase 4 (Ongoing)**: Monitor metrics, weekly/monthly/quarterly reviews

### Section 9: Success Metrics
- D30 Retention: [Baseline → Target]
- Churn Rate: [Baseline → Target]
- Win-Back Reactivation Rate: [Target: 5-10%]
- Involuntary Churn: [<20% of total churn]
- Health Score: [75%+ of users in Green]

### Section 10: Next Steps
- Launch win-back campaign this week
- Schedule monthly retention review meetings
- Integrate with **customer-feedback-framework** (use exit surveys to gather churn reasons)
- Integrate with **onboarding-flow-optimizer** (improve early retention via better activation)

---

## STEP 5: Quality Review & Iteration

After generating the strategy, I will ask:

**Quality Check**:
1. Is the retention baseline and target realistic? (D30 retention 35% → 45% in 90 days is achievable)
2. Are churn reasons based on real data (exit surveys, user interviews)?
3. Are at-risk criteria measurable and actionable?
4. Is the win-back campaign multi-channel and escalating?
5. Are retention loops feasible to build in the given timeline?
6. Is the customer success model appropriate for your ARPU and scale?

**Iterate?** [Yes — refine X / No — finalize]

---

## STEP 6: Save & Next Steps

Once finalized, I will:
1. **Save** the retention optimization strategy to your project folder
2. **Suggest** running **onboarding-flow-optimizer** next (to improve early retention)
3. **Remind** you to launch the win-back campaign this week

---

## 8 Critical Guidelines for This Skill

1. **Retention > Acquisition**: It's 5-7x cheaper to retain a customer than acquire a new one. Prioritize retention over growth.

2. **Cohort analysis is essential**: Don't just track overall retention. Track by cohort (signup month) and segment (persona, acquisition source, plan tier).

3. **At-risk users can be saved**: Identify users showing declining engagement 2-4 weeks before they churn, and intervene proactively.

4. **Involuntary churn is addressable**: 20-40% of churn is due to failed payments. Implement dunning campaigns to recover revenue.

5. **Exit surveys are mandatory**: You can't fix churn if you don't know why users leave. Trigger exit surveys on cancellation.

6. **Retention loops > one-time campaigns**: Build repeating cycles (content drip, social, progress) that bring users back automatically.

7. **Health scores predict churn**: Track 5 factors (login frequency, feature usage, support tickets, NPS, payment status) to calculate customer health.

8. **Customer success scales with ARPU**: Low ARPU = tech-touch (automated). High ARPU = high-touch (dedicated CSM).

---

## Quality Checklist (Before Finalizing)

- [ ] Retention baseline and targets are clearly defined (D1/D7/D30, churn rate)
- [ ] Cohort analysis shows retention by signup month and user segment
- [ ] At-risk user criteria are measurable (3-5 leading indicators)
- [ ] Win-back campaign is multi-channel with 4 touchpoints (Days 7, 14, 21, 30)
- [ ] Dunning campaign is implemented to reduce involuntary churn
- [ ] Top 3 churn reasons are identified with action plans
- [ ] 1-3 retention loops are defined (content drip, social, progress, collaboration, email digest)
- [ ] Customer success model matches your ARPU and scale
- [ ] Implementation roadmap is realistic (Weeks 1-3: Analyze, Weeks 4-6: Intervene, Weeks 7-12: Improve)
- [ ] Success metrics are tracked (D30 retention, churn rate, win-back reactivation, involuntary churn, health score)

---

## Integration with Other Skills

**Upstream Skills** (reuse data from):
- **metrics-dashboard-designer** → Retention metrics, cohort data, churn rates, health scores
- **customer-persona-builder** → User segments for cohort analysis
- **product-positioning-expert** → Value delivered, success indicators
- **onboarding-flow-optimizer** → Activation rates, early retention data
- **customer-feedback-framework** → Churn reasons, exit surveys, NPS, CSAT
- **email-marketing-architect** → Win-back email sequences, drip campaigns
- **growth-hacking-playbook** → Retention loops (AARRR framework)

**Downstream Skills** (use this data in):
- **customer-feedback-framework** → Gather feedback from churned users and at-risk users
- **onboarding-flow-optimizer** → Improve early retention (D1-D7) via better onboarding and activation
- **product roadmap** → Prioritize features that reduce churn (top-requested features, bug fixes)
- **investor-pitch-deck-builder** → Use improved retention metrics in traction slides
- **financial-model-architect** → Use lower churn rate to project revenue and LTV

---

## HTML Output Verification

After generating the HTML report, verify all elements render correctly:

### Visual Verification Checklist
- [ ] Header displays business name and date correctly
- [ ] Score banner shows D30 retention, D7 retention, churn rate, at-risk %, healthy %
- [ ] Curve type verdict box displays correctly
- [ ] Retention curve container shows type and description
- [ ] Cohort table displays 4+ rows with color-coded retention cells
- [ ] Segment cards show 3-4 segments with metrics
- [ ] Risk indicators display 4-5 at-risk criteria with icons
- [ ] Health score distribution shows green/yellow/red percentages
- [ ] Health factors list shows 5 weighted factors
- [ ] Win-back timeline displays 4 escalating tiers
- [ ] Churn table shows reasons with addressability badges
- [ ] Retention loops show 2-3 loop cards with cycle steps
- [ ] CS model displays name and ratio
- [ ] Touchpoints grid shows 3 phases
- [ ] All 4 charts render with correct data:
  - Retention curve (line with fill)
  - Cohort comparison (bar)
  - Churn reasons (horizontal bar)
  - Health score distribution (doughnut)
- [ ] Success metrics show 5 baseline -> target cards
- [ ] Roadmap displays 4 phases with tasks
- [ ] Footer shows StratArts branding

### Data Quality Verification
- [ ] D30 retention is realistic (typically 20-50% for SaaS)
- [ ] Churn rate aligns with retention (if 38% D30 retention, expect 5-8% monthly churn)
- [ ] Cohort data shows trend (improving, flat, or declining)
- [ ] Health score distribution adds to 100%
- [ ] Win-back tiers escalate logically (Days 7 -> 14 -> 21 -> 30+)
- [ ] Churn reasons sum to ~100%
- [ ] CS model matches ARPU (low ARPU = tech-touch, high = dedicated)

### Template Location
- Skeleton template: `html-templates/retention-optimization-expert.html`
- Test output: `skills/retention-metrics/retention-optimization-expert/test-template-output.html`

---

**End of Skill**
