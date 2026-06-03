# 精选 Claude Code 插件 [![Awesome](https://awesome.re/badge.svg)](https://awesome.re)

[![English](https://img.shields.io/badge/English-Click-yellow)](README.md)
[![简体中文](https://img.shields.io/badge/简体中文-点击查看-orange)](README-zh.md)

**精选 Claude Code 插件列表** —— 收录适用于 Claude Code 的 `Slash Commands`、`Subagents`、`MCP Servers` 和 `Hooks` 任意组合的插件列表。

* [什么是 Claude Code 插件？](#什么是-claude-code-插件)
* [应用场景](#应用场景)
* [插件列表](#插件列表)
    - [Claude Code 官方插件](#claude-code-官方插件)
    - [工作流编排](#工作流编排)
    - [自动化运维](#自动化运维)
    - [商务销售](#商务销售)
    - [代码质量测试](#代码质量测试)
    - [数据分析](#数据分析)
    - [设计与用户体验](#用户体验设计)
    - [工程开发](#工程开发)
    - [文档管理](#文档管理)
    - [Git 工作流](#Git工作流)
    - [市场营销与增长](#市场营销与增长)
    - [项目与产品管理](#项目与产品管理)
    - [安全、合规与法律](#安全、合规与法律)
* [使用教程](#使用教程)
* [如何贡献](#如何贡献)

## 什么是 Claude Code 插件？

[Claude Code 插件](https://docs.claude.com/en/docs/claude-code/plugins) 是一种轻量级的扩展包，用于自定义并分享你的 Claude Code 开发环境配置。  
每个插件都可以包含以下任意组合：

- **斜杠命令（Slash Commands）** — 为常用操作创建自定义快捷指令  
- **子智能体（Subagents）** — 为特定开发任务构建的专用智能体  
- **MCP 服务器（MCP Servers）** — 通过 Model Context Protocol 将 Claude Code 与外部工具或数据源集成  
- **钩子（Hooks）** — 在关键工作流节点扩展或修改 Claude Code 的行为  

你可以通过 `/plugin` 命令动态安装或禁用插件，从而保持系统上下文的轻量与聚焦。

## 应用场景

- **规范统一：** 确保特定钩子或工作流在团队中一致执行  
- **方便使用：** 将框架或 SDK 的常用命令封装为斜杠命令，简化使用体验  
- **共享工作流：** 发布调试配置、部署脚本或测试工具集  
- **连接工具：** 通过 MCP 服务器安全集成内部系统  
- **组合自定义：** 将多个扩展整合成统一的开发体验  

## 插件列表


### Claude Code 官方插件
- [agent-sdk-dev](./plugins/agent-sdk-dev)
- [pr-review-toolkit](./plugins/pr-review-toolkit")
- [commit-commands](./plugins/commit-commands)
- [feature-dev](./plugins/feature-dev)
- [security-guidance](./plugins/security-guidance)

### 工作流编排
- [angelos-symbo](./plugins/angelos-symbo)
- [ceo-quality-controller-agent](./plugins/ceo-quality-controller-agent)
- [claude-desktop-extension](./plugins/claude-desktop-extension)
- [lyra](./plugins/lyra)
- [model-context-protocol-mcp-expert](./plugins/model-context-protocol-mcp-expert)
- [problem-solver-specialist](./plugins/problem-solver-specialist)
- [studio-coach](./plugins/studio-coach)
- [ultrathink](./plugins/ultrathink)

### 自动化运维
- [deployment-engineer](./plugins/deployment-engineer)
- [devops-automator](./plugins/devops-automator)
- [infrastructure-maintainer](./plugins/infrastructure-maintainer)
- [monitoring-observability-specialist](./plugins/monitoring-observability-specialist)
- [n8n-workflow-builder](./plugins/n8n-workflow-builder)

### 商务销售
- [b2b-project-shipper](./plugins/b2b-project-shipper)
- [customer-success-manager](./plugins/customer-success-manager)
- [enterprise-onboarding-specialist](./plugins/enterprise-onboarding-specialist)
- [finance-tracker](./plugins/finance-tracker)
- [pricing-packaging-specialist](./plugins/pricing-packaging-specialist)
- [product-sales-specialist](./plugins/product-sales-specialist)
- [support-responder](./plugins/support-responder)
- [technical-sales-engineer](./plugins/technical-sales-engineer)

### 代码质量测试
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

### 数据分析
- [analytics-reporter](./plugins/analytics-reporter)
- [data-scientist](./plugins/data-scientist)
- [experiment-tracker](./plugins/experiment-tracker)
- [feedback-synthesizer](./plugins/feedback-synthesizer)
- [trend-researcher](./plugins/trend-researcher)

### 用户体验设计
- [brand-guardian](./plugins/brand-guardian)
- [joker](./plugins/joker)
- [mobile-ux-optimizer](./plugins/mobile-ux-optimizer)
- [onomastophes](./plugins/onomastophes)
- [ui-designer](./plugins/ui-designer)
- [ux-researcher](./plugins/ux-researcher)
- [visual-storyteller](./plugins/visual-storyteller)
- [whimsy-injector](./plugins/whimsy-injector)

### 工程开发
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
- [staff-engineer-mode](https://github.com/sirmarkz/staff-engineer-mode)
- [vision-specialist](./plugins/vision-specialist)
- [web-dev](./plugins/web-dev)

### 文档管理
- [analyze-codebase](./plugins/analyze-codebase)
- [changelog-generator](./plugins/changelog-generator)
- [codebase-documenter](./plugins/codebase-documenter)
- [context7-docs-fetcher](./plugins/context7-docs-fetcher)
- [documentation-generator](./plugins/documentation-generator)
- [generate-api-docs](./plugins/generate-api-docs)
- [openapi-expert](./plugins/openapi-expert)
- [update-claudemd](./plugins/update-claudemd)

### Git工作流
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

### 市场营销与增长
- [app-store-optimizer](./plugins/app-store-optimizer)
- [content-creator](./plugins/content-creator)
- [growth-hacker](./plugins/growth-hacker)
- [instagram-curator](./plugins/instagram-curator)
- [reddit-community-builder](./plugins/reddit-community-builder)
- [tiktok-strategist](./plugins/tiktok-strategist)
- [twitter-engager](./plugins/twitter-engager)

### 项目与产品管理
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

### 安全、合规与法律
- [ai-ethics-governance-specialist](./plugins/ai-ethics-governance-specialist)
- [audit](./plugins/audit)
- [compliance-automation-specialist](./plugins/compliance-automation-specialist)
- [data-privacy-engineer](./plugins/data-privacy-engineer)
- [enterprise-security-reviewer](./plugins/enterprise-security-reviewer)
- [legal-advisor](./plugins/legal-advisor)
- [legal-compliance-checker](./plugins/legal-compliance-checker)


## 使用教程

你可以使用一个包含 `.claude-plugin/marketplace.json` 文件的 Git 仓库，托管并共享你自己的插件市场（plugin marketplace）。
用户可以通过以下命令添加你的 marketplace：

```bash
# /plugin marketplace add ccplugins/marketplace
/plugin marketplace add user-or-org/repo-name
```

随后即可在 Claude Code 的 `/plugin` 菜单中浏览并安装插件。

示例：

```bash
/plugin
/plugin install analyze-codebase
```


## 如何贡献

欢迎贡献！
你可以：

* 添加你喜欢的插件
* 分享最佳实践
* 提交你自己的插件