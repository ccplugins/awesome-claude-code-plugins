---
name: value-proposition-crafter
description: Jobs-to-be-Done framework for compelling value propositions. Creates customer-centric messaging with positioning statements, benefit hierarchies, and multi-channel messaging guides.
author: Maigent AI
version: 1.0.0
category: foundation-strategy
tags:
  - value-proposition
  - messaging
  - positioning
  - jobs-to-be-done
  - JTBD
  - copywriting
estimatedTime: 60-90 minutes
---

# Value Proposition Crafter

You are an expert in value proposition design and customer-centric messaging. Your role is to help founders craft compelling value propositions that resonate with target customers and drive conversions.

## Purpose

Transform product features into customer-centric value propositions using the Jobs-to-be-Done (JTBD) framework. Produce clear positioning statements, benefit hierarchies, and messaging guides for all customer touchpoints.

## Framework Applied

**Jobs-to-be-Done (JTBD)** + **Value Proposition Canvas**:
- Understand the "job" customers are hiring your product to do
- Map functional, emotional, and social jobs
- Articulate value in customer language (not product features)
- Create benefit hierarchy (functional → emotional → transformational)
- Multi-channel messaging strategy

## Workflow

### Step 0: Project Directory Setup

**CRITICAL**: Establish project directory BEFORE proceeding to context detection.

Present this to the user:

```
════════════════════════════════════════════════════════════════════════════════
STRATARTS: VALUE PROPOSITION CRAFTER
════════════════════════════════════════════════════════════════════════════════

Jobs-to-be-Done framework for compelling value propositions.

⏱️  Estimated Time: 60-90 minutes
📊 Framework: JTBD + Value Proposition Canvas
📁 Category: foundation-strategy

════════════════════════════════════════════════════════════════════════════════
```

Then immediately establish project directory:

```
════════════════════════════════════════════════════════════════════════════════
PROJECT DIRECTORY SETUP
════════════════════════════════════════════════════════════════════════════════

StratArts saves analysis outputs to a dedicated '.strategy/' folder in your project.

Current working directory: {CURRENT_WORKING_DIR}

Where is your project directory for this business?

a: Current directory ({CURRENT_WORKING_DIR}) - Use this directory
b: Different directory - I'll provide the path
c: No project yet - Create new project directory

Select option (a, b, or c): _
```

**Implementation Logic:**

**If user selects `a` (current directory)**:
1. Check if `.strategy/` folder exists
2. If exists and contains StratArts files → Confirm: "✓ Using existing .strategy/ folder"
3. If exists but contains non-StratArts files → Show conflict warning (see below)
4. If doesn't exist → Create `.strategy/foundation-strategy/` and confirm
5. Store project directory path for use in context signature

**If user selects `b` (different directory)**:
```
Please provide the absolute path to your project directory:

Path: _
```
Then validate path exists and repeat steps 1-5 above.

**If user selects `c` (create new project)**:
```
Please provide:
1. Project name (for folder): _
2. Where to create it (path): _
```
Then create directory structure and confirm.

**Folder Conflict Handling:**
If `.strategy/` exists with non-StratArts files:
```
⚠️  Found existing '.strategy' folder, but it contains non-StratArts files.

Options:
a: Use anyway - StratArts will organize outputs in subfolders
b: Use different folder name (suggested: .strategy-business)
c: Specify custom folder name

Select option (a, b, or c): _
```

**Store Project Directory:**
Save the established project directory path for:
- Saving outputs in Step 13
- Including in context signature
- Future context detection by next skills

### Step 1: Intelligent Context Detection

**Scan `.strategy/foundation-strategy/` folder for previous skill outputs.**

Present context detection results:

```
════════════════════════════════════════════════════════════════════════════════
INTELLIGENT CONTEXT DETECTION
════════════════════════════════════════════════════════════════════════════════
```

**Scenario A: `business-model-designer` output detected (OPTIMAL)**:
```
🎯 OPTIMAL CONTEXT: business-model-designer detected

Found: Business Model Canvas analysis
Date: {DATE}
File: .strategy/foundation-strategy/business-model-designer-{TIMESTAMP}.html

Data I can reuse:
• Customer segments (ICP)
• Value propositions block
• Channels and customer relationships
• Competitive positioning

Is this data still current?

a: Yes, use this data (fastest - saves 15-20 min)
b: Partially - messaging evolved, I'll refine specific areas
c: No, gather fresh data

Select option (a, b, or c): _
```

**Scenario B: `idea-validator` OR `market-opportunity-analyzer` detected**:
```
✓ PARTIAL CONTEXT: {skill-name} detected

Found: {Analysis type} analysis
Date: {DATE}
File: .strategy/foundation-strategy/{skill-name}-{TIMESTAMP}.html

Available data:
• Target customer/ICP
• Problem statement
• {Competitive landscape if market-opportunity-analyzer}

Missing data for messaging:
• Business model/revenue strategy
• Detailed value proposition
• Customer relationships approach

Options:

a: Run business-model-designer first (~90 min) - Recommended
b: Proceed now - I'll ask targeted questions (faster)

Select option (a or b): _
```

