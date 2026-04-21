# Entity: Person

> Source of truth for required fields: `people/_template.md`

## What it is

A **person** is any internal collaborator of the organization who is identifiable and relevant to the vault's context — engineer, tech lead, manager, product manager, engineering manager, designer, DRI, or any other professional who participates in decisions, operations, or technical contributions.

The primary identification is the **corporate email prefix** (e.g., `alice.smith@company.com` -> filename `alice-smith.md`), which ensures idempotency and universality — every collaborator has a corporate email, regardless of whether they have a GitHub account.

Persons are connected to teams and actors via wikilinks. The vault tracks people to understand: who works on what, who is the focal point for which system, who participated in which decisions, and what each person's role is in the organization.

## When to create

- The content mentions a person by full name AND it is possible to associate them with a team or actor in the vault
- The content identifies an active contributor (commits, PRs, code reviews) in repositories of known actors
- The content names a DRI, focal point, or person responsible for an action/decision
- The content mentions a professional (PM, EM, designer, etc.) who actively participates in a team or project in the vault, even without direct code contribution

## When NOT to create

- It is a generic mention without a full name (e.g., "the notifications team folks", "someone from infra") — that is a reference to a team, not a person
- It is an end user or customer (e.g., "the merchant reported a bug") — persons are internal collaborators
- It is an external stakeholder without direct participation in the organization (e.g., "the PCI auditor")
- It is a person mentioned only once without team/actor context — probably not relevant to the vault

## How to distinguish from other types

| Looks like... | But is... | Key difference |
|---|---|---|
| Person | Team | If the content says "the payments folks", it is a reference to the team. A person is an individual with a name |
| Person | Actor | Names like `ralph` can be either a person or a repo. If it has a corporate email and participates in a team, it is a person. If it deploys, it is an actor |
| Person | Discussion participant | If the person only appears as a participant in a meeting, they can be created as a person AND referenced in the discussion |

## Required fields (frontmatter)

| Field | Type | Description |
|---|---|---|
| `type` | string | Always `"person"` |
| `name` | string | Person's full name |
| `role` | string | Job title/function |
| `team` | wikilink | `"[[squad-name]]"` |
| `focal_points` | array | Wikilinks to actors: `["[[repo-name]]"]` |
| `updated_at` | date | YYYY-MM-DD |
| `updated_by` | string | Who updated it |

## Optional fields (frontmatter)

| Field | Type | Description |
|---|---|---|
| `email` | string | Full corporate email (e.g., `alice.smith@company.com`) |
| `github` | string | GitHub login (when applicable) |
| `slack` | string | Slack handle (e.g., `@alice.smith`) |
| `jira` | string | Jira username |

## Filename convention

A person's filename is derived from the **corporate email prefix**, normalized:
- Dots become hyphens: `alice.smith` -> `alice-smith`
- Lowercase, no accents
- Example: `alice.smith@company.com` -> `alice-smith.md`

When the email is not known, use `first-last.md` based on the full name (normalized).

## Zettelkasten Role

**Classification:** permanent note
**Purpose in the graph:** Represent consolidated facts about internal collaborators — who they are, where they work, and which systems they contribute to.

### Linking Rules

**Structural links (frontmatter):** `team` (wikilink to squad), `focal_points` (wikilinks to actors). These define the organizational position — which team and which systems the person works on.
**Semantic links (body):** Wikilinks in the body must have textual context. E.g., "leads the migration from [[legacy-gateway]] to [[billing-api]]" instead of just "[[legacy-gateway]]". Body links explain contributions, responsibilities, and involvement in decisions.
**Relationship with other roles:** Persons are referenced by bridge notes (topics, discussions) that record participation in events and subjects. Do not duplicate in the person the history of discussions — the person describes who they are, the topic/discussion describes what happened.

### Completeness Criteria

A person is complete when: they have a full name, assigned team, and at least 1 focal point or defined role. If only the name is mentioned without team or role context, the content should go to `fleeting/` until consolidated.

## Examples

### This IS a person

1. "Bob Jones is an engineer on squad Payments and works primarily on billing-api." — Individual with name, team, and focal actor. It is a person.

2. "PR #142 on notification-service was opened by `davewilson` (Dave Wilson)." — Identifiable contributor with GitHub login and actor. It is a person.

3. "Eve Martin is a Product Manager on squad Orders and leads the V2 migration project." — Professional with name, team, and project. It is a person, even without commits.

### This is NOT a person

1. "The notifications team will handle the migration." — Reference to a team, not an individual. Do not create a person.

2. "A merchant reported a timeout on card charges." — End user, not an internal collaborator. Do not create a person.
