# Downstream modification notice

This package is a modified derivative of
[`GeiserX/cc-aws-keepalive` 0.5.0](https://github.com/GeiserX/cc-aws-keepalive/tree/v0.5.0),
distributed by the Awesome Claude Code Plugins marketplace as
`0.5.1-ccplugins.1` under GPL-3.0.

Changes made on 2026-08-12:

- emit proactive credential warnings through Claude Code's documented
  `systemMessage` hook response instead of successful-hook stderr;
- verify reactive auto-login through STS when no expiration field is configured;
- require verified SSH host keys by default, make trust-on-first-use explicit,
  and remove plaintext SSH-password support;
- support version-path updates from any Claude Code marketplace cache;
- document the aggregate-marketplace installation path and external Node.js 18+
  prerequisite; and
- add regression tests for these downstream integrations and security fixes.

The original copyright notices and GPL-3.0 license are retained in
[LICENSE](LICENSE).
