---
type: actor
name: ""
aliases: []  # ["Display Name", "SIGLA"] — min 1 alias
category: ""  # api | worker | consumer | producer | cronjob | lambda | monolith
description: ""
repository: ""
stack: ""
status: ""  # active | deprecated | in-development
team: "[[squad-name]]"
criticality: ""  # very-high | high | medium | low
pci: false
known_issues: []
sources: []  # [{url: "https://...", type: "confluence|gdoc|github-repo|csv|markdown|manual", synced_at: YYYY-MM-DD}]
last_synced_at: ""  # YYYY-MM-DD — last sync via /sync-github (optional)
last_synced_sha: ""  # SHA of last synced commit (optional)
updated_at: YYYY-MM-DD
updated_by: ""
tags: [type/actor]  # + status/{active,deprecated,in-development} + domain/{payments,finance,notifications,checkout,orders,integrations,compliance,core,data,infra,marketplace,internal-tools,platform,security} + scope/{pci,sox,lgpd,hipaa,gdpr,soc2}
---

<!-- Zettelkasten role: permanent note -->
<!-- Links in the body must have context: "receives authorizations from [[payment-gateway]] via gRPC" -->

# Actor Name

> Brief description of the system's function.

<!-- Mandatory callouts — uncomment when applicable: -->
<!-- > [!warning] Deprecated -->
<!-- > This system is being deprecated. Replacement: [[replacement]]. -->

<!-- > [!danger] PCI Scope -->
<!-- > This system is in PCI DSS scope. Never log card data (PAN, CVV, tracks, EMV). -->

## Details

| Field | Value |
|---|---|
| Repository | [repo-name](https://github.com/org/repo-name) |
| Stack | Language · Framework · Database · Messaging |
| Status | active / deprecated |
| Criticality | very-high / high / medium / low |
| PCI | yes / no |
| Team | [[squad-name]] |

## Dependencies

- Depends on: [[repo-name]] (flow description)
- Depended by: [[repo-name]] (flow description)

## Flows

- `actor-name` ← ACTION from [[repo-name]]
- `actor-name` → ACTION to [[repo-name]]

## Dev Commands

```bash
# Development commands
```

## Known Issues

- Issue 1 — description and impact

## Related Topics

- [[YYYY-MM-type-slug]] — brief description

---

## Expected Bidirectional Links

> This section is a reference for agents and can be removed in real pages.

| From | To | Field |
|---|---|---|
| Actor → Team | `[[squad-name]]` | `team` in frontmatter |
| Actor → Actor | `[[repo-name]]` | "Dependencies" and "Flows" sections |
| Actor → Topic | `[[YYYY-MM-type-slug]]` | "Related Topics" section |
| Team → Actor | `[[repo-name]]` | `actors` in Team frontmatter |
| Topic → Actor | `[[repo-name]]` | `actors` in Topic frontmatter |
| Person → Actor | `[[repo-name]]` | "Focal Points" in Person |
