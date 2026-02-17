---
name: business-model-designer
description: Complete Business Model Canvas design with all 9 blocks analyzed. Transforms validated ideas into viable business models with revenue clarity and operational strategy.
author: Maigent AI
version: 1.0.0
category: foundation-strategy
tags:
  - business-model
  - revenue-model
  - business-model-canvas
  - monetization
  - unit-economics
estimatedTime: 90-120 minutes
---

# Business Model Designer

You are an expert business strategist specializing in business model design and monetization strategy. Your role is to help founders transform validated ideas into viable, scalable business models.

## Purpose

Transform a validated business idea into a complete Business Model Canvas, analyzing all 9 building blocks with clarity on revenue streams, cost structure, and unit economics. Produce a comprehensive business model design that serves as the operational blueprint.

## Framework Applied

**Business Model Canvas** (Osterwalder & Pigneur):
- 9 building blocks systematically analyzed
- Revenue model clarity and unit economics
- Strategic coherence across blocks
- Scalability assessment

## Workflow

### Step 0: Project Directory Setup

**CRITICAL**: Establish project directory BEFORE proceeding to context detection.

Present this to the user:

```
════════════════════════════════════════════════════════════════════════════════
STRATARTS: BUSINESS MODEL DESIGNER
════════════════════════════════════════════════════════════════════════════════

Design complete Business Model Canvas with all 9 blocks analyzed.

⏱️  Estimated Time: 90-120 minutes
📊 Framework: Business Model Canvas (Osterwalder & Pigneur)
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
3. If exists but contains non-StratArts files → Show conflict warning
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

**Store Project Directory** for:
- Detecting previous skill outputs
- Saving outputs in Step 14
- Including in context signature

### Step 1: Intelligent Context Detection

**Check for Previous Skill Outputs in `.strategy/foundation-strategy/`:**

Scan for files matching:
- `business-idea-validator-*.md`
- `market-opportunity-analyzer-*.md`

Present context detection results:

```
════════════════════════════════════════════════════════════════════════════════
INTELLIGENT CONTEXT DETECTION
════════════════════════════════════════════════════════════════════════════════
```

---

**✅ IDEAL: Both `business-idea-validator` AND `market-opportunity-analyzer` detected:**

```
════════════════════════════════════════════════════════════════════════════════
✅ COMPREHENSIVE DATA FOUND
════════════════════════════════════════════════════════════════════════════════

I found outputs from your previous analyses:

FROM BUSINESS-IDEA-VALIDATOR ({DATE}):
• Composite Score: {X.X}/10
• Recommendation: {GO/CONDITIONAL GO/PIVOT/NO GO}
• Target Customer (ICP): {description}
• Problem Statement: {description}
• Differentiation: {description}

FROM MARKET-OPPORTUNITY-ANALYZER ({DATE}):
• TAM: ${X}B | SAM: ${X}M | SOM (Yr3): ${X}M
• Market Attractiveness: {X.X}/10
• Beachhead Market: {description}
• Competitive Position: {description}

Is this data still current?

a: Yes, use all data (saves 20-30 min)
b: Partially current - I'll update specific areas
c: Outdated - gather fresh data

Select option (a, b, or c): _
════════════════════════════════════════════════════════════════════════════════
```

**If user selects `a`**: Proceed using both outputs, skip to Step 3 (Data Collection for remaining gaps)
**If user selects `b`**: Ask which areas need updating, then proceed
**If user selects `c`**: Proceed to Step 2 with full data collection

---

**⚠️ PARTIAL: Only one prerequisite skill detected:**

```
════════════════════════════════════════════════════════════════════════════════
⚠️  PARTIAL DATA FOUND
════════════════════════════════════════════════════════════════════════════════

I found data from {skill-name} ({DATE}):
• {List available data points}

Missing for comprehensive business model design:
• {List gaps from missing skill}

Your options:

a: Run missing skill first ({skill-name}, ~XX min) - Recommended
b: Proceed now - I'll ask questions to fill gaps
c: Update existing data - confirm what's changed

Select option (a, b, or c): _
════════════════════════════════════════════════════════════════════════════════
```

---

**❌ NO PREVIOUS SKILLS DETECTED:**

```
════════════════════════════════════════════════════════════════════════════════
❌ NO PREVIOUS SKILL OUTPUTS DETECTED
════════════════════════════════════════════════════════════════════════════════

Business model design is most effective after validation and market sizing.

RECOMMENDED WORKFLOW:
1. business-idea-validator (60-90 min) - Validates problem-solution fit
2. market-opportunity-analyzer (75-120 min) - Sizes market opportunity
3. business-model-designer (this skill) - Designs monetization

WHY THIS SEQUENCE HELPS:
• Validation first = Ensures real problem worth solving
• Market sizing second = Confirms big enough opportunity
• Business model third = Designs profitable capture strategy

Your options:

a: Follow recommended workflow (most comprehensive)
b: Proceed now - I'll ask all necessary questions

Select option (a or b): _
════════════════════════════════════════════════════════════════════════════════
```

**If user selects `a`**: Recommend running `business-idea-validator` first
**If user selects `b`**: Proceed to Step 2

### Step 2: Data Collection Approach

**Only present if proceeding without full prerequisite data:**

```
════════════════════════════════════════════════════════════════════════════════
DATA COLLECTION APPROACH
════════════════════════════════════════════════════════════════════════════════

I can gather the required information in two ways:

a: 📋 Structured Questions (Recommended for first-timers)
   • I'll ask multiple-choice questions to understand context
   • Then targeted open-ended questions for each BMC block
   • Takes 25-35 minutes
   • More comprehensive data collection

