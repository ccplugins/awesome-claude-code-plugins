# Downstream modification notice

This package is a modified derivative of
[`GeiserX/cc-aws-keepalive` 0.5.1](https://github.com/GeiserX/cc-aws-keepalive/tree/v0.5.1),
distributed by the Awesome Claude Code Plugins marketplace as
`0.5.2-ccplugins.1` under GPL-3.0-or-later.

Changes made on 2026-08-12 against upstream 0.5.0, and carried onto upstream
0.5.1 on 2026-10-10:

- raise the `UserPromptSubmit` hook timeout in `hooks/hooks.json` from 10 to
  15 seconds;
- verify reactive auto-login through STS when no expiration field is configured;
- require verified SSH host keys by default, make trust-on-first-use explicit,
  and remove plaintext SSH-password support;
- support version-path updates from any Claude Code marketplace cache;
- document the aggregate-marketplace installation path and external Node.js 18+
  prerequisite in `docs/getting-started.md`, the SSH changes in
  `docs/credential-sync.md`, and add a note to `README.md` that points to this
  notice and gives the marketplace install commands;
- add regression tests for these downstream integrations and security fixes;
  and
- give the package its own version in `package.json` and
  `.claude-plugin/plugin.json` (`0.5.1-ccplugins.1` until 2026-10-10, now
  `0.5.2-ccplugins.1`), and list this notice in the `package.json` `files`
  array.

Two earlier downstream changes are now part of upstream 0.5.1 and no longer
differ from it: hook warnings sent as a `systemMessage` instead of stderr, and
the `GPL-3.0-or-later` license declaration.

Repository-only files of upstream 0.5.1 are not included: CI and code-review
configuration, agent and issue-tracker files, `.gitignore`, `SECURITY.md`, the
upstream marketplace manifest and the social preview image.

The original copyright notices and GPL-3.0 license are retained in
[LICENSE](LICENSE).
