---
name: oraclebone
description: Use this skill when the user asks for a tarot reading, I Ching (易经) hexagram cast, Xiao Liu Ren (小六壬), or Bazi (八字 / Four Pillars) chart. Calls audited local Python tools that produce deterministic JSON output; the model never invents the result, it only interprets the JSON.
---

# Oraclebone

This skill wraps `oraclebone` — an MCP server + Python package providing auditable tarot, I Ching, Xiao Liu Ren, and Bazi divination tools.

## When to use
- User asks for a tarot reading (e.g. 3-card, decision spread)
- User asks for an I Ching / 易经 hexagram with moving lines
- User asks for a 小六壬 / Xiao Liu Ren reading
- User asks for a 八字 / Bazi / Four Pillars chart from a birth datetime
- User wants reproducible / auditable divination (seed-based) instead of model-imagined cards

## Install
```bash
pip install oraclebone
```

## Workflow
1. Run the CLI for the requested method:
   - Tarot: `oraclebone tarot --spread three-card`
   - I Ching: `oraclebone iching --method coins`
   - Xiao Liu Ren: `oraclebone xiaoliuren --method numbers --month 3 --day 12 --hour 7`
   - Bazi: `oraclebone bazi --datetime 1990-05-20T14:30:00`
2. The CLI prints structured JSON (cards/lines, positions, names, keywords, audit metadata)
3. Interpret the JSON in natural language. **Do not** invent additional cards, swap positions, or change the result; only interpret what the JSON contains.

## MCP alternative
If the user is in an MCP host (Claude Desktop, Codex, Cursor, Continue), register `oraclebone-mcp` (stdio JSON-RPC 2.0) and use tools: `tarot_draw`, `iching_cast`, `xiaoliuren_cast`, `bazi_cast`, `interpretation_template`.

## Links
- Repo: https://github.com/sapuyou45-bit/oraclebone
- PyPI: https://pypi.org/project/oraclebone/
