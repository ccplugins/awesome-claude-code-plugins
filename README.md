# Awesome Claude Code Plugins [![Awesome](https://awesome.re/badge.svg)](https://awesome.re)

[![English](https://img.shields.io/badge/English-Click-yellow)](README.md)
[![简体中文](https://img.shields.io/badge/简体中文-点击查看-orange)](README-zh.md)

Awesome Claude Code plugins — a curated list of slash commands, subagents, MCP servers, and hooks for Claude Code

* [What is Claude Code Plugin?](#what-is-claude-code-plugin)
* [Use Cases](#use-cases)
* [Plugins](#plugins)
    - [Official Claude Code Plugins](#official-claude-code-plugins)
    - [Workflow Orchestration](#workflow-orchestration)
    - [Automation DevOps](#automation-devops)
    - [Business Sales](#business-sales)
    - [Code Quality Testing](#code-quality-testing)
    - [Data Analytics](#data-analytics)
    - [Design UX](#design-ux)
    - [Development Engineering](#development-engineering)
    - [Documentation](#documentation)
    - [Git Workflow](#git-workflow)
    - [Marketing Growth](#marketing-growth)
    - [Project & Product Management](#project--product-management)
    - [Security, Compliance, & Legal](#security-compliance--legal)
* [Tutorials](#tutorials)
* [Contributing](#contributing)

## What is Claude Code Plugin?

[Claude Code Plugin](https://docs.claude.com/en/docs/claude-code/plugins) is lightweight package that let you customize and share your Claude Code setup.
 Each plugin can include any combination of:

- **Slash Commands** — Custom shortcuts for frequent operations
- **Subagents** — Purpose-built agents for specialized dev tasks
- **MCP Servers** — Integrations to tools and data sources via the Model Context Protocol
- **Hooks** — Extensions that modify Claude Code’s behavior at key workflow points

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
- [pr-review-toolkit](./plugins/pr-review-toolkit")
- [commit-commands](./plugins/commit-commands)
- [feature-dev](./plugins/feature-dev)
- [security-guidance](./plugins/security-guidance)

### Workflow Orchestration
- [angelos-symbo](./plugins/angelos-symbo)
- [ceo-quality-controller-agent](./plugins/ceo-quality-controller-agent)
- [claude-desktop-extension](./plugins/claude-desktop-extension)
- [lyra](./plugins/lyra)
- [model-context-protocol-mcp-expert](./plugins/model-context-protocol-mcp-expert)
- [plan-build-run](./plugins/plan-build-run)
- [problem-solver-specialist](./plugins/problem-solver-specialist)
- [studio-coach](./plugins/studio-coach)
- [ultrathink](./plugins/ultrathink)

### Automation DevOps
- [deployment-engineer](./plugins/deployment-engineer)
- [devops-automator](./plugins/devops-automator)
- [infrastructure-maintainer](./plugins/infrastructure-maintainer)
- [monitoring-observability-specialist](./plugins/monitoring-observability-specialist)
- [n8n-workflow-builder](./plugins/n8n-workflow-builder)

### Business Sales
- [b2b-project-shipper](./plugins/b2b-project-shipper)
- [customer-success-manager](./plugins/customer-success-manager)
- [enterprise-onboarding-specialist](./plugins/enterprise-onboarding-specialist)
- [finance-tracker](./plugins/finance-tracker)
- [pricing-packaging-specialist](./plugins/pricing-packaging-specialist)
- [product-sales-specialist](./plugins/product-sales-specialist)
- [support-responder](./plugins/support-responder)
- [technical-sales-engineer](./plugins/technical-sales-engineer)

### Code Quality Testing
- [api-tester](./plugins/api-tester)
- [bug-detective](./plugins/bug-detective)
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
- [test-file](./plugins/test-file)
- [test-results-analyzer](./plugins/test-results-analyzer)
- [test-writer-fixer](./plugins/test-writer-fixer)
- [unit-test-generator](./plugins/unit-test-generator)

### Data Analytics
- [analytics-reporter](./plugins/analytics-reporter)
- [data-scientist](./plugins/data-scientist)
- [experiment-tracker](./plugins/experiment-tracker)
- [feedback-synthesizer](./plugins/feedback-synthesizer)
- [trend-researcher](./plugins/trend-researcher)

### Design UX
- [brand-guardian](./plugins/brand-guardian)
- [joker](./plugins/joker)
- [mobile-ux-optimizer](./plugins/mobile-ux-optimizer)
- [onomastophes](./plugins/onomastophes)
- [ui-designer](./plugins/ui-designer)
- [ux-researcher](./plugins/ux-researcher)
- [visual-storyteller](./plugins/visual-storyteller)
- [whimsy-injector](./plugins/whimsy-injector)

### Development Engineering
- [ai-engineer](./plugins/ai-engineer)
- [api-integration-specialist](./plugins/api-integration-specialist)
- [backend-architect](./plugins/backend-architect)
- [code-architect](./plugins/code-architect)
- [desktop-app-dev](./plugins/desktop-app-dev)
- [enterprise-integrator-architect](./plugins/enterprise-integrator-architect)
- [flutter-mobile-app-dev](./plugins/flutter-mobile-app-dev)
- [frontend-developer](./plugins/frontend-developer)
- [mobile-app-builder](./plugins/mobile-app-builder)
- [project-curator](./plugins/project-curator)
- [python-expert](./plugins/python-expert)
- [rapid-prototyper](./plugins/rapid-prototyper)
- [react-native-dev](./plugins/react-native-dev)
- [vision-specialist](./plugins/vision-specialist)
- [web-dev](./plugins/web-dev)

### Documentation
- [analyze-codebase](./plugins/analyze-codebase)
- [changelog-generator](./plugins/changelog-generator)
- [codebase-documenter](./plugins/codebase-documenter)
- [context7-docs-fetcher](./plugins/context7-docs-fetcher)
- [documentation-generator](./plugins/documentation-generator)
- [generate-api-docs](./plugins/generate-api-docs)
- [openapi-expert](./plugins/openapi-expert)
- [update-claudemd](./plugins/update-claudemd)

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
- [content-creator](./plugins/content-creator)
- [growth-hacker](./plugins/growth-hacker)
- [instagram-curator](./plugins/instagram-curator)
- [reddit-community-builder](./plugins/reddit-community-builder)
- [tiktok-strategist](./plugins/tiktok-strategist)
- [twitter-engager](./plugins/twitter-engager)

### Project & Product Management
- [discuss](./plugins/discuss)
- [explore](./plugins/explore)
- [plan](./plugins/plan)
- [planning-prd-agent](./plugins/planning-prd-agent)
- [prd-specialist](./plugins/prd-specialist)
- [project-shipper](./plugins/project-shipper)
- [sprint-prioritizer](./plugins/sprint-prioritizer)
- [studio-producer](./plugins/studio-producer)
- [tool-evaluator](./plugins/tool-evaluator)
- [workflow-optimizer](./plugins/workflow-optimizer)

### Security, Compliance, & Legal
- [ai-ethics-governance-specialist](./plugins/ai-ethics-governance-specialist)
- [audit](./plugins/audit)
- [compliance-automation-specialist](./plugins/compliance-automation-specialist)
- [data-privacy-engineer](./plugins/data-privacy-engineer)
- [enterprise-security-reviewer](./plugins/enterprise-security-reviewer)
- [legal-advisor](./plugins/legal-advisor)
- [legal-compliance-checker](./plugins/legal-compliance-checker)


## Tutorials

You can host and share your own curated plugin marketplace using a simple Git repository with a `.claude-plugin/marketplace.json` file.
 Users can install your marketplace via:

```bash
# /plugin marketplace add ccplugins/marketplace
/plugin marketplace add user-or-org/repo-name
```

Then browse and install plugins from within Claude Code’s `/plugin` menu.

Example:

```bash
/plugin
/plugin install analyze-codebase
```

## Contributing

Contributions are welcome!
 You can add your favorite plugins, share best practices, or submit your own marketplace.