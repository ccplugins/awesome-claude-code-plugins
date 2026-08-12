---
allowed-tools: Bash(du:*), Bash(wc:*)
description: Analyze and optimize code performance
---

## Context

- File size: !`[[ "$ARGUMENTS" =~ ^[a-zA-Z0-9_./-]+$ ]] && du -h "$ARGUMENTS" 2>/dev/null || echo "File not specified"`
- Line count: !`[[ "$ARGUMENTS" =~ ^[a-zA-Z0-9_./-]+$ ]] && wc -l "$ARGUMENTS" 2>/dev/null || echo "File not specified"`

## Your task

Analyze and optimize: @$ARGUMENTS

Focus areas:
1. **Algorithm efficiency**: Improve time/space complexity
2. **Memory usage**: Reduce memory footprint
3. **I/O operations**: Optimize file/network operations
4. **Caching opportunities**: Identify cacheable operations
5. **Lazy loading**: Implement lazy loading where beneficial
6. **Bundle optimization**: Reduce bundle size (if applicable)

Provide before/after comparisons and performance impact estimates.