---
name: onboarding-flow-optimizer
description: Optimize user onboarding to reduce time-to-value and increase activation rates. Design clear paths to the "aha moment" through checklists, product tours, educational content, and personalized flows. Generate actionable HTML reports with funnel analysis, email sequences, and A/B testing plans.
version: 1.0.0
category: retention-metrics
---

# onboarding-flow-optimizer

**Mission**: Optimize the onboarding experience to reduce time-to-value, increase activation rates, and improve early retention (D1-D7). Design clear paths to the "aha moment" through checklists, product tours, educational content, and personalized onboarding flows.

---

## STEP 0: Pre-Generation Verification

Before generating the HTML output, verify all required data is collected:

### Header & Score Banner
- [ ] `{{BUSINESS_NAME}}` - Company/product name
- [ ] `{{DATE}}` - Report generation date
- [ ] `{{ACTIVATION_RATE}}` - Current activation rate (e.g., "47%")
- [ ] `{{TARGET_RATE}}` - Target activation rate (e.g., "65%")
- [ ] `{{TIME_TO_ACTIVATE}}` - Median time to activate (e.g., "18h")
- [ ] `{{CHECKLIST_STEPS}}` - Number of onboarding steps (e.g., "5")
- [ ] `{{D7_RETENTION}}` - Day 7 retention rate (e.g., "52%")
- [ ] `{{AHA_MOMENT}}` - Short aha moment description (e.g., "First Task Completed")

### Executive Summary
- [ ] `{{EXECUTIVE_SUMMARY}}` - 2-3 paragraph overview with key insights and interventions
- [ ] `{{ACTIVATION_EVENT}}` - Full activation event definition
- [ ] `{{ACTIVATION_DESCRIPTION}}` - Why this event represents the aha moment

### Funnel Analysis
- [ ] `{{FUNNEL_STEPS}}` - 5+ funnel steps with users, conversion %, drop-off %
  - Each step: step name, bar width, user count, drop-off percentage

### Onboarding Checklist
- [ ] `{{CHECKLIST_STEPS}}` - 3-5 numbered steps
  - Each step: title, reason (why it matters), time estimate

### Product Tour
- [ ] `{{TOUR_STEPS}}` - 5-7 tour steps
  - Each step: number, title, highlight message, user action

### Educational Content
- [ ] `{{CONTENT_CARDS}}` - 5-6 content types
  - Each card: icon, type label, description

### Personalized Paths
- [ ] `{{PATH_CARDS}}` - 2-4 user segments
  - Each path: segment name, goal, 3-4 checklist steps

### Email Sequence
- [ ] `{{EMAIL_ITEMS}}` - 5 emails (Day 0, 1, 3, 5, 7)
  - Each email: day label, subject line, body description

### A/B Tests
- [ ] `{{AB_TEST_CARDS}}` - 3-4 A/B tests
  - Each test: name, metric, variant A, variant B

### Charts
- [ ] `{{FUNNEL_LABELS}}` - JSON array of funnel step names
- [ ] `{{FUNNEL_DATA}}` - JSON array of conversion percentages
- [ ] `{{TIME_LABELS}}` - JSON array of time buckets (e.g., "<1 hour", "1-24 hours")
- [ ] `{{TIME_DATA}}` - JSON array of user percentages per bucket
- [ ] `{{RETENTION_LABELS}}` - JSON array of retention days (D0, D1, D3, D7, etc.)
- [ ] `{{RETENTION_DATA}}` - JSON array of retention percentages
- [ ] `{{COHORT_LABELS}}` - JSON array of cohort names (months)
- [ ] `{{COHORT_DATA}}` - JSON array of activation rates per cohort

### Roadmap
- [ ] `{{ROADMAP_PHASES}}` - 3 phases (Foundation, Education, Optimize)
  - Each phase: name, timing, goal, 4-5 tasks

---

## STEP 1: Detect Previous Context

### Ideal Context (All Present):
- **metrics-dashboard-designer** → Activation metrics, D1/D7 retention, time-to-activate
- **customer-persona-builder** → User segments, goals, pain points, skill levels
- **product-positioning-expert** → Value proposition, key features, success indicators
- **retention-optimization-expert** → Early churn data, D1-D7 retention by cohort

