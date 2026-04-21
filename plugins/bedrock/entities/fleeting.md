# Entity: Fleeting

> Source of truth for required fields: `fleeting/_template.md`

## What it is

A **fleeting note** is a capture of raw information — ideas, emerging concepts, vague mentions, fragments without full context. Fleeting notes are the vault's inbox: they receive content that has not yet reached the threshold of a permanent or bridge note.

Fleeting notes are **temporary by design**. They should be promoted (to permanent or bridge) or archived within a reasonable period. They are not garbage — they are information in the process of maturing.

## Zettelkasten Role

**Classification:** fleeting note
**Purpose in the graph:** Capture information in formation that is not yet consolidated enough to be a permanent or bridge note.

### Linking Rules

**Structural links (frontmatter):** `source` (wikilink to the source it came from, or `"session"` if captured directly), `promoted_to` (wikilink to the destination note when promoted).
**Semantic links (body):** Links in the body are exploratory — they may reference existing permanents or bridges that seem related, but without the obligation of full textual context. Fleeting notes are drafts; the semantic linking requirement applies when they are promoted.
**Relationship with other roles:** Fleeting notes reference existing permanents and bridges as connection "clues". When promoted, the content migrates to a permanent (actor, person, team) or bridge (topic, discussion) following the linking rules of that type.

### Completeness Criteria

Fleeting notes **do not need** to be complete — that is the point. They exist precisely to capture incomplete information. The relevant criterion is **promotion** (see below).

## When to create

- Content ingested by `/teach` contains ideas, mentions, or fragments that do not meet the completeness criteria of any permanent or bridge type
- The content mentions something potentially useful but without enough data to create an entity (e.g., "someone mentioned a new tokenization service" — no name, repo, or team)
- The content captures a hypothesis, suggestion, or draft idea that needs refinement
- `/preserve` receives content that does not pass the completeness criteria of any type

## When NOT to create

- The content already has enough data to create a permanent or bridge entity — create directly in the correct type
- The content is irrelevant to the vault (noise, casual conversation, off-topic information)
- The content is a duplicate of something already captured in another fleeting note or existing entity

## How to distinguish from other types

| Looks like... | But is... | Key difference |
|---|---|---|
| Fleeting | Actor | If it has a repo, deployment, and team — it is an actor. If only "someone mentioned a new service" without details, it is fleeting |
| Fleeting | Person | If it has a full name and team — it is a person. If only "an engineer from payments", it is fleeting |
| Fleeting | Topic | If it has a clear objective and affected actors — it is a topic. If it is "maybe we need to deprecate X", it is fleeting |
| Fleeting | Discussion | If it has a date, participants, and decisions — it is a discussion. If it is "it seems there was a meeting about Y", it is fleeting |

## Promotion Criteria

A fleeting note should be promoted to permanent or bridge when **any** of the 3 criteria is met:

### 1. Critical mass

The fleeting note accumulates enough information to be self-contained:
- More than 3 paragraphs with verifiable sources
- Concrete data (names, dates, numbers, repositories)
- Sufficient context to meet the completeness criteria of the destination type

### 2. Corroboration

The information in the fleeting note is confirmed or supplemented by an existing permanent note:
- A new ingestion via `/teach` brings data that validates or expands the fleeting
- An existing permanent is updated with information that confirms the fleeting's content
- Two or more fleeting notes about the same subject can be consolidated into a permanent note

### 3. Active relevance

`/bedrock` references the fleeting note in response to a query, signaling that the information is useful:
- The fleeting's content is cited as an answer to a user question
- The fleeting contributes to the understanding of an active subject in the vault
- In this case, `/bedrock` signals the promotion opportunity

## Promotion Pipeline

1. **Detection** — `/preserve`, `/teach`, or `/bedrock` identifies that a promotion criterion has been met
2. **Signaling** — The skill signals with a callout: `> [!info] Suggested promotion: this note can be promoted to <type>`
3. **Promotion** — `/preserve` is invoked to create the destination entity, migrating the relevant content
4. **Update** — The fleeting note receives `status: promoted` and `promoted_to: [[destination-note]]`

## Required fields (frontmatter)

| Field | Type | Description |
|---|---|---|
| `type` | string | Always `"fleeting"` |
| `title` | string | Short descriptive title |
| `source` | wikilink/string | `"[[source-name]]"` or `"session"` |
| `captured_at` | date | YYYY-MM-DD of capture |
| `status` | string | `raw`, `reviewing`, `promoted`, `archived` |
| `promoted_to` | wikilink/string | `"[[destination-note]]"` or `""` (empty until promotion) |
| `updated_at` | date | YYYY-MM-DD |
| `updated_by` | string | Who updated it |

## Possible statuses

| Status | Description |
|---|---|
| `raw` | Newly captured, not yet reviewed |
| `reviewing` | Under analysis — someone or some skill is evaluating for promotion |
| `promoted` | Promoted — content migrated to a permanent/bridge note (see `promoted_to`) |
| `archived` | Archived — content was not relevant or became obsolete |

## Examples

### This IS a fleeting note

1. "Someone mentioned a new tokenization service that will replace the legacy-gateway, but I don't know the name or the repo." — Useful but incomplete information. It is fleeting until it has concrete data.

2. "It seems the Notifications squad is thinking about migrating crypto-service to Rust. Needs confirmation." — Unconfirmed hypothesis. It is fleeting until validated.

3. "In some meeting they talked about changing the SMS provider for notifications. I don't know when or who was there." — Fragment without date, participants, or decision. It is fleeting.

### This is NOT a fleeting note

1. "The health-checker is a Go service that replaces MonitorAPI. Repo: acme-corp/health-checker. Squad Orders is responsible." — Enough concrete data to be an actor.

2. "Planning meeting (04/01/2026): Alice, Bob, Carol. Decision: prioritize legacy-gateway migration." — Complete data for a discussion.
