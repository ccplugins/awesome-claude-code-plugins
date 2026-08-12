---
name: customer-feedback-framework
description: Comprehensive customer feedback framework including NPS, CSAT, CES surveys, exit interviews, user research, feature request management with RICE prioritization, feedback analysis, close-the-loop processes, and 90-day implementation roadmap for Voice of Customer programs
version: 1.0.0
category: retention-metrics
---

# customer-feedback-framework

## Step 0: Pre-Generation Verification

**IMPORTANT**: Before generating the HTML output, verify you have gathered data for ALL required placeholders:

### Header & Score Banner Placeholders
- [ ] `{{BUSINESS_NAME}}` - Company/product name
- [ ] `{{DATE}}` - Generation date
- [ ] `{{NPS_SCORE}}` - Current NPS score
- [ ] `{{CSAT_SCORE}}` - Current CSAT percentage
- [ ] `{{CES_SCORE}}` - Current CES score (1-5)
- [ ] `{{SURVEY_COUNT}}` - Number of survey types deployed
- [ ] `{{INTERVIEW_COUNT}}` - Monthly interview target
- [ ] `{{FRAMEWORK_STATUS}}` - Status verdict (e.g., "VOICE OF CUSTOMER")

### Metrics Overview Placeholders
- [ ] `{{METRICS_OVERVIEW}}` - 4 metric cards with current/target values

### NPS Section Placeholders
- [ ] `{{NPS_CADENCE}}` - Survey cadence (Quarterly/Transactional)
- [ ] `{{NPS_FOLLOWUPS}}` - 3 follow-up cards (Promoters, Passives, Detractors)

### CSAT/CES Section Placeholders
- [ ] `{{CSAT_TOUCHPOINTS}}` - Active touchpoints for CSAT
- [ ] `{{CES_TOUCHPOINTS}}` - Active touchpoints for CES

### Exit Survey Placeholders
- [ ] `{{EXIT_RESPONSE_RATE}}` - Response rate percentage
- [ ] `{{CHURN_REASONS}}` - 6 churn reasons with percentages and addressability

### Close the Loop Placeholders
- [ ] `{{LOOP_PROCESS}}` - 3 process cards (Detractors, Passives, Promoters)

### User Interviews Placeholders
- [ ] `{{INTERVIEW_TYPES}}` - Interview types with monthly counts
- [ ] `{{INTERVIEW_DURATION}}` - Interview length
- [ ] `{{INTERVIEW_SCRIPT}}` - Script sections with questions

### Feature Requests Placeholders
- [ ] `{{FEATURE_CHANNELS}}` - Collection channel items
- [ ] `{{RICE_TABLE_ROWS}}` - Feature requests with RICE scores

### Feedback Themes Placeholders
- [ ] `{{FEEDBACK_THEMES}}` - Theme cards with mentions, trends, actions

### Roadmap Placeholders
- [ ] `{{ROADMAP_PHASES}}` - 3 phase cards

### Chart Data Placeholders
- [ ] `{{NPS_LABELS}}` - JSON array (Promoters, Passives, Detractors)
- [ ] `{{NPS_DATA}}` - JSON array (percentages)
- [ ] `{{THEMES_LABELS}}` - JSON array (theme names)
- [ ] `{{THEMES_DATA}}` - JSON array (mention counts)
- [ ] `{{TRENDS_LABELS}}` - JSON array (months)
- [ ] `{{CSAT_TREND_DATA}}` - JSON array (CSAT percentages)
- [ ] `{{CES_TREND_DATA}}` - JSON array (CES scores)
- [ ] `{{VOLUME_LABELS}}` - JSON array (months)
- [ ] `{{NPS_VOLUME_DATA}}` - JSON array (NPS responses)
- [ ] `{{CSAT_VOLUME_DATA}}` - JSON array (CSAT responses)
- [ ] `{{EXIT_VOLUME_DATA}}` - JSON array (exit responses)

**DO NOT proceed to HTML generation until all placeholders have corresponding data from the user conversation.**

---

**Mission**: Build a systematic framework for gathering, analyzing, and acting on customer feedback through surveys (NPS, CSAT, CES), exit interviews, user research, feature requests, and feedback loops. Turn customer insights into product improvements and business decisions.

---

## STEP 1: Detect Previous Context

### Ideal Context (All Present):
- **retention-optimization-expert** → Churn reasons, exit survey questions, at-risk users
- **onboarding-flow-optimizer** → Onboarding feedback needs, activation metrics
- **metrics-dashboard-designer** → NPS, CSAT metrics and targets
- **customer-persona-builder** → User segments for targeted feedback

