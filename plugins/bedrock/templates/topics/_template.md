---
type: topic
title: ""
aliases: []  # ["Short Title"] — min 1 alias (e.g., ["Deprecation Probe"])
category: ""  # bugfix | troubleshooting | rfc | incident | feature | deprecation | compliance
status: ""  # open | in-progress | completed | cancelled
people: ["[[first-last]]"]
actors: ["[[repo-name]]"]
objective: ""
created_at: YYYY-MM-DD
sources: []  # [{url: "https://...", type: "confluence|gdoc|github-repo|csv|markdown|manual", synced_at: YYYY-MM-DD}]
updated_at: YYYY-MM-DD
updated_by: ""
tags: [type/topic]  # + status/{open,in-progress,completed,cancelled} + category/{deprecation,bugfix,...} + domain/* optional
---

<!-- Zettelkasten role: bridge note -->
<!-- Links in the body explain WHY permanents relate: "the deprecation of [[legacy-gateway]] is blocked because clients of the legacy system depend on the tokenization of [[billing-api]]" -->

# Topic Title

> Brief description of the topic's objective.

<!-- Mandatory callout for deprecation topics: -->
<!-- > [!warning] Deprecated -->
<!-- > Description of the deprecation plan and affected systems. -->

## Context

Description of context and motivation.

## People Involved

| Person | Role |
|---|---|
| [[first-last]] | focal point |
| [[first-last]] | contributor |

## Actors Involved

| Actor | Relation |
|---|---|
| [[repo-name]] | affected system |
| [[repo-name]] | replacement system |

## History

| Date | Event |
|---|---|
| YYYY-MM-DD | Event description |

## Decisions

- Decision 1 — justification

## Next Steps

- [ ] Action 1
- [ ] Action 2

---

## Expected Bidirectional Links

> This section is a reference for agents and can be removed in real pages.

| From | To | Field |
|---|---|---|
| Topic → Person | `[[first-last]]` | `people` in frontmatter |
| Topic → Actor | `[[repo-name]]` | `actors` in frontmatter |
| Person → Topic | `[[YYYY-MM-type-slug]]` | "Active Topics" in Person |
| Actor → Topic | `[[YYYY-MM-type-slug]]` | "Related Topics" in Actor |
