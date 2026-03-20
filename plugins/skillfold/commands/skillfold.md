---
description: Compile, validate, or inspect a skillfold pipeline
allowed-tools: Bash, Read, Write, Edit, Glob, Grep
argument-hint: "[compile|validate|list|graph|watch|init] [options]"
---

# Skillfold CLI

Run the skillfold compiler to manage multi-agent pipeline configurations. Skillfold compiles YAML config into standard SKILL.md files per the Agent Skills specification.

## Usage

Run the requested skillfold command. If no arguments are given, compile the pipeline.

```
npx skillfold $ARGUMENTS
```

## Commands

- `npx skillfold` - Compile the pipeline (default)
- `npx skillfold validate` - Validate config without compiling
- `npx skillfold list` - Display a structured summary of the pipeline
- `npx skillfold graph` - Output Mermaid flowchart of the team flow
- `npx skillfold watch` - Compile and watch for changes
- `npx skillfold init [dir]` - Scaffold a new pipeline project
- `npx skillfold compile --target claude-code` - Compile to Claude Code agents and skills
- `npx skillfold plugin` - Package compiled output as a Claude Code plugin

## Options

- `--config <path>` - Config file (default: skillfold.yaml)
- `--out-dir <path>` - Output directory (default: build)
- `--target <skill|claude-code>` - Output format (default: skill)
- `--check` - Verify compiled output is up-to-date (exit 1 if stale)
