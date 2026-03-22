---
allowed-tools: Bash(curl:*), Bash(jq:*)
description: Check security audit status of an AI agent skill via ClawSec
---

## Context

- ClawSec API: https://api.clawsec.cc
- Audits 33,000+ skills with a 5-tier assessment engine

## Your task

Query the ClawSec API to check the security audit status of the specified skill.

1. **Lookup skill**: `curl -s "https://api.clawsec.cc/api/skills/search?q=$ARGUMENTS" | jq .`
2. **Review findings**: Check the audit score, risk level, and any flagged vulnerabilities
3. **Summarize**: Present the security assessment with actionable recommendations

Target: $ARGUMENTS

Provide a clear security summary with pass/fail status and any remediation steps.