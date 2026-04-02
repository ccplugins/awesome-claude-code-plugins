---
allowed-tools: Bash(npx:*), Bash(npm:*), Bash(claude:*)
description: Set up ToolPipe MCP server for 238+ developer tools (JSON, hash, UUID, DNS, QR, regex, JWT, and more)
---

## ToolPipe MCP Server Setup

ToolPipe provides 238+ developer utility tools accessible via the Model Context Protocol. No API key required for the free tier.

### Tools available include:
- JSON formatter and validator
- QR code generator
- Hash generator (MD5, SHA-1, SHA-256, SHA-512)
- UUID generator (v1, v4, v5, v7)
- DNS lookup
- Base64 encoder/decoder
- JWT decoder
- SQL formatter
- Markdown to HTML converter
- Regex tester
- Color converter (HEX, RGB, HSL)
- Text analyzer (word count, reading time)
- Fake data generator
- Cron expression parser
- Code review helper
- And 220+ more

### Setup instructions

**Option A: Remote MCP (no install needed)**

Add to your Claude Code settings:
```json
{
  "mcpServers": {
    "toolpipe": {
      "type": "url",
      "url": "https://toolpipe.dev/mcp"
    }
  }
}
```

**Option B: Local via npm**

```bash
npx @cosai-labs/toolpipe-mcp-server
```

Or install globally:
```bash
npm install -g @cosai-labs/toolpipe-mcp-server
```

Then add to your Claude Code settings:
```json
{
  "mcpServers": {
    "toolpipe": {
      "command": "toolpipe-mcp-server"
    }
  }
}
```

### Links
- Website: https://toolpipe.dev
- GitHub: https://github.com/COSAI-Labs/toolpipe-mcp-server
- npm: https://www.npmjs.com/package/@cosai-labs/toolpipe-mcp-server
