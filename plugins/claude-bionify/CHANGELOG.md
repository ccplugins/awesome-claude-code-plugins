# Changelog

All notable changes to claude-bionify are documented here. This project follows
[semantic versioning](https://semver.org) and [Keep a Changelog](https://keepachangelog.com).

## [1.0.6] - 2026-08-17

### Fixed
- `/claude-bionify:status` no longer reports that nothing is being bolded when it is. The
  check read the interpreter's entire output, so a banner printed ahead of it by a
  `sitecustomize` or a conda activation hid the version line and a perfectly good Python was
  counted as unusable. It now reads the last line the probe prints.
- A malformed `hooks.json` no longer leaves `/claude-bionify:status` silent. An unreadable
  file now says so, and an oddly shaped one is treated as declaring no interpreters rather
  than raising.

## [1.0.5] - 2026-08-15

### Fixed
- The hook now starts on native Windows. It ran as `python3`, a name that is usually not
  Python there: the python.org installer creates no `python3.exe`, and Windows ships a
  Microsoft Store placeholder of that name which exits without running anything. Hooks are
  spawned with no shell, so there was no fallback, and a failed `MessageDisplay` hook shows
  the original text without reporting an error. The hook is now declared as both `python3`
  and `py -3`, and the first that starts does the bolding. Thanks to @aermak for the report.
- `/claude-bionify:status` no longer reports ON while nothing is being bolded.

### Known limitation
- Where `python3` is the Store placeholder, bolding works but the `/claude-bionify:*`
  commands do not, since they run through a shell and no fallback syntax suits both Git Bash
  and PowerShell 5.1. Installing Git for Windows, or a real `python3` on `PATH`, restores them.

## [1.0.4] - 2026-08-13

### Fixed
- Code blocks are less likely to be bolded as prose when Claude streams quickly.
  Claude Code runs up to three flushes of one message at once, and the file that
  remembers whether a code fence is open was truncated before being rewritten, so
  an overlapping flush could read it as empty. It is now written to a temporary
  file and moved into place, which no reader can observe half-finished.
- The hook reads the message identifier from `message_id`, the field Claude Code
  actually sends. It looked for `messageId`, never found it, and fell back to the
  session id, which keyed fence state per session rather than per message.
- Fence state is cleared when a message ends on a newline. That final flush
  carries no text, and the hook returned before reaching its own cleanup, leaving
  a stale file behind for the rest of the session.
- Stale temporary files from an interrupted flush are collected alongside stale
  fence state at the start of the next message.

## [1.0.3] - 2026-07-26

### Fixed
- Non-ASCII characters no longer garble on Windows. Python decodes a pipe with
  the system ANSI codepage rather than UTF-8, so em dashes and curly quotes in
  Claude's replies arrived corrupted before being bolded. The hook now reads its
  event as bytes and lets JSON decode it. Thanks to @aermak for the report.
- `/claude-bionify:status` and the other control commands no longer emit an
  undecodable separator on Windows. The status line is now written as UTF-8
  bytes instead of being encoded with the platform codepage, which produced a
  broken glyph on Western systems and failed outright on Japanese ones.
- `assets/generate_themes.py` reads and writes UTF-8 explicitly, so regenerating
  `themes.svg` produces the same file on any platform.

## [1.0.2] - 2026-07-12

### Changed
- The claude-bionify skill now confirms the plugin is installed before giving
  settings or command guidance. Skill marketplaces can surface the skill on its
  own, so when the plugin is missing the skill now says so and points to the
  install commands instead of walking through controls that are not there.

## [1.0.1] - 2026-07-04

### Fixed
- Preserve fenced code blocks that use spaced info strings such as
  ```` ``` python ````.
- Stop URL protection before surrounding quotes and brackets.
- Reject invalid boolean and minimum-word-length live override values instead
  of silently applying surprising settings.
- Save live overrides correctly when `CLAUDE_BIONIFY_STATE_FILE` is set to a
  filename in the current working directory.
- Use fully-qualified `/claude-bionify:set ...` examples in the plugin README.

## [1.0.0] - 2026-06-28

Initial release.

### Added
- `MessageDisplay` hook that bolds the leading part of each word in Claude's
  streamed replies as they render. The change is display-only: the saved
  transcript and what Claude reads are never altered.
- Unicode-aware bolding that works in any language, while leaving numbers and
  identifiers like `value3` or `api_key` alone.
- Three bolding strategies via the `boundary` option: `fraction` (default),
  `syllable` (ends at the first syllable), and `log` (long words bolded less).
- Configurable `fixation` strength and `min_word_length`.
- `skip_acronyms` (default on) leaves ALL-CAPS acronyms like `API` whole.
- `protect_urls` (default on) keeps URLs, emails, and file paths unbolded, while
  still bolding prose like `and/or` or `e.g.`.
- `skip_headings` (default on) leaves markdown headings unbolded.
- Inline `` `code` ``, fenced code blocks, markdown links, and existing
  `**bold**` always render verbatim.
- Live control commands (`/claude-bionify:on`, `:off`, `:toggle`,
  `:set <option> <value>`, `:status`, `:reset`) that change settings mid-session
  with no reload.
- Seven color themes (Nord, Dracula, Gruvbox, Solarized Dark, Solarized Light,
  Sepia, Focus Dark) in Claude Code's `/theme` picker as `custom:claude-bionify:<name>`.
- Crash-safe by design: on any error the original text is shown unchanged.