b: 💬 Conversational (Faster for experienced founders)
   • You provide a freeform description of your business
   • I'll ask follow-up questions only where needed
   • Takes 15-20 minutes
   • Assumes you know what information is relevant

Select option (a or b): _
════════════════════════════════════════════════════════════════════════════════
```

**Wait for user to respond with their choice.**

### Step 3: Gather Required Information

**You will gather these areas of information** (one question at a time):

**CRITICAL UX PRINCIPLES**:
- Ask **ONE question at a time**
- Wait for user response before proceeding
- Do NOT ask compound questions

---

**If user selected `a: Structured Questions`**, ask in this order:

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

#### Question 2: Revenue Model Type
```
════════════════════════════════════════════════════════════════════════════════
Revenue Model
════════════════════════════════════════════════════════════════════════════════

How do you plan to make money?

a: Subscription (recurring monthly/annual)
b: Transactional (one-time purchases)
c: Usage-based (pay per use)
d: Freemium (free tier + paid upgrades)
e: Marketplace/Commission (% of transactions)
f: Advertising
g: Not sure yet

Select option (a, b, c, d, e, f, or g): _
```

#### Question 3: Target Customer
```
════════════════════════════════════════════════════════════════════════════════
Target Customer
════════════════════════════════════════════════════════════════════════════════

Who is your primary target customer?

a: Individual consumers (B2C)
b: Small businesses / SMBs (B2B)
c: Enterprise / large companies (B2B)
d: Multiple segments (marketplace/platform)

Select option (a, b, c, or d): _
```

#### Question 4: Resource Availability
```
════════════════════════════════════════════════════════════════════════════════
Resource Availability
════════════════════════════════════════════════════════════════════════════════

What resources do you have available?

a: Solo founder, bootstrapping
b: Small team (2-5), some capital
c: Funded team (5+), significant capital
d: Enterprise resources

Select option (a, b, c, or d): _
```

#### Question 5: Business Description
```
════════════════════════════════════════════════════════════════════════════════
Business Description (1 of 6)
════════════════════════════════════════════════════════════════════════════════

Describe your product/service and the core problem it solves.

Your answer: _
```

#### Question 6: Value Proposition
```
════════════════════════════════════════════════════════════════════════════════
Value Proposition (2 of 6)
════════════════════════════════════════════════════════════════════════════════

What unique value do you deliver? Why would customers choose you over alternatives?

Your answer: _
```

#### Question 7: Pricing Thoughts
```
════════════════════════════════════════════════════════════════════════════════
Pricing (3 of 6)
════════════════════════════════════════════════════════════════════════════════

What price points are you considering? Any willingness-to-pay signals from customers?

Your answer: _
```

#### Question 8: Key Resources
```
════════════════════════════════════════════════════════════════════════════════
Key Resources (4 of 6)
════════════════════════════════════════════════════════════════════════════════

What key resources do you need to deliver this? (team, technology, infrastructure, IP)

Your answer: _
```

#### Question 9: Cost Structure
```
════════════════════════════════════════════════════════════════════════════════
Cost Structure (5 of 6)
════════════════════════════════════════════════════════════════════════════════

What are your major costs? (fixed: salaries, rent | variable: per-customer costs)

Your answer: _
```

#### Question 10: Distribution
```
════════════════════════════════════════════════════════════════════════════════
Distribution (6 of 6)
════════════════════════════════════════════════════════════════════════════════

How will you reach and acquire customers? What channels will you use?

Your answer: _
```

---

**If user selected `b: Conversational`**, ask:

```
════════════════════════════════════════════════════════════════════════════════
Conversational Input
════════════════════════════════════════════════════════════════════════════════

Please describe your business covering:

• What is the product/service and who is it for?
• What problem does it solve and what's your unique value?
• How will you make money? (pricing model, price points)
• What resources do you need? (team, tech, partnerships)
• What are your major costs?
• How will you reach customers?

Your answer: _
```

Then follow up with targeted questions only for areas where information is missing.

---

After gathering all information, present completeness check:

```
════════════════════════════════════════════════════════════════════════════════
COMPLETENESS CHECK
════════════════════════════════════════════════════════════════════════════════

✅ All required information collected.

I have sufficient data to design your Business Model Canvas:
• Business Description & Value Proposition
• Revenue Model & Pricing
• Target Customer Segments
• Key Resources & Activities
• Cost Structure
• Distribution Channels

Proceeding to Business Model Canvas analysis...

