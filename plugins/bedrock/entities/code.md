# Entity: Code

> Source of truth for required fields: `actors/_template_node.md`

## What it is

A **code** entity is a granular unit of knowledge automatically extracted by graphify from an actor's source code or documentation. It represents functions, classes, modules, concepts, decisions, interfaces, or endpoints that were identified by semantic analysis (AST + LLM) of the repository.

Code entities are sub-entities of actors — each code entity belongs to exactly one actor and lives inside the actor's folder at `actors/<actor-name>/nodes/`. They form the fine-grained detail layer of the knowledge graph, connecting the vault to information that exists in the code but would not be captured by high-level descriptions.

## When to create

- Graphify extracted a node from an actor's repository (function, class, module, interface, endpoint) with semantic relevance
- Graphify extracted a concept or architectural decision from documentation linked to an actor
- The node has `confidence` EXTRACTED or INFERRED (not purely AMBIGUOUS)
- The corresponding actor already exists in the vault

## When NOT to create

- The node is trivial (generic getter/setter, boilerplate, auto-generated code) — filter by relevance
- The node already exists as another entity in the vault (e.g., a concept that is already a topic)
- The corresponding actor does not exist in the vault — create the actor first
- The node has confidence AMBIGUOUS without edges connecting it to other nodes — isolated information without value
- The content is sensitive (credentials, tokens, PANs, CVVs) — never persist sensitive data

## How to distinguish from other types

| Looks like... | But is... | Key difference |
|---|---|---|
| Code | Topic | If the content is a broad architectural decision affecting multiple actors, it is a topic. If it is specific to a function/class of one actor, it is a code entity |
| Code | Actor | If it has its own repository and independent deployment, it is an actor. Code entities are internal parts of an actor |
| Code | Fleeting | If it came from graphify with confidence EXTRACTED/INFERRED and has a `graphify_node_id`, it is a code entity. If it is a loose idea without a link to the graph, it is fleeting |
| Code | Discussion | If it describes a decision made in a meeting/debate, it is a discussion. If it describes a design decision found in the code, it is a code entity |
| Code | Concept | If the content describes a cross-cutting pattern, principle, or abstraction that is actor-independent, it is a concept. If it is specific to a single actor's implementation, it is a code entity |

## Required fields (frontmatter)

| Field | Type | Description |
|---|---|---|
| `type` | string | Always `"code"` |
| `name` | string | Human-readable name of the node (e.g., `"ProcessTransaction"`, `"KafkaEventPublisher"`) |
| `aliases` | array | Alternative names (min 1). E.g., `["Process Transaction", "processTransaction"]` |
| `actor` | wikilink | `"[[actor-name]]"` — parent actor to which this code entity belongs |
| `node_type` | string | `function`, `class`, `module`, `concept`, `decision`, `interface`, `endpoint` |
| `source_file` | string | Relative path in the actor's repo (e.g., `src/Controllers/PaymentController.cs`) |
| `description` | string | Description of this node's function/role |
| `graphify_node_id` | string | Unique node ID in graph.json (e.g., `billing_api_processTransaction`) |
| `confidence` | string | `EXTRACTED`, `INFERRED`, or `AMBIGUOUS` — extraction confidence level |
| `updated_at` | date | YYYY-MM-DD |
| `updated_by` | string | Who updated it |
| `tags` | array | Hierarchical tags: `[type/code]` + `domain/*` inherited from the actor |

### Optional fields

| Field | Type | Description |
|---|---|---|
| `relations` | array | Wikilinks to other code entities or related entities |
| `source_location` | string | Line or range in the source_file (e.g., `L42-L85`) |

## Zettelkasten Role

**Classification:** permanent note extension (sub-entity of actor)
**Purpose in the graph:** Represent granular implementation details of actors — functions, classes, design decisions — that enrich the knowledge graph without polluting the high-level permanent notes.

### Linking Rules

**Structural links (frontmatter):** `actor` (wikilink to the parent actor). Defines the hierarchy — every code entity belongs to exactly one actor.
**Semantic links (body):** Wikilinks in the body should have textual context when possible. E.g., "calls [[ProcessPayment]] to execute the transaction" instead of just "[[ProcessPayment]]". For code entities with many relations, links in the frontmatter (`relations`) are acceptable without textual context.
**Relationship with other roles:** Code entities are referenced by the parent actor ("Knowledge Nodes" section) and can be referenced by bridge notes (topics, discussions) when relevant. Code entities reference each other via `relations` and edges from graph.json.

### Completeness Criteria

A code entity is complete when: it has a valid `graphify_node_id`, defined `actor`, defined `node_type`, identified `source_file`, and a self-contained `description`. If `graphify_node_id` or `actor` is missing, the content should go to `fleeting/`.

## Examples

### This IS a code entity

1. "The function `ProcessTransaction` in `src/Controllers/PaymentController.cs` of `billing-api` is responsible for orchestrating the processing flow with the selected provider." — Specific function of an actor, extracted by AST. It is a code entity.

2. "The class `KafkaEventPublisher` implements the event publishing pattern for Kafka topics following the orders contract." — Internal class of an actor. It is a code entity.

3. "The endpoint `POST /v1/payments/authorize` receives authorization requests and delegates to `AuthorizationService`." — API endpoint of an actor. It is a code entity.

### This is NOT a code entity

1. "The billing-api is being refactored to support internationalization." — High-level information about the actor. It is a topic.

2. "We decided in the daily that the retry pattern will change to exponential backoff." — Decision made in a meeting. It is a discussion.

3. "There might be a race condition in the void worker." — Unconfirmed hypothesis. It is fleeting.

4. "Event sourcing is a pattern where state changes are captured as a sequence of events." — Cross-cutting abstraction, not specific to one actor. It is a concept.