### Partial Context (Some Present):
- **retention-optimization-expert** → Churn data available
- **metrics-dashboard-designer** → Feedback metrics framework available
- **customer-persona-builder** → User segmentation available

### No Context:
- None of the above skills were run

---

## STEP 2: Context-Adaptive Introduction

### If Ideal Context:
> I found outputs from **retention-optimization-expert**, **onboarding-flow-optimizer**, **metrics-dashboard-designer**, and **customer-persona-builder**.
>
> I can reuse:
> - **Churn reasons** (top 3: [Reason 1], [Reason 2], [Reason 3])
> - **Exit survey questions** (already drafted)
> - **Onboarding pain points** (activation rate: [X%], drop-off points)
> - **Feedback metrics** (NPS target: [X], CSAT target: [Y%])
> - **User segments** ([Segment A], [Segment B], [Segment C])
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
> I'll guide you through building your customer feedback framework from the ground up.

---

## STEP 3: Questions (One at a Time, Sequential)

### NPS (Net Promoter Score)

**Question NPS1: What is your NPS strategy?**

**NPS Question**: "On a scale of 0-10, how likely are you to recommend [Product] to a friend or colleague?"

**NPS Scoring**:
- **Promoters (9-10)**: Loyal enthusiasts who will refer others
- **Passives (7-8)**: Satisfied but unenthusiastic, vulnerable to competition
- **Detractors (0-6)**: Unhappy customers who can damage your brand through negative word-of-mouth

**NPS Formula**: % Promoters - % Detractors
- Example: 50% promoters, 10% detractors → NPS = 40

**NPS Benchmarks** (for context):
- **SaaS**: 30-40 (good), 50+ (excellent)
- **E-commerce**: 30-50
- **B2B**: 20-40
- **B2C**: 10-30

**Your Current NPS**: [e.g., "32" or "Not yet measured"]
**Your Target NPS**: [e.g., "50 within 12 months"]

**When to survey**:
- ☐ **Relationship NPS** (quarterly or bi-annually — measures overall loyalty)
- ☐ **Transactional NPS** (after key moments — post-purchase, post-support, post-onboarding)

**Your NPS Survey Cadence**: [e.g., "Quarterly relationship NPS + transactional NPS after support interactions"]

---

**Question NPS2: What follow-up questions will you ask?**

**NPS Follow-Up Question** (required — understand the "why"):

**For Promoters (9-10)**:
- "What do you love most about [Product]?"
- "What made you give us a [9/10]?"
- "Would you be willing to write a review or refer a friend?" (capture testimonials, referrals)

**For Passives (7-8)**:
- "What would it take to make us a 10?"
- "What's missing or could be improved?"

**For Detractors (0-6)**:
- "We're sorry to hear that. What went wrong?"
- "What can we do to improve your experience?"
- "Would you like someone from our team to reach out?" (offer to fix the issue)

**Your Follow-Up Questions** (customize for each group):
- **Promoters**: [Question]
- **Passives**: [Question]
- **Detractors**: [Question]

---

**Question NPS3: How will you close the loop with respondents?**

**Close the Loop** = Respond to feedback, especially from Detractors and Passives

**Detractor Response Process**:
1. **Immediate Alert** (within 1 hour): Send alert to CSM or support lead
2. **Personal Outreach** (within 24 hours): CSM or founder emails/calls detractor
   - "Thank you for your feedback. I'd love to understand what went wrong and how we can fix it."
3. **Action Plan** (within 1 week): Offer solution (refund, fix issue, custom support)
4. **Follow-Up** (after 30 days): Re-survey detractor to measure improvement

**Passive Response Process**:
1. **Thank You Email** (automated): "Thanks for your feedback. Here's what we're working on."
2. **Feature Update** (when relevant): Email passive users when you ship requested features

**Promoter Response Process**:
1. **Thank You Email** (automated): "We're thrilled to hear you love [Product]!"
2. **Request Testimonial**: "Would you share your experience in a quick review?" (link to G2, Capterra, TrustPilot)
3. **Request Referral**: "Know someone who'd love [Product]? Refer them and both of you get [reward]"

**Your Close-the-Loop Plan** (assign ownership):
- **Detractors**: [Who responds? How quickly?]
- **Passives**: [Automated email or personal outreach?]
- **Promoters**: [Request testimonials? Referrals?]