### Partial Context (Some Present):
- **metrics-dashboard-designer** → Activation metrics available
- **customer-persona-builder** → User segmentation available
- **product-positioning-expert** → Value proposition available

### No Context:
- None of the above skills were run

---

## STEP 2: Context-Adaptive Introduction

### If Ideal Context:
> I found outputs from **metrics-dashboard-designer**, **customer-persona-builder**, **product-positioning-expert**, and **retention-optimization-expert**.
>
> I can reuse:
> - **Activation metrics** (current activation rate: [X%], time-to-activate: [Y hours])
> - **User segments** ([Segment A], [Segment B] with different onboarding needs)
> - **Value proposition** (core value: [X], key features: [Y, Z])
> - **Early retention data** (D1 retention: [X%], D7 retention: [Y%])
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
> I'll guide you through optimizing your onboarding flow from the ground up.

---

## STEP 3: Questions (One at a Time, Sequential)

### Activation Definition & Current Performance

**Question AD1: How do you define user activation?**

**Activation = "Aha Moment"** (the moment a user experiences the core value of your product)

**Examples**:
- **Slack**: "Send 2,000 team messages"
- **Dropbox**: "Upload and share first file"
- **Facebook**: "Add 7 friends in 10 days"
- **Canva**: "Create and download first design"
- **Notion**: "Create first page and add content"
- **Airbnb**: "Complete first booking"

**Your Activation Event**: [e.g., "Create first project with 3+ tasks and invite 1 team member"]

**Why this event?**: [What value does the user experience at this moment?]

**Alternative Metrics** (if no single activation event):
- ☐ **Feature Breadth**: Used X out of Y core features
- ☐ **Feature Depth**: Used core feature X times
- ☐ **Value Milestone**: Achieved measurable result (e.g., "Sent first invoice", "Published first blog post")

---

**Question AD2: What is your current activation performance?**

**Activation Metrics**:
- **Activation Rate**: [e.g., "42% of signups complete activation within 7 days"]
- **Time to Activate**: [e.g., "Median time: 12 hours from signup"]
- **Activation by Cohort**: [e.g., "January: 38%, February: 42%, March: 45%" — improving?]
- **Activation by Segment**:
  - [Segment A]: [X%]
  - [Segment B]: [X%]
  - [Segment C]: [X%]

**Activation Funnel** (signup → onboarding steps → activation):

| Step                          | Users | Conversion | Drop-off |
|-------------------------------|-------|------------|----------|
| 1. Signup completed           | 1,000 | 100%       | —        |
| 2. Email verified             | 850   | 85%        | 15%      |
| 3. Profile completed          | 680   | 68%        | 17%      |
| 4. First action taken         | 510   | 51%        | 17%      |
| 5. **Activated** (aha moment) | 420   | **42%**    | 9%       |

**Where is the biggest drop-off?**: [Which step?]

**Industry Benchmarks** (for context):
- **B2B SaaS**: Activation rate 30-50%
- **Consumer Apps**: Activation rate 20-40%
- **Productivity Tools**: Activation rate 40-60%

**Your Performance vs. Benchmark**:
- Current Activation Rate: [X%]
- Benchmark: [Y%]
- Gap: [Z percentage points]

**Target Activation Rate**: [e.g., "60% within 90 days"]

---

### Onboarding Friction Analysis

**Question FA1: Where do users get stuck during onboarding?**

**Drop-off Point Analysis** (from funnel above):

| Step                     | Drop-off | Why are users dropping off?                          | How to fix?                                  |
|--------------------------|----------|------------------------------------------------------|----------------------------------------------|
| Signup → Email Verified  | 15%      | [e.g., "Didn't receive email, went to spam"]         | [e.g., "Improve email deliverability"]       |
| Email → Profile Complete | 17%      | [e.g., "Too many fields, friction"]                  | [e.g., "Reduce required fields to 3"]        |
| Profile → First Action   | 17%      | [e.g., "Don't know what to do next"]                 | [e.g., "Add onboarding checklist"]           |
| First Action → Activated | 9%       | [e.g., "Core feature too complicated"]               | [e.g., "Add interactive product tour"]       |

**Top 3 Friction Points**:
1. [Friction Point 1] — [Impact: X% drop-off] — [Solution]
2. [Friction Point 2] — [Impact: X% drop-off] — [Solution]
3. [Friction Point 3] — [Impact: X% drop-off] — [Solution]