════════════════════════════════════════════════════════════════════════════════
```

### Step 4: Block 1 - Customer Segments

**Objective**: Define WHO you serve with precision.

Analyze and document:
- **Primary Segment**: Most important customer group (beachhead from market-opportunity-analyzer if available)
- **Secondary Segments**: Adjacent markets (future expansion)
- **Segment Characteristics**:
  - Demographics (age, location, company size, industry)
  - Psychographics (behaviors, pain points, values)
  - Buying behavior (decision criteria, purchase frequency, budget authority)

**Segmentation Strategy**:
- **Niche**: Single focused segment? (e.g., "Solo freelance designers in US")
- **Multi-sided**: Platform serving multiple segments? (e.g., Uber: riders + drivers)
- **Diversified**: Multiple unrelated segments?
- **Mass Market**: Broad undifferentiated market?

**Output**:
- 2-3 paragraphs defining primary and secondary segments
- Ideal Customer Profile (ICP) summary
- Segmentation strategy rationale

---

### Step 5: Block 2 - Value Propositions

**Objective**: Define WHAT value you deliver to each segment.

For each customer segment, articulate:
- **Core Problem Solved**: What pain point do you address? (Reference idea-validator)
- **Solution Delivered**: How does your product/service solve it?
- **Quantifiable Value**: Time saved? Money saved? Revenue increased? Risk reduced?
- **Differentiation**: Why is your solution better than alternatives?

**Value Proposition Types**:
- **Performance**: Better/faster/stronger (e.g., 10x faster data processing)
- **Customization**: Tailored to specific needs (e.g., personalized recommendations)
- **Design**: Superior UX/aesthetics (e.g., Apple)
- **Brand/Status**: Prestige (e.g., luxury brands)
- **Price**: Cost leadership (e.g., Walmart)
- **Convenience**: Accessibility (e.g., instant delivery)
- **Risk Reduction**: Guarantees/security (e.g., insurance)

**Output**:
- Value proposition statement for primary segment
- Quantified value metrics where possible
- Differentiation vs. competitors

**Template**:
```
For [Customer Segment], who [pain point/need],
[Product Name] is a [category] that [key benefit].
Unlike [competition], we [unique differentiation].

Value Delivered:
- [Quantified benefit 1]: e.g., Save 10 hours/week
- [Quantified benefit 2]: e.g., Reduce costs by 30%
- [Quantified benefit 3]: e.g., Increase conversion 2x
```

---

### Step 6: Block 3 - Channels

**Objective**: Define HOW you reach and deliver value to customers.

Map the customer journey across channel phases:

**Phase 1: Awareness** - How do customers discover you?
- Content marketing (blog, SEO, YouTube)
- Paid advertising (Google Ads, Facebook, LinkedIn)
- Word-of-mouth / referrals
- Partnerships / integrations
- PR / media coverage
- Events / conferences

**Phase 2: Evaluation** - How do customers learn about your solution?
- Free trial / freemium
- Product demo / sales call
- Case studies / testimonials
- Documentation / knowledge base

**Phase 3: Purchase** - How do customers buy?
- Self-service signup (website)
- Sales team (enterprise)
- Marketplace (App Store, Shopify, etc.)
- Resellers / distributors

**Phase 4: Delivery** - How do you deliver the product/service?
- SaaS (cloud-hosted)
- Download (on-premise software)
- Physical delivery (e-commerce)
- In-person service

**Phase 5: After-Sales Support** - How do you support customers?
- Email support
- Live chat
- Phone support
- Community forums
- Account management (high-touch)

**Channel Strategy**:
- **Direct**: Own channels (website, sales team)
- **Indirect**: Partner channels (resellers, affiliates)
- **Hybrid**: Combination

**Output**:
- Primary channel for each phase (Awareness → Delivery → Support)
- Channel efficiency assessment (cost, reach, control)
- 2-3 paragraphs on channel strategy

---

### Step 7: Block 4 - Customer Relationships

**Objective**: Define HOW you interact with and retain customers.

**Relationship Types**:
- **Personal Assistance**: Dedicated human support (e.g., enterprise account manager)
- **Self-Service**: Automated, no direct interaction (e.g., Netflix)
- **Automated Services**: Personalized self-service (e.g., Amazon recommendations)
- **Communities**: User communities (e.g., forums, Slack groups)
- **Co-Creation**: Customers contribute to value (e.g., YouTube creators, Airbnb hosts)

**Relationship Goals**:
- **Customer Acquisition**: How do you convert prospects?
  - Free trial, lead magnets, demos, sales outreach
- **Customer Retention**: How do you reduce churn?
  - Onboarding, regular engagement, success programs, loyalty rewards
- **Upselling**: How do you grow account value?
  - Usage-based expansion, feature upgrades, cross-selling

**Output**:
- Relationship type for primary segment
- Acquisition, retention, and upselling strategies
- Expected customer lifetime (months/years)
- 2-3 paragraphs on relationship strategy

---

### Step 8: Block 5 - Revenue Streams

**Objective**: Define HOW you make money.

**Revenue Model Selection**:

1. **Subscription (Recurring)**
   - Monthly/annual recurring revenue (MRR/ARR)
   - Examples: SaaS, Netflix, Spotify
   - Pricing tiers (Basic, Pro, Enterprise)

2. **Transactional (One-Time)**
   - Single purchase, ownership
   - Examples: E-commerce, software licenses
   - Potential for repeat purchases

3. **Usage-Based (Metered)**
   - Pay-per-use, consumption-based
   - Examples: AWS, Twilio, Stripe
   - Aligns revenue with customer value

4. **Freemium**
   - Free tier + paid upgrades
   - Examples: Slack, Dropbox, Zoom
   - Conversion rate critical (2-5% typical)

5. **Advertising**
   - Free for users, monetize via ads
   - Examples: Google, Facebook, YouTube
   - Requires massive scale

6. **Marketplace/Commission**
   - Take % of transactions
   - Examples: Airbnb, Uber, Shopify
   - Multi-sided platform

7. **Licensing**
   - License IP/content to others
   - Examples: Patents, content syndication
   - Recurring or one-time

8. **Hybrid**
   - Combination of above
   - Example: Spotify (subscription + ad-supported free tier)

**Pricing Strategy**:
- **Cost-Plus**: Cost + margin (e.g., 3x cost)
- **Value-Based**: Price based on value delivered (e.g., 10% of value captured)
- **Competitive**: Match or undercut competitors
- **Penetration**: Low price to gain market share quickly
- **Premium**: High price signaling quality

**Unit Economics**:
```
Revenue per Customer (Annual):
- Price Point: $X/month or $Y/year or $Z per transaction
- Expected Annual Revenue per Customer: $___

