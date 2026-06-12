---
allowed-tools: Bash(npx:*), Bash(poc:*), Bash(cat:*)
description: Audit project dependencies for supply chain risk using behavioral signals
---

## Context

- Lock files: !`ls package-lock.json yarn.lock pnpm-lock.yaml bun.lock Cargo.toml go.sum requirements.txt 2>/dev/null || echo "none found"`

## Your task

Run a supply chain security audit on this project using [Proof of Commitment](https://github.com/piiiico/proof-of-commitment).

This scores dependencies on **behavioral commitment signals** — publisher depth, release consistency, maintenance patterns — that predict supply chain risk. Both axios and chalk scored CRITICAL *before* their 2026 compromises.

```bash
npx -y proof-of-commitment $ARGUMENTS
```

If `$ARGUMENTS` is empty, the CLI auto-detects the best manifest in the current directory (package-lock.json > yarn.lock > pnpm-lock.yaml > package.json > requirements.txt > Cargo.toml > go.sum).

After running:
1. Report CRITICAL and HIGH packages with their risk flags
2. For CRITICAL packages: explain what "single npm publisher" means as a risk
3. Suggest `poc hook` to install a pre-install gate that blocks CRITICAL packages automatically
