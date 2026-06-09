---
name: ai-divination-skills
description: Use this skill when the user asks for a tarot reading, I Ching (Yijing) hexagram cast, or Chinese Xiao Liu Ren (小六壬) divination. Calls audited local Python tools that produce deterministic JSON output; the model never invents the result, it only interprets the JSON.
---

# AI Divination Skills

This skill wraps `ai-divination-skills` — an MCP server + Python package providing auditable tarot, I Ching, and Xiao Liu Ren divination tools.

## When to use
- User asks for a tarot reading (e.g. 3-card, Celtic Cross)
- User asks for an I Ching / 易经 hexagram with moving lines
- User asks for a 小六壬 / Xiao Liu Ren / Six Yao reading
- User wants reproducible / auditable divination (seed-based) instead of model-imagined cards

## Install
```bash
pip install ai-divination-skills
```

## Workflow
1. Run the CLI for the requested method:
   - Tarot: `ai-divination tarot --spread three-card`
   - I Ching: `ai-divination iching --method coin`
   - Xiao Liu Ren: `ai-divination xiaoliuren`
2. The CLI prints structured JSON (cards/lines, positions, names, keywords)
3. Interpret the JSON in natural language. **Do not** invent additional cards, swap positions, or change the result; only interpret what the JSON contains.

## MCP alternative
If the user is in Claude Desktop, register `ai-divination-mcp` (stdio JSON-RPC 2.0) and use tools: `tarot.draw`, `iching.cast`, `xiaoliuren.cast`, `interpretation_template`.

## Links
- Repo: https://github.com/sapuyou45-bit/ai-divination-skills
- PyPI: https://pypi.org/project/ai-divination-skills/