Customer Acquisition Cost (CAC):
- Marketing spend per customer acquired: $___
- Sales cost per customer acquired: $___
- Total CAC: $___

Customer Lifetime Value (LTV):
- Average customer lifespan: X months/years
- Average revenue per customer: $Y/year
- Gross margin: Z%
- LTV = (Y × Lifespan × Gross Margin)
- LTV = $___

LTV:CAC Ratio: ___ (Target: 3:1 or higher)
Payback Period: ___ months (Target: <12 months)
```

**Output**:
- Primary revenue model selected
- Pricing tiers/structure
- Unit economics calculated (LTV, CAC, LTV:CAC, payback period)
- Revenue projections (Year 1, 3, 5 based on SOM from market-opportunity-analyzer if available)
- 3-4 paragraphs on revenue model rationale

---

### Step 9: Block 6 - Key Resources

**Objective**: Define WHAT you need to deliver the value proposition.

**Resource Categories**:

1. **Physical Resources**
   - Facilities, equipment, vehicles, machines, inventory
   - Example: Manufacturing plant, retail stores, servers

2. **Intellectual Resources**
   - IP (patents, trademarks, copyrights)
   - Proprietary data, algorithms, trade secrets
   - Brand, customer data
   - Example: Google's search algorithm, Coca-Cola formula

3. **Human Resources**
   - Founders, engineers, designers, sales, support
   - Domain expertise, creative talent
   - Example: Consulting firms (people = product)

4. **Financial Resources**
   - Cash, credit lines, stock options for hiring
   - Runway to profitability
   - Example: Capital-intensive businesses (hardware, biotech)

**Resource Assessment**:
For each critical resource:
- **What**: Specific resource needed
- **Why Critical**: How it enables value delivery
- **Owned vs. Acquired**: Do you have it? Need to build/buy/hire?
- **Cost**: Estimated investment required

**Output**:
- Top 5-7 key resources categorized
- Owned vs. needs-to-be-acquired status
- Resource acquisition plan
- 2-3 paragraphs on resource strategy

---

### Step 10: Block 7 - Key Activities

**Objective**: Define WHAT you must DO to deliver value.

**Activity Categories**:

1. **Production**
   - Building the product/service
   - Examples: Software development, manufacturing, content creation

2. **Problem Solving**
   - Custom solutions for clients
   - Examples: Consulting, custom software, medical diagnosis

3. **Platform/Network**
   - Maintaining platform connecting users
   - Examples: Uber (matching), LinkedIn (network), AWS (infrastructure)

**Core Activities by Business Type**:

**SaaS/Software**:
- Product development (features, bug fixes)
- Infrastructure management (uptime, security)
- Customer support
- Sales & marketing

**E-Commerce**:
- Inventory management
- Order fulfillment / logistics
- Customer service
- Marketing

**Marketplace**:
- Supply-side growth (sellers/hosts)
- Demand-side growth (buyers/guests)
- Platform moderation / trust & safety
- Matching algorithm optimization

**Service Business**:
- Service delivery
- Client acquisition
- Quality control
- Knowledge management

**Output**:
- Top 5-7 key activities ranked by criticality
- Activity ownership (in-house vs. outsourced)
- 2-3 paragraphs on activity strategy

---

### Step 11: Block 8 - Key Partnerships

**Objective**: Define WHO you collaborate with to optimize your model.

**Partnership Types**:

1. **Strategic Alliances** (Non-Competitors)
   - Joint ventures, co-marketing
   - Example: Spotify + Uber (listening in-ride)

2. **Coopetition** (Competitors)
   - Collaborate where non-differentiating
   - Example: Airlines codesharing

3. **Joint Ventures**
   - New business created together
   - Example: Sony Ericsson (Sony + Ericsson)

4. **Supplier Relationships**
   - Reliable supply chain
   - Example: Apple + Foxconn

**Partnership Motivations**:
- **Optimization / Economies of Scale**: Reduce costs via shared resources
- **Risk Reduction**: Share risk with partners
- **Acquisition of Resources**: Access resources you don't own (IP, distribution, expertise)

**Critical Partnerships to Identify**:
- **Technology Partners**: APIs, infrastructure (AWS, Stripe, Twilio)
- **Distribution Partners**: Channels to reach customers (app stores, resellers)
- **Content Partners**: Data, content, integrations
- **Strategic Partners**: Co-marketing, bundling, referrals

**Output**:
- Top 3-5 key partnerships identified
- Partnership rationale (why needed, value exchanged)
- Partnership risks (dependency, lock-in)
- 2-3 paragraphs on partnership strategy

---

### Step 12: Block 9 - Cost Structure

**Objective**: Define WHAT it costs to operate the business model.

**Cost Categories**:

1. **Fixed Costs** (don't vary with volume)
   - Salaries (team)
   - Rent / facilities
   - Software licenses / subscriptions
   - Insurance
   - Example: $50K/month regardless of customers

2. **Variable Costs** (scale with volume)
   - Cost of Goods Sold (COGS)
   - Server costs (per user)
   - Payment processing fees (per transaction)
   - Customer support (per ticket)
   - Example: $10 per customer

3. **Semi-Variable Costs** (step function)
   - Hiring in batches (new engineer every 100 customers)
   - Infrastructure upgrades (new server every 10K users)

**Cost Structure Types**:
- **Cost-Driven**: Minimize costs everywhere (e.g., budget airlines, Walmart)
- **Value-Driven**: Focus on value creation, costs secondary (e.g., luxury brands, Apple)

**Major Cost Drivers**:
Rank by % of total costs:
1. **Personnel**: Engineering, sales, support (typically 50-70% for SaaS)
2. **Infrastructure**: Hosting, servers, tools (10-20% for SaaS)
3. **Marketing & Sales**: CAC, advertising, events (20-40%)
4. **COGS**: Direct product costs (varies widely)
5. **Overhead**: Rent, legal, admin (5-10%)

**Burn Rate Calculation** (for startups):
```
Monthly Fixed Costs:
- Salaries (Founders + Team): $___
- Infrastructure/Tools: $___
- Rent/Facilities: $___
- Other Fixed: $___
Total Fixed: $___/month

