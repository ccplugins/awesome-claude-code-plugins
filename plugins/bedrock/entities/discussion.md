# Entity: Discussion

> Source of truth for required fields: `discussions/_template.md`

## What it is

A **discussion** is the record of a conversation, meeting, or exchange of ideas that took place at a specific moment. Discussions capture: who participated, what was discussed, which decisions were made, and which actions remained pending.

Discussions are **one-time events with a fixed date** — they do not evolve over time like topics. Once created, they are only updated to reflect progress on action items, never to add new subjects to the same discussion.

## When to create

- The content is meeting minutes or meeting notes with participants and decisions
- The content records a conversation that generated decisions or action items relevant to the vault
- The content describes an alignment/planning session with multiple people and impact on actors

## When NOT to create

- It is technical documentation, a spec, or a PRD — those are reference documents, not discussions
- It is a changelog or release notes — that is activity of an actor
- It is a Slack thread with one-off information without decisions — it only counts if there was a decision or action item
- It is a casual 1:1 conversation with no impact on the vault — discussions record relevant events

## How to distinguish from other types

| Looks like... | But is... | Key difference |
|---|---|---|
| Discussion | Topic | A topic is a subject that evolves (status, history). A discussion is an event with a fixed date. A meeting about deprecation is a discussion; the deprecation itself is a topic |
| Discussion | Project | A project has deliverables and a deadline. A discussion is the record of a conversation. A planning meeting can generate a discussion AND result in the creation of a project |
| Discussion | Source | If the content is meeting notes being ingested, the source is the source. The content extracted from the source can generate a discussion |

## Required fields (frontmatter)

| Field | Type | Description |
|---|---|---|
| `type` | string | Always `"discussion"` |
| `title` | string | Descriptive title of the conversation |
| `date` | date | YYYY-MM-DD of the conversation |
| `summary` | string | Summary in 1-2 sentences |
| `conclusions` | array | List of decisions made |
| `action_items` | array | List of pending actions |
| `related_topics` | array | Wikilinks to topics |
| `related_actors` | array | Wikilinks to actors |
| `related_people` | array | Wikilinks to persons |
| `related_projects` | array | Wikilinks to projects |
| `related_teams` | array | Wikilinks to teams |
| `source` | string | `session`, `meeting-notes`, `jira`, `confluence`, `manual` |
| `updated_at` | date | YYYY-MM-DD |
| `updated_by` | string | Who updated it |

## Zettelkasten Role

**Classification:** bridge note
**Purpose in the graph:** Record the moment when permanents (people, actors, teams) connected through a conversation, decision, or exchange of ideas.

### Linking Rules

**Structural links (frontmatter):** `related_people`, `related_actors`, `related_teams`, `related_topics`, `related_projects` (wikilinks). These define which entities participated in or were discussed during the event.
**Semantic links (body):** Links in the body must contextualize participation or mention. E.g., "[[bob-jones]] presented the proposal to migrate [[legacy-gateway]] to [[billing-api]]" instead of just listing names. The body of the discussion is the narrative of the event — who said what about which system and for what reason.
**Relationship with other roles:** Discussions are temporal bridges — they record when and how permanents connected at a specific moment. They differ from topics because they are one-time events, not subjects that evolve. A discussion can generate or update topics and projects.

### Completeness Criteria

A discussion is complete when: it has a date, at least 1 participant (person), a summary of what was discussed, and at least 1 conclusion or action item. If there is only a mention of "a meeting happened" without details, the content should go to `fleeting/` until enriched.

## Examples

### This IS a discussion

1. "Q2 planning meeting (04/01/2026): Alice, Bob, Carol attended. Decision: prioritize migration of legacy-gateway. Action: Bob will map dependencies by Friday." — Meeting notes with participants, decision, and action item. It is a discussion.

2. "Observability alignment (04/03/2026): we decided to migrate from DataDog to OpenTelemetry in the Go services. Responsible: squad Notifications starts with crypto-service." — Conversation with decision and action. It is a discussion.

### This is NOT a discussion

1. "Architecture document for orders-api describing the hexagonal flow." — Technical documentation. It is not a discussion.

2. "Release notes v2.3.0 for billing-api: added PartnerPay support." — Changelog for an actor. It is not a discussion.