---

**Question FA2: How long does it take users to activate?**

**Time-to-Activate Distribution**:
- **<1 hour**: [X%] (fast activators — ideal)
- **1-24 hours**: [X%] (same-day activators)
- **1-7 days**: [X%] (slow activators)
- **7+ days**: [X%] (very slow, likely won't activate)

**Median Time-to-Activate**: [e.g., "12 hours"]
**Target Time-to-Activate**: [e.g., "<1 hour for 50% of users"]

**What delays activation?**:
- ☐ Waiting for team members to join
- ☐ Waiting for data import to complete
- ☐ Learning curve (too complicated, need tutorials)
- ☐ Missing information (need to gather data before using product)
- ☐ Technical issues (bugs, slow load times)
- ☐ Other: [specify]

**How to reduce time-to-activate**:
1. [Action 1] — e.g., "Allow users to skip team invites and activate solo first"
2. [Action 2] — e.g., "Provide sample data so users can explore without importing"
3. [Action 3] — e.g., "Add quick-start video (2 minutes) to speed learning"

---

### Onboarding Checklist Design

**Question OC1: What is your onboarding checklist?**

**Onboarding Checklist** = A clear, step-by-step guide to activation

**Best Practices**:
- **3-5 steps** (not 10+)
- **Specific, actionable** ("Create your first project", not "Explore features")
- **Trackable progress** (show "2 of 4 completed")
- **Celebration on completion** (confetti, badge, email)

**Your Onboarding Checklist**:

✅ **Step 1**: [e.g., "Complete your profile (name, company, role)"]
- Why it matters: [e.g., "Personalizes your experience"]
- Time to complete: [e.g., "30 seconds"]

✅ **Step 2**: [e.g., "Create your first project"]
- Why it matters: [e.g., "This is where you'll organize your work"]
- Time to complete: [e.g., "1 minute"]

✅ **Step 3**: [e.g., "Add 3 tasks to your project"]
- Why it matters: [e.g., "Experience how easy task management is"]
- Time to complete: [e.g., "2 minutes"]

✅ **Step 4**: [e.g., "Invite 1 team member" or "Connect your calendar"]
- Why it matters: [e.g., "Collaborate with your team" or "Sync your workflow"]
- Time to complete: [e.g., "1 minute"]

✅ **Step 5**: [e.g., "Mark your first task as complete"]
- Why it matters: [e.g., "Feel the satisfaction of progress"]
- Time to complete: [e.g., "10 seconds"]

**Total Time to Complete Checklist**: [e.g., "5 minutes"]
**Completion = Activation?**: [Yes/No — does completing checklist = activation event?]

---

**Question OC2: How do you incentivize checklist completion?**

**Incentive Strategies**:

1. **Progress Bar** (visual progress indicator)
   - "You're 60% done! Just 2 more steps"
   - Visual: ▓▓▓▓▓▓░░░░ (6/10 complete)

2. **Gamification** (points, badges, streaks)
   - "Complete onboarding to unlock power features"
   - "Earn your 'Getting Started' badge"

3. **Social Proof** (show what others did)
   - "95% of successful teams complete all 5 steps"
   - "Top users completed onboarding in under 5 minutes"

4. **Reward on Completion** (unlock feature, give credits, send swag)
   - "Complete onboarding to get 100 free credits"
   - "Finish setup and we'll mail you a T-shirt"

5. **Email Nudges** (reminder emails for incomplete steps)
   - Day 1: "You're 2 steps away from full setup"
   - Day 3: "Just 1 step left! Finish now"

**Your Incentive Strategy** (choose 2-3):
1. [Incentive 1] — e.g., "Progress bar with % complete"
2. [Incentive 2] — e.g., "Unlock power feature after completing checklist"
3. [Incentive 3] — e.g., "Email nudge on Day 1 and Day 3"

---

### Product Tour Design

**Question PT1: Do you need a product tour?**

**Product Tour** = Interactive walkthrough that guides users through key features

**When to use product tours**:
- ☐ Your product is complex (many features, steep learning curve)
- ☐ First-time users don't know where to start
- ☐ Activation requires using specific features in sequence
- ☐ You have multiple user personas with different use cases

**When NOT to use product tours**:
- ☐ Your product is self-explanatory (e.g., Google search)
- ☐ Users are experienced (e.g., developers, power users)
- ☐ Tour would interrupt critical workflows

**Do you need a product tour?**: [Yes/No]

**If Yes**: [Type of tour — full tour, feature-specific tour, or persona-based tour]

---

**Question PT2: What does your product tour cover?**

**Product Tour Structure** (3-7 steps):

**Step 1**: **Welcome & Goal**
- Message: [e.g., "Welcome to [Product]! Let's get you set up in 2 minutes"]
- Goal: [e.g., "By the end, you'll have created your first project"]

**Step 2**: **Core Feature 1**
- Highlight: [e.g., "Project Dashboard — this is your command center"]
- Action: [e.g., "Click 'New Project' to get started"]
- Tooltip: [e.g., "All your projects will appear here"]

**Step 3**: **Core Feature 2**
- Highlight: [e.g., "Task List — add tasks to your project"]
- Action: [e.g., "Click 'Add Task' and type your first task"]
- Tooltip: [e.g., "Tasks can be assigned, prioritized, and tracked"]

**Step 4**: **Core Feature 3**
- Highlight: [e.g., "Collaboration — invite your team"]
- Action: [e.g., "Click 'Invite' and add your teammates"]
- Tooltip: [e.g., "Everyone can see updates in real-time"]

**Step 5**: **Power Feature** (optional)
- Highlight: [e.g., "Automation — save time with smart rules"]
- Action: [e.g., "Try creating your first automation"]
- Tooltip: [e.g., "Auto-assign tasks, send reminders, and more"]

**Step 6**: **Completion & Next Steps**
- Message: [e.g., "You're all set! Now go create something amazing"]
- CTA: [e.g., "Explore on your own" or "Start your first project"]

**Tour Format**:
- ☐ **Tooltip Tour** (tooltips appear over UI elements, user clicks through)
- ☐ **Modal Tour** (modal dialogs guide user step-by-step)
- ☐ **Video Tour** (2-minute video walkthrough)
- ☐ **Interactive Demo** (sandbox environment to practice without consequences)

**Your Tour Format**: [Choose 1-2]

**Can users skip the tour?**: [Yes/No — forced tour or optional?]
- Best practice: Always allow skipping, but track skip rate (high skip rate = tour isn't valuable)

---

### Educational Content & Help Resources

**Question EC1: What educational content do you provide during onboarding?**

**Educational Content Types**:

1. **Tooltips** (contextual help, appears on hover or click)
   - Example: "💡 Tip: Assign tasks to team members to track accountability"
   - When to show: First time user sees a feature

2. **Empty States** (helpful messages when there's no data yet)
   - Example: "No projects yet. Let's create your first one!"
   - CTA: [e.g., "Create Project" button]

3. **Help Docs** (knowledge base, FAQs, tutorials)
   - Organized by: Getting Started, Core Features, Advanced Features, Troubleshooting
   - Format: Text + screenshots, or video tutorials

4. **Quick-Start Video** (2-3 minute overview)
   - Shows: Core workflow from start to finish
   - Hosted: Embedded in app (YouTube, Vimeo, Loom)

5. **Webinars / Live Onboarding Calls** (for high-touch customers)
   - Frequency: [e.g., "Weekly live onboarding session, or 1-on-1 call for enterprise"]
   - Who leads: CSM, Product Specialist, or Founder

6. **In-App Messages** (contextual nudges at key moments)
   - Example: "Try adding a due date to your task to set a deadline"
   - Trigger: User creates task without due date

**Your Educational Content** (choose 3-5):
1. [Content Type 1] — e.g., "Tooltips for all core features"
2. [Content Type 2] — e.g., "Quick-start video (2 minutes)"
3. [Content Type 3] — e.g., "Help docs with screenshots"
4. [Content Type 4] — e.g., "Empty states with CTAs"
5. [Content Type 5] — e.g., "In-app messages for key moments"

---

**Question EC2: How do you measure content effectiveness?**

**Content Performance Metrics**:

| Content Type              | Metric                                      | Current | Target |
|---------------------------|---------------------------------------------|---------|--------|
| Product Tour              | Completion rate (% who finish tour)         | X%      | >70%   |
| Tooltips                  | Click-through rate (% who click "Learn more")| X%      | >20%   |
| Quick-Start Video         | View rate (% of new users who watch)        | X%      | >40%   |
| Quick-Start Video         | Watch time (% of video watched)             | X%      | >60%   |
| Help Docs                 | Search rate (% of users who search docs)    | X%      | >10%   |
| Help Docs                 | Deflection rate (% who find answer)         | X%      | >70%   |
| Webinar                   | Attendance rate (% who sign up and attend)  | X%      | >50%   |

**Feedback Mechanisms**:
- ☐ "Was this helpful?" (thumbs up/down) on help docs
- ☐ "Did this answer your question?" after tooltip
- ☐ CSAT survey after webinar
- ☐ NPS survey after completing onboarding

---

### Personalized Onboarding Paths

**Question PP1: Do different user segments need different onboarding experiences?**

**Personalization Triggers**:
- ☐ **By User Role**: Marketer vs. Developer vs. Sales Rep
- ☐ **By Company Size**: Solo user vs. Small team vs. Enterprise
- ☐ **By Use Case**: Project Management vs. CRM vs. Content Planning
- ☐ **By Experience Level**: Beginner vs. Intermediate vs. Advanced
- ☐ **By Acquisition Source**: Organic vs. Paid vs. Referral

**Do you need personalized onboarding?**: [Yes/No]

**If Yes**: [How will you segment users? e.g., "Ask 'What's your role?' during signup"]

---

**Question PP2: What are your personalized onboarding paths?**

**Onboarding Path 1**: [Segment Name — e.g., "Marketing Manager"]
- **Goal**: [e.g., "Create first content calendar"]
- **Checklist**:
  1. [Step 1] — e.g., "Set up content pillars"
  2. [Step 2] — e.g., "Add 5 content ideas"
  3. [Step 3] — e.g., "Schedule first post"
- **Tour Focus**: [e.g., "Content planning features, editorial calendar"]
- **Resources**: [e.g., "Content Marketing 101 guide"]

**Onboarding Path 2**: [Segment Name — e.g., "Software Developer"]
- **Goal**: [e.g., "Integrate API and make first request"]
- **Checklist**:
  1. [Step 1] — e.g., "Generate API key"
  2. [Step 2] — e.g., "Run sample code"
  3. [Step 3] — e.g., "Make first API call"
- **Tour Focus**: [e.g., "API docs, developer console"]
- **Resources**: [e.g., "API reference docs, code samples"]

**Onboarding Path 3**: [Segment Name — e.g., "Sales Rep"]
- **Goal**: [e.g., "Add first contact and send outreach"]
- **Checklist**:
  1. [Step 1] — e.g., "Import contacts from CSV"
  2. [Step 2] — e.g., "Create email template"
  3. [Step 3] — e.g., "Send first outreach email"
- **Tour Focus**: [e.g., "Contact management, email sequences"]
- **Resources**: [e.g., "Sales email templates, best practices"]

**How to personalize**:
- ☐ Ask segmentation question during signup ("What's your role?")
- ☐ Auto-detect based on behavior (e.g., user clicks "Developer Docs" → developer path)
- ☐ Allow users to choose path ("I'm here to... [Manage Projects / Build Integrations / Track Sales]")

---

### Email Onboarding Sequence

**Question ES1: What is your email onboarding sequence?**

**Email Onboarding** = Series of emails to guide users through activation

**Email 1 (Day 0): Welcome + Quick Start**
- **Subject**: [e.g., "Welcome to [Product]! Let's get you started"]
- **Body**:
  - Welcome message
  - Quick-start video (2 minutes)
  - Primary CTA: "Complete your setup" (link to onboarding checklist)
  - Support: "Reply to this email if you need help"

**Email 2 (Day 1): Feature Highlight**
- **Subject**: [e.g., "How to [achieve goal] with [Product]"]
- **Body**:
  - Highlight core feature (e.g., "Task management made easy")
  - Tutorial: Step-by-step guide with screenshots
  - Social proof: "10,000+ teams use this feature daily"
  - CTA: "Try it now"

**Email 3 (Day 3): Success Story / Use Case**
- **Subject**: [e.g., "How [Customer Name] achieved [result] with [Product]"]
- **Body**:
  - Customer success story (2-3 paragraphs)
  - Key takeaway: "You can achieve [result] too"
  - CTA: "Get started"

**Email 4 (Day 5): Re-Engagement / Reminder**
- **Subject**: [e.g., "You're almost there! Just 2 steps left"]
- **Body**:
  - Progress update: "You've completed 3 of 5 steps"
  - Reminder of incomplete steps
  - Incentive: "Finish setup to unlock [reward]"
  - CTA: "Complete setup"

**Email 5 (Day 7): Support Offer**
- **Subject**: [e.g., "Need help getting started?"]
- **Body**:
  - Offer help: "Our team is here to help you succeed"
  - Resources: Link to help docs, video tutorials, live chat
  - Optional: Book a 15-minute onboarding call
  - CTA: "Get help"

**Email Cadence**: [Day 0, Day 1, Day 3, Day 5, Day 7]
**Trigger**: [All users, or only users who haven't activated?]

---

### A/B Testing Onboarding Variations

**Question AB1: What will you A/B test in your onboarding?**

**A/B Test Ideas**:

1. **Checklist Length**
   - **Variant A**: 3 steps (faster, but less guidance)
   - **Variant B**: 5 steps (more guidance, but longer)
   - **Metric**: Activation rate

2. **Product Tour**
   - **Variant A**: Forced tour (all users must complete)
   - **Variant B**: Optional tour (users can skip)
   - **Metric**: Activation rate, time-to-activate

3. **Empty State CTAs**
   - **Variant A**: "Create Project" button only
   - **Variant B**: "Create Project" + "Watch Tutorial" (two options)
   - **Metric**: CTA click-through rate, activation rate

4. **Incentive**
   - **Variant A**: No incentive
   - **Variant B**: "Complete setup to get 100 free credits"
   - **Metric**: Checklist completion rate, activation rate

5. **Email Timing**
   - **Variant A**: Email sequence (Day 0, 1, 3, 5, 7)
   - **Variant B**: Email sequence (Day 0, 2, 7)
   - **Metric**: Email open rate, activation rate

**Your A/B Test Plan** (choose 2-3 tests):
1. **Test 1**: [What are you testing?] — Variant A vs. B — Metric: [X]
2. **Test 2**: [What are you testing?] — Variant A vs. B — Metric: [X]
3. **Test 3**: [What are you testing?] — Variant A vs. B — Metric: [X]

**Testing Cadence**: [How often will you run tests? e.g., "One test every 2 weeks"]

---

### Implementation Roadmap

**Question IR1: What is your 90-day onboarding optimization plan?**

### Phase 1: Foundation (Weeks 1-3)
**Goal**: Implement core onboarding elements

- **Week 1: Activation Definition**
  - Define activation event (aha moment)
  - Set up activation tracking (Mixpanel, Amplitude, or custom event)
  - Pull baseline activation metrics (current rate, time-to-activate, funnel)

- **Week 2: Onboarding Checklist**
  - Design 3-5 step checklist
  - Build checklist UI (progress bar, checkmarks)
  - Deploy checklist to 100% of new users

- **Week 3: Email Onboarding**
  - Write 5-email onboarding sequence
  - Set up automated triggers (email service provider)
  - Launch email sequence for new signups

**Deliverable**: Onboarding checklist and email sequence live, activation tracking implemented

---

### Phase 2: Educational Content (Weeks 4-6)
**Goal**: Add product tours, tooltips, and help resources

- **Week 4: Product Tour**
  - Script 5-step product tour
  - Build tour using tool (Appcues, Pendo, Intercom, or custom)
  - Launch tour to 50% of new users (A/B test)

- **Week 5: Tooltips & Empty States**
  - Identify top 10 features needing tooltips
  - Write tooltip copy
  - Design empty states with CTAs (e.g., "No projects yet. Let's create your first one!")

- **Week 6: Help Resources**
  - Create quick-start video (2-3 minutes)
  - Write 10-15 help docs (Getting Started section)
  - Add in-app help widget (link to docs, video, live chat)

**Deliverable**: Product tour live, tooltips added, quick-start video published

---

### Phase 3: Personalization & Optimization (Weeks 7-12)
**Goal**: Personalize onboarding paths and run A/B tests

- **Week 7-8: Personalized Onboarding Paths**
  - Add segmentation question during signup ("What's your role?")
  - Build 2-3 persona-specific onboarding paths
  - Deploy personalized checklists and tours

- **Week 9-10: A/B Testing**
  - Run A/B test #1 (e.g., 3-step checklist vs. 5-step checklist)
  - Analyze results after 2 weeks (1,000+ users per variant)
  - Implement winning variant

- **Week 11-12: Continuous Optimization**
  - Analyze friction points (where users drop off)
  - Iterate on checklist, tour, emails based on data
  - Run A/B test #2 (e.g., forced tour vs. optional tour)

**Deliverable**: Personalized onboarding live, 2 A/B tests completed, activation rate improved by [X%]

---

## STEP 4: Generate Comprehensive Onboarding Optimization Strategy

**You will now receive a comprehensive document covering**:

### Section 1: Executive Summary
- Activation definition (aha moment: [X])
- Current activation rate and target (X% → Y%)
- Time-to-activate (current: [X], target: [Y])
- Top 3 friction points and solutions

### Section 2: Activation Funnel Analysis
- Activation funnel (signup → email → profile → first action → activated)
- Drop-off analysis (where users get stuck, why, how to fix)
- Activation by segment (persona, acquisition source, cohort)
- Industry benchmarks and performance gap

### Section 3: Onboarding Checklist Design
- 3-5 step checklist with time estimates
- Progress indicators and completion incentives
- Gamification and social proof strategies
- Email nudges for incomplete steps

### Section 4: Product Tour Design
- 5-step product tour (welcome, core features, completion)
- Tour format (tooltip, modal, video, interactive demo)
- Skip option and tracking (completion rate, skip rate)

### Section 5: Educational Content Strategy
- Tooltips for core features
- Empty states with CTAs
- Quick-start video (2-3 minutes)
- Help docs (Getting Started, FAQs, Troubleshooting)
- In-app messages for key moments
- Webinars / live onboarding (for high-touch customers)

### Section 6: Personalized Onboarding Paths
- Segmentation strategy (role, company size, use case, experience level)
- 2-3 persona-specific onboarding paths
- Personalized checklists, tours, and resources

### Section 7: Email Onboarding Sequence
- 5-email sequence (Day 0, 1, 3, 5, 7)
- Email content (subject, body, CTA)
- Triggers and segmentation (all users vs. non-activated users)

### Section 8: A/B Testing Plan
- 3 A/B tests (checklist length, product tour, incentives)
- Success metrics (activation rate, time-to-activate, completion rate)
- Testing cadence (one test every 2 weeks)

### Section 9: Implementation Roadmap
- **Phase 1 (Weeks 1-3)**: Activation definition, onboarding checklist, email sequence
- **Phase 2 (Weeks 4-6)**: Product tour, tooltips, help resources
- **Phase 3 (Weeks 7-12)**: Personalization, A/B testing, continuous optimization

### Section 10: Success Metrics
- Activation Rate: [Baseline → Target — e.g., 42% → 60%]
- Time-to-Activate: [Baseline → Target — e.g., 12 hours → <1 hour]
- Checklist Completion Rate: [Target: >80%]
- Product Tour Completion Rate: [Target: >70%]
- D1 Retention: [Baseline → Target — e.g., 55% → 70%]
- D7 Retention: [Baseline → Target — e.g., 40% → 55%]

### Section 11: Next Steps
- Launch onboarding checklist this week
- Schedule weekly onboarding optimization meetings
- Integrate with **retention-optimization-expert** (early retention data feeds churn analysis)
- Integrate with **customer-feedback-framework** (gather onboarding feedback via surveys)

---

## STEP 5: Quality Review & Iteration

After generating the strategy, I will ask:

**Quality Check**:
1. Is the activation definition clear and measurable?
2. Does the onboarding checklist reduce time-to-value?
3. Are drop-off points addressed with specific solutions?
4. Is the product tour helpful without being intrusive?
5. Are personalized onboarding paths feasible to build?
6. Are A/B tests designed to optimize activation rate?

**Iterate?** [Yes — refine X / No — finalize]

---

## STEP 6: Save & Next Steps

Once finalized, I will:
1. **Save** the onboarding optimization strategy to your project folder
2. **Suggest** running **customer-feedback-framework** next (to gather feedback on onboarding)
3. **Remind** you to launch the onboarding checklist this week

---

## 8 Critical Guidelines for This Skill

1. **Activation = Aha Moment**: Define activation as the moment users experience core value, not arbitrary milestones (e.g., "Send 2,000 messages" > "Complete profile").

2. **Reduce time-to-value**: The faster users reach the aha moment, the better. Target <1 hour for 50% of users.

3. **3-5 step checklist, not 10+**: Long checklists overwhelm users. Keep it short and actionable.

4. **Product tours should be optional**: Forced tours frustrate experienced users. Always allow skipping, but track skip rate.

5. **Empty states are opportunities**: Turn blank screens into onboarding moments (e.g., "No projects yet. Let's create your first one!").

6. **Personalize for different segments**: Marketers and developers need different onboarding experiences. Segment by role, use case, or experience level.

7. **Measure everything**: Track activation rate, time-to-activate, checklist completion rate, tour completion rate, drop-off points.

8. **A/B test continuously**: Run one test every 2 weeks to optimize activation rate. Small improvements compound.

---

## Quality Checklist (Before Finalizing)

- [ ] Activation definition is clear, measurable, and tied to core value
- [ ] Current activation rate and target are defined (e.g., 42% → 60%)
- [ ] Activation funnel shows drop-off points with solutions
- [ ] Onboarding checklist is 3-5 steps with time estimates
- [ ] Product tour is designed (5 steps, optional, tracked)
- [ ] Educational content includes tooltips, empty states, quick-start video, help docs
- [ ] Personalized onboarding paths are defined for 2-3 segments
- [ ] Email onboarding sequence is 5 emails (Day 0, 1, 3, 5, 7)
- [ ] A/B testing plan includes 3 tests with success metrics
- [ ] Implementation roadmap is realistic (Weeks 1-3: Foundation, Weeks 4-6: Content, Weeks 7-12: Optimization)

---

## Integration with Other Skills

**Upstream Skills** (reuse data from):
- **metrics-dashboard-designer** → Activation metrics, D1/D7 retention, time-to-activate, activation funnel
- **customer-persona-builder** → User segments, goals, pain points, skill levels (for personalized onboarding)
- **product-positioning-expert** → Value proposition, key features, success indicators (for aha moment definition)
- **retention-optimization-expert** → Early churn data, D1-D7 retention by cohort (to prioritize onboarding improvements)

**Downstream Skills** (use this data in):
- **retention-optimization-expert** → Improved activation rates lead to better D1-D7 retention
- **customer-feedback-framework** → Gather onboarding feedback via surveys (e.g., "How was your onboarding experience?")
- **metrics-dashboard-designer** → Track activation metrics on product dashboard
- **email-marketing-architect** → Email onboarding sequence integrates with lifecycle email campaigns

---

## HTML Output Verification

After generating the HTML report, verify all elements render correctly:

### Visual Verification Checklist
- [ ] Header displays business name and date correctly
- [ ] Score banner shows activation rate, target, time-to-activate, checklist steps, D7 retention
- [ ] Aha moment verdict box displays correctly
- [ ] Activation event container has proper border and centered text
- [ ] Funnel steps show progress bars with correct widths and drop-off percentages
- [ ] Checklist steps are numbered with circular badges
- [ ] Product tour grid shows 5-7 step cards
- [ ] Educational content cards display icons and descriptions
- [ ] Personalized paths show segment names with numbered step lists
- [ ] Email timeline has connected dots and day labels
- [ ] A/B test cards show variant comparisons
- [ ] All 4 charts render with correct data:
  - Funnel chart (horizontal bar)
  - Time distribution chart (doughnut)
  - Retention curve (line with fill)
  - Cohort activation chart (vertical bar)
- [ ] Roadmap phases display 3 cards with tasks
- [ ] Footer shows StratArts branding

### Data Quality Verification
- [ ] Activation rate is realistic (typically 30-60% for B2B SaaS)
- [ ] Funnel shows progressive drop-off (each step lower than previous)
- [ ] Time-to-activate aligns with product complexity
- [ ] Retention curve shows expected decay pattern
- [ ] Cohort data shows trend over 3-4 months
- [ ] Checklist steps are achievable in 5-10 minutes total
- [ ] Email sequence follows Day 0, 1, 3, 5, 7 pattern
- [ ] A/B tests have measurable success metrics

### Template Location
- Skeleton template: `html-templates/onboarding-flow-optimizer.html`
- Test output: `skills/retention-metrics/onboarding-flow-optimizer/test-template-output.html`

---

**End of Skill**
