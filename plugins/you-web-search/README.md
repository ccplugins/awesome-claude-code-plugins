# you-web-search

Current web search, URL content extraction, and cited web synthesis for Claude Code,
via the [You.com](https://you.com) remote MCP server.

## Install

```
/plugin marketplace add ccplugins/awesome-claude-code-plugins
/plugin install you-web-search@awesome-claude-code-plugins
```

## Setup

The plugin registers the You.com MCP server (`https://api.you.com/mcp`). It needs an
API key:

```
export YDC_API_KEY="..."   # from https://you.com/platform/api-keys
```

Claude Code expands `${YDC_API_KEY}` in the plugin's `.mcp.json` at connect time, so
the key never needs to be written into the repo or chat.

## Tools you get

| Tool | Use for |
|------|---------|
| `you-search` | Current web search — snippets, source discovery, freshness/domain-targeted queries |
| `you-contents` | Read specific URLs and extract clean content |
| `you-research` | Multi-source research with citations |

## Example

> Search the web for the current stable Go release and cite sources

returns an answer with source URLs, not just a summary.

## Notes

- The plugin is a thin registration of a hosted MCP server — no local code runs.
- Without `YDC_API_KEY` set, the MCP tools return an auth error; the agent definition
  tells Claude to surface that clearly instead of retrying or guessing.
- You.com also publishes broader agent skills at
  [youdotcom-oss/agent-skills](https://github.com/youdotcom-oss/agent-skills)
  (`npx skills add youdotcom-oss/agent-skills`) if you want research/finance routing
  on top of raw search.