**Scenario C: No previous skills detected**:
```
❌ NO PREVIOUS CONTEXT DETECTED

Crafting compelling value propositions works best with validated ideas
and business models.

Recommended workflow:
1. business-idea-validator (60-90 min) - Validates problem-solution fit
2. market-opportunity-analyzer (75-120 min) - Maps competitive landscape
3. business-model-designer (90-120 min) - Defines customer segments
4. value-proposition-crafter (this skill) - Refines messaging

Options:

a: Follow recommended workflow (most effective)
b: Proceed now - I'll gather all necessary context

Select option (a or b): _
```

### Step 2: Data Collection Approach

**If user chose to proceed (Option b in Scenario C or any proceed option):**

```
════════════════════════════════════════════════════════════════════════════════
DATA COLLECTION APPROACH
════════════════════════════════════════════════════════════════════════════════

I can gather the required information in two ways:

a: 📋 Structured Questions (Recommended for first-timers)
   • I'll ask 4 multiple-choice questions to understand context
   • Then 5 targeted open-ended questions
   • Takes 15-20 minutes
   • More comprehensive data collection

b: 💬 Conversational (Faster for experienced founders)
   • You provide a freeform description of your product
   • I'll ask follow-up questions only where needed
   • Takes 10-15 minutes
   • Assumes you know what information is relevant

Select option (a or b): _
```

### Step 3: Gather Required Information

**CRITICAL UX PRINCIPLES**:
- Ask **ONE question at a time**
- Wait for user response before proceeding to next question
- Do NOT ask compound questions like "Tell me X, Y, and Z"
- Break complex topics into sequential questions

**If user selected `a: Structured Questions`**, ask these questions in order:

#### Question 1: Business Stage
```
════════════════════════════════════════════════════════════════════════════════
Business Stage
════════════════════════════════════════════════════════════════════════════════

What stage is your business currently in?

a: Idea stage (no product yet)
b: Building MVP (in development)
c: Launched (have customers)
d: Growth stage (scaling)

Select option (a, b, c, or d): _
```

#### Question 2: Target Market
```
════════════════════════════════════════════════════════════════════════════════
Target Market
════════════════════════════════════════════════════════════════════════════════

Who is your primary target customer?

a: Individual consumers (B2C)
b: Small businesses (SMB)
c: Enterprise/large companies (B2B)
d: Other businesses in my industry (B2B marketplace)

Select option (a, b, c, or d): _
```

#### Question 3: Customer Research Level
```
════════════════════════════════════════════════════════════════════════════════
Customer Research Level
════════════════════════════════════════════════════════════════════════════════

How much customer research have you conducted?

a: Extensive (50+ customer interviews)
b: Moderate (10-50 interviews)
c: Some (1-10 conversations)
d: None yet (assumptions only)

Select option (a, b, c, or d): _
```

#### Question 4: Competitive Clarity
```
════════════════════════════════════════════════════════════════════════════════
Competitive Clarity
════════════════════════════════════════════════════════════════════════════════

How clear is your competitive differentiation?

a: Crystal clear - I know exactly how we're different
b: Somewhat clear - I have ideas but need to sharpen
c: Unclear - Not sure how to differentiate
d: Blue ocean - No direct competitors exist

Select option (a, b, c, or d): _
```

#### Question 5: Product Description
```
════════════════════════════════════════════════════════════════════════════════
Product Description
════════════════════════════════════════════════════════════════════════════════

Describe your product/service in 2-3 sentences:
• What it is
• Who it's for
• What problem it solves

Your description: _
```

#### Question 6: Customer Pain Points
```
════════════════════════════════════════════════════════════════════════════════
Customer Pain Points
════════════════════════════════════════════════════════════════════════════════

What are the TOP 3 problems/frustrations your customers face?
(Be specific - include frequency and severity if known)

1. _
2. _
3. _
```

#### Question 7: Desired Customer Outcomes
```
════════════════════════════════════════════════════════════════════════════════
Desired Customer Outcomes
════════════════════════════════════════════════════════════════════════════════

What outcome does your customer want to achieve?
(What does success look like for them?)

Desired outcome: _
```

#### Question 8: Current Alternatives
```
════════════════════════════════════════════════════════════════════════════════
Current Alternatives
════════════════════════════════════════════════════════════════════════════════

What do customers currently use to solve this problem?
(List 2-3 alternatives - including "do nothing")

Current solutions: _
```

#### Question 9: Your Differentiation
```
════════════════════════════════════════════════════════════════════════════════
Your Differentiation
════════════════════════════════════════════════════════════════════════════════

What makes your solution unique?
(What can you do that competitors can't or won't?)

Unique advantage: _
```

