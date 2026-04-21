# Entity: Actor

> Source of truth for required fields: `actors/_template.md`

## What it is

An **actor** is a system, service, API, or application with its own lifecycle — it has a GitHub repository, an independent deployment process, and is operated by a specific team. Actors are the fundamental infrastructure unit in the Second Brain: each actor represents something that runs in production (or has run, if deprecated).

Actors can be HTTP APIs, queue workers/consumers, cronjobs, lambdas, or monoliths. The key criterion is: **has its own repository and independent deployment**.

## When to create

- The content mentions a system/service with its own GitHub repository that does not yet exist in `actors/`
- The content describes a new application being developed (status: `in-development`)
- The content references an organization GitHub repository not yet cataloged

## When NOT to create

- It is an internal library/SDK used by other actors (e.g., `opentelemetry-golang-lib`) — that is a dependency, not an actor
- It is a module within another repository (e.g., `orders-cdc` within the `orders-api` workspace) — the actor is the root repository
- It is a CI/CD tool or shared infrastructure (e.g., ArgoCD, Karavela, Terraform modules)
- It is an external/third-party service (e.g., DataDog, New Relic, AWS SQS) — mention it as a dependency of an actor, not as its own actor

## How to distinguish from other types

| Looks like... | But is... | Key difference |
|---|---|---|
| Actor | Topic (deprecation) | If the focus is "this system is going to be shut down", it is a deprecation topic that **references** the actor. The actor is the system; the topic is the subject about it |
| Actor | Project | If the focus is "we are building a new system", it is a project until the system has a repo and deployment. Once created, the system becomes an actor |
| Actor | Person | Repo names can look like people's names (e.g., `ralph`). If it has a GitHub repo and deploys, it is an actor |

## Required fields (frontmatter)

| Field | Type | Description |
|---|---|---|
| `type` | string | Always `"actor"` |
| `name` | string | Repository name (kebab-case) |
| `category` | string | `api`, `worker`, `consumer`, `producer`, `cronjob`, `lambda`, `monolith` |
| `description` | string | Description of the system's function |
| `repository` | string | GitHub repository URL |
| `stack` | string | Tech stack separated by ` · ` |
| `status` | string | `active`, `deprecated`, `in-development` |
| `team` | wikilink | `"[[squad-name]]"` |
| `criticality` | string | `very-high`, `high`, `medium`, `low` |
| `pci` | boolean | Whether it operates under PCI DSS scope |
| `updated_at` | date | YYYY-MM-DD |
| `updated_by` | string | Who updated it |

## Zettelkasten Role

**Classification:** permanent note
**Purpose in the graph:** Represent consolidated facts about systems and services that run in production.

### Linking Rules

**Structural links (frontmatter):** `team` (wikilink to the responsible squad). These define the organizational structure — who operates the system.
**Semantic links (body):** Wikilinks in the body must have textual context explaining the relationship. E.g., "receives authorizations from [[payment-gateway]] via gRPC" instead of just "[[payment-gateway]]". Body links explain technical dependencies, data flows, and integrations — the *why* of the connection.
**Relationship with other roles:** Actors are referenced by bridge notes (topics, discussions) that explain what is happening with the system. Do not duplicate in the actor explanations that belong in a topic — the actor describes the system, the topic describes the subject about it.

### Completeness Criteria

An actor is complete when: it has an identified repository, documented stack, defined status, assigned responsible team, and a self-contained description (understandable without reading other notes). If fundamental data is missing (no repo, no team, no description), the content should go to `fleeting/` until consolidated.

## Examples

### This IS an actor

1. "The `billing-api` is a .NET 8 API that processes charges and invoices. It runs on EKS via ArgoCD in the `runtime-payments-prd` namespace." — System with repo, deployment, runtime. It is an actor.

2. "We are spinning up `health-checker` in Go to replace the old probe. It already has a GitHub repo and CI pipeline." — New system with its own repo. It is an actor (status: `in-development`).

### This is NOT an actor

1. "We use the `opentelemetry-golang-lib` library for instrumentation." — Shared library, has no independent deployment. It is a dependency of actors.

2. "ArgoCD handles deployment for all squad services." — Shared infrastructure tool, does not have independent deployment as a product. It is not an actor.