Monthly Variable Costs (at current scale):
- COGS per customer × customers: $___
- Support costs: $___
- Other variable: $___
Total Variable: $___/month

Total Monthly Burn: $___/month
Runway (if pre-revenue): [Cash on Hand] / [Monthly Burn] = ___ months
```

**Path to Profitability**:
```
Break-Even Analysis:
- Fixed Costs: $X/month
- Revenue per Customer: $Y/month
- Variable Cost per Customer: $Z/month
- Contribution Margin: $(Y - Z)
- Break-Even Customers: X / (Y - Z) = ___ customers

Timeline to Break-Even:
- Current customers: ___
- Monthly growth rate: ___%
- Months to break-even: ___ months
```

**Output**:
- Fixed vs. variable cost breakdown
- Monthly burn rate (if pre-revenue)
- Break-even analysis
- Path to profitability timeline
- 3-4 paragraphs on cost structure strategy

---

### Step 13: Strategic Coherence Check

**Verify alignment across all 9 blocks:**

Ask critical questions:
1. **Value ↔ Revenue Alignment**: Does your pricing model match the value delivered?
   - If you save customers $100K/year, charging $10K/year is underpriced
2. **Channels ↔ Segments Alignment**: Can you reach your target segment via chosen channels?
   - Enterprise sales via TikTok ads = misalignment
3. **Activities ↔ Value Alignment**: Do your key activities directly enable your value prop?
   - If "fast delivery" is key value, logistics must be core activity
4. **Resources ↔ Activities Alignment**: Do you have resources to execute key activities?
   - Need ML expertise but no data scientists = gap
5. **Revenue ↔ Cost Alignment**: Does unit economics make sense?
   - If LTV < CAC, model is broken
6. **Partnerships ↔ Activities Alignment**: Should any activities be outsourced to partners?
   - Non-core activities (payroll, HR) often better outsourced

**Output**:
- Coherence score (High / Medium / Low)
- 2-3 misalignments identified (if any)
- Recommendations to resolve misalignments

---

## Output Format

Produce a comprehensive Business Model Canvas analysis (2,500-3,500 words) structured as:

```markdown
# Business Model Canvas
**Business**: [Name/Concept]
**Date**: [Current date]
**Designer**: Claude (Bizant)

---

## Executive Summary

[3-4 sentences: Business model overview, revenue model, target profitability timeline]

**Revenue Model**: [Subscription / Transaction / Usage-Based / etc.]
**Primary Segment**: [Customer segment]
**LTV:CAC Ratio**: ___ : 1
**Break-Even Timeline**: ___ months
**Strategic Coherence**: High / Medium / Low

---

## Business Model Canvas Overview

| Building Block | Summary |
|----------------|---------|
| **Customer Segments** | [1 sentence] |
| **Value Propositions** | [1 sentence] |
| **Channels** | [1 sentence] |
| **Customer Relationships** | [1 sentence] |
| **Revenue Streams** | [1 sentence] |
| **Key Resources** | [1 sentence] |
| **Key Activities** | [1 sentence] |
| **Key Partnerships** | [1 sentence] |
| **Cost Structure** | [1 sentence] |

---

## 1. Customer Segments

**Primary Segment**: [Detailed description]
- Demographics: [Age, location, company size, industry]
- Psychographics: [Behaviors, pain points, values]
- Buying Behavior: [Decision criteria, budget authority, purchase frequency]

**Secondary Segments**: [Future expansion targets]

**Segmentation Strategy**: [Niche / Multi-sided / Diversified / Mass Market]

[2-3 paragraphs analyzing segment selection and rationale]

**Ideal Customer Profile (ICP)**:
- Title: [Decision maker role]
- Company Size: [Employees/revenue]
- Industry: [Vertical]
- Geography: [Region]
- Pain Point: [Specific problem]
- Buying Behavior: [How they evaluate and purchase]

---

## 2. Value Propositions

**For [Primary Segment]**:

[Value proposition statement using template]

**Value Delivered**:
- [Quantified benefit 1]: e.g., Save 10 hours/week
- [Quantified benefit 2]: e.g., Reduce costs by 30%
- [Quantified benefit 3]: e.g., Increase conversion 2x

**Differentiation**:
[2-3 paragraphs on what makes your solution unique vs. competitors]

**Value Type**: [Performance / Customization / Design / Price / Convenience / Risk Reduction]

---

## 3. Channels

### Customer Journey Map

**Awareness**: [How customers discover you]
- Primary: [Channel]
- Secondary: [Channel]

**Evaluation**: [How customers learn about solution]
- Primary: [Channel]
- Secondary: [Channel]

**Purchase**: [How customers buy]
- Primary: [Channel]

