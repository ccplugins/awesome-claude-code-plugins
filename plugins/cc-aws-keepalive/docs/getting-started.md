# Getting started

Requires Node.js 18 or newer. Install Node.js separately if it is not already
available on your `PATH`; native Claude Code installations do not provide a
standalone `node` executable.

## Option A: As a Claude Code plugin (recommended)

```bash
/plugin marketplace add ccplugins/awesome-claude-code-plugins
/plugin install cc-aws-keepalive@awesome-claude-code-plugins
```

The plugin auto-registers the `UserPromptSubmit` hook. You still need to add `awsCredentialExport` and `awsAuthRefresh` to `~/.claude/settings.json` — point them at the cached plugin path:

```json
{
  "awsCredentialExport": "node ~/.claude/plugins/cache/awesome-claude-code-plugins/cc-aws-keepalive/<version>/aws-cred-export.mjs",
  "awsAuthRefresh": "node ~/.claude/plugins/cache/awesome-claude-code-plugins/cc-aws-keepalive/<version>/aws-auth-refresh.mjs"
}
```

Replace `<version>` with the installed version (for this snapshot,
`0.5.2-ccplugins.1`),
then run the cached installer. It creates the protected config file and prints
the exact settings paths for this installation:

```bash
node ~/.claude/plugins/cache/awesome-claude-code-plugins/cc-aws-keepalive/<version>/install.mjs
```

Edit the created `~/.config/cc-aws-keepalive/config.json` before using the
plugin.

## Option B: Manual (no plugin system)

```bash
git clone https://github.com/GeiserX/cc-aws-keepalive.git
cd cc-aws-keepalive
node install.mjs
```

The installer creates a config and prints all settings to add to `~/.claude/settings.json`.

## Upgrading

After upgrading, re-run the installer to update paths:

- **Plugin**: `node ~/.claude/plugins/cache/awesome-claude-code-plugins/cc-aws-keepalive/<version>/install.mjs`
- **Manual**: `git pull && node install.mjs`

The installer automatically:

1. **OMC HUD wrapper**: Cleans up any legacy timer patch from `omc-hud.mjs` and updates the `aws-hud-wrapper.mjs` with the current path
2. **settings.json paths**: Updates `awsCredentialExport` and `awsAuthRefresh` to point to the new version directory (preserves any custom wrapper commands)

## Requirements

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) with `CLAUDE_CODE_USE_BEDROCK=1`
- Node.js 18 or newer, installed separately and available on `PATH`
- Any AWS credential provider that writes to `~/.aws/credentials`

## Platform notes

The core scripts (credential export, auth refresh, cred check, statusline) work on **macOS, Linux, and Windows**. The `autoLoginCmd` feature runs your command via the platform's native shell (`/bin/sh` on Unix, `cmd.exe` on Windows). On Windows, use a PowerShell script instead of `expect` — see [Windows alternative](auto-login.md#windows-alternative).
