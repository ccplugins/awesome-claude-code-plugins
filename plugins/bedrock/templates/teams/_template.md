---
type: team
name: ""
aliases: []  # ["Short Name", "Full Name"] — min 1 alias (e.g., ["Payments", "Squad Payments"])
scope: ""
purpose: ""
members: ["[[first-last]]"]
actors: ["[[repo-name]]"]
jira_board: ""
confluence_space: ""
sources: []  # [{url: "https://...", type: "confluence|gdoc|github-repo|csv|markdown|manual", synced_at: YYYY-MM-DD}]
updated_at: YYYY-MM-DD
updated_by: ""
tags: [type/team]  # + domain/{payments,finance,notifications,checkout,orders,integrations,compliance,core,data,infra,marketplace,internal-tools,platform,security}
---

<!-- Zettelkasten role: permanent note -->
<!-- Links in the body must have context: "responsible for operating [[billing-api]]" -->

# Team Name

> Brief description of scope and purpose.

## Members

| Person | Role |
|---|---|
| [[first-last]] | Role |
| [[first-last]] | Role |

## Actors under Ownership

| Actor | Category | Status |
|---|---|---|
| [[repo-name]] | api | active |
| [[repo-name]] | worker | deprecated |

## Responsibilities

- Responsibility 1
- Responsibility 2

## Useful Links

- Jira Board: [link]()
- Confluence Space: [link]()

---

## Expected Bidirectional Links

> This section is a reference for agents and can be removed in real pages.

| From | To | Field |
|---|---|---|
| Team → Person | `[[first-last]]` | `members` in frontmatter |
| Team → Actor | `[[repo-name]]` | `actors` in frontmatter |
| Person → Team | `[[squad-name]]` | `team` in Person frontmatter |
| Actor → Team | `[[squad-name]]` | `team` in Actor frontmatter |
