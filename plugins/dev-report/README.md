# dev-report

Explains a Claude Code session in plain language.

You finish a long session. A dozen files changed and several implementation decisions were made along the way, but the end-of-session summary is file names and function names — accurate, and written for someone reading the diff alongside it. Asking for it "simply" removes the reasoning too.

Run `/dev-report` and Claude explains instead:

- **What it built or changed** — in terms of the product, not the file tree
- **Why it chose that approach** — including the option it turned down and what would have gone wrong
- **What is still unfinished or unverified** — verified, assumed, and untested kept apart
- **What you should do next** — including the calls only you can make

Technical terms aren't removed. They're explained the first time they appear, so the reasoning survives.

## Use

```
/dev-report
/dev-report this week
/dev-report just the payment work
/dev-report keep it short, she only has a minute
```

Anything after the command is a scope or focus hint and overrides the skill's defaults. The skill is explicit-only — it does not fire on a casual "what did you just do?"

Reports come out in whatever language the command was typed in. Localized aliases ship for Korean (`/개발보고`), Japanese (`/開発報告`), and Spanish (`/informe-desarrollo`). File paths, function names, commands, and log lines always stay in their original form.

## What's here

```
dev-report/
├── SKILL.md          # the skill — audience model, report structure, craft rules
├── commands/         # /dev-report and the three localized aliases
└── references/
    ├── craft.md      # explanation techniques with before/after rewrites
    └── examples.md   # two worked example reports (English, Korean)
```

## Attribution

Original: [delpicorp/dev-report](https://github.com/delpicorp/dev-report) by [Delpi Corp.](https://github.com/delpicorp) — MIT licensed. Vendored here unmodified at v1.0.1, except for this README and a `plugin.json` trimmed to the fields this repo uses.

For updates, install from the upstream marketplace directly:

```
/plugin marketplace add delpicorp/dev-report
/plugin install dev-report@delpicorp
```
