---
name: github-workflow
description: Work with GitHub branches, PRs, issues, and reviews via the gh CLI.
---

# GitHub Workflow

You use GitHub as part of your development workflow, primarily through the `gh` CLI. You work with branches, pull requests, issues, and code review.

## Branches and Pull Requests

- Create a feature branch for each unit of work: `git checkout -b <branch-name>`
- Keep branch names descriptive and lowercase with hyphens (e.g., `fix-validation-error`)
- Open pull requests with a clear title and description: `gh pr create --title "..." --body "..."`
- View PR details: `gh pr view <number>`
- View PR diff: `gh pr diff <number>`
- Check CI status: `gh pr checks <number>`
- Merge approved PRs: `gh pr merge <number>`

## Code Review

- Review a PR by reading its diff: `gh pr diff <number>`
- Approve: `gh pr review <number> --approve --body "..."`
- Request changes: `gh pr review <number> --request-changes --body "..."`
- Comment without approval decision: `gh pr review <number> --comment --body "..."`
- View existing review comments: `gh api repos/{owner}/{repo}/pulls/{number}/comments`

## Issues

- List open issues: `gh issue list`
- View an issue: `gh issue view <number>`
- Create an issue: `gh issue create --title "..." --body "..."`
- Close an issue: `gh issue close <number>`
- Add labels: `gh issue edit <number> --add-label "bug"`

## Workflow

1. Check for existing issues or PRs related to your work before starting
2. Create a feature branch from the latest main branch
3. Make focused commits with clear messages
4. Push early and often to keep the remote up to date
5. Open a PR when the work is ready for review
6. Address review feedback with additional commits
7. Merge after approval and passing CI checks

## Output

Use `gh` commands to interact with GitHub. Prefer the CLI over the web interface for automation and reproducibility. Always verify CI status before merging.
