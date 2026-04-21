---
type: concept
name: ""
aliases: []  # ["Readable Name", "Acronym"] — min 1 alias
description: ""
related_to: ["[[entity-name]]"]  # wikilinks to any related entity type
sources: []  # [{url: "https://...", type: "confluence|gdoc|github-repo|csv|markdown|manual", synced_at: YYYY-MM-DD}]
updated_at: YYYY-MM-DD
updated_by: ""
tags: [type/concept]  # + domain/{payments,finance,notifications,checkout,orders,integrations,compliance,core,data,infra,marketplace,internal-tools,platform,security}
---

<!-- Zettelkasten role: permanent note -->
<!-- Links in the body must have context: "commonly used by [[billing-api]] and [[notification-service]] for resilient HTTP calls" -->

# Concept Name

> One-line definition of what this concept IS.

## Description

Detailed explanation of the concept — what it is, how it works, and why it matters.
Self-contained: a reader should understand the concept without needing to read other entities.

## Key Characteristics

- Characteristic 1
- Characteristic 2
- Characteristic 3

## Where it Applies

- [[entity-name]] — how the concept applies to this entity

## Related Concepts

- [[concept-name]] — relationship description

---

## Expected Bidirectional Links

> This section is a reference for agents and can be removed in real pages.

| From | To | Field |
|---|---|---|
| Concept → Actor | `[[repo-name]]` | "Where it Applies" section |
| Concept → Topic | `[[YYYY-MM-type-slug]]` | "Where it Applies" section |
| Concept → Concept | `[[concept-name]]` | "Related Concepts" section |
| Actor → Concept | `[[concept-name]]` | "Related Topics" or body reference |
| Topic → Concept | `[[concept-name]]` | body reference |