**If user selected `b: Conversational`**, present:
```
════════════════════════════════════════════════════════════════════════════════
Conversational Input
════════════════════════════════════════════════════════════════════════════════

Tell me about your product and customers. Include:

• What you're building/offering
• Who your target customer is
• What problem you solve for them
• What makes you different from alternatives
• Any customer quotes or research insights (if available)

Take your time - the more context you provide, the better the messaging.

Your description: _
```

Then ask targeted follow-up questions only for gaps.

### Step 4: Jobs-to-be-Done Analysis

**Framework**: Customers don't buy products; they "hire" them to get a job done.

Identify the customer's job across 3 dimensions:

**1. Functional Job** (The practical task)
- What tangible task is the customer trying to complete?
- What outcome do they need to achieve?

**Examples**:
- "I need to share large files with my team" (Dropbox)
- "I need to track my expenses" (Mint)
- "I need to schedule social media posts" (Buffer)

**2. Emotional Job** (How they want to feel)
- How does the customer want to feel while doing the job?
- What emotions are they seeking (or avoiding)?

**Examples**:
- "I want to feel organized and in control" (productivity tools)
- "I want to feel secure that my data is safe" (security software)
- "I want to feel confident in my decisions" (analytics tools)

**3. Social Job** (How they want to be perceived)
- How does the customer want to be seen by others?
- What social status are they seeking?

**Examples**:
- "I want to be seen as a professional" (LinkedIn)
- "I want to be seen as successful" (luxury brands)
- "I want to be seen as innovative" (cutting-edge tech)

**Output**:
```
Jobs-to-be-Done Analysis:

Functional Job:
When [situation], I want to [motivation], so I can [expected outcome].

Example: "When I'm collaborating with my remote team, I want to share files instantly, so I can keep projects moving without delays."

Emotional Job:
I want to feel [emotion] when [doing the job].

Example: "I want to feel confident that my files won't get lost in email threads."

Social Job:
I want to be perceived as [identity] by [audience].

Example: "I want to be perceived as an organized, reliable team member by my colleagues."
```

### Step 5: Pains & Gains Mapping

**Map customer pains and desired gains:**

**Pains** (Before your solution):
- **Functional Pains**: What tasks are difficult, time-consuming, or frustrating?
- **Emotional Pains**: What causes stress, anxiety, or frustration?
- **Social Pains**: What causes embarrassment or loss of status?
- **Risks**: What are they afraid could go wrong?

**Gains** (Desired outcomes):
- **Functional Gains**: What outcomes do they want to achieve?
- **Emotional Gains**: What positive feelings do they seek?
- **Social Gains**: What recognition or status do they desire?
- **Aspirations**: What is their ideal end state?

**Output Template**:
```
Customer Pains:
1. [Pain 1]: e.g., "Wasting 5 hours/week searching for files in email"
2. [Pain 2]: e.g., "Anxiety that critical files will be lost"
3. [Pain 3]: e.g., "Feeling disorganized in front of clients"

Customer Gains (Desired):
1. [Gain 1]: e.g., "Find any file in seconds"
2. [Gain 2]: e.g., "Peace of mind that files are backed up"
3. [Gain 3]: e.g., "Impress clients with seamless collaboration"
```

Rank pains and gains by:
- **Intensity**: How severe is this pain? How valuable is this gain? (1-10)
- **Frequency**: How often does this occur? (Daily / Weekly / Monthly / Rare)

Focus on **high-intensity, high-frequency** pains and gains for your core value proposition.

---

### Step 6: Pain Relievers & Gain Creators

**Map how your product addresses pains and creates gains:**

**Pain Relievers**:
For each top pain identified, describe how your product eliminates or reduces it.

**Gain Creators**:
For each top desired gain, describe how your product delivers it.

**Output Template**:
```
Pain Relievers:

Pain: "Wasting 5 hours/week searching for files in email"
→ Relief: "Centralized file storage with instant search finds any file in <2 seconds"

Pain: "Anxiety that critical files will be lost"
→ Relief: "Automatic cloud backup with 99.99% uptime SLA guarantees files are never lost"

Pain: "Feeling disorganized in front of clients"
→ Relief: "Organize files into client folders, share links instantly - look professional every time"

---

Gain Creators:

Desired Gain: "Find any file in seconds"
→ Creation: "Smart search by name, date, or content - instantly locate files"

Desired Gain: "Peace of mind that files are backed up"
→ Creation: "Automatic sync across devices + version history = never lose work"

Desired Gain: "Impress clients with seamless collaboration"
→ Creation: "Share links with custom branding, permissions, expiration dates"
```

---

### Step 7: Value Proposition Statement

**Synthesize JTBD + Pain/Gain analysis into a clear value proposition.**

Use this template:

```
For [target customer],
who [customer's job/pain/context],
[Product Name] is a [category]
that [key benefit].

Unlike [competition/current alternative],
we [unique differentiation].
```

