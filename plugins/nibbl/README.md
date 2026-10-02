# Nibbl

A tiny pixel pet that lives above your Claude Code prompt. It hatches from an egg after 10 answered turns, reacts to what really happens in your session (a bug appears on an error, it eats the bugs when your tests pass, it carries a box when you commit, it goes on an expedition while Claude works and sleeps when you are away) and grows over months. It never costs a model token and never interrupts you.

## Install

    /plugin marketplace add https://getnibbl.pages.dev/marketplace.json
    /plugin install nibbl@nibbl

## Commands

| Command | What it does |
|---|---|
| `/nibbl` | Name, serial, tier, level, XP, hearts, rarest trait, card and leaderboard links |
| `/nibbl pet` | Pets it from the prompt |
| `/nibbl name <text>` | Rename your pet (once a week, up to 16 characters) |
| `/nibbl label <text>` | Set a label (up to 24 characters); `/nibbl label` alone clears it |
| `/nibbl odds` | Hatch odds and the odds of each of your pet's traits |
| `/nibbl export` | Shows the secret code that moves your pet to another machine |
| `/nibbl import <code>` | Moves a pet to this machine |
| `/nibbl hide` | Hides or shows the band; the pet keeps living |

Type `/nibbl pet`, or focus the band with `ctrl+x tab` and press `p` (a click on `[♥]` works in the fullscreen terminal). Five pets an hour give XP; after that it still loves you, it just gives no XP.

## Odds

Every egg is rolled on the server, once per machine, with the same odds for everyone: common 40%, uncommon 30%, rare 18%, epic 9%, legendary 3%. Shiny is 4% on top of any tier (a legendary shiny is about 1 in 830). Every pet also rolls a mark with odds of 1 in 24 (4.17%), so each one has a trait rarer than 5%. `/nibbl odds` shows yours.

## What leaves your machine

- `machineHash`: the SHA-256 of your hardware id plus "nibbl". The id itself never leaves.
- Your pet's serial and token.
- The name and label you set with `/nibbl name` and `/nibbl label`. They show on your pet's public card and the leaderboard.
- Events: only the type (`turn`, `check_pass`, `commit`, `error`, `pet`, `hide`) and the time of each. Never your prompts, commands, file paths or outputs.

All of it goes to https://getnibbl.pages.dev and nowhere else. The export code is a secret: anyone who has it owns your pet, so it is drawn on your screen only and never sent to the model.

## Local testing

Run the API with `pnpm -C apps/api dev` and point the mod at it with `NIBBL_API=http://localhost:8787` (or the `Nibbl server` option in `/config`).