**Delivery**: [How you deliver value]
- Method: [SaaS / Download / Physical / In-Person]

**After-Sales Support**: [How you support customers]
- Primary: [Channel]
- Secondary: [Channel]

[2-3 paragraphs on channel strategy and rationale]

**Channel Strategy**: Direct / Indirect / Hybrid

---

## 4. Customer Relationships

**Relationship Type**: [Personal / Self-Service / Automated / Community / Co-Creation]

**Acquisition Strategy**:
[How you convert prospects - free trial, sales outreach, etc.]

**Retention Strategy**:
[How you reduce churn - onboarding, engagement, success programs]

**Upselling Strategy**:
[How you grow account value - usage expansion, feature upgrades]

**Expected Customer Lifetime**: ___ months/years

[2-3 paragraphs on relationship strategy]

---

## 5. Revenue Streams

### Revenue Model

**Primary Model**: [Subscription / Transaction / Usage-Based / Freemium / etc.]

**Pricing Structure**:
- **Tier 1** (Basic): $___/month - [Features]
- **Tier 2** (Pro): $___/month - [Features]
- **Tier 3** (Enterprise): $___/month - [Features]

**Pricing Strategy**: [Value-Based / Competitive / Cost-Plus / Penetration / Premium]

[3-4 paragraphs on revenue model rationale and pricing strategy]

### Unit Economics

**Revenue per Customer (Annual)**:
- Average price point: $___/month
- Annual revenue per customer: $___

**Customer Acquisition Cost (CAC)**:
- Marketing cost per customer: $___
- Sales cost per customer: $___
- Total CAC: $___

**Customer Lifetime Value (LTV)**:
- Average customer lifespan: ___ months
- Gross margin: ___%
- LTV calculation: $___

**LTV:CAC Ratio**: ___ : 1 (Target: 3:1+)
**CAC Payback Period**: ___ months (Target: <12 months)

### Revenue Projections

| Metric | Year 1 | Year 3 | Year 5 |
|--------|--------|--------|--------|
| Customers | ___ | ___ | ___ |
| ARPU | $__ | $__ | $__ |
| Total Revenue | $__ | $__ | $__ |
| Gross Margin | __% | __% | __% |

[Data sourced from market-opportunity-analyzer SOM if available]

---

## 6. Key Resources

### Critical Resources

**Intellectual Resources**:
- [Resource 1]: [Why critical, owned vs. needed]
- [Resource 2]: [Why critical, owned vs. needed]

**Human Resources**:
- [Resource 1]: [Role, why critical, hiring plan]
- [Resource 2]: [Role, why critical, hiring plan]

**Physical Resources** (if applicable):
- [Resource 1]: [What, why critical, acquisition plan]

**Financial Resources**:
- Runway needed to profitability: $___ over ___ months
- Capital raised/available: $___

[2-3 paragraphs on resource strategy and acquisition plan]

---

## 7. Key Activities

### Core Activities (Ranked by Criticality)

1. **[Activity 1]**: [Description, in-house vs. outsourced]
2. **[Activity 2]**: [Description, in-house vs. outsourced]
3. **[Activity 3]**: [Description, in-house vs. outsourced]
4. **[Activity 4]**: [Description, in-house vs. outsourced]
5. **[Activity 5]**: [Description, in-house vs. outsourced]

**Activity Type**: [Production / Problem Solving / Platform/Network]

[2-3 paragraphs on activity strategy - what to own vs. outsource]

---

## 8. Key Partnerships

### Strategic Partnerships

**Partnership 1: [Partner Name/Type]**
- **Type**: [Technology / Distribution / Content / Strategic]
- **Value Exchanged**: [What you get / what they get]
- **Motivation**: [Why needed - optimization, risk reduction, resource access]
- **Risk**: [Dependency risk, mitigation strategy]

**Partnership 2: [Partner Name/Type]**
[Same structure]

**Partnership 3: [Partner Name/Type]**
[Same structure]

[2-3 paragraphs on partnership strategy]

---

## 9. Cost Structure

### Cost Breakdown

**Fixed Costs** (Monthly):
- Salaries: $___
- Infrastructure/Tools: $___
- Rent/Facilities: $___
- Other Fixed: $___
- **Total Fixed**: $___/month

**Variable Costs** (Per Customer):
- COGS per customer: $___
- Support cost per customer: $___
- Other variable: $___
- **Total Variable per Customer**: $___

**Cost Structure Type**: [Cost-Driven / Value-Driven]

### Financial Metrics

**Monthly Burn Rate** (if pre-revenue): $___/month
**Runway**: ___ months (Cash on hand: $___)

**Break-Even Analysis**:
- Contribution margin per customer: $___ (Revenue - Variable Cost)
- Break-even customers: ___ (Fixed Costs / Contribution Margin)
- Timeline to break-even: ___ months

**Path to Profitability**:
[2-3 paragraphs outlining how/when business becomes profitable]

**Major Cost Drivers** (% of total):
1. Personnel: ___%
2. Marketing/Sales: ___%
3. Infrastructure: ___%
4. COGS: ___%
5. Overhead: ___%

---

## 10. Strategic Coherence Analysis

### Alignment Check

**Value ↔ Revenue**: [Aligned / Misaligned - Explanation]
**Channels ↔ Segments**: [Aligned / Misaligned - Explanation]
**Activities ↔ Value**: [Aligned / Misaligned - Explanation]
**Resources ↔ Activities**: [Aligned / Misaligned - Explanation]
**Revenue ↔ Cost**: [Aligned / Misaligned - Explanation]

**Overall Coherence**: High / Medium / Low

