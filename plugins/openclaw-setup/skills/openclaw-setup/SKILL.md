---
name: openclaw-setup
description: |
  Install and secure OpenClaw AI Assistant in one command.
  Generates 32-byte security token, applies hardened config, blocks dangerous tools.
  Use when: "openclaw", "clawbot", "install", "security setup"
userInvocable: true
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
version: "1.0.0"
---

# OpenClaw Setup

> **One command. Full security.**

Install and configure [OpenClaw](https://openclaw.ai) AI Assistant with paranoid-level security defaults.

## Usage

```bash
/openclaw-setup              # Full install + security
/openclaw-setup install      # Install only
/openclaw-setup security     # Security config only
/openclaw-setup audit        # Security audit only
```

## What It Does

### Phase 1: Installation
```bash
which openclaw || curl -fsSL https://openclaw.ai/install.sh | bash
openclaw --version
```

### Phase 2: Generate Security Token
```bash
openssl rand -base64 32
```

### Phase 3: Create Secure Config

Creates `~/.openclaw/openclaw.json` with:

| Setting | Value | Effect |
|---------|-------|--------|
| Gateway | `loopback` | Local access only |
| Auth | `token` | 32-byte token required |
| DM Policy | `pairing` | Pairing code required |
| Sandbox | `mode: all` | All tools sandboxed |
| Workspace | `ro` | Read-only |
| Dangerous tools | `deny` | exec, write, browser blocked |

### Phase 4: Harden Permissions
```bash
chmod 700 ~/.openclaw
chmod 600 ~/.openclaw/openclaw.json
```

### Phase 5: Run Audit
```bash
openclaw security audit
```

## Blocked Tools
- `exec` - Shell execution
- `write` / `edit` - File modification
- `browser` - Browser automation
- `process` - Process control
- `apply_patch` - Code patches

## Allowed Tools
- `read` - File reading
- `search` - Code search
- `web_search` / `web_fetch` - Web access

## After Setup

```bash
openclaw onboard                      # Complete setup
openclaw channels login whatsapp      # Connect WhatsApp
openclaw status                       # Verify
```

## Links

- [OpenClaw Docs](https://docs.openclaw.ai)
- [Security Guide](https://docs.openclaw.ai/security)
- [Plugin Repository](https://github.com/cathy-kim/openclaw-plugin)

---

**Version**: 1.0.0
