# Poppify — Claude Code Plugin for Short-Form Vertical Video

**Photo-led short-form vertical reels for Instagram / TikTok / YouTube Shorts / Facebook.** Upload 1–10 photos, get a captioned 15/30/60s reel with motion, library-matched music, and optional voiceover. **$0.06 base render. 50 free seeds on signup. No subscription.**

Poppify is the **creative slot in an agentic marketing stack** for SMBs (5–19 employees) and solo service providers — the agency replacement at $30–60/mo instead of $3K+. Pairs with Postiz for cross-platform scheduling and Windsor.ai for performance attribution. Drop-in replacement for Runway when you have photos and want library-matched audio.

## Source

The canonical plugin source, full README, and 27-tool MCP catalog live at:

**[github.com/Poppify/poppify-claude-plugin](https://github.com/Poppify/poppify-claude-plugin)**

## Install

In Claude Code:

```
/plugin marketplace add Poppify/poppify-claude-plugin
/plugin install poppify@poppify
```

After install, ask Claude: *"Use Poppify to turn these photos into a reel."*

## What it bundles

- **MCP server** (`https://poppify.ai/mcp`, HTTP) — 27 tools: `register`, `start_session_from_photos`, `customize`, `set_audio`, `generate_image`, `confirm`, `get_result`, and more
- **4 skills** — `poppify-build-reel`, `poppify-render-debug`, `poppify-troubleshoot`, `poppify-schema-introspect`
- **3 slash commands** — `/poppify:make-reel`, `/poppify:troubleshoot`, `/poppify:verify-render`

## Costs

- MCP install + all customization tools: **free**
- `confirm` render: **1 seed (~$0.06)**
- `generate_image` / `generate_music` / `generate_voiceover`: 10 seeds each

50 free seeds granted on signup. Seeds sold at $5.99 / 100 seeds (standard) or $0.50 / 5 seeds (mini trial).

## Not for

Text→video generation (use Runway / Sora / Veo), avatar-based video (use HeyGen / Synthesia), 4K horizontal cinema, or sub-4s clips.

## License

MIT — see [Poppify/poppify-claude-plugin](https://github.com/Poppify/poppify-claude-plugin).
