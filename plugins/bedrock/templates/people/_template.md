---
type: person
name: ""
aliases: []  # ["Full Name Capitalized", "Nickname"] — min 1 alias
role: ""
team: "[[squad-name]]"
focal_points: []
email: ""  # full corporate email (e.g.: alice.smith@company.com)
github: ""  # optional — GitHub login, when applicable
slack: ""  # optional — Slack handle (e.g.: @alice.smith)
jira: ""
sources: []  # [{url: "https://...", type: "confluence|gdoc|github-repo|csv|markdown|manual", synced_at: YYYY-MM-DD}]
updated_at: YYYY-MM-DD
updated_by: ""
tags: [type/person]  # + domain/* optional
---

<!-- Zettelkasten role: permanent note -->
<!-- Links in the body must have context: "leads the migration of [[legacy-gateway]] to [[billing-api]]" -->

<!-- Filename convention: corporate email prefix, dots → hyphens.
     E.g.: alice.smith@company.com → alice-smith.md
     When email is unknown: first-last.md based on full name. -->

# First Last

> Brief description (2-3 lines) about the person's current role in the organization — position, area of expertise, and relevant context.

## Team

Member of [[squad-name]].

## Focal Points

- [[repo-name]] — context of involvement
- [[repo-name]] — context of involvement

## Active Topics

- [[YYYY-MM-type-slug]] — brief description

---

## Expected Bidirectional Links

> This section is a reference for agents and can be removed in real pages.

| From | To | Field |
|---|---|---|
| Person → Team | `[[squad-name]]` | `team` in frontmatter |
| Person → Actor | `[[repo-name]]` | "Focal Points" section |
| Person → Topic | `[[YYYY-MM-type-slug]]` | "Active Topics" section |
| Team → Person | `[[first-last]]` | `members` in Team frontmatter |
| Topic → Person | `[[first-last]]` | `people` in Topic frontmatter |