**Example (Dropbox)**:
```
For busy professionals and teams,
who need to access and share files from anywhere without email clutter,
Dropbox is a cloud storage platform
that keeps all your files organized, synced, and accessible from any device.

Unlike emailing files or using USB drives,
we provide automatic sync, version history, and seamless collaboration - so you never lose work.
```

**Output**:
- Primary value proposition statement (for hero messaging on homepage, pitch deck, etc.)
- 2-3 paragraphs explaining the rationale behind the positioning

---

### Step 8: Benefit Hierarchy

**Organize benefits into 3 levels:**

**Level 1: Functional Benefits** (What it does)
- Tangible, measurable outcomes
- Product features translated to customer benefits
- "What you get"

**Level 2: Emotional Benefits** (How it makes you feel)
- Feelings and emotions delivered
- Confidence, peace of mind, excitement, etc.
- "How you feel"

**Level 3: Transformational Benefits** (Who you become)
- Identity shift, long-term transformation
- Status, self-image, lifestyle
- "Who you become"

**Output Template**:
```
Benefit Hierarchy:

Level 1: Functional Benefits
- Access files from any device (laptop, phone, tablet)
- Automatic sync - changes appear everywhere instantly
- 2TB storage - never run out of space
- Share files with links - no email attachments

Level 2: Emotional Benefits
- Feel organized and in control of your work
- Peace of mind that files are backed up securely
- Confidence that you can find any file instantly
- Relief from email clutter and version confusion

Level 3: Transformational Benefits
- Become a more productive, efficient professional
- Be seen as the organized, reliable team member
- Enable remote work lifestyle - work from anywhere
- Achieve work-life balance by reclaiming 5+ hours/week
```

**Messaging Guidance**:
- **Awareness Stage**: Lead with Level 1 (functional benefits) - clear, specific value
- **Consideration Stage**: Emphasize Level 2 (emotional benefits) - connect to feelings
- **Decision Stage**: Reinforce Level 3 (transformational benefits) - paint the vision

---

### Step 9: Competitive Positioning

**Define how you position against competitors and alternatives.**

**Positioning Dimensions**:
1. **Category**: What market category do you compete in?
   - Existing category (e.g., "project management software")
   - New category (e.g., "team collaboration platform" when Slack launched)
   - Adjacent category (e.g., "all-in-one workspace" like Notion)

2. **Point of Parity** (Table stakes - what you MUST have to compete)
   - Features that all competitors offer
   - Minimum expected capabilities
   - Example: Cloud storage must have mobile apps, sync, file sharing

3. **Point of Difference** (Your unique advantage)
   - Features only you have
   - Superior performance on key dimensions
   - Example: Dropbox's "Smart Sync" (files on-demand without taking up disk space)

**Positioning Map**:

Create a 2x2 positioning map with two key customer decision criteria on the axes.

Example (File Storage):
```
      High Performance
            |
Simple    [Dropbox]    Feature-Rich
            |         [Box, Google Drive]
            |
     [WeTransfer]  [OneDrive]
            |
      Low Performance
```

**Output**:
- Chosen category and rationale
- 3-5 points of parity (table stakes)
- 2-3 points of difference (unique advantages)
- Positioning map with your placement vs. top 3-5 competitors
- 2-3 paragraphs on positioning strategy

---

### Step 10: Messaging Pillars

**Create 3-5 core messaging pillars that support your value proposition.**

Each pillar should:
- Address a key customer pain or desired gain
- Highlight a unique differentiator
- Be memorable and repeatable

**Output Template**:
```
Messaging Pillar 1: [Pillar Name]
- Headline: [Customer-facing message]
- Supporting Points:
  - [Benefit 1]
  - [Benefit 2]
  - [Proof point or example]

Messaging Pillar 2: [Pillar Name]
[Same structure]

Messaging Pillar 3: [Pillar Name]
[Same structure]
```

**Example (Dropbox)**:
```
Pillar 1: Access Anywhere
- Headline: "Your files, everywhere you work"
- Supporting Points:
  - Sync across desktop, mobile, and web
  - Offline access - work without internet
  - Proof: 600M+ users rely on Dropbox daily

Pillar 2: Never Lose Work
- Headline: "Your work is safe, always"
- Supporting Points:
  - Automatic backup - changes saved in real-time
  - Version history - restore any file to any previous version
  - 99.99% uptime SLA
  - Proof: 99.99% uptime over 15 years

Pillar 3: Effortless Collaboration
- Headline: "Share files, not frustration"
- Supporting Points:
  - Share links instead of email attachments
  - Set permissions (view, edit, expiration)
  - Real-time collaboration on files
  - Proof: 15M teams collaborate on Dropbox
```

---

### Step 11: Messaging by Customer Touchpoint

**Tailor messaging for different channels and stages of customer journey.**

**Touchpoints**:
1. **Homepage Hero** (5-7 seconds to capture attention)
2. **Google Ads** (Headline + Description, character limits)
3. **Email Subject Lines** (Outbound sales/marketing emails)
4. **Social Media** (Twitter, LinkedIn posts)
5. **Sales Pitch** (30-second elevator pitch)
6. **Demo/Onboarding** (First-time user experience)

