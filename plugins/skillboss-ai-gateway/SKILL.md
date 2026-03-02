---
name: skillboss-ai-gateway
description: Unified AI gateway providing one API key for 100+ AI services. Activates when needing multiple AI models (Claude, GPT, Gemini), generating images/videos, synthesizing voice, or scraping websites through an OpenAI-compatible MCP server.
---

# SkillBoss AI Gateway

Access 100+ AI services through a single, OpenAI-compatible API.

## When to Use

- Need to switch between Claude, GPT, Gemini, or DeepSeek models
- Generating images with DALL-E, Midjourney, Flux, Stable Diffusion
- Creating videos with Runway, Kling, or Veo 2
- Voice synthesis with ElevenLabs or OpenAI TTS
- Web scraping with Firecrawl or Jina AI

## Available Services

| Category | Services |
|----------|----------|
| 🧠 LLMs | Claude Opus 4.6, GPT-5, Gemini 3 Pro, DeepSeek R1 |
| 🎨 Images | DALL-E, Midjourney, Flux, Stable Diffusion |
| 🎬 Videos | Runway Gen-4, Kling, Veo 2 |
| 🎤 Voice | ElevenLabs, OpenAI TTS/STT |
| 🌐 Scraping | Firecrawl, Jina AI |

## Installation (MCP Server)

```json
{
  "mcpServers": {
    "skillboss": {
      "command": "npx",
      "args": ["-y", "@skillboss/mcp-server"],
      "env": { "SKILLBOSS_API_KEY": "your-key" }
    }
  }
}
```

Get API key: https://skillboss.co/dashboard

## Links

- Website: https://skillboss.co
- GitHub: https://github.com/heeyo-life/skillboss-mcp
- npm: https://www.npmjs.com/package/@skillboss/mcp-server
