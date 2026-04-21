# Entity: Project

> Source of truth for required fields: `projects/_template.md`

## What it is

A **project** is an initiative with a closed scope, a deadline (real or estimated), concrete deliverables, and responsible focal points. Projects aggregate multiple actors, people, and topics under a common objective. They are the "hub" of an initiative in the Second Brain.

Projects have status (planning → active → blocked → completed), trackable progress, and explicit blockers. They differ from topics by being more concrete and delivery-oriented.

## When to create

- The content describes an initiative with an objective, scope, and at least 1 responsible person (focal point)
- The content mentions a migration, rewrite, or construction of a new system with a timeline
- The content defines deliverables and milestones of a cross-team effort

## When NOT to create

- It is a subject/theme without a deadline or concrete deliverables — that is a topic
- It is a conversation/meeting — that is a discussion (which may reference a project)
- It is an isolated task by 1 person on 1 actor — that is operational work, not a project
- It is the ongoing operation of a system — that is the actor itself

## How to distinguish from other types

| Looks like... | But is... | Key difference |
|---|---|---|
| Project | Topic | A topic is an open subject (e.g., "deprecation of legacy services"). A project is a closed initiative (e.g., "migrate legacy-gateway to billing-api by Q3"). A topic can exist without a deadline; a project always has one (even if estimated) |
| Project | Actor | If the end result is a new system, it starts as a project and becomes an actor once it has a repo and deploy. E.g., "project to create health-checker" → later becomes actor `health-checker` |
| Project | Discussion | A discussion is a one-time event. A project is an ongoing effort with progress. A discussion can create or update a project |

## Required fields (frontmatter)

| Field | Type | Description |
|---|---|---|
| `type` | string | Always `"project"` |
| `name` | string | Project name |
| `description` | string | Description |
| `status` | string | `planning`, `active`, `blocked`, `completed` |
| `deadline` | string | Deadline date or empty |
| `progress` | string | Description of current progress |
| `blockers` | array | List of blockers |
| `focal_points` | array | Wikilinks to persons: `["[[first-last]]"]` |
| `related_topics` | array | Wikilinks to topics |
| `related_actors` | array | Wikilinks to actors |
| `related_teams` | array | Wikilinks to teams |
| `updated_at` | date | YYYY-MM-DD |
| `updated_by` | string | Who last updated |

## Zettelkasten Role

**Classification:** index note
**Purpose in the graph:** Organize reading paths — aggregate bridges (topics, discussions) and permanents (actors, people, teams) under a common objective, functioning as a thematic Map of Content (MOC).

### Linking Rules

**Structural links (frontmatter):** `focal_points` (wikilinks to persons), `related_topics`, `related_actors`, `related_teams` (wikilinks). Define which entities compose this initiative.
**Semantic links (body):** Links in the body should point to where the knowledge lives, without repeating content. E.g., "the migration progress is documented in [[2026-06-deprecation-legacy-gateway]]" instead of replicating the history here. The project body is curation — it directs the reader to the right notes.
**Relationship with other roles:** Projects do not contain their own knowledge — they point to bridges (topics that detail the subjects) and permanents (actors and people involved). If a project is explaining something in detail, that detail should be in a topic.

### Completeness Criteria

A project is complete when: it has an objective, at least 1 focal point, and references to related topics or actors. If it is just an idea for an initiative without a responsible person or concrete scope, the content should go to `fleeting/` until it is defined.

## Examples

### This IS a project

1. "Migration from legacy-gateway to billing-api: deadline Q3/2026. Responsible: Bob. Blocker: legacy system clients that still use the legacy-gateway." — Initiative with deadline, responsible person, blocker. It is a project.

2. "V2 Orders API: we are building the new orders API. Squad Orders leads, go-live forecast in May. Involves orders-api, billing engine, integration engine." — Construction effort with timeline and multiple actors. It is a project.

### This is NOT a project

1. "We need to improve observability of the Go services." — Open subject without a deadline or concrete deliverable. It is a topic.

2. "Fix the timeout bug in notification-service by Friday." — One-off task by 1 person. It is not a project.
