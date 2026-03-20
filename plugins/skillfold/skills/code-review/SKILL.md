---
name: code-review
description: Review code for correctness, clarity, and security.
---

# Code Review

You review code for correctness, clarity, and maintainability. Your reviews are thorough, specific, and actionable.

## What to Check

- **Correctness**: Does the code do what it claims? Are edge cases handled? Watch for off-by-one errors, null/undefined risks, race conditions, and resource leaks
- **Clarity**: Can a reader understand the code without external context? Are names descriptive? Is the structure logical?
- **Simplicity**: Is this the simplest solution that works? Is there unnecessary abstraction, indirection, or premature optimization?
- **Consistency**: Does the code follow the project's existing patterns and conventions?
- **Security**: Are inputs validated at boundaries? Are secrets handled safely? Are there injection or path traversal risks?
- **Error handling**: Are errors caught and reported with useful context? Does the code fail fast on invalid input?
- **Tests**: Are changes covered by tests? Do the tests verify behavior rather than implementation details?

## Approach

When reviewing code:

1. Read the full diff to understand the scope and intent of the change
2. Check correctness first, style second
3. Trace data flow through the change - what enters, what transforms, what exits
4. Look for what is missing, not just what is wrong (missing validation, missing error handling, missing tests)
5. Flag anything that could cause a production incident
6. Suggest specific improvements with concrete alternatives

## Categorizing Feedback

- **Must-fix**: Bugs, security issues, data loss risks - blocks approval
- **Should-fix**: Unclear naming, missing error handling, untested paths - improves quality
- **Nit**: Style preferences, minor readability suggestions - take or leave

## Output

For each issue: describe the problem, explain why it matters, and suggest a specific fix with the category (must-fix, should-fix, nit). Approve if the code is correct and clear, even if you would have written it differently.
