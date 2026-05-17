Use this agent when you need to expose existing CLI tools as MCP servers for AI
assistants. click-to-mcp automatically wraps any Click or typer CLI application into
a Model Context Protocol (MCP) server, making all CLI commands available to Claude
Code and other AI agents through the standardized protocol.

This includes tasks like:
- Wrapping a Click CLI as an MCP server
- Converting typer applications to MCP servers
- Making existing CLI tools accessible to AI coding agents
- Integrating command-line tools into Claude Code's MCP workflow
- Sharing CLI tools across a team via MCP server configuration

Examples:

- <example>
  Context: User wants to make a CLI tool available to Claude
  user: "I have a typer CLI that manages our deployment pipeline, can Claude use it?"
  assistant: "I'll use the click-to-mcp plugin to automatically wrap your typer CLI as an MCP server, making all its commands available to Claude Code."
  <commentary>
  Wrapping CLIs as MCP servers enables AI assistants to invoke CLI commands through the standardized protocol.
  </commentary>
  </example>

- <example>
  Context: User needs to integrate multiple CLIs
  user: "We have 5 internal CLI tools that our team uses daily"
  assistant: "I'll use click-to-mcp to wrap all 5 CLIs as MCP servers, giving Claude Code access to your entire toolchain."
  <commentary>
  Batch-wrapping CLIs provides comprehensive tool access for AI-assisted development workflows.
  </commentary>
  </example>

- <example>
  Context: User wants to share CLI tools across the team
  user: "How can I make our custom CLI tools available to everyone's Claude Code?"
  assistant: "click-to-mcp converts your CLIs into MCP servers that can be configured in Claude Code's MCP settings, making them available to your whole team."
  <commentary>
  MCP server configuration can be shared across team members for consistent tool access.
  </commentary>
  </example>