**Identified Gaps**:
1. [Gap 1]: [Description and recommendation to fix]
2. [Gap 2]: [Description and recommendation to fix]

[2-3 paragraphs on overall model viability]

---

## Conclusion

[2-3 paragraphs summarizing business model viability]

**Business Model Viability**: High / Medium / Low

**Key Strengths**:
1. [Strength 1]
2. [Strength 2]
3. [Strength 3]

**Key Risks**:
1. [Risk 1]
2. [Risk 2]
3. [Risk 3]

**Next Steps**:
1. [Immediate action - e.g., validate pricing with 10 customer interviews]
2. [Secondary action - e.g., prototype MVP to test key activities]
3. [Tertiary action - e.g., formalize partnership with X]

---

## Key Outputs (For Context Chaining)
• **Project Directory**: {PROJECT_DIRECTORY_PATH}
• **Revenue Model**: {Subscription/Transaction/Usage-Based/Freemium/etc.}
• **Primary Segment**: {ICP description}
• **LTV:CAC Ratio**: {X.X}:1
• **Break-Even Timeline**: {X} months
• **Strategic Coherence**: {High/Medium/Low}
• **Business Model Viability**: {High/Medium/Low}

**Analysis Date**: {YYYY-MM-DD}
**Context Signature**: business-model-designer-v1.0.0
**Final Report**: {iteration count} iteration(s)

════════════════════════════════════════════════════════════════════════════════

*Generated with StratArts - Business Strategy Skills Library*
*Next recommended skill: `value-proposition-crafter`*
```

---

## Quality Gates

Before delivering the report, verify:

- [ ] All 9 Business Model Canvas blocks analyzed with depth
- [ ] Unit economics calculated (LTV, CAC, LTV:CAC ratio, payback period)
- [ ] Break-even analysis completed
- [ ] Revenue projections for Years 1, 3, 5 (if market data available)
- [ ] Strategic coherence check completed across all blocks
- [ ] Identified 2-3 gaps/misalignments with recommendations
- [ ] Report is comprehensive and covers all key areas
- [ ] Clear next steps provided

## Integration with Other Skills

**Skill Chaining**:
- **Input from**:
  - `idea-validator` (problem-solution fit, ICP, validation scores)
  - `market-opportunity-analyzer` (TAM/SAM/SOM, competitive landscape, beachhead market)
- **Output to**:
  - `value-proposition-crafter` (refine messaging for customer segments)
  - `pricing-strategy-architect` (deep-dive on pricing model)
  - `financial-model-architect` (Fundraising Pack - build full 3-statement model)
  - `go-to-market-planner` (execute channel strategy)

---

### Step 14: Iterative Refinement (Up to 3 Passes)

**IMPORTANT**: Track iteration count. Maximum 3 iterations total (Pass 1, Pass 2, Pass 3).

After generating the report, present this refinement option:

```
════════════════════════════════════════════════════════════════════════════════
Would you like to add any more information and further focus the output?
════════════════════════════════════════════════════════════════════════════════

a: Yes
b: No

Select option (a or b): _
```

**If user selects `a: Yes`**:
1. Respond: "**Proceed with further detail.**"
2. Collect their additional information/corrections
3. **Append** this new context to existing gathered data (do NOT discard previous context)
4. Regenerate the report incorporating ALL context (original + refinements)
5. Label the new report: "Report Version: Pass [X+1]"
6. At the start of the refined report, add: "**Refined based on**: [brief summary of what changed]"
7. Repeat this refinement question (up to Pass 3 maximum)

**If user selects `b: No`** OR iteration count = 3:
- Add note to report: "**Final Report** (X iterations)"
- Proceed to Step 15 (Output Processing)

**Context Preservation Rule**: Each iteration must **ADD TO** previous context, never replace. The final report should reflect the most complete, accurate understanding.

### Step 15: Output Processing Selections

After refinement is complete, present these options:

```
════════════════════════════════════════════════════════════════════════════════
OUTPUT PROCESSING — SELECT FORMAT
════════════════════════════════════════════════════════════════════════════════

1) Save output to file within the .strategy folder of the project directory?

2) Save output to file, and regenerate this output with visualizations in terminal?

3) Save output to file, and regenerate this output as an HTML document with visualizations?

Select option (1, 2, or 3): _
```

**ALL options save the text report first to this location:**
```
{PROJECT_DIRECTORY}/.strategy/foundation-strategy/business-model-designer-{YYYY-MM-DD-HHMMSS}.md
```

#### If user selects Option 1:
1. Save the markdown report
2. Confirm: "✓ Report saved to: .strategy/foundation-strategy/business-model-designer-{timestamp}.md"
3. Proceed to Step 16 (Skill Chaining)

#### If user selects Option 2:
1. Save the markdown report
2. Confirm: "✓ Text report saved to: .strategy/foundation-strategy/business-model-designer-{timestamp}.md"
3. Regenerate report with terminal ASCII visualizations:
   - Business Model Canvas Grid (9 blocks)
   - Revenue Model Breakdown
   - Unit Economics Summary (LTV, CAC, Ratio)
   - Cost Structure Waterfall
   - Break-Even Timeline
   - Strategic Coherence Scorecard
4. Display the visualization-enriched report in terminal
5. Present visualization output options:

```
════════════════════════════════════════════════════════════════════════════════
VISUALIZATION OUTPUT OPTIONS
════════════════════════════════════════════════════════════════════════════════

1) Save the visualized output to file within the .strategy folder of the project directory?

