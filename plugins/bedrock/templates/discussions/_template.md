---
type: discussion
title: ""
aliases: []  # ["Short Title"] — min 1 alias if title is long
date: YYYY-MM-DD
summary: ""
conclusions: []
action_items: []
related_topics: ["[[YYYY-MM-type-slug]]"]
related_actors: ["[[repo-name]]"]
related_people: ["[[first-last]]"]
related_projects: ["[[project-slug]]"]
related_teams: ["[[squad-name]]"]
source: ""  # session | meeting-notes | jira | confluence | manual
sources: []  # [{url: "https://...", type: "confluence|gdoc|github-repo|csv|markdown|manual", synced_at: YYYY-MM-DD}]
updated_at: YYYY-MM-DD
updated_by: ""
tags: [type/discussion]  # + domain/* optional
---

<!-- Zettelkasten role: bridge note -->
<!-- Links in the body contextualize participation: "[[bob-jones]] presented the migration proposal for [[legacy-gateway]]" -->

# Discussion Title

> Brief summary of the discussion in 1-2 sentences.

## Context

Description of the context and motivation for this discussion.

## Participants

| Person | Role |
|---|---|
| [[first-last]] | participant |

## Discussed Actors

| Actor | Context |
|---|---|
| [[repo-name]] | context of the mention |

## Conclusions

- Conclusion 1
- Conclusion 2

## Action Items

- [ ] Action 1 — owner: [[first-last]]
- [ ] Action 2 — owner: [[first-last]]

## Related Projects

- [[project-slug]]

## Related Topics

- [[YYYY-MM-type-slug]]

---

## Expected Bidirectional Links

> This section is a reference for agents and can be removed in real pages.

| From | To | Field |
|---|---|---|
| Discussion -> Actor | `[[repo-name]]` | `related_actors` in frontmatter |
| Discussion -> Person | `[[first-last]]` | `related_people` in frontmatter |
| Discussion -> Topic | `[[YYYY-MM-type-slug]]` | `related_topics` in frontmatter |
| Discussion -> Project | `[[project-slug]]` | `related_projects` in frontmatter |
| Discussion -> Team | `[[squad-name]]` | `related_teams` in frontmatter |
| Actor -> Discussion | `[[YYYY-MM-DD-slug]]` | "Discussions" section in Actor |
| Person -> Discussion | `[[YYYY-MM-DD-slug]]` | "Discussions" section in Person |
| Project -> Discussion | `[[YYYY-MM-DD-slug]]` | "Discussions" section in Project |
