# Entity: Topic

> Source of truth for required fields: `topics/_template.md`

## What it is

A **topic** is a cross-cutting subject with its own lifecycle (open → in-progress → completed/cancelled). Topics represent initiatives, incidents, RFCs, deprecations, or any theme that evolves over time and affects multiple actors or people. They are the "tracker" of subjects in the Second Brain.

Topics have status, event history, decisions made, and next steps. They are the place where you record **what is happening** with a subject over time.

## When to create

- The content describes a cross-cutting initiative that affects more than 1 actor (e.g., observability migration, service deprecation)
- The content reports an incident or systemic problem with cross-team impact
- The content proposes an RFC or architectural change that needs tracking
- The content describes a system deprecation process

## When NOT to create

- It is a one-off task without temporal evolution (e.g., "fix bug X in PR #123") — that is operational work, not a topic
- It is an isolated bug in a single actor without cross-team impact — record it as a known_issue in the actor
- It is a feature request without cross-cutting impact — it could be an item in a project, not a topic
- It is a conversation/meeting — that is a discussion. Topics are subjects; discussions are events

## How to distinguish from other types

| Looks like... | But is... | Key difference |
|---|---|---|
| Topic | Discussion | A discussion is a one-time event (meeting, conversation) with a fixed date. A topic is a subject that evolves over time with status and history |
| Topic | Project | A project has a deadline, deliverables, and focal points. A topic is more open — it may not have a defined deadline. E.g., "deprecation of legacy-gateway" is a topic; "migration to orders-api v2" is a project |
| Topic | Actor (known_issue) | If the problem affects only 1 actor and is technical, it goes as a known_issue in the actor. If it affects multiple actors or has organizational impact, it is a topic |

## Required fields (frontmatter)

| Field | Type | Description |
|---|---|---|
| `type` | string | Always `"topic"` |
| `title` | string | Descriptive title of the subject |
| `category` | string | `bugfix`, `troubleshooting`, `rfc`, `incident`, `feature`, `deprecation`, `compliance` |
| `status` | string | `open`, `in-progress`, `completed`, `cancelled` |
| `people` | array | Wikilinks to persons: `["[[first-last]]"]` |
| `actors` | array | Wikilinks to actors: `["[[repo-name]]"]` |
| `objective` | string | Topic objective |
| `created_at` | date | YYYY-MM-DD |
| `updated_at` | date | YYYY-MM-DD |
| `updated_by` | string | Who last updated |

## Zettelkasten Role

**Classification:** bridge note
**Purpose in the graph:** Connect permanent notes (actors, people, teams) explaining *why* they relate in the context of a subject that evolves over time.

### Linking Rules

**Structural links (frontmatter):** `people` (wikilinks to involved persons), `actors` (wikilinks to affected actors). Define which permanents this subject connects.
**Semantic links (body):** Links in the body are the central point of a topic — they should explain the relationship between permanents with rich context. E.g., "the deprecation of [[legacy-gateway]] is blocked because legacy system clients still depend on the tokenization provided by [[billing-api]]" instead of just "[[legacy-gateway]] and [[billing-api]]". The topic body is where the explanation of the connection between permanents lives.
**Relationship with other roles:** Topics are the connective tissue between permanents. If two actors relate, the explanation lives here — not duplicated in both actors. Topics are referenced by index notes (projects) that organize multiple subjects under an objective.

### Completeness Criteria

A topic is complete when: it has a defined objective, at least 1 actor or person referenced with context, and an updated status. If the subject is vague, without concrete actors or a clear objective, the content should go to `fleeting/` until it matures.

## Examples

### This IS a topic

1. "We are migrating all Go services from dd-trace to OpenTelemetry. Affects notification-service, crypto-service, orders-api, and metrics-collector." — Cross-cutting initiative with multiple actors. It is a topic (category: `rfc`).

2. "The deprecation of legacy-gateway is blocked by the migration of legacy system clients. Status: in progress since March." — Subject with lifecycle and status. It is a topic (category: `deprecation`).

### This is NOT a topic

1. "I need to fix the timeout on the /create endpoint of notification-service." — One-off bug in 1 actor. Goes as a known_issue in the actor, not as a topic.

2. "We had a meeting about the deprecation plan on Monday." — That is a discussion (event). The deprecation plan itself may be a topic.