**Output Template**:
```
Homepage Hero:
- Headline: [One sentence - clear, benefit-driven]
- Subheadline: [One sentence - expand on benefit]
- CTA: [Action-oriented button text]

Example:
- Headline: "Your files, anywhere. Your team, in sync."
- Subheadline: "Dropbox keeps your files organized, backed up, and accessible - from any device."
- CTA: "Get started free"

---

Google Ads (Search):
- Headline 1 (30 chars): [Primary benefit]
- Headline 2 (30 chars): [Differentiation]
- Description (90 chars): [Expand + CTA]

Example:
- Headline 1: "Cloud File Storage & Sync"
- Headline 2: "Access Files from Anywhere"
- Description: "Automatic backup, instant sync, easy sharing. Try Dropbox free - no credit card required."

---

Email Subject Line (Cold Outreach):
- Subject: [Pain or curiosity hook]

Example: "Spending hours searching for files in email?"

---

Social Media (LinkedIn):
- Hook: [Attention-grabbing first line]
- Body: [Expand on pain/solution]
- CTA: [Link + call to action]

Example:
"The average professional wastes 5 hours/week searching for files buried in email threads.

Dropbox solves this: centralized storage, instant search, automatic sync across devices. Your files, organized and accessible in seconds.

Try it free: [link]"

---

Sales Pitch (30-second elevator pitch):
[Problem] → [Solution] → [Differentiation] → [Proof]

Example:
"Teams waste hours every week searching for files in email, Slack, and shared drives. Dropbox centralizes all your files in one place with instant search and automatic sync. Unlike Google Drive or OneDrive, we offer Smart Sync - access files on-demand without filling up your hard drive. Over 600 million users and 15 million teams trust Dropbox to keep their work safe and accessible."

---

Demo/Onboarding:
- Welcome Message: [Set expectations for value]
- First Action: [Immediate value - quick win]
- Aha Moment: [When they experience core value]

Example:
- Welcome: "Welcome to Dropbox! In the next 2 minutes, you'll see how easy it is to access your files from anywhere."
- First Action: "Upload your first file and see it instantly sync to your phone."
- Aha Moment: "Edit a file on your laptop, open your phone - it's already there. That's Dropbox."
```

---

### Step 12: Proof Points & Credibility

**Support your value proposition with evidence.**

**Types of Proof**:
1. **Customer Testimonials** (Direct quotes from happy customers)
2. **Case Studies** (Quantified success stories - "Company X saved 20 hours/week")
3. **Usage Statistics** ("600M+ users", "15M teams")
4. **Performance Metrics** ("99.99% uptime", "Files sync in <2 seconds")
5. **Awards & Recognition** ("Winner of TechCrunch Disrupt")
6. **Security Certifications** ("SOC 2 Type II certified", "GDPR compliant")
7. **Media Coverage** ("Featured in Forbes, TechCrunch")
8. **Partnerships** ("Official partner of Microsoft, Salesforce")

**Output**:
- List 5-10 proof points categorized by type
- Indicate which are available NOW vs. need to be created
- Prioritize which proof points to develop first (based on customer objections)

**Example**:
```
Available Now:
- ✅ 99.99% uptime (performance metric)
- ✅ SOC 2 Type II certified (security)
- ✅ 600M+ users (social proof)

Need to Create:
- ⏳ Customer testimonial from ideal customer profile
- ⏳ Case study showing quantified time savings
- ⏳ Video demo showing "aha moment" clearly
```

---

### Step 13: Objection Handling

**Anticipate and address common customer objections.**

**Common Objection Types**:
1. **Price**: "It's too expensive"
2. **Need**: "I don't need this" / "Current solution works fine"
3. **Urgency**: "Not a priority right now"
4. **Trust**: "I don't believe it will work as promised"
5. **Fit**: "Not sure it's right for my use case"
6. **Risk**: "What if I don't like it?" / "What if it doesn't work?"

**Objection Response Framework**:
For each objection:
1. **Acknowledge**: Empathize with the concern
2. **Reframe**: Shift perspective using customer language
3. **Provide Evidence**: Use proof points to counter objection
4. **Bridge to Value**: Redirect to core value proposition

**Output Template**:
```
Objection 1: "It's too expensive"
- Acknowledge: "I understand budget is a concern."
- Reframe: "How much is 5 hours/week of wasted time costing you? At $50/hour, that's $13K/year."
- Evidence: "Our customers save an average of 10 hours/week - ROI in under 2 months."
- Bridge: "Plus, we have a free tier so you can validate value before paying anything."

Objection 2: "I don't need this - Google Drive works fine"
- Acknowledge: "Google Drive is a solid choice for basic storage."
- Reframe: "But does Google Drive offer Smart Sync, so you can access files without filling your hard drive?"
- Evidence: "92% of our customers switched from Google Drive because of this feature."
- Bridge: "Try both side-by-side for 30 days - if Google Drive still works better, stick with it."
```

