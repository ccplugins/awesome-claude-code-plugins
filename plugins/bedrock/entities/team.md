# Entity: Team

> Source of truth for required fields: `teams/_template.md`

## What it is

A **team** is a squad with a defined organizational scope, identifiable members, and ownership over a set of actors. Teams are the organizational unit of the Second Brain — they represent the real squad structure of the organization.

Teams have a domain scope (e.g., "card transaction lifecycle"), listed members, and a set of actors under their responsibility.

## When to create

- The content references a squad/team with a formal name and at least 1 identifiable member or 1 actor under ownership
- The content describes the creation of a new squad with a defined scope
- The content lists members and responsibilities of an uncatalogued team

## When NOT to create

- It is an ad-hoc group assembled for a specific project (e.g., "migration task force") — that is a project with focal_points, not a team
- It is a reference to a Slack channel or communication group (e.g., "#payments-alerts")
- It is a generic mention ("the backend folks", "the infra crew") — without a formal scope, it is not a team
- It is a reference to a non-technical team without system ownership (e.g., "legal compliance team", "HR team") — the vault covers technology teams

## How to distinguish from other types

| Looks like... | But is... | Key difference |
|---|---|---|
| Team | Project | If it is a temporary group with a deadline and deliverables, it is a project. A team is permanent with ongoing ownership |
| Team | Person (plural) | If the content says "Carol and Bob from payments", those are persons referencing the team. The team already exists |
| Team | Actor | If the content says "payments", it could be the team (squad-payments) or a specific actor. Context defines: if talking about people/ownership → team; if talking about deploy/code → actor |

## Required fields (frontmatter)

| Field | Type | Description |
|---|---|---|
| `type` | string | Always `"team"` |
| `name` | string | Squad name (e.g., "Squad Payments") |
| `scope` | string | Area of responsibility |
| `purpose` | string | Team purpose/mission |
| `members` | array | Wikilinks to persons: `["[[first-last]]"]` |
| `actors` | array | Wikilinks to actors: `["[[repo-name]]"]` |
| `updated_at` | date | YYYY-MM-DD |
| `updated_by` | string | Who last updated |

## Zettelkasten Role

**Classification:** permanent note
**Purpose in the graph:** Represent consolidated facts about squads — organizational scope, members, and system ownership.

### Linking Rules

**Structural links (frontmatter):** `members` (wikilinks to persons), `actors` (wikilinks to actors). Define the team composition — who works there and which systems it operates.
**Semantic links (body):** Wikilinks in the body should have textual context. E.g., "responsible for the operation and evolution of [[billing-api]] and [[rate-limiter]]" instead of listing loose links. Links in the body explain the team's relationship with its systems and with other teams.
**Relationship with other roles:** Teams are referenced by bridge notes (topics, discussions) and index notes (projects). Do not duplicate project history in the team — the team describes the organizational structure, the project describes the initiative.

### Completeness Criteria

A team is complete when: it has a formal name, a defined scope, at least 1 listed member, and at least 1 actor under ownership. If only the squad name is mentioned without members or actors, the content should go to `fleeting/` until it is consolidated.

## Examples

### This IS a team

1. "Squad Notifications is responsible for notification-service, retry-consumer, and crypto-service. It has 5 engineers." — Formal squad with actors and members. It is a team.

2. "We are creating Squad Orders to manage the order lifecycle. Bob will lead." — New squad with a defined scope. It is a team.

### This is NOT a team

1. "We assembled a group with people from payments and notifications to resolve the incident." — Ad-hoc/temporary group. It could be a discussion or topic, not a team.

2. "The HR team adjusted the meal voucher benefit." — Non-technical team without system ownership. Outside the vault's scope.
