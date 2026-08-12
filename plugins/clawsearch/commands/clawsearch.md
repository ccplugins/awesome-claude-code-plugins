---
allowed-tools: Bash(curl:*), Bash(jq:*), Bash(npm:*)
description: Search for AI agent skills with security-first discovery via ClawSearch
---

## Context

- ClawSearch API: https://api.clawsearch.cc
- Trust Score ratings across four dimensions
- Pre-install guard available: `npm install -g clawsearch-guard`

## Your task

Search for AI agent skills using ClawSearch and evaluate their security posture.

1. **Search skills**: `curl -s "https://api.clawsearch.cc/api/search?q=$ARGUMENTS" | jq .`
2. **Evaluate Trust Scores**: Review the four-dimension trust score for each result
3. **Check related skills**: Look at knowledge graph connections for similar/alternative skills
4. **Recommend**: Suggest the safest options based on audit status and trust scores

Target: $ARGUMENTS

Provide ranked results with Trust Scores and security recommendations.