---
name: skillfold-cli
description: Use the skillfold compiler to manage multi-agent pipeline configs. Compile, validate, inspect, and visualize pipelines defined in skillfold.yaml.
---

# Skillfold CLI

You use the skillfold compiler to manage multi-agent pipeline configurations. Skillfold compiles YAML config into standard SKILL.md files per the Agent Skills specification.

## Config File

The pipeline is defined in `skillfold.yaml` at the project root. It has three top-level sections:

- **skills** - Atomic skill directories and composition rules
- **state** - Typed state schema with custom types and external locations
- **team** - Orchestrator designation and execution flow

## Commands

### Compile

```bash
npx skillfold
```

Compiles the pipeline config and writes one SKILL.md per agent to the output directory (default: `build/`). Each output file contains the concatenated bodies of the agent's composed skills plus YAML frontmatter.

### Validate

```bash
npx skillfold validate
```

Validates the config without writing any output. Checks skill references, state types, flow transitions, cycle exit conditions, and write conflicts. Use this for quick feedback while editing config.

### Check

```bash
npx skillfold --check
```

Verifies that compiled output on disk matches what the compiler would generate. Exits with code 1 if any output is stale or missing. Designed for CI pipelines to catch uncommitted config changes.

### List

```bash
npx skillfold list
```

Displays a structured summary of the pipeline: skills (atomic and composed with their composition chains), state fields with types and locations, and team flow with transitions.

### Graph

```bash
npx skillfold graph
```

Outputs a Mermaid flowchart of the team flow. Shows full skill composition lineage (which atomic skills compose each agent) and state writes on edges.

### Init

```bash
npx skillfold init
```

Scaffolds a new pipeline project with a starter `skillfold.yaml` and two example skills. Use this to get started quickly in a new directory.

## Options

| Flag | Description |
|------|-------------|
| `--config <path>` | Config file path (default: `skillfold.yaml`) |
| `--out-dir <path>` | Output directory (default: `build`) |
| `--dir <path>` | Target directory for init (default: `.`) |
| `--check` | Verify compiled output is up-to-date |
| `--help` | Show help |
| `--version` | Show version |

## Workflow

A typical workflow when modifying the pipeline:

1. Edit `skillfold.yaml` to change skills, state, or team flow
2. Run `npx skillfold validate` to catch errors early
3. Run `npx skillfold` to compile the pipeline
4. Run `npx skillfold list` to inspect the result
5. Commit both the config and the compiled output

For CI, add `npx skillfold --check` to verify compiled output stays in sync with the config source of truth.