Create responses for the top 3-5 objections you expect to hear.

---

## Output Format

Produce a comprehensive Value Proposition Guide (2,000-2,500 words) structured as:

```markdown
# Value Proposition Guide
**Business**: [Name/Concept]
**Date**: [Current date]
**Created By**: Claude (Bizant)

---

## Executive Summary

[2-3 sentences: Core value proposition, target customer, key differentiation]

**Value Proposition**: [One-sentence positioning statement]
**Target Customer**: [Primary segment]
**Key Differentiation**: [Main competitive advantage]

---

## 1. Jobs-to-be-Done Analysis

### Functional Job
When [situation], I want to [motivation], so I can [expected outcome].

**Example**: [Filled in for your product]

### Emotional Job
I want to feel [emotion] when [doing the job].

**Example**: [Filled in for your product]

### Social Job
I want to be perceived as [identity] by [audience].

**Example**: [Filled in for your product]

---

## 2. Pains & Gains Map

### Customer Pains (Ranked by Intensity × Frequency)

1. **[Pain 1]** (Intensity: X/10, Frequency: Daily/Weekly/Monthly)
   - Description: [What's frustrating]
   - Impact: [Cost in time/money/stress]

2. **[Pain 2]** (Intensity: X/10, Frequency: Daily/Weekly/Monthly)
   [Same structure]

3. **[Pain 3]** (Intensity: X/10, Frequency: Daily/Weekly/Monthly)
   [Same structure]

### Customer Gains (Desired Outcomes)

1. **[Gain 1]** (Value: X/10, Frequency: Daily/Weekly/Monthly)
   - Description: [What they want to achieve]
   - Why it matters: [Impact on their life/work]

2. **[Gain 2]** (Value: X/10, Frequency: Daily/Weekly/Monthly)
   [Same structure]

3. **[Gain 3]** (Value: X/10, Frequency: Daily/Weekly/Monthly)
   [Same structure]

---

## 3. Pain Relievers & Gain Creators

### Pain Relievers

**Pain**: [Customer pain]
→ **Relief**: [How your product addresses it]

[Repeat for top 3 pains]

### Gain Creators

**Desired Gain**: [What customer wants]
→ **Creation**: [How your product delivers it]

[Repeat for top 3 gains]

---

## 4. Value Proposition Statement

```
For [target customer],
who [customer's job/pain/context],
[Product Name] is a [category]
that [key benefit].

Unlike [competition/current alternative],
we [unique differentiation].
```

**Rationale**:
[2-3 paragraphs explaining positioning choices]

---

## 5. Benefit Hierarchy

### Level 1: Functional Benefits (What it does)
- [Benefit 1]
- [Benefit 2]
- [Benefit 3]
- [Benefit 4]

### Level 2: Emotional Benefits (How it makes you feel)
- [Benefit 1]
- [Benefit 2]
- [Benefit 3]

### Level 3: Transformational Benefits (Who you become)
- [Benefit 1]
- [Benefit 2]

**Messaging Strategy**:
- Awareness Stage: Lead with [Level 1/2/3]
- Consideration Stage: Emphasize [Level 1/2/3]
- Decision Stage: Reinforce [Level 1/2/3]

---

## 6. Competitive Positioning

### Category
**Chosen Category**: [e.g., "Cloud Storage Platform"]
**Rationale**: [Why this category vs. alternatives]

### Points of Parity (Table Stakes)
1. [Feature 1 all competitors have]
2. [Feature 2 all competitors have]
3. [Feature 3 all competitors have]

### Points of Difference (Unique Advantages)
1. **[Differentiator 1]**: [Why it matters to customers]
2. **[Differentiator 2]**: [Why it matters to customers]
3. **[Differentiator 3]**: [Why it matters to customers]

### Positioning Map

```
        [Axis Y Label]
              |
  [Competitor] | [You]
              |
[Competitor]  |  [Competitor]
              |
        [Axis X Label]
```

**Positioning Strategy**:
[2-3 paragraphs on how you differentiate and why this positioning wins]

---

## 7. Messaging Pillars

### Pillar 1: [Pillar Name]
- **Headline**: [Customer-facing message]
- **Supporting Points**:
  - [Benefit 1]
  - [Benefit 2]
  - [Proof point or example]

### Pillar 2: [Pillar Name]
[Same structure]

### Pillar 3: [Pillar Name]
[Same structure]

---

## 8. Messaging by Touchpoint

### Homepage Hero
- **Headline**: [One sentence - clear, benefit-driven]
- **Subheadline**: [One sentence - expand on benefit]
- **CTA**: [Action-oriented button text]

### Google Ads (Search)
- **Headline 1** (30 chars): [Primary benefit]
- **Headline 2** (30 chars): [Differentiation]
- **Description** (90 chars): [Expand + CTA]

### Email Subject Line (Cold Outreach)
- **Subject**: [Pain or curiosity hook]

### Social Media (LinkedIn)
- **Hook**: [Attention-grabbing first line]
- **Body**: [Expand on pain/solution]
- **CTA**: [Link + call to action]

### Sales Pitch (30-second elevator pitch)
[Problem] → [Solution] → [Differentiation] → [Proof]

[Full pitch written out]

### Demo/Onboarding
- **Welcome Message**: [Set expectations for value]
- **First Action**: [Immediate value - quick win]
- **Aha Moment**: [When they experience core value]

---

## 9. Proof Points & Credibility

### Available Now
- ✅ [Proof point 1]
- ✅ [Proof point 2]
- ✅ [Proof point 3]

### Need to Create
- ⏳ [Proof point to develop]
- ⏳ [Proof point to develop]
- ⏳ [Proof point to develop]

**Priority**: [Which proof point to develop first and why]

---

## 10. Objection Handling

### Objection 1: [Common objection]
- **Acknowledge**: [Empathize]
- **Reframe**: [Shift perspective]
- **Evidence**: [Proof point to counter]
- **Bridge**: [Redirect to value]

### Objection 2: [Common objection]
[Same structure]

### Objection 3: [Common objection]
[Same structure]

---

## Conclusion

[2-3 paragraphs summarizing value proposition strength and next steps]

**Value Proposition Strength**: High / Medium / Low

**Next Steps**:
1. [Action 1 - e.g., Test homepage messaging with 100 visitors via A/B test]
2. [Action 2 - e.g., Collect customer testimonials from first 10 customers]
3. [Action 3 - e.g., Create case study template for quantified value]

---

*Generated with Bizant - Business Strategy Skills Library*
*Next recommended skill: `go-to-market-planner` OR `customer-persona-builder`*
```

---

## Quality Gates

Before delivering the report, verify:

- [ ] Jobs-to-be-Done analysis completed (functional, emotional, social)
- [ ] Top 3 pains and gains identified with intensity/frequency rankings
- [ ] Pain relievers and gain creators mapped to product features
- [ ] Value proposition statement crafted using template
- [ ] Benefit hierarchy created (functional, emotional, transformational)
- [ ] Competitive positioning defined (category, parity, difference)
- [ ] 3-5 messaging pillars developed with proof points
- [ ] Messaging tailored for 5+ touchpoints (homepage, ads, email, social, sales, onboarding)
- [ ] Top 3-5 objections addressed with response framework
- [ ] Proof points identified (available + needed)
- [ ] Report is comprehensive and covers all key areas
- [ ] Customer language used (not product-centric jargon)

## Integration with Other Skills

**Skill Chaining**:
- **Input from**:
  - `idea-validator` (problem-solution fit, target customer)
  - `market-opportunity-analyzer` (competitive landscape, beachhead market)
  - `business-model-designer` (customer segments, value propositions block)
- **Output to**:
  - `go-to-market-planner` (messaging for launch campaigns)
  - `customer-persona-builder` (persona-specific messaging)
  - `content-strategy-architect` (content themes based on messaging pillars)
  - `sales-playbook-builder` (sales pitch, objection handling)

---

### Step 14: Iterative Refinement (Up to 3 Passes)

After generating the value proposition report, implement this refinement loop:

**IMPORTANT**: Track iteration count. Maximum 3 iterations total (Pass 1, Pass 2, Pass 3).

**After each report generation**, ask:

"**Would you like to refine this analysis?**

Sometimes after seeing the analysis, you realize additional context or corrections that could improve the conclusions.

**Current Version**: Pass [X] of 3

**Options**:
1. ✅ **No, this analysis is complete** → Proceed to save
2. 🔄 **Yes, I have additional information** → Refine analysis

If you choose option 2, provide any:
- Corrections to details I misunderstood
- Additional context I should consider
- New information that could change conclusions
- Clarifications on any assumptions I made

**What would you like to do?**"

**IF user selects option 2 (refine)**:
1. Collect their additional information/corrections
2. **Append** this new context to the existing gathered data (do NOT discard previous context)
3. Regenerate the report incorporating ALL context (original + refinements)
4. Label the new report: "Report Version: Pass [X+1]"
5. At the start of the refined report, add a note: "**Refined based on**: [brief summary of what changed]"
6. Repeat this refinement question (up to Pass 3)

**IF user selects option 1 (complete) OR iteration count = 3**:
- Add note to report: "**Final Report** (X iterations)"
- Proceed to Step 15 (Save Report)

**Context Preservation Rule**: Each iteration must **ADD TO** previous context, never replace. The final report should reflect the most complete, accurate understanding.

### Step 15: Save Report (IMPORTANT)

After refinement is complete (user selected "No" or reached 3 iterations), **ALWAYS** ask the user:

"Would you like me to save this value proposition report?

I can save it as a markdown file for your records. This report represents 60-90 minutes of strategic analysis and should be preserved for future reference.

**Suggested filename**: `[Business-Name]-Value-Proposition-[YYYY-MM-DD].md`

**Suggested location**: Current working directory or a `/reports/` or `/docs/` folder if one exists.

Would you like me to save this report now?"

**Wait for user response before proceeding.**

If user says yes, use the Write tool to save the complete report to the specified location.

---

## Time Estimate

**Total Time**: 60-90 minutes
- Context gathering: 10-15 minutes
- JTBD + Pains/Gains analysis: 20-25 minutes
- Value prop statement + benefit hierarchy: 15-20 minutes
- Messaging pillars + touchpoints: 20-25 minutes
- Objection handling: 10-15 minutes
- Report formatting: 5-10 minutes

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
   html-templates/value-proposition-crafter.html
   ```

### How to Use Templates

1. Read `VERIFICATION-CHECKLIST.md` first - contains canonical CSS patterns that MUST be copied exactly
2. Read `base-template.html` - contains all shared CSS, layout structure, and Chart.js configuration
3. Read `value-proposition-crafter.html` - contains skill-specific content sections, CSS extensions, and chart scripts
4. Replace all `{{PLACEHOLDER}}` markers with actual analysis data
5. Merge the skill-specific CSS into `{{SKILL_SPECIFIC_CSS}}`
6. Merge the content sections into `{{CONTENT_SECTIONS}}`
7. Merge the chart scripts into `{{CHART_SCRIPTS}}`

### Required Charts (5 total)

1. **jtbdRadar** (Radar) - Functional, emotional, social job scores
2. **painGainChart** (Horizontal Bar) - Top pains and gains with intensity scores
3. **benefitPyramid** (Doughnut) - Functional, emotional, transformational benefit distribution
4. **positioningChart** (Scatter) - Competitive positioning map
5. **messagingPillarChart** (Bar) - Messaging pillar effectiveness scores

### Key Placeholders

**Header:**
- `{{KICKER}}` = "StratArts Business Analysis"
- `{{TITLE}}` = "Value Proposition Crafter"
- `{{SUBTITLE}}` = Business name + description

**Score Banner:**
- `{{PRIMARY_SCORE}}` = Value proposition strength score (0-10)
- `{{SCORE_LABEL}}` = "Value Proposition Strength"
- `{{VERDICT}}` = "✓ STRONG VALUE PROP" | "⚠️ NEEDS REFINEMENT" | "✗ WEAK - MAJOR REVISION NEEDED"

**Footer:**
- `{{CONTEXT_SIGNATURE}}` = "value-proposition-crafter-v1.0.0"

### MANDATORY: Pre-Save Verification

**Before saving any HTML output, verify against VERIFICATION-CHECKLIST.md:**

1. **Footer CSS** - Copy EXACTLY from checklist (do NOT write from memory):
   ```css
   footer { background: #0a0a0a; display: flex; justify-content: center; }
   .footer-content { max-width: 1600px; width: 100%; background: #1a1a1a; color: #a3a3a3; padding: 2rem 4rem; font-size: 0.85rem; text-align: center; border-top: 1px solid rgba(16, 185, 129, 0.2); }
   .footer-content p { margin: 0.3rem 0; }
   .footer-content strong { color: #10b981; }
   ```

2. **Footer HTML** - Use EXACTLY this structure:
   ```html
   <footer>
       <div class="footer-content">
           <p><strong>Generated:</strong> {{DATE}} | <strong>Project:</strong> {{PROJECT_NAME}}</p>
           <p style="margin-top: 5px;">StratArts Business Strategy Skills | {{SKILL_NAME}}-v{{VERSION}}</p>
           <p style="margin-top: 5px;">Context Signature: {{CONTEXT_SIGNATURE}} | Final Report ({{ITERATIONS}} iteration{{ITERATIONS_PLURAL}})</p>
       </div>
   </footer>
   ```

3. **Version Format** - Always use `v1.0.0` (three-part semantic versioning)

4. **Prohibited Patterns** - NEVER use:
   - `#0f0f0f` (wrong background color)
   - `.footer-brand` or `.footer-meta` classes
   - `justify-content: space-between` in footer-content
   - `v1.0` or `v2.0.0` (incorrect version formats)

### Context Signature Block

Include at end of report for skill chaining:
```
<!-- STRATARTS_CONTEXT_SIGNATURE
skill: value-proposition-crafter
version: 1.0.0
date: {ISO_DATE}
project_dir: {PROJECT_DIR}
business_name: {BUSINESS_NAME}
key_outputs:
  - Value Proposition Statement
  - JTBD Analysis (functional, emotional, social)
  - Benefit Hierarchy (3 levels)
  - 3-5 Messaging Pillars
  - Competitive Positioning
  - Objection Handling Framework
END_STRATARTS_CONTEXT -->
```

---

*This skill is part of StratArts Foundation & Strategy Skills*
*For advanced messaging and copywriting, see: `content-strategy-architect` (Marketing & Growth Pack)*
