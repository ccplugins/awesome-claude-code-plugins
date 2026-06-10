# Web Security Guard

[![Claude Code Plugin](https://img.shields.io/badge/Claude%20Code-plugin-d97757)](https://docs.claude.com/en/docs/claude-code)
[![Version](https://img.shields.io/badge/version-0.2.1-blue)](https://github.com/ayalaphiscan/web-security-guard/releases)
[![License: MIT](https://img.shields.io/badge/license-MIT-green)](LICENSE)

A security plugin for [Claude Code](https://docs.claude.com/en/docs/claude-code) and Claude Cowork that turns Claude into a security-aware engineer. It bundles 6 skills, 2 slash commands and ready-to-deploy infrastructure templates covering the full lifecycle: hardening, authentication, payments privacy, active defense, stealth architecture and CI security.

```
/plugin marketplace add ayalaphiscan/web-security-guard
```

## What's inside

| Skill | What it does |
|---|---|
| `hardening-siti` | Applies security hardening whenever a site/app is built or reviewed: security headers, CSP, HTTPS, input validation, cookies, CORS, uploads, OWASP Top 10 |
| `autenticazione-sicura` | Secure auth flows: email verification codes, 2FA/TOTP, passkeys, password hashing, sessions, account recovery |
| `difesa-attacchi` | Installs a defense agent (WAF middleware for Express) that detects SQLi, XSS, path traversal, brute force and bots — with rate limiting, IP blocklist and a data-preserving lockdown mode |
| `privacy-pagamenti` | Protects payment data: secure Stripe/PayPal integration, webhook signature verification, PCI-DSS, GDPR, data minimization |
| `architettura-fortezza` | Designs a 4-layer "Fortress": invisible reverse-proxy shield, hidden origin server, WireGuard mesh, air-gapped offline vault with encrypted backups. Includes all deployment templates in `references/fortezza/` |
| `sicurezza-github` | Adds automated security workflows to your repos: dependency scanning, secret scanning, CodeQL, Dependabot |

**Commands:** `/proteggi-sito` (install all protections in the current project) · `/security-audit` (full security audit with report)

**Battle-tested defense agent.** The included `guardian` middleware (plain Node.js, zero runtime dependencies) handles malformed-URI evasion attempts, prunes its memory maps to avoid unbounded growth, and ships in two flavors: standard (with explanatory 403s) and stealth (attackers get their connection dropped, no response at all).

## Installation

### Claude Code
```
/plugin marketplace add ayalaphiscan/web-security-guard
/plugin install web-security-guard@web-security-guard
```

### Claude Cowork (desktop app)
Download this repository as a zip, rename it to `web-security-guard.plugin`, then install it from **Settings → Capabilities**.

## Usage examples

- *"Build me a login page"* → hardening + secure authentication kick in automatically
- *"Add Stripe subscriptions"* → payment privacy rules are applied
- *"I want my server hidden and my data in a box"* → Fortress architecture, with templates
- `/security-audit` → full report of issues and fixes for the current project

## Honest limits (by design, stated in the skills)

The public web port can never be invisible — what can be made invisible are SSH, admin, the real origin server and the vault. Large volumetric DDoS still requires an external CDN/WAF. The skills promise *minimal attack surface, unreachable core, recoverable data* — never "unhackable".

## License

[MIT](LICENSE) — © ayalaphiscan (Fede)
