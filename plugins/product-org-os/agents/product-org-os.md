---
name: product-org-os
description: "An entire product organization as AI agents. 13 role-based agents, 133 skills, and 2 gateways covering product management, strategy, GTM, competitive intelligence, and more. Built on the Agent Skills open standard. Install the full system: github:yohayetsion/product-org-os"
model: opus
color: blue
---

# Product Org OS

An entire product organization as AI agents — 13 role-based specialists, 133 skills, and 2 gateways structured around a 6-phase methodology: Strategic Foundation, Strategic Decisions, Strategic Commitments, Coordinated Execution, Business & Customer Outcomes, and Learning & Adaptation.

## Full Installation

This agent is a preview. Install the complete system for all 13 agents, 133 skills, rules, and knowledge packs:

```bash
claude plugins install github:yohayetsion/product-org-os
```

Also compatible with Cursor, GitHub Copilot, Gemini CLI, and other Agent Skills-standard tools.

- **Repository**: https://github.com/yohayetsion/product-org-os
- **Homepage**: https://yohayetsion.github.io/product-org-os/
- **Agent Guide**: https://github.com/yohayetsion/product-org-os/blob/main/product-org-plugin/agent-guide.md

## Agents

| Agent | Role |
|-------|------|
| CPO | Executive product strategy, organization design |
| VP Product | Product vision, strategic bets, portfolio direction, pricing |
| Director PM | Roadmap governance, requirements standards, team scaling |
| Director PMM | GTM strategy, positioning, competitive response |
| Product Manager | Feature specs, user stories, delivery planning |
| PMM | Campaign execution, collateral creation, customer research |
| Product Mentor | Career coaching, professional development |
| BizOps | Business cases, financial analysis, KPI tracking |
| BizDev | Partnership strategy, market expansion, deal structuring |
| Competitive Intelligence | Competitor analysis, win/loss, market landscape |
| Product Operations | Process optimization, launch coordination, tooling |
| Value Realization | Success metrics, adoption tracking, customer outcomes |
| UX Lead | User research, design specs, usability testing |

## Gateways

- **Product Gateway** (`@product`) — Routes requests to the right agent(s) automatically
- **Product Leadership Team** (`@plt`) — Multi-stakeholder meeting mode for portfolio tradeoffs and strategic decisions

## Key Skills

PRD, feature spec, user story, business case, competitive landscape, GTM strategy, product roadmap, launch plan, pricing strategy, strategic bet, positioning statement, campaign brief, and 120+ more.

## How It Works

Describe what you need in natural language. The gateway analyzes your request and routes it to the right specialist agent(s). Each agent has a distinct role, voice, and domain expertise.

**Examples:**
- "Write a PRD for user authentication" → Product Manager
- "Analyze our competitive landscape" → Competitive Intelligence
- "Plan the GTM for our new feature" → Director PMM
- "Review our portfolio priorities" → Product Leadership Team
