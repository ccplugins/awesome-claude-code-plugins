# Awesome Claude Code Plugins [![Awesome](https://awesome.re/badge.svg)](https://awesome.re)

[![English](https://img.shields.io/badge/English-Click-yellow)](README.md)
[![简体中文](https://img.shields.io/badge/简体中文-点击查看-orange)](README-zh.md)

Awesome Claude Code plugins — a curated list of slash commands, subagents, MCP servers, and hooks for Claude Code

* [What is Claude Code Plugin?](#what-is-claude-code-plugin)
* [Use Cases](#use-cases)
* [Plugins](#plugins)
    - [Official Claude Code Plugins](#official-claude-code-plugins)
    - [Workflow Orchestration](#workflow-orchestration)
    - [AI & Speech](#ai--speech)
    - [Automation DevOps](#automation-devops)
    - [Business Sales](#business-sales)
    - [Code Quality Testing](#code-quality-testing)
    - [Communication & Integrations](#communication--integrations)
    - [Data Analytics](#data-analytics)
    - [Audio & Media](#audio--media)
    - [Design UX](#design-ux)
    - [Development Engineering](#development-engineering)
    - [Documentation](#documentation)
    - [Git Workflow](#git-workflow)
    - [Marketing Growth](#marketing-growth)
    - [Project & Product Management](#project--product-management)
    - [Lifestyle & Entertainment](#lifestyle--entertainment)
    - [Security, Compliance, & Legal](#security-compliance--legal)
    - [MCP Servers](#mcp-servers)
    - [Thinking & Knowledge Management](#thinking--knowledge-management)
    - [Companion Apps & Tools](#companion-apps--tools)
    - [Knowledge Management](#knowledge-management)
* [External Marketplaces](#external-marketplaces)
    - [Skills & Frameworks](#skills--frameworks)
* [Resources](#resources)
* [Tutorials](#tutorials)
* [Marketplaces](#marketplaces)
* [Contributing](#contributing)

## What is Claude Code Plugin?
[Claude Code Plugin](https://docs.claude.com/en/docs/claude-code/plugins) is lightweight package that let you customize and share your Claude Code setup.
 Each plugin can include any combination of:

- **Slash Commands** — Custom shortcuts for frequent operations
- **Subagents** — Purpose-built agents for specialized dev tasks
- **MCP Servers** — Integrations to tools and data sources via the Model Context Protocol
- **Hooks** — Extensions that modify Claude Code's behavior at key workflow points

Install or disable them dynamically with the `/plugin` command — enabling you to keep your system context focused and lightweight.

## Use Cases

- **Enforce Standards:** Ensure specific hooks or workflows run consistently across your team
- **Support Users:** Package slash commands that simplify your framework or SDK usage
- **Share Workflows:** Publish debugging setups, deployment scripts, or testing harnesses
- **Connect Tools:** Integrate internal systems securely through MCP servers
- **Bundle Customizations:** Combine multiple extensions for a cohesive developer experience

## Plugins


### Official Claude Code Plugins
- [agent-sdk-dev](./plugins/agent-sdk-dev)
- [pr-review-toolkit](./plugins/pr-review-toolkit)
- [commit-commands](./plugins/commit-commands)
- [feature-dev](./plugins/feature-dev)
- [security-guidance](./plugins/security-guidance)

### Workflow Orchestration
- [agent-triforce](https://github.com/ArtemioPadilla/agent-triforce) - 3-agent PM/Dev/QA system with WHO checklist methodology. Prometeo (PM), Forja (Dev), Centinela (QA) with 24 checklists, 6 skills, and auto-generated HTML dashboard.
- [angelos-symbo](./plugins/angelos-symbo)
- [artel](https://github.com/NicolasPrimeau/artel) - Infrastructure for AI teams: shared semantic memory, tasks, agent-to-agent messages, and session handoffs across machines and LLM providers.
- **[claude-brain](https://github.com/toroleapinc/claude-brain)** — Sync and evolve your Claude Code brain across machines. Auto-syncs memory, skills, agents, rules, and CLAUDE.md via Git with LLM-powered semantic merge.
- [ceo-quality-controller-agent](./plugins/ceo-quality-controller-agent)
- [claude-recap](https://github.com/hatawong/claude-recap) — Per-topic session memory using Shell hooks — archives each conversation topic as a separate Markdown summary. Two hooks, bash + Node.js, 100% local.
- [claude-desktop-extension](./plugins/claude-desktop-extension)
- [equilateral-agents](https://github.com/Equilateral-AI/equilateral-agents-open-core) - 22 self-learning agents with memory, security review, code quality, deployment validation, and infrastructure checks
- [lyra](./plugins/lyra)
- [magebyte-power](https://github.com/MageByte-Zero/magebyte-power) — Production-incident-distilled Claude Code skill: 7-phase workflow with 4-round AI cross-verification that catches concurrency & idempotency bugs before prod
- [model-context-protocol-mcp-expert](./plugins/model-context-protocol-mcp-expert)
- [now-next-methodology](https://github.com/soutone/now-next-methodology) - Two-file task management system for Claude Code/OpenCode: NOW.md tracks current work, NEXT.md queues future tasks with /next command
- [problem-solver-specialist](./plugins/problem-solver-specialist)
- [reviewer-author-loop](./plugins/reviewer-author-loop)
- [studio-coach](./plugins/studio-coach)
- [tree-ring-memory](https://github.com/TerminallyLazy/tree-ring-memory-claude-plugin)
- [ultrathink](./plugins/ultrathink)
- [pro-workflow](https://github.com/rohitg00/pro-workflow) - Self-correcting memory, 17 skills, 6 agents, 16 commands, 23 hooks. Context engineering, parallel worktrees, and agent teams.
- [claude-reflect](./plugins/claude-reflect) - Self-learning system that captures corrections during sessions and syncs to CLAUDE.md with human review
- [agent-manager-skill](./plugins/agent-manager-skill)
- [conductor-orchestrator-superpowers](./plugins/conductor-orchestrator-superpowers)
- [context-mode](./plugins/context-mode)
- [Claude Forge](https://github.com/sangrokjung/claude-forge) — oh-my-zsh for Claude Code: 11 agents, 36 commands, 15 skills, 14 hooks, 6-layer security. Install in 5 min.
- [claude-memory-manager](https://github.com/WhymustIhaveaname/claude-memory-manager) - Global memory tier for Claude Code. Stores cross-project memories in ~/.claude/memory/, injects them via SessionStart hook. Includes a web UI for managing all memory files without digging through directories.
- [ultraship](./plugins/ultraship)
- [launch-swarm](https://github.com/harshmoney123/launch-swarm) - 6-agent Claude Code swarm with strict role separation, dual-gate merge pipeline, and prompt health anti-rot
- [cc-inspect](./plugins/cc-inspect)
- [omega-memory](./plugins/omega-memory)
- [idea-to-deploy](./plugins/idea-to-deploy)
- [nexus-agents](https://github.com/williamzujkowski/nexus-agents) — Multi-CLI orchestration with 30 MCP tools, 12 expert agents, 17 skills, and Budget→TOPSIS→LinUCB routing. Coordinates Claude, Gemini, Codex, and OpenCode via consensus voting.
- [bobusang](https://github.com/jun0-ds/bobusang) — Multi-device memory system for Claude Code. Syncs context across Windows, WSL2, and Linux with git-based auto-sync.
- [magic-cc-codex-worker](./plugins/magic-cc-codex-worker)
- [weft](./plugins/weft)
- [hyperflow](./plugins/hyperflow)
- [espresso](https://github.com/mirkobozzetto/espresso) - Full token-saving stack. Output compression, global rules, RTK, Caveman, GitNexus auto-config. Detects existing setup, installs only what's missing.
- [aicoo-skills](https://www.aicoo.io) - AI COO agent skills: share agent via links, agent-to-agent communication, autonomous heartbeat loops, context sync, Aicoo Square discovery board
- [devforge-ai](https://github.com/saitarrun/devforge-ai) — Agentic SDLC orchestration for Claude Code: 10 role-specific agents across Plan → Build → Verify → Ship → Operate phases with tracer bullet delivery
- [ai-meeting](./plugins/ai-meeting)
- [praetor](./plugins/praetor)
- [fable-baton](./plugins/fable-baton)
- [craftsman](./plugins/craftsman)
- [rote](./plugins/rote)
- [claude-session-tint](./plugins/claude-session-tint)

### AI & Speech
- [speech-ai](https://github.com/fasuizu-br/speech-ai-examples) - Speech AI plugin with pronunciation assessment, text-to-speech, and speech-to-text. 8 MCP tools for language learning, accessibility, and voice applications.

### Automation DevOps
- [PUIUX Pilot](https://github.com/PUIUX-Cloud/puiux-pilot) - Auto-configures Claude Code hooks, MCPs, and skills for any project. Scans 95+ project types, selects from 28+ hooks, scores quality (0-100, A-F). `npm i -g puiux-pilot`
- [deployment-engineer](./plugins/deployment-engineer)
- [devops-automator](./plugins/devops-automator)
- [MyVibe](https://www.myvibe.so) - Instant deployment with `/myvibe:publish`
- [infrastructure-maintainer](./plugins/infrastructure-maintainer)
- [kubestellar-console](./plugins/kubestellar-console)
- [monitoring-observability-specialist](./plugins/monitoring-observability-specialist)
- [n8n-workflow-builder](./plugins/n8n-workflow-builder)
- [qovery-deploy](https://github.com/Qovery/qovery-skills) - Deploy any app to Kubernetes on AWS/GCP/Azure/Scaleway. Creates Dockerfiles, provisions databases, deploys via CLI+API or Terraform. Install: `curl -fsSL https://skill.qovery.com/install.sh | bash`
- [screenshot-janitor](./plugins/screenshot-janitor)
- [aws-cost-saver](./plugins/aws-cost-saver)
- [prompt-chime](https://github.com/pick/prompt-chime) - Cross-platform notification plugin with meme sound presets, toast notifications, profiles, quiet hours, and per-project overrides.
- [cc-aws-keepalive](./plugins/cc-aws-keepalive)
- [claude-snapshot](https://github.com/adhenawer/claude-snapshot) - Portable `.tar.gz` snapshots of your Claude Code setup (settings, hooks, plugins, MCPs) with diff-before-apply and `.bak` rollback for migration and backup across machines.
- [notify](https://github.com/ApurvBazari/claude-plugins)
- [retro-daily](./plugins/retro-daily)

### Business Sales
- [Drevon](https://drevon.dev) - Mac desktop workspace for GTM engineers. Run parallel AI agents powered by Claude Code, Codex, or Copilot to build target lists, score accounts, and pull prospect intel.
- [b2b-project-shipper](./plugins/b2b-project-shipper)
- [customer-success-manager](./plugins/customer-success-manager)
- [enterprise-onboarding-specialist](./plugins/enterprise-onboarding-specialist)
- [finance-tracker](./plugins/finance-tracker)
- [mortgage](https://github.com/lendtrain/mortgage) - Mortgage refinance plugin by LendTrain — real-time institutional pricing, compliance, and FHA/VA loan detection via MCP. No API key required.
- [pricing-packaging-specialist](./plugins/pricing-packaging-specialist)
- [product-sales-specialist](./plugins/product-sales-specialist)
- [support-responder](./plugins/support-responder)
- [stratarts](./plugins/stratarts)
- [technical-sales-engineer](./plugins/technical-sales-engineer)
- [founder-toolkit](https://github.com/mooster/founder-toolkit) - 4 skills for startup founders: investor update writer (YC/a16z format), pitch deck reviewer (10-dimension VC scoring), SaaS metrics dashboard with benchmarks, and outreach lead scorer (ICP-first, tested on 300+ companies). Built by Mu Chen, CEO of Canopy Cloud ($120B+ AUM).
- [overloop-cli](./plugins/overloop-cli)
- [signals-cli](./plugins/signals-cli)

### Code Quality Testing
- [autoresearch](./plugins/autoresearch)
- [api-tester](./plugins/api-tester)
- [bug-detective](./plugins/bug-detective)
- [claudex](./plugins/claudex)
- [code-review](./plugins/code-review)
- [code-review-assistant](./plugins/code-review-assistant)
- [code-reviewer](./plugins/code-reviewer)
- [database-performance-optimizer](./plugins/database-performance-optimizer)
- [debug-session](./plugins/debug-session)
- [debugger](./plugins/debugger)
- [double-check](./plugins/double-check)
- [optimize](./plugins/optimize)
- [performance-benchmarker](./plugins/performance-benchmarker)
- [refractor](./plugins/refractor)
- [sdlc-wizard](https://github.com/BaseInfinity/agentic-ai-sdlc-wizard) - SDLC enforcement plugin with hooks for TDD gates, planning workflow, confidence levels, and cross-model review. Installs via `npx agentic-sdlc-wizard init`.
- [test-file](./plugins/test-file)
- [test-results-analyzer](./plugins/test-results-analyzer)
- [test-writer-fixer](./plugins/test-writer-fixer)
- [unit-test-generator](./plugins/unit-test-generator)
- [vibe-guard](https://github.com/ofershap/vibe-guard) - Always-on security guardrails for AI-generated code
- [think-first](https://github.com/ofershap/think-first) - Plan-before-code behavior modifier for agents
- [sonmat](https://github.com/jun0-ds/sonmat) — Verification discipline plugin with six reactive axes (guard, inspect, witness, punch, devil's advocate, scribe) for AI-human collaboration.
- [slm-mcp-hub](https://github.com/qualixar/slm-mcp-hub) - External: Universal MCP gateway federating 430+ tools from 37 servers through one endpoint. 75% RAM reduction.
- [tailtest](https://github.com/avansaber/tailtest) - Automatically generates and runs tests for every file Claude Code creates or modifies. PostToolUse hook detects changes, generates test scenarios, runs them, and surfaces failures. 8 languages (Python, TypeScript, JavaScript, Go, Ruby, PHP, Java, Rust). Zero config, zero commands.
- [adamsreview](./plugins/adamsreview)
- [slicewise](./plugins/slicewise)
- [bullpen](./plugins/bullpen)

### Communication & Integrations
- [whatsapp-claude-plugin](https://github.com/Rich627/whatsapp-claude-plugin) — WhatsApp channel plugin for Claude Code. Connects as a linked device via Baileys v7 with bidirectional messaging, full media support, voice transcription, permission relay, and access control.

### Data Analytics
- [alphai](./plugins/alphai)
- [analytics-reporter](./plugins/analytics-reporter)
- [crypto-trading-desk](./plugins/crypto-trading-desk)
- [data-scientist](./plugins/data-scientist)
- [dna-claude-analysis](./plugins/dna-claude-analysis)
- [experiment-tracker](./plugins/experiment-tracker)
- [feedback-synthesizer](./plugins/feedback-synthesizer)
- [newsmcp](https://github.com/pranciskus/newsmcp) — Real-time world news for AI agents — events clustered from hundreds of sources, classified by 12 topics and 30+ geographic regions, ranked by importance. Free, no API key required.
- [trend-researcher](./plugins/trend-researcher)
- [wellnizz](./plugins/wellnizz)
- [xpoz-brand-intelligence](./plugins/xpoz-brand-intelligence) - Brand sentiment, competitive analysis, and influencer discovery using real-time Twitter/X data
- [x-twitter-scraper](./plugins/x-twitter-scraper)
- [claude-ecom](./plugins/claude-ecom)
- [XVARY Stock Research](https://github.com/xvary-research/claude-code-stock-analysis-skill) — Claude Code skill for public SEC EDGAR + market data: `/analyze`, `/score`, `/compare`. MIT.
- [flex-claudecode](./plugins/flex-claudecode)
- [ai-dev-jobs-search](./plugins/ai-dev-jobs-search)
- [nhs-mcp-search](./plugins/nhs-mcp-search)
- [session-tax](./plugins/session-tax)

### Audio & Media
- [bibigpt-skill](https://github.com/JimmyLv/bibigpt-skill) - AI-powered video, audio & podcast summarization

### Design UX
- [brand-guardian](./plugins/brand-guardian)
- [joker](./plugins/joker)
- [journey-mapper](./plugins/journey-mapper)
- [mobile-ux-optimizer](./plugins/mobile-ux-optimizer)
- [nano-banana](https://github.com/Ibrahim-3d/nano-banana-claude-plugin) - Google Gemini image generation plugin. Text-to-image, text-guided image editing, style transfer, 4K output, search grounding, and multi-reference composition via `/genimage`. Uses `gemini-2.5-flash-image` (fast) and `gemini-3-pro-image-preview` (4K/search).
- [onomastophes](./plugins/onomastophes)
- [ui-designer](./plugins/ui-designer)
- [ux](https://github.com/Laith0003/ux-skill)
- [ux-researcher](./plugins/ux-researcher)
- [visual-storyteller](./plugins/visual-storyteller)
- [whimsy-injector](./plugins/whimsy-injector)
- [claude-bionify](./plugins/claude-bionify)

### Development Engineering
- [claude-sounds](https://github.com/culminationAI/claude-sounds)
- [ai-engineer](./plugins/ai-engineer)
- [claw-army/claude-node](https://github.com/claw-army/claude-node) - Python subprocess bridge for Claude Code CLI, giving Python code direct access to Claude Code native capabilities via stream-json.
- [api-integration-specialist](./plugins/api-integration-specialist)
- [backend-architect](./plugins/backend-architect)
- [blueprint](https://github.com/JuliusBrussee/blueprint)
- [code-architect](./plugins/code-architect)
- [context-memory](./plugins/context-memory)
- [desktop-app-dev](./plugins/desktop-app-dev)
- [enterprise-integrator-architect](./plugins/enterprise-integrator-architect)
- [flutter-mobile-app-dev](./plugins/flutter-mobile-app-dev)
- [frontend-developer](./plugins/frontend-developer)
- [ios-app-dev-skills](https://github.com/JasonColapietro/ios-app-dev-skills)
- [mobile-app-builder](./plugins/mobile-app-builder)
- [html-report](https://github.com/panhongwei/html-report)
- [project-curator](./plugins/project-curator)
- [python-expert](./plugins/python-expert)
- [rapid-prototyper](./plugins/rapid-prototyper)
- [react-native-dev](./plugins/react-native-dev)
- [silicon-friendly](./plugins/silicon-friendly)
- [vision-specialist](./plugins/vision-specialist)
- [web-dev](./plugins/web-dev)
- [tailwind-best-practices](https://github.com/ofershap/tailwind-best-practices) - Tailwind CSS v4 patterns — stop agents from generating v3 code
- [typescript-best-practices](https://github.com/ofershap/typescript-best-practices) - Modern TypeScript — strict mode, discriminated unions, satisfies
- [python-best-practices](https://github.com/ofershap/python-best-practices) - Modern Python 3.12+ — type hints, async, Pydantic v2
- [sveltekit-best-practices](https://github.com/ofershap/sveltekit-best-practices) - SvelteKit — Svelte 5 runes, load functions, form actions
- [drizzle-best-practices](https://github.com/ofershap/drizzle-best-practices) - Drizzle ORM — schema design, relations, type-safe queries
- [fastapi-best-practices](https://github.com/ofershap/fastapi-best-practices) - FastAPI — async, dependency injection, Pydantic v2
- [shadcn-best-practices](https://github.com/ofershap/shadcn-best-practices) - shadcn/ui — component customization, forms, theming
- [expo-best-practices](https://github.com/ofershap/expo-best-practices) - Expo/React Native — navigation, EAS Build, platform splits
- [flutter-best-practices](https://github.com/ofershap/flutter-best-practices) - Flutter/Dart 3 — GoRouter, Riverpod, sealed classes
- [go-best-practices](https://github.com/ofershap/go-best-practices) - Modern Go — error wrapping, slog, context, goroutine lifecycle
- [image-link](./plugins/image-link)
- [agentkits-memory](./plugins/agentkits-memory)
- [lightcms](./plugins/lightcms)
- [deapi-media](./plugins/deapi-media)
- [reporecall](https://github.com/proofofwork-agency/reporecall) - Local codebase memory for Claude Code. AST indexing (22 languages), call graphs, hybrid search. Injects context via hooks (~5ms). Also an MCP server.
- [dotforge](https://github.com/luiseiman/dotforge) - Configuration factory for Claude Code — 17 skills, 7 agents, 15 stacks, audit scoring (0-10), practices pipeline.
- [slack-message-formatter](./plugins/slack-message-formatter)
- [cc-hud](https://github.com/WaterTian/cc-hud) — Compact single-line statusline: model name, context usage bar, active subagents, rate limits. Zero dependencies.
- [vara-skills](./plugins/vara-skills)
- [superlocalmemory](https://github.com/qualixar/superlocalmemory) - External: Persistent memory + learning MCP server for Claude Code. Zero-cloud, 6-channel retrieval, 16K+ monthly downloads. Backed by 3 arXiv papers.
- [skill-auto-installer](./plugins/skill-auto-installer)
- [tldr](./plugins/tldr)
- [Imagine](https://github.com/freestyler-arb/imagine-gemini-for-claude-codex) - Brings Google Gemini into Claude Code & Codex: delegate reasoning, independent code review, deep research, and automatic prompt-engineering. Runs on your Google AI Pro subscription, not your agent's tokens.

### Documentation
- [analyze-codebase](./plugins/analyze-codebase)
- [changelog-generator](./plugins/changelog-generator)
- [codebase-documenter](./plugins/codebase-documenter)
- [context7-docs-fetcher](./plugins/context7-docs-fetcher)
- [dev-report](./plugins/dev-report)
- [documentation-generator](./plugins/documentation-generator)
- [generate-api-docs](./plugins/generate-api-docs)
- [openapi-expert](./plugins/openapi-expert)
- [update-claudemd](./plugins/update-claudemd)
- [readme-best-practices](https://github.com/ofershap/readme-best-practices) - Stop agents from writing dry API-doc READMEs
- [prompt-compression](https://github.com/ofershap/prompt-compression) - Compress docs/prompts into minimal tokens for AGENTS.md
- [conversation-memory](https://github.com/ofershap/conversation-memory) - Give agents memory across sessions
- [ai-humanizer](https://github.com/ofershap/ai-humanizer) - Remove AI-detectable patterns from generated content
- [llm-wiki](https://github.com/praneybehl/llm-wiki-plugin) - Build a compounding, LLM-curated personal knowledge base in any project (Karpathy's LLM Wiki pattern). Skill + 5 `/wiki:*` commands with sharded indexes, BM25 search, and a structural lint script.
- [swarmvault](./plugins/swarmvault)
- [verifying-phd-citations](./plugins/verifying-phd-citations)
- [thermal-fluid-research-workflow](./plugins/thermal-fluid-research-workflow)
- [trigger-tree](https://github.com/Hedde/trigger_tree)

### Git Workflow
- [analyze-issue](./plugins/analyze-issue)
- [bug-fix](./plugins/bug-fix)
- [commit](./plugins/commit)
- [create-pr](./plugins/create-pr)
- [create-pull-request](./plugins/create-pull-request)
- [create-worktrees](./plugins/create-worktrees)
- [fix-github-issue](./plugins/fix-github-issue)
- [fix-issue](./plugins/fix-issue)
- [fix-pr](./plugins/fix-pr)
- [github-issue-fix](./plugins/github-issue-fix)
- [husky](./plugins/husky)
- [pr-issue-resolve](./plugins/pr-issue-resolve)
- [pr-review](./plugins/pr-review)
- [update-branch-name](./plugins/update-branch-name)

### Marketing Growth
- [app-store-optimizer](./plugins/app-store-optimizer)
- [claude-rank](https://github.com/Houseofmvps/claude-rank) - SEO/GEO/AEO audit with 170+ rules, auto-fix for robots.txt/sitemap.xml/llms.txt/JSON-LD
- [content-creator](./plugins/content-creator)
- [growth-hacker](./plugins/growth-hacker)
- [Hermes Tweet](https://github.com/Xquik-dev/hermes-tweet) - Native Hermes Agent plugin for X/Twitter research, monitoring, drafting, follower exports, and approval-gated actions.
- [instagram-curator](./plugins/instagram-curator)
- [poppify](./plugins/poppify) — photo-led short-form vertical reels (Instagram/TikTok/YouTube Shorts/Facebook) via MCP, $0.06/render, 50 free seeds, no subscription
- [reddit-community-builder](./plugins/reddit-community-builder)
- [taisly-agent-kit](https://github.com/taisly/agent)
- [tiktok-strategist](./plugins/tiktok-strategist)
- [toprank](./plugins/toprank)
- [twitter-engager](./plugins/twitter-engager)
- [wondelai-skills](https://github.com/wondelai/skills)
- [agentkits-marketing](./plugins/agentkits-marketing)
- [claude-code-marketing-skills](https://github.com/cognyai/claude-code-marketing-skills) - AI marketing skills: SEO Audit, Landing Page Review, Competitor Analysis, Ad Copy Writer, Lead Qualification. 5 free + premium via Cogny MCP
- [unslop](./plugins/unslop)
- [claude-persona](./plugins/claude-persona)
- [Pulse](https://septimlabs.com/pulse?utm_source=awesome-list&utm_campaign=ccplugins) - Claude Code sub-agent that scores your X (Twitter) drafts against the published [twitter/the-algorithm](https://github.com/twitter/the-algorithm) heavy-ranker weights (+75 `reply_engaged_by_author`, -74 `negative_feedback_v2`, link tax, etc.) **before** you post. Outputs a 0-100 score, 5-axis breakdown, ship/rewrite verdict, and 3-5 concrete rewrites cited to which axis lifts. Drops into `~/.claude/agents/pulse.md`. Open-source sample: [github.com/septimlabs-code/septim-agents-pack-sample](https://github.com/septimlabs-code/septim-agents-pack-sample). $49 founding rate thru Mon 2026-05-26 ($79 after). [septimlabs.com/pulse](https://septimlabs.com/pulse)
- [social-media-publisher](./plugins/social-media-publisher)
- [Diffmode Growth Tactics](https://github.com/acogood/diffmode_free) — free plugin + marketplace that runs a growth-strategy pipeline: a competitor read, a buyer jobs-to-be-done map, and 7–9 unconventional acquisition tactics for bootstrapped founders. Claude Code + Codex, Apache-2.0.
- [notfair](./plugins/notfair)
- [social-vision](./plugins/social-vision)
- [x-skills](https://github.com/sergebulaev/x-skills)
- [yaohe](./plugins/yaohe)

### Project & Product Management
- [bleu](https://github.com/Nirvaan05/Bleu-plugin)
- [discuss](./plugins/discuss)
- [explore](./plugins/explore)
- [fractal](https://github.com/rmolines/fractal) - Recursive project management plugin. Decomposes any goal into verifiable predicates, works on the riskiest unknown first. Features `/fractal:run` (idempotent state machine), `/fractal:init`, `/fractal:patch`, dry run mode, and incremental decomposition with re-evaluation.
- [plan](./plugins/plan)
- [planning-prd-agent](./plugins/planning-prd-agent)
- [plannotator](https://github.com/backnotprop/plannotator) - Interactive plan review UI with visual annotation (install via `/plugin marketplace add backnotprop/plannotator`)
- [prd-specialist](./plugins/prd-specialist)
- [product-manager-skills](https://github.com/Digidai/product-manager-skills) - Senior PM agent with 30+ frameworks, 32 SaaS metrics with exact formulas, 12 templates, and anti-pattern detection. Pure Markdown, MIT-0 license.
- [project-shipper](./plugins/project-shipper)
- [sprint-prioritizer](./plugins/sprint-prioritizer)
- [studio-producer](./plugins/studio-producer)
- [tool-evaluator](./plugins/tool-evaluator)
- [tycana](./plugins/tycana)
- [workflow-optimizer](./plugins/workflow-optimizer)
- [prd-generator](https://github.com/dredozubov/prd-generator) — Self-contained PRD generator from conversation context
- [agent-decision-record](./plugins/agent-decision-record)
- [product-org-os](./plugins/product-org-os)
- [governor](https://github.com/0xhimanshu/governor)

### Lifestyle & Entertainment
- [ai-divination-skills](./plugins/ai-divination-skills)

### Security, Compliance, & Legal
- [ai-ethics-governance-specialist](./plugins/ai-ethics-governance-specialist)
- [audit](./plugins/audit)
- [compliance-automation-specialist](./plugins/compliance-automation-specialist)
- [data-privacy-engineer](./plugins/data-privacy-engineer)
- [enterprise-security-reviewer](./plugins/enterprise-security-reviewer)
- [security-sweep](https://github.com/Onome-AJ/security-sweep-plugin) - Comprehensive security scanner covering OWASP Top 10 (2025), Mobile Top 10 (2024), and LLM Top 10 (2025). Scans for hardcoded secrets, injection flaws, auth issues, misconfigurations, AI-specific vulnerabilities, mobile security, and data exposure.
- [legal-advisor](./plugins/legal-advisor)
- [legal-compliance-checker](./plugins/legal-compliance-checker)
- [openclaw-security](https://github.com/AtlasPA/openclaw-security) - 11-tool security suite for agent workspaces: integrity scanning, secret detection, permission auditing, network DLP, supply-chain checks, injection defense, credential lifecycle, compliance enforcement, audit trails, cryptographic signing, and incident response.
- [privacy-mask](https://github.com/fullstackcrew-alpha/privacy-mask) - Detect and redact PII, API keys, and secrets in screenshots via OCR + regex before images reach Claude. 47 detection rules, Tesseract/RapidOCR support, UserPromptSubmit hook integration. 100% offline.
- [skillfortify](https://github.com/qualixar/skillfortify) - External: Formal verification scanner for AI agent skills (including Claude Code skills + MCP servers). 100% precision on 540-skill benchmark. ASBOM generation. arXiv:2603.00195.
- [shellgate](./plugins/shellgate)
- [huiyu-safe-ai](https://github.com/huiyu9144/huiyu-safe-ai) - Lightweight AI security guard for install/download commands. Blocks 68+ malicious packages, verifies identity, scans code in <1s. Built from a real supply chain attack.
- [web-security-guard](./plugins/web-security-guard)
- [supply-chain-gate](./plugins/supply-chain-gate)
- [agent-safety-preflight](./plugins/agent-safety-preflight)

### MCP Servers
- [AccInt](https://github.com/maxbaluev/accreted-intelligence) — Local-first Work Model MCP server and Claude Code/Codex/OpenCode plugin. Tools: `acc_retrieve`, `acc_act`; official registry `io.github.maxbaluev/accint`.
- [lazymac/mcp](https://github.com/lazymac2x/lazymac-mcp) — Unified MCP server exposing 42+ developer tools (qr, ip-geo, ai-cost, llm-router, k-privacy, korean-nlp) backed by Cloudflare Workers. `npx -y @lazymac/mcp`
- [lazymac/k-mcp](https://github.com/lazymac2x/lazymac-k-mcp) — Korean wedge MCP — PIPA compliance, KRW + BOK rates, 사업자등록번호 lookup, address geocoding, NLP. `npx -y @lazymac/k-mcp`
- [Lobex](https://github.com/chrisgu/lobex-mcp) - Agent-to-agent marketplace. Remote MCP `https://lobex.app/mcp` + stdio client. Site: https://lobex.app
- [mcp-interactive-terminal](https://github.com/amol21p/mcp-interactive-terminal) — Real interactive terminal sessions for REPLs, SSH, database clients, and any interactive CLI — with clean text output, smart completion detection, and multi-layer security. Install: `claude mcp add terminal -- npx -y mcp-interactive-terminal`
* [SkillFlow](https://github.com/rafsilva85/skillflow-mcp-server) - AI Skills Marketplace discovery server. Search, compare, and get installation instructions for curated MCP servers and AI agent tools.
- [WhichModel](https://github.com/Which-Model/whichmodel-mcp) — AI model pricing & recommendation MCP server for Claude Code. Helps choose the right model for every task at the best price. Cross-verified data updated every 4 hours. MCP endpoint: `https://whichmodel.dev/mcp`
- [Synder Importer MCP](https://github.com/SynderAccounting/gl-importer-plugin) — Official Synder plugin. Import CSV/XLSX accounting data into QuickBooks Online or Xero via the [Synder Importer API](https://importer.synder.com). 19 MCP tools covering imports, field mapping rules, post-import rules, and entity discovery. Bundles the `gl-importer` agent skill.
- [AgentIQ / MoltAd](https://github.com/chrisgu/agentiq-mcp) — Publisher MCP: list placements, `deliver_ad`, earn credits. https://moltad.net/publishers · https://moltad.net/mcp
- [BuyWhere](https://github.com/BuyWhere/buywhere-mcp) — Agent-native product catalog MCP. 370M+ live products across SG/MY/VN/TH/PH/US/JP with `deliver_to` shipping signals. 13 tools: `search_products`, `find_best_price`, `get_deals`, `compare_products`, etc. OAuth 2.1 bearer auth (no email/signup). Hosted at `https://mcp.buywhere.ai/mcp`. Official registry `io.github.BuyWhere/buywhere-mcp@1.1.0`. Install: `npx -y @buywhere/buywhere-mcp`.

### Thinking & Knowledge Management
- [thinking-tree](https://github.com/CoralLips/thinking-tree)

### Companion Apps & Tools
- [Onepilot](https://onepilotapp.com) — iOS app to SSH into remote servers and run Claude Code from your phone

### Knowledge Management
- [bedrock](./plugins/bedrock)

## External Marketplaces

Community-maintained plugin marketplaces you can add to access additional plugins.

| Marketplace | Description | Install |
|-------------|-------------|---------|
| [ykdojo/claude-code-tips](https://github.com/ykdojo/claude-code-tips?tab=readme-ov-file#install-the-dx-plugin) | dx plugin: GitHub Actions analysis (`/gha`), conversation cloning (`/clone`, `/half-clone`), context handoffs (`/handoff`), Reddit fetching (`/reddit-fetch`) | `claude plugin marketplace add ykdojo/claude-code-tips` then `claude plugin install dx@ykdojo` |


### Skills & Frameworks
- [aurakit](https://github.com/smorky850612/Aurakit) — All-in-one Claude Code skill: 46 modes, 23 sub-agents, 6-layer OWASP security, 10 lifecycle hooks, ~55% token savings. Cross-platform (Codex, Cursor, Manus, Windsurf). Install: `npx @smorky85/aurakit`

## Resources
- [Claudebin](https://claudebin.com) ([GitHub](https://github.com/wunderlabs-dev/claudebin.com/)) - A minimalistic tool for publishing and sharing Claude coding sessions.

## Tutorials

You can host and share your own curated plugin marketplace using a simple Git repository with a `.claude-plugin/marketplace.json` file.
 Users can install your marketplace via:

```bash
# /plugin marketplace add ccplugins/marketplace
/plugin marketplace add user-or-org/repo-name
```

Then browse and install plugins from within Claude Code's `/plugin` menu.

Example:

```bash
/plugin
/plugin install analyze-codebase
```

## Marketplaces

- [AgentStore](https://github.com/techgangboss/agentstore) - Open-source plugin marketplace with gasless USDC payments. Install via `/plugin marketplace add techgangboss/agentstore`. Publishers earn 80% of sales. Agent-first API for zero-auth publishing.
- [protonium](https://github.com/protonium-labs/protonium-marketplace) — AI agents and productivity tools. Includes **AxiomCore**, a project & routine management agent: enforced structure (numbered folders, task IDs, wiki memory), plan → approve → execute workflow, agile or WBS project creation.

## Contributing

Contributions are welcome!
 You can add your favorite plugins, share best practices, or submit your own marketplace.
