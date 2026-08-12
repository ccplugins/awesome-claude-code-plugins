---
description: Format Markdown for Slack. Rich HTML copy-paste + mrkdwn API output.
author: karanb192
author-url: https://github.com/karanb192
version: 1.0.0
---

# Slack Message Formatter

This slash command formats messages for Slack with pixel-perfect accuracy. It converts standard Markdown to Slack-compatible output with two delivery paths:

1. **Copy-paste** — Rich HTML that preserves formatting when pasted into Slack's compose box
2. **API/Webhook** — Slack mrkdwn syntax for bots, automation, and CI/CD

## Key Features

- Converts bold, italic, strikethrough, code, links, headings, tables, task lists, and more
- Handles Slack mentions (`<@U...>`, `<#C...>`, `<!here>`) as pass-through
- Generates a Slack-themed browser preview page
- Copies rich HTML to clipboard for instant paste into Slack
- Supports direct webhook sending via `CCH_SLA_WEBHOOK` environment variable
- Converts 150+ emoji shortcodes to native Unicode

## Usage

```
/slack-message-formatter preview
/slack-message-formatter send
```

Write your message in standard Markdown, and the formatter handles conversion to Slack's mrkdwn syntax and rich HTML automatically.