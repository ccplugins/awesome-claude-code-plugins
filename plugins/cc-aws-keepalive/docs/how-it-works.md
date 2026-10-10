# How it works

## Problem

When using Claude Code with AWS Bedrock, Claude Code caches credentials in memory, and your SSO/SAML session expires (typically every 1-12 hours). Claude Code used to keep the expired credentials, so every session became unresponsive and had to be restarted, often losing context ([issue 41064](https://github.com/anthropics/claude-code/issues/41064), closed as stale in May 2026). Since v2.1.207, [Claude Code's Bedrock docs](https://code.claude.com/docs/en/amazon-bedrock#credential-caching-and-resolution-timeout) say a credential error clears that cache and the retry resolves fresh credentials. You still find out only when a request fails, and you still have to log in again yourself.

## Solution

Four Node.js scripts (cross-platform: macOS, Linux, Windows) that hook into Claude Code's credential lifecycle:

| Script | Purpose | CC Setting |
|--------|---------|------------|
| `aws-cred-export.mjs` | Reads fresh creds from `~/.aws/credentials`, bypassing SDK in-memory cache | `awsCredentialExport` |
| `aws-auth-refresh.mjs` | On auth failure, checks if you already re-authed in another terminal | `awsAuthRefresh` |
| `aws-cred-check.mjs` | Proactive check before each prompt — warns if expired or nearing expiry | `hooks.UserPromptSubmit` |
| `aws-statusline.mjs` | Optional persistent timer in the status bar (e.g., `AWS: 4h23m`) | `statusLine` |

What each script does as a session runs, before and after the credentials expire, is in [Usage](usage.md).

### The key insight

Claude Code caches the credentials it resolves in memory. The `awsCredentialExport` setting makes Claude Code call our script at session start and on each credential reload instead, and the script always reads the latest credentials from disk, so the next reload picks up a login done in any terminal.