---

### CSAT (Customer Satisfaction)

**Question CSAT1: What is your CSAT strategy?**

**CSAT Question**: "How satisfied are you with [specific experience]?"

**CSAT Scale**:
- 1 = Very Dissatisfied
- 2 = Dissatisfied
- 3 = Neutral
- 4 = Satisfied
- 5 = Very Satisfied

**CSAT Formula**: (# of 4-5 responses / Total responses) × 100
- Example: 80 satisfied out of 100 responses → CSAT = 80%

**CSAT Benchmark**: >80% is good, >90% is excellent

**When to survey** (transactional — after specific interactions):
- ☐ After customer support interaction
- ☐ After onboarding completion
- ☐ After product purchase
- ☐ After feature usage (e.g., "How was your experience with [new feature]?")
- ☐ After renewal or upgrade

**Your CSAT Touchpoints** (choose 2-4):
1. [Touchpoint 1] — e.g., "After support ticket resolved"
2. [Touchpoint 2] — e.g., "After onboarding completion (Day 30)"
3. [Touchpoint 3] — e.g., "After trial conversion"

**Current CSAT**: [X% or "Not yet measured"]
**Target CSAT**: [e.g., ">90%"]

---

**Question CSAT2: What follow-up question will you ask?**

**CSAT Follow-Up** (understand the "why"):

**For Satisfied (4-5)**:
- "What did we do well?"
- "Anything we could improve?"

**For Dissatisfied (1-3)**:
- "We're sorry to hear that. What went wrong?"
- "What could we have done better?"
- "Would you like us to follow up?" (offer to fix)

**Your CSAT Follow-Up Questions**:
- **Satisfied (4-5)**: [Question]
- **Dissatisfied (1-3)**: [Question]

---

### CES (Customer Effort Score)

**Question CES1: What is your CES strategy?**

**CES Question**: "How easy was it to [complete task]?"

**CES Scale**:
- 1 = Very Difficult
- 2 = Difficult
- 3 = Neutral
- 4 = Easy
- 5 = Very Easy

**CES Formula**: Average score (1-5)
- Example: 4.2 average → "Most users found it easy"

**CES Benchmark**: >4.0 is good (most users find it easy)

**When to survey** (after tasks requiring effort):
- ☐ After onboarding completion
- ☐ After resolving a support issue
- ☐ After completing a complex workflow (e.g., "How easy was it to set up your first integration?")
- ☐ After account setup or configuration

**Your CES Touchpoints** (choose 2-3):
1. [Touchpoint 1] — e.g., "After onboarding completion"
2. [Touchpoint 2] — e.g., "After support issue resolved"
3. [Touchpoint 3] — e.g., "After integration setup"

**Current CES**: [X or "Not yet measured"]
**Target CES**: [e.g., ">4.0"]

---

**Question CES2: What follow-up question will you ask?**

**CES Follow-Up**:

**For Easy (4-5)**:
- "What made it easy?"

**For Difficult (1-3)**:
- "What made it difficult?"
- "How can we simplify this for you?"

**Your CES Follow-Up Questions**:
- **Easy (4-5)**: [Question]
- **Difficult (1-3)**: [Question]

---

### Exit Surveys (Churn Surveys)

**Question ES1: What are your exit survey questions?**

**Exit Survey** = Survey users when they cancel or churn

**Trigger**: When user clicks "Cancel subscription" or becomes inactive for 30+ days

**Exit Survey Questions** (3-5 questions):

**Question 1: Why are you leaving?**
- ☐ Too expensive
- ☐ Didn't see value / wasn't using it
- ☐ Missing features I need
- ☐ Found a better alternative: [which one?]
- ☐ Too complicated / hard to use
- ☐ Poor customer support
- ☐ Technical issues / bugs
- ☐ Company shut down / no longer needed
- ☐ Other: [open text]

**Question 2: What would have kept you as a customer?**
- [Open text]

**Question 3: Would you consider returning in the future?**
- ☐ Yes, if [condition]
- ☐ Maybe
- ☐ No

**Question 4: Can we follow up with you?**
- ☐ Yes, please reach out (collect email/phone)
- ☐ No, I'm all set

**Question 5 (optional): How satisfied were you overall?**
- [1-5 scale]

**Incentive to Complete Survey**:
- ☐ No incentive
- ☐ Gift card ($10-$25 Amazon/Starbucks)
- ☐ Extended access (e.g., "Keep your data for 60 more days")
- ☐ Discount to return (e.g., "20% off if you rejoin within 3 months")

**Your Incentive**: [Choose one]

**Response Rate Goal**: [e.g., "30% of churned users complete exit survey"]

---

**Question ES2: How will you act on exit survey data?**

**Exit Survey Analysis**:

| Churn Reason                    | % of Responses | Addressable? | Action Plan                                 | Owner         |
|---------------------------------|----------------|--------------|---------------------------------------------|---------------|
| Didn't see value / low usage    | X%             | ✅ Yes       | Improve onboarding, activation              | Product Lead  |
| Too expensive                   | X%             | ✅ Yes       | Introduce lower-tier plan, annual discount  | Pricing Lead  |
| Missing features                | X%             | ✅ Yes       | Build top-requested features                | Product Lead  |
| Found better alternative        | X%             | ⚠️ Maybe    | Competitive analysis, differentiate         | Marketing     |
| Too complicated                 | X%             | ✅ Yes       | Simplify UI, improve help docs              | Product/UX    |
| Poor support                    | X%             | ✅ Yes       | Hire more support, reduce response time     | Support Lead  |
| Technical issues                | X%             | ✅ Yes       | Fix bugs, improve performance               | Engineering   |

**Quarterly Churn Review**:
- Review exit survey data every quarter
- Identify top 3 addressable churn reasons
- Prioritize product/pricing/support improvements

---

### User Interviews & Qualitative Research

**Question UI1: How will you conduct user interviews?**

**User Interview Strategy**:

**When to conduct interviews**:
- ☐ **Onboarding feedback** (interview 10-20 new users after onboarding)
- ☐ **Feature feedback** (interview users of new feature after 30 days)
- ☐ **Churn interviews** (interview churned users to understand why they left)
- ☐ **Power user interviews** (interview top 10% of users to understand what they love)
- ☐ **At-risk user interviews** (interview users with declining engagement)

**Interview Cadence**: [e.g., "10 user interviews per month (mix of new, power, at-risk, churned)"]

**Your Interview Focus Areas** (choose 2-3):
1. [Focus Area 1] — e.g., "Onboarding feedback (new users)"
2. [Focus Area 2] — e.g., "Churn interviews (churned users)"
3. [Focus Area 3] — e.g., "Power user interviews (top 10%)"

---

**Question UI2: What are your user interview questions?**

**User Interview Script** (30-45 minutes):

### Part 1: Background (5 minutes)
- "Tell me about your role and your company."
- "What are your main goals/challenges in [domain]?"
- "What tools do you currently use to achieve [goal]?"

### Part 2: Product Experience (15-20 minutes)
- "How did you first hear about [Product]?"
- "What problem were you trying to solve when you signed up?"
- "Walk me through how you use [Product] in a typical week."
- "What do you love most about [Product]?"
- "What's frustrating or confusing about [Product]?"
- "What features do you wish we had?"

### Part 3: Competitive Landscape (5 minutes)
- "Have you tried alternatives to [Product]? Which ones?"
- "How does [Product] compare to [Competitor X]?"
- "What would make you switch to a different tool?"

### Part 4: Future & Closing (5 minutes)
- "If you could wave a magic wand and change one thing about [Product], what would it be?"
- "Are there any other thoughts or feedback you'd like to share?"

**Your Interview Questions** (customize based on focus area):
1. [Question 1]
2. [Question 2]
3. [Question 3]
4. [Question 4]
5. [Question 5]

**Incentive for Interviews**:
- ☐ $50-$100 gift card
- ☐ Free month of service
- ☐ Swag (T-shirt, stickers)
- ☐ Early access to new features

**Your Incentive**: [Choose one]

---

### Feature Requests & Feedback Management

**Question FR1: How will you collect feature requests?**

**Feature Request Channels**:
- ☐ **In-app feedback widget** (e.g., "Request a feature" button)
- ☐ **Email** (support@yourcompany.com)
- ☐ **Dedicated feedback tool** (e.g., Canny, ProductBoard, UserVoice)
- ☐ **Community forum** (public roadmap, upvote features)
- ☐ **Support tickets** (extract feature requests from support conversations)
- ☐ **Sales feedback** (sales team logs requests from prospects/customers)

**Your Feature Request Channels** (choose 2-4):
1. [Channel 1] — e.g., "In-app feedback widget"
2. [Channel 2] — e.g., "Dedicated tool: Canny"
3. [Channel 3] — e.g., "Support tickets (tagged as 'Feature Request')"

**Feature Request Tool**: [e.g., "Canny" or "Internal spreadsheet" or "ProductBoard"]

---

**Question FR2: How will you prioritize feature requests?**

**Prioritization Framework** (RICE Model):

**RICE Score = (Reach × Impact × Confidence) / Effort**

| Feature Request                 | Reach | Impact | Confidence | Effort | RICE Score | Priority |
|---------------------------------|-------|--------|------------|--------|------------|----------|
| [Feature 1]                     | 100   | 3      | 80%        | 2      | 120        | High     |
| [Feature 2]                     | 50    | 2      | 50%        | 5      | 10         | Low      |

**RICE Definitions**:
- **Reach**: How many users will this impact per quarter? (e.g., 100 users)
- **Impact**: How much will this impact each user? (1=Low, 2=Medium, 3=High, 4=Massive)
- **Confidence**: How confident are you in your estimates? (50%=Low, 80%=Medium, 100%=High)
- **Effort**: How many person-months will this take? (e.g., 2 weeks = 0.5, 2 months = 2)

**Your Prioritization Framework**: [RICE or alternative — MoSCoW, Kano, Value vs. Effort]

**Quarterly Feature Review**:
- Collect all feature requests
- Score using RICE (or chosen framework)
- Top 5 requests → Product roadmap

---

**Question FR3: How will you close the loop with requesters?**

**Feature Request Response Plan**:

**When request is submitted**:
- **Auto-reply**: "Thank you for your feedback! We've logged your request and will review it for our roadmap."

**When request is prioritized**:
- **Update email**: "Good news! We're working on [feature]. We'll notify you when it's live."
- **Public roadmap update** (if using Canny, ProductBoard): Mark as "Planned" or "In Progress"

**When feature ships**:
- **Launch email**: "The feature you requested is now live! Here's how to use it..."
- **In-app notification**: "New feature: [Feature Name]"

**When request is declined**:
- **Explanation email**: "Thanks for suggesting [feature]. Here's why we're not building it right now..." (be transparent, explain trade-offs)

**Your Response Plan** (assign ownership):
- **Who responds to feature requests?**: [e.g., "Product Manager"]
- **How quickly?**: [e.g., "Within 3 business days"]
- **Do you notify when features ship?**: [Yes/No]

---

### Feedback Analysis & Reporting

**Question FA1: How will you analyze and report feedback?**

**Feedback Analysis Process**:

### Step 1: Aggregate Feedback (Monthly)
- Pull all feedback from: NPS, CSAT, CES, exit surveys, user interviews, feature requests, support tickets
- Tag feedback by theme: Onboarding, Pricing, Features, Support, Bugs, Usability, Performance

### Step 2: Identify Themes (Monthly)
| Theme                    | # of Mentions | % of Feedback | Trend       | Action                              |
|--------------------------|---------------|---------------|-------------|-------------------------------------|
| "Missing feature X"      | 45            | 15%           | ↑ Increasing| Build feature X in Q2               |
| "Onboarding too complex" | 32            | 11%           | → Stable    | Simplify onboarding (already WIP)   |
| "Too expensive"          | 28            | 9%            | ↑ Increasing| Consider lower-tier plan            |
| "Slow performance"       | 20            | 7%            | ↓ Decreasing| Recent performance fix working      |

### Step 3: Create Feedback Report (Monthly)
- **Summary**: Key themes, trends, volume of feedback
- **Highlights**: Top 5 most-requested features, top 3 pain points
- **Action Items**: What we'll do in response (product changes, support improvements, content creation)
- **Distribute to**: Leadership, Product, Engineering, Support, Sales

**Your Reporting Cadence**: [e.g., "Monthly feedback report shared with leadership"]

---

**Question FA2: How will you track feedback metrics over time?**

**Feedback Metrics Dashboard**:

| Metric                          | Baseline | Target  | Current | Trend       |
|---------------------------------|----------|---------|---------|-------------|
| NPS                             | 32       | 50      | 38      | ↑ Improving |
| CSAT (Support)                  | 85%      | 90%     | 87%     | ↑ Improving |
| CES (Onboarding)                | 3.5      | 4.0     | 3.8     | ↑ Improving |
| Exit Survey Response Rate       | 20%      | 30%     | 25%     | ↑ Improving |
| Feature Request Volume (monthly)| 50       | —       | 65      | ↑ Increasing|
| User Interviews Conducted (monthly) | 5    | 10      | 8       | ↑ Improving |

**Review Cadence**:
- **Monthly**: Review feedback metrics, identify trends
- **Quarterly**: Deep dive into themes, prioritize product changes

---

### Implementation Roadmap

**Question IR1: What is your 90-day feedback framework implementation plan?**

### Phase 1: Survey Setup (Weeks 1-3)
**Goal**: Implement NPS, CSAT, CES, and exit surveys

- **Week 1: NPS Survey**
  - Choose tool (Delighted, Wootric, Intercom, or custom)
  - Write NPS question + follow-ups (for Promoters, Passives, Detractors)
  - Set up quarterly NPS survey + transactional triggers (post-support)

- **Week 2: CSAT & CES Surveys**
  - Write CSAT questions (post-support, post-onboarding)
  - Write CES questions (post-onboarding, post-integration)
  - Set up automated triggers

- **Week 3: Exit Survey**
  - Write exit survey questions (why leaving, what would keep you, would you return)
  - Set up trigger (when user cancels or becomes inactive)
  - Add incentive (gift card, extended access)

**Deliverable**: NPS, CSAT, CES, and exit surveys live and collecting responses

---

### Phase 2: Close-the-Loop Process (Weeks 4-6)
**Goal**: Respond to feedback and build feedback loops

- **Week 4: Detractor Response Process**
  - Set up alerts (Detractor NPS responses → Slack/email alert to CSM)
  - Create response template (email/call script)
  - Assign ownership (CSM, Support Lead, or Founder)

- **Week 5: Feature Request Management**
  - Choose feature request tool (Canny, ProductBoard, or spreadsheet)
  - Set up channels (in-app widget, email, support tickets)
  - Create RICE prioritization framework

- **Week 6: Feedback Response Playbook**
  - Document close-the-loop process (Detractors, Passives, Promoters)
  - Train CSM/Support team on response protocols
  - Set SLA (respond to Detractors within 24 hours)

**Deliverable**: Close-the-loop process live, feature request tool set up

---

### Phase 3: Qualitative Research (Weeks 7-12)
**Goal**: Conduct user interviews and analyze feedback themes

- **Week 7-8: User Interview Setup**
  - Create interview script (onboarding, churn, power user)
  - Recruit 10 interviewees (offer $50-$100 gift card)
  - Schedule interviews (2-3 per week)

- **Week 9-10: Conduct Interviews**
  - Conduct 10-15 user interviews (30-45 minutes each)
  - Record (with permission) and transcribe
  - Tag themes (onboarding, features, pricing, support, bugs)

- **Week 11: Feedback Analysis**
  - Aggregate all feedback (NPS, CSAT, CES, exit surveys, interviews, feature requests)
  - Identify top 5 themes (most-mentioned pain points, feature requests)
  - Create feedback report (share with leadership, product, engineering)

- **Week 12: Action Planning**
  - Prioritize top 3 feedback themes
  - Create action plan (product changes, support improvements, content creation)
  - Assign owners and timelines

**Deliverable**: 10-15 user interviews completed, monthly feedback report published, action plan created

---

## STEP 4: Generate Comprehensive Customer Feedback Framework

**You will now receive a comprehensive document covering**:

### Section 1: Executive Summary
- Feedback strategy overview (NPS, CSAT, CES, exit surveys, user interviews, feature requests)
- Current performance and targets (NPS: [X → Y], CSAT: [X → Y%])
- Top 3 feedback themes and action plans

### Section 2: NPS (Net Promoter Score)
- NPS question and follow-ups (Promoters, Passives, Detractors)
- Survey cadence (quarterly relationship NPS + transactional NPS)
- Close-the-loop process (Detractor response within 24 hours)
- NPS targets and benchmarks (current: [X], target: [Y], benchmark: [Z])

### Section 3: CSAT (Customer Satisfaction)
- CSAT questions and touchpoints (post-support, post-onboarding, post-purchase)
- Follow-up questions (satisfied vs. dissatisfied)
- CSAT targets (>90%)

### Section 4: CES (Customer Effort Score)
- CES questions and touchpoints (post-onboarding, post-support, post-workflow)
- Follow-up questions (easy vs. difficult)
- CES targets (>4.0)

### Section 5: Exit Surveys
- Exit survey questions (5 questions: why leaving, what would keep you, would you return, follow-up, overall satisfaction)
- Incentive strategy (gift card, extended access, discount to return)
- Exit survey analysis (churn reason breakdown, addressable actions)
- Quarterly churn review process

### Section 6: User Interviews
- Interview strategy (onboarding, churn, power user, at-risk user interviews)
- Interview script (30-45 minutes: background, product experience, competitive landscape, future)
- Interview cadence (10 interviews per month)
- Incentive ($50-$100 gift card, free month, early access)

### Section 7: Feature Requests & Feedback Management
- Feature request channels (in-app widget, email, dedicated tool, community forum, support tickets, sales feedback)
- Feature request tool (Canny, ProductBoard, UserVoice, or internal)
- Prioritization framework (RICE: Reach × Impact × Confidence / Effort)
- Close-the-loop process (acknowledge request, update when prioritized, notify when shipped)

### Section 8: Feedback Analysis & Reporting
- Feedback aggregation process (monthly)
- Theme identification (tag by: onboarding, pricing, features, support, bugs, usability, performance)
- Monthly feedback report (summary, highlights, action items, distribution to leadership)
- Feedback metrics dashboard (NPS, CSAT, CES, exit survey response rate, feature request volume, interview count)

### Section 9: Implementation Roadmap
- **Phase 1 (Weeks 1-3)**: NPS, CSAT, CES, exit survey setup
- **Phase 2 (Weeks 4-6)**: Close-the-loop process, feature request management, feedback response playbook
- **Phase 3 (Weeks 7-12)**: User interviews, feedback analysis, action planning

### Section 10: Success Metrics
- NPS: [Baseline → Target — e.g., 32 → 50]
- CSAT: [Baseline → Target — e.g., 85% → 90%]
- CES: [Baseline → Target — e.g., 3.5 → 4.0]
- Exit Survey Response Rate: [Baseline → Target — e.g., 20% → 30%]
- Detractor Response Time: [<24 hours]
- User Interviews Conducted: [10+ per month]

### Section 11: Next Steps
- Launch NPS survey this week
- Schedule monthly feedback review meetings
- Integrate with **retention-optimization-expert** (use exit survey data to reduce churn)
- Integrate with **onboarding-flow-optimizer** (use CSAT/CES data to improve onboarding)

---

## STEP 5: Quality Review & Iteration

After generating the strategy, I will ask:

**Quality Check**:
1. Are NPS, CSAT, and CES surveys deployed at the right touchpoints?
2. Is the close-the-loop process fast enough (Detractors responded to within 24 hours)?
3. Are feature requests prioritized using a clear framework (RICE)?
4. Are user interviews conducted regularly (10+ per month)?
5. Is feedback analyzed and reported monthly to leadership?
6. Are action plans created based on feedback themes?

**Iterate?** [Yes — refine X / No — finalize]

---

## STEP 6: Save & Next Steps

Once finalized, I will:
1. **Save** the customer feedback framework to your project folder
2. **Suggest** launching NPS survey this week
3. **Remind** you to schedule monthly feedback review meetings

---

## 8 Critical Guidelines for This Skill

1. **Close the loop with Detractors within 24 hours**: Unhappy customers who receive a fast, personal response are more likely to stay or return.

2. **NPS is not enough**: NPS measures loyalty, but CSAT and CES measure specific experiences. Use all three for a complete picture.

3. **Always ask "why"**: Scores without qualitative feedback are useless. Always include follow-up questions to understand the "why."

4. **Exit surveys are gold**: Churned users will tell you exactly what's broken. Don't let them leave without understanding why.

5. **User interviews > surveys**: 10 in-depth user interviews reveal more insights than 1,000 survey responses. Prioritize qualitative research.

6. **Feedback without action is noise**: Don't collect feedback you won't act on. Create action plans and assign owners.

7. **Feature requests must be prioritized**: Use a framework (RICE, MoSCoW, Value vs. Effort) to avoid building the loudest request instead of the most valuable one.

8. **Report feedback to leadership monthly**: Feedback themes should inform product roadmap, pricing, support, and marketing decisions.

---

## Quality Checklist (Before Finalizing)

- [ ] NPS survey is set up with follow-up questions for Promoters, Passives, and Detractors
- [ ] CSAT surveys are deployed at 2-4 touchpoints (post-support, post-onboarding, post-purchase)
- [ ] CES surveys are deployed at 2-3 touchpoints (post-onboarding, post-support, post-workflow)
- [ ] Exit survey has 3-5 questions with incentive to complete
- [ ] Close-the-loop process is defined (Detractors responded to within 24 hours)
- [ ] Feature request channels and tool are selected (Canny, ProductBoard, or internal)
- [ ] Feature request prioritization framework is chosen (RICE, MoSCoW, Value vs. Effort)
- [ ] User interview strategy is defined (10+ interviews per month, script, incentive)
- [ ] Feedback analysis process is monthly (aggregate, identify themes, create report, distribute)
- [ ] Implementation roadmap is realistic (Weeks 1-3: Surveys, Weeks 4-6: Close-the-loop, Weeks 7-12: Interviews)

---

## Integration with Other Skills

**Upstream Skills** (reuse data from):
- **retention-optimization-expert** → Churn reasons, exit survey questions, at-risk user identification
- **onboarding-flow-optimizer** → Onboarding pain points, activation metrics (to inform CSAT/CES questions)
- **metrics-dashboard-designer** → NPS, CSAT, CES metrics and targets
- **customer-persona-builder** → User segments for targeted feedback collection
- **customer-success** → Support CSAT data, customer health scores

**Downstream Skills** (use this data in):
- **retention-optimization-expert** → Use exit survey data to identify churn drivers and build win-back campaigns
- **onboarding-flow-optimizer** → Use CSAT/CES feedback to improve onboarding experience and reduce friction
- **product-roadmap** → Use feature request prioritization (RICE) to inform product roadmap
- **customer-success** → Use Detractor feedback to trigger proactive CSM outreach
- **marketing** → Use Promoter testimonials in case studies, landing pages, and ads
- **sales** → Use feature request data to inform product positioning and objection handling

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
   html-templates/customer-feedback-framework.html
   ```

### How to Use Templates

1. Read `VERIFICATION-CHECKLIST.md` first - contains canonical CSS patterns that MUST be copied exactly
2. Read `base-template.html` - contains all shared CSS, layout structure, and Chart.js configuration
3. Read `customer-feedback-framework.html` - contains skill-specific content sections, CSS extensions, and chart scripts
4. Replace all `{{PLACEHOLDER}}` markers with actual analysis data
5. Merge the skill-specific CSS into `{{SKILL_SPECIFIC_CSS}}`
6. Merge the content sections into `{{CONTENT_SECTIONS}}`
7. Merge the chart scripts into `{{CHART_SCRIPTS}}`

---

## HTML Output Verification

After generating the HTML output, verify the following:

### Structure Verification
- [ ] Header uses canonical pattern with gradient background (#10b981 → #14b8a6)
- [ ] Score banner shows NPS, CSAT, CES, survey count, interview count
- [ ] Verdict box displays framework status
- [ ] All 9 sections present: Executive Summary, NPS, CSAT, CES, Exit Surveys, Close the Loop, User Interviews, Feature Requests, Feedback Themes, Roadmap
- [ ] Footer uses canonical pattern with StratArts branding

### Content Verification
- [ ] Executive summary includes 2 paragraphs + 4 metric overview cards
- [ ] NPS section has survey question, scale, and 3 follow-up cards
- [ ] CSAT section has survey question and touchpoint badges
- [ ] CES section has survey question and touchpoint badges
- [ ] Exit surveys show 6 churn reasons with percentages and addressability badges
- [ ] Close the loop has 3 process cards with timing steps
- [ ] User interviews shows interview types + script sections
- [ ] Feature requests has channels list + RICE prioritization table
- [ ] Feedback themes grid with trend indicators and action items
- [ ] 90-day roadmap with 3 phase cards

### CSS Verification
- [ ] Dark theme applied (#0a0a0a background, #1a1a1a containers)
- [ ] Emerald accent color (#10b981) used consistently
- [ ] Survey question boxes have left border accent
- [ ] Addressability badges use color coding (green=yes, amber=maybe)
- [ ] Priority badges use color coding (green=high, amber=medium, red=low)
- [ ] Responsive breakpoints at 1200px and 768px

### Chart Verification
- [ ] npsChart: Doughnut showing Promoters/Passives/Detractors
- [ ] themesChart: Horizontal bar chart of feedback themes
- [ ] trendsChart: Dual-axis line (CSAT % left, CES right)
- [ ] volumeChart: Stacked bar chart of survey volume
- [ ] All charts use Chart.js v4.4.0
- [ ] Dark theme defaults applied (color: #888, borderColor: #333)

### Data Consistency
- [ ] NPS score in banner matches doughnut chart calculation
- [ ] CSAT/CES scores match trend chart endpoints
- [ ] Churn reasons percentages sum to ~100%
- [ ] RICE scores correctly calculated (Reach × Impact × Confidence / Effort)
