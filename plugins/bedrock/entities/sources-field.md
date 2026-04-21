# Field: sources (provenance)

> Documentation for the `sources` field in entity frontmatter.

## What it is

The `sources` field is an array in the frontmatter of any entity that records where the information came from — a Confluence page, a Google Doc, a CSV, a GitHub repository. It is NOT an entity type; it is traceability metadata embedded in the entity itself.

The field enables re-ingestion: by recording the URL/path and the date of the last sync, `/sync` knows which sources are outdated and can be re-queried.

## Schema

```yaml
sources:
  - url: "https://mycompany.atlassian.net/wiki/spaces/PROC/pages/..."
    type: "confluence"
    synced_at: 2026-04-09
  - url: "https://github.com/acme-corp/billing-api"
    type: "github-repo"
    synced_at: 2026-04-10
```

| Field | Type | Required | Description |
|---|---|---|---|
| `url` | string | yes | URL or local path of the source |
| `type` | string | yes | `confluence`, `gdoc`, `github-repo`, `csv`, `markdown`, `manual` |
| `synced_at` | date | yes | YYYY-MM-DD of the last sync |

## Merge rules

- **Append-only:** new sources are added, never removed
- **Dedup by URL:** if the URL already exists in the list, update `synced_at` (do not duplicate the entry)
- **Order:** most recent first (by `synced_at`)

## When to populate

- An external source was ingested via `/teach` and the content created or updated this entity
- `/sync` re-synchronized a source and updated `synced_at`
- The user wants to manually record the provenance of an entity

## When NOT to populate

- The content was typed directly by the user without reference to an external document — there is no source to record
- The source is the agent's session memory — that is implicit, no record needed
- The source is a GitHub commit or PR — that is already tracked by git history

## How /sync uses this field

1. Scans all vault entities extracting the `sources` field
2. Deduplicates by URL (a URL may appear in multiple entities)
3. For each unique URL with a syncable type (`confluence`, `gdoc`, `github-repo`, `markdown`):
   - Re-fetches the updated content
   - Compares with existing entities (incremental diff)
   - Updates `synced_at` in all entities that reference that URL

## Relationship with the `source` field (singular)

Discussions and fleeting notes have a `source` field (singular string) that indicates the capture context: `session`, `meeting-notes`, `teach`, `manual`. This field has different semantics:

| Field | Type | Semantics | Example |
|---|---|---|---|
| `source` (singular) | string | How the entity was captured | `"meeting-notes"` |
| `sources` (plural) | array | Where the external data came from | `[{url: "...", type: "confluence", synced_at: "..."}]` |

Both can coexist in the same entity. They are independent.

## Examples

### Entity with a single source

```yaml
sources:
  - url: "https://mycompany.atlassian.net/wiki/spaces/PROC/pages/8675099062"
    type: "confluence"
    synced_at: 2026-04-09
```

### Entity with multiple sources

```yaml
sources:
  - url: "https://github.com/acme-corp/billing-api"
    type: "github-repo"
    synced_at: 2026-04-10
  - url: "https://mycompany.atlassian.net/wiki/spaces/PROC/pages/123"
    type: "confluence"
    synced_at: 2026-04-05
```

### Entity without an external source

```yaml
sources: []
```