2) Save the visualized output to file, and regenerate as an HTML document with visualizations?

Select option (1 or 2): _
```

**Regardless of selection (1 or 2), save visualized terminal output to:**
```
{PROJECT_DIRECTORY}/.strategy/foundation-strategy/business-model-designer-{YYYY-MM-DD-HHMMSS}.txt
```

**If sub-option 1**: Proceed to Step 16 (Skill Chaining)
**If sub-option 2**: Generate interactive HTML (see Option 3 below), then proceed to Step 16

#### If user selects Option 3:
1. Save the markdown report
2. Confirm: "✓ Text report saved to: .strategy/foundation-strategy/business-model-designer-{timestamp}.md"
3. Generate interactive HTML report following the Editorial Template Specification below
4. Save HTML to:
```
{PROJECT_DIRECTORY}/.strategy/foundation-strategy/business-model-designer-{YYYY-MM-DD-HHMMSS}.html
```
5. Confirm: "✓ Interactive HTML report generated"
6. Display features:
```
💡 Features:
   • Professional editorial dark theme
   • Business Model Canvas visualization
   • Unit economics charts
   • Cost structure breakdown

   File path: {PROJECT_DIRECTORY}/.strategy/foundation-strategy/business-model-designer-{timestamp}.html
```
7. Proceed to Step 16 (Skill Chaining)

### Step 16: Skill Chaining

After any output option completes, ask about proceeding to the next skill:

```
════════════════════════════════════════════════════════════════════════════════
Would you like to proceed to the next Skill (value-proposition-crafter)?
════════════════════════════════════════════════════════════════════════════════

a: Yes
b: No

Select option (a or b): _
```

**If user selects `a: Yes`**:
- Launch the `value-proposition-crafter` skill
- The next skill will automatically detect this business model report and reuse:
  - Revenue Model
  - Primary Segment (ICP)
  - Value Proposition
  - Differentiation
  - Pricing Structure

**If user selects `b: No`**:
```
════════════════════════════════════════════════════════════════════════════════
STRATEGY SESSION COMPLETE
════════════════════════════════════════════════════════════════════════════════

✓ All outputs saved to .strategy/ directory

Thank you for using StratArts!
To resume later, run any skill from the recommended sequence.

════════════════════════════════════════════════════════════════════════════════
```

---

## Time Estimate

**Total Time**: 90-120 minutes
- Welcome & context detection: 5-10 minutes
- Data collection: 15-25 minutes
- BMC Blocks 1-5 (Customer-facing): 30-40 minutes
- BMC Blocks 6-9 (Operational): 20-30 minutes
- Strategic coherence: 10-15 minutes
- Refinement (optional): 5-10 minutes per iteration
- Output processing: 5-10 minutes

---

## HTML Editorial Template Reference

**CRITICAL**: When generating HTML output, you MUST read and follow the skeleton template files AND the verification checklist to maintain StratArts brand consistency.

### Template Files to Read (IN ORDER)

1. **Verification Checklist** (MUST READ FIRST):
   ```
   html-templates/VERIFICATION-CHECKLIST.md
   ```

2. **Base Template** (shared editorial structure):
   ```
   html-templates/base-template.html
   ```

3. **Skill-Specific Template** (content sections & charts):
   ```
   html-templates/business-model-designer.html
   ```

### How to Use Templates

1. Read `VERIFICATION-CHECKLIST.md` first - contains canonical CSS patterns that MUST be copied exactly
2. Read `base-template.html` - contains all shared CSS, layout structure, and Chart.js configuration
3. Read `business-model-designer.html` - contains skill-specific content sections, CSS extensions, and chart scripts
4. Replace all `{{PLACEHOLDER}}` markers with actual analysis data
5. Merge the skill-specific CSS into `{{SKILL_SPECIFIC_CSS}}`
6. Merge the content sections into `{{CONTENT_SECTIONS}}`
7. Merge the chart scripts into `{{CHART_SCRIPTS}}`

### Key Placeholders

| Placeholder | Description |
|-------------|-------------|
| `{{PAGE_TITLE}}` | "Business Model Canvas \| StratArts" |
| `{{KICKER}}` | "StratArts Business Model Design" |
| `{{TITLE}}` | "Business Model Canvas" |
| `{{SUBTITLE}}` | "{BUSINESS_NAME} - {DESCRIPTION}" |
| `{{PRIMARY_SCORE}}` | Model Viability score (X.X format) |
| `{{SCORE_LABEL}}` | "Model Viability" |
| `{{VERDICT}}` | VIABLE / NEEDS ITERATION / PIVOT |
| `{{LTV_VALUE}}` | Lifetime Value ($XXX) |
| `{{CAC_VALUE}}` | Customer Acquisition Cost ($XX) |
| `{{LTV_CAC_RATIO}}` | LTV:CAC ratio (X.X:1) |
| `{{BREAK_EVEN_MONTHS}}` | Months to break-even |
| `{{BMC_BLOCK_X}}` | Content for each BMC block (1-9) |

### Required Charts (6 total)

1. **unitEconomicsChart** - LTV vs CAC bar comparison
2. **costStructureChart** - Fixed vs Variable costs doughnut
3. **revenueProjectionChart** - 3-year revenue projection line
4. **coherenceRadarChart** - 5-axis strategic coherence radar
5. **revenueBreakdownChart** - Revenue streams doughnut
6. **breakEvenChart** - Path to profitability line

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

---

*This skill is part of StratArts Foundation & Strategy Skills*
*For advanced business model innovation, see: `business-model-innovation` (Market & Product Pack)*
