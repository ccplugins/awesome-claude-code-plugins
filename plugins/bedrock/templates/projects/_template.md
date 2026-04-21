---
type: project
name: ""
aliases: []  # ["Acronym", "Short Name"] — min 1 alias (e.g., ["V2 Migration"])
description: ""
status: ""  # planning | active | blocked | completed
deadline: ""
progress: ""
blockers: []
action_items:
  - description: "Action item description"
    status: "todo"  # todo | in_progress | done | blocked
    deadline: "YYYY-MM-DD"
    owner: "[[first-last]]"
focal_points: ["[[first-last]]"]
related_topics: ["[[YYYY-MM-type-slug]]"]
related_actors: ["[[repo-name]]"]
related_teams: ["[[squad-name]]"]
sources: []  # [{url: "https://...", type: "confluence|gdoc|github-repo|csv|markdown|manual", synced_at: YYYY-MM-DD}]
updated_at: YYYY-MM-DD
updated_by: ""
tags: [type/project]  # + status/{planning,active,blocked,completed} + domain/* optional
---

<!-- Zettelkasten role: index note -->
<!-- Links in the body point to where the knowledge lives: "progress documented in [[2026-06-deprecation-legacy-gateway]]" — curation, not repetition -->

# Project Name

> Brief description of the project's objective and scope.

## Overview

Description of the project, its motivation, and expected outcomes.

## Status

| Field | Value |
|---|---|
| Status | planning / active / blocked / completed |
| Deadline | YYYY-MM-DD |
| Progress | description of current progress |

> **Convention:** The project status reflects a management decision. The action items below help infer the actual state, but do not derive the status automatically. Examples: if all items are `done`, the project is likely `completed`; if any item is `blocked`, consider updating the project status to `blocked`.

## Action Items

| Item | Status | Deadline | Owner |
|---|---|---|---|
| Item description | todo | YYYY-MM-DD | [[first-last]] |

> Action items are defined in the frontmatter (`action_items` field) to enable Dataview queries. The table above is a visualization for readability.

**Dataview query — pending items for this project:**

```dataview
TABLE WITHOUT ID
  item.description AS "Item",
  item.status AS "Status",
  item.deadline AS "Deadline",
  item.owner AS "Owner"
FROM "projects"
WHERE file.name = this.file.name
FLATTEN action_items AS item
WHERE item.status != "done"
SORT item.deadline ASC
```

## Blockers

- Blocker 1 — description and impact

## Focal Points

| Person | Role |
|---|---|
| [[first-last]] | lead |
| [[first-last]] | contributor |

## Related Topics

| Topic | Relation |
|---|---|
| [[YYYY-MM-type-slug]] | related topic |

## Related Actors

| Actor | Relation |
|---|---|
| [[repo-name]] | affected system |

## Related Teams

| Team | Relation |
|---|---|
| [[squad-name]] | owning team |

---

## Expected Bidirectional Links

> This section is a reference for agents and can be removed in real pages.

| From | To | Field |
|---|---|---|
| Project → Topic | `[[YYYY-MM-type-slug]]` | `related_topics` in frontmatter |
| Project → Actor | `[[repo-name]]` | `related_actors` in frontmatter |
| Project → Person | `[[first-last]]` | `focal_points` in frontmatter |
| Project → Team | `[[squad-name]]` | `related_teams` in frontmatter |
| Actor → Project | `[[project-slug]]` | "Related Projects" section in Actor |
| Topic → Project | `[[project-slug]]` | "Related Projects" section in Topic |
| Person → Project | `[[project-slug]]` | "Projects" section in Person |
