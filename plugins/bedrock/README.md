# Bedrock

Second Brain automation for Obsidian vaults — entity management, ingestion, compression, and sync via Claude Code skills.

**Upstream repository:** https://github.com/iurykrieger/claude-bedrock
**Homepage:** https://claude-bedrock.vercel.app

## What it does

Bedrock turns any Obsidian vault into a structured Second Brain following adapted Zettelkasten principles. Knowledge is organized into **8 entity types** (actors, people, teams, concepts, topics, discussions, projects, fleeting notes), each with YAML frontmatter, hierarchical tags (`type/`, `status/`, `domain/`, `scope/`), and bidirectional wikilinks.

No build system. No runtime. Just markdown files, AI agents, and your Obsidian vault.

## Skills

| Skill | Purpose |
|---|---|
| `/bedrock:setup` | Interactive vault initialization and configuration |
| `/bedrock:ask` | Orchestrated vault reader — decomposes questions, searches graph and vault, cross-references entities |
| `/bedrock:teach` | Ingest external sources (Confluence, Google Docs, GitHub, DOCX/PPTX/XLSX/PDF/HTML/EPUB via docling) and extract entities |
| `/bedrock:preserve` | Single write point — detect, match, create/update entities with bidirectional links |
| `/bedrock:compress` | Deduplication and vault health — fix broken backlinks, merge duplicates, consolidate fragmented concepts |
| `/bedrock:sync` | Re-sync entities with external sources (GitHub PRs/activity, contributors) |
| `/bedrock:healthcheck` | Read-only vault health diagnostic — graphify-out integrity, orphans, dangling content |
| `/bedrock:vaults` | Manage registered vaults — list, set default, remove |

## Dependencies

- [graphify](https://github.com/iurykrieger/graphify) — semantic code extraction and knowledge-graph pipeline (auto-installed by `/bedrock:setup`)
- [docling](https://github.com/docling-project/docling) — universal file → markdown converter (auto-installed by `/bedrock:setup`)

## Install

```bash
/plugin install bedrock@awesome-claude-code-plugins
```

Then scaffold a vault:

```
/bedrock:setup
```

## License

[MIT](LICENSE) — Iury Krieger
