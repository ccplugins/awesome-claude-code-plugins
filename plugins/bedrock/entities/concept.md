# Entity: Concept

> Source of truth for required fields: `concepts/_template.md`

## What it is

A **concept** is a timeless, definitional unit of knowledge — a pattern, principle, technique, protocol, or abstraction that is self-contained and actor-independent. Concepts describe *what something IS*, not what is happening with it. They are the canonical source of truth for ideas that recur across multiple entities in the vault.

Concepts consolidate knowledge that would otherwise be scattered: instead of each actor and topic re-describing "event sourcing" or "circuit breaker pattern" in their own words, they reference the concept via wikilink. The concept page holds the stable definition; temporal evolution of how the concept is being adopted lives in topics that reference it.

## When to create

- The content defines a pattern, principle, or technique that is referenced by multiple actors or topics (e.g., "event sourcing", "saga pattern", "PCI tokenization flow")
- The content describes a protocol or standard that governs how systems interact (e.g., "mTLS authentication", "ISO 8583 message format")
- The content explains an abstraction or architectural paradigm used across the organization (e.g., "CQRS", "hexagonal architecture", "strangler fig pattern")
- Graphify extracted a concept node (`file_type: document` or `file_type: paper`) that is self-contained and not specific to a single actor's implementation

## When NOT to create

- The content describes a temporal initiative with status and lifecycle (e.g., "we are migrating to event sourcing") — that is a topic
- The content is specific to a single actor's implementation (e.g., "the retry logic in billing-api uses exponential backoff") — that is a code entity (sub-entity of the actor)
- The content is a vague or unconfirmed idea without a clear definition (e.g., "maybe we should look into CQRS") — that is fleeting
- The content is a meeting or conversation about a concept (e.g., "we discussed event sourcing in the daily") — that is a discussion

## How to distinguish from other types

| Looks like... | But is... | Key difference |
|---|---|---|
| Concept | Topic | A topic is temporal — it has a status, lifecycle, and tracks what is HAPPENING over time (e.g., "migration to event sourcing"). A concept is timeless — it defines what something IS (e.g., "event sourcing"). A topic can reference a concept. |
| Concept | Code | A code entity is a sub-entity of a specific actor — it describes an implementation detail (function, class, endpoint) inside one system. A concept is actor-independent — it describes a pattern or principle used across systems. |
| Concept | Fleeting | A fleeting note is a raw, unconfirmed fragment. A concept is self-contained and definitional — it has a clear name, description, and enough context to stand on its own. If the idea is vague, it belongs in fleeting until it matures. |
| Concept | Actor | An actor has a repository and deployment. A concept is abstract knowledge — it has no repo, no deployment, no infrastructure. If it deploys, it is an actor. |

## Required fields (frontmatter)

| Field | Type | Description |
|---|---|---|
| `type` | string | Always `"concept"` |
| `name` | string | Human-readable name of the concept (e.g., `"Event Sourcing"`, `"Circuit Breaker Pattern"`) |
| `aliases` | array | Alternative names (min 1). E.g., `["ES", "Event-Driven State"]` |
| `description` | string | One-line definition of the concept |
| `related_to` | array | Wikilinks to related entities of any type: `["[[entity-name]]"]` |
| `sources` | array | Provenance: `[{url, type, synced_at}]` |
| `updated_at` | date | YYYY-MM-DD |
| `updated_by` | string | Who updated it |
| `tags` | array | Hierarchical tags: `[type/concept]` + `domain/*` when applicable |

### Optional fields

| Field | Type | Description |
|---|---|---|
| `graphify_node_id` | string | Unique node ID in graph.json (when extracted by graphify) |
| `confidence` | string | `EXTRACTED`, `INFERRED`, or `AMBIGUOUS` — extraction confidence level (when extracted by graphify) |

## Zettelkasten Role

**Classification:** permanent note
**Purpose in the graph:** Represent stable, timeless, definitional knowledge — patterns, principles, techniques, protocols, and abstractions — that multiple entities reference instead of re-describing.

### Linking Rules

**Structural links (frontmatter):** `related_to` (wikilinks to any related entity). This is a flat list — the body provides the semantic context for each relationship.
**Semantic links (body):** Wikilinks in the body must have textual context. E.g., "commonly implemented in Go services like [[billing-api]] and [[notification-service]] using the circuit breaker library" — not just "[[billing-api]]". The concept body explains what the concept IS and how it connects to the vault's entities.
**Relationship with other roles:** Concepts are referenced by bridge notes (topics) that track temporal adoption or evolution. Concepts are referenced by permanent notes (actors) that implement them. Concepts do not duplicate information from topics — the concept defines the idea, the topic tracks what is happening with it.

### Completeness Criteria

A concept is complete when: it has a clear name, a self-contained description that defines what it IS, and at least 1 related entity referenced with context. If the idea is vague, lacks a clear definition, or cannot stand on its own without reading other entities, the content should go to `fleeting/` until it matures.

## Examples

### This IS a concept

1. "Event sourcing is a pattern where state changes are captured as a sequence of events rather than storing only the current state. Events are immutable and append-only." — Timeless definition of a pattern. Self-contained. Not specific to one actor. It is a concept.

2. "The circuit breaker pattern prevents cascading failures by detecting repeated errors and temporarily stopping calls to a failing service, returning a fallback response instead." — Defines a technique used across multiple systems. It is a concept.

3. "mTLS (mutual TLS) is a protocol where both client and server authenticate each other using certificates, ensuring bidirectional identity verification." — Protocol definition, actor-independent. It is a concept.

### This is NOT a concept

1. "We are migrating all Go services from REST to gRPC by Q3." — Temporal initiative with deadline. This is a topic (category: `rfc` or `feature`).

2. "The `CircuitBreakerMiddleware` class in notification-service wraps HTTP calls with a 5-second timeout and 3-retry threshold." — Implementation detail specific to one actor. This is a code entity of notification-service.

3. "Someone mentioned we should try CQRS for the new orders system." — Vague, unconfirmed. This is a fleeting note until it has a clear definition and confirmed relevance.
