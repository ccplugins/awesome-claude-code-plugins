# anki-band

[![CI](https://github.com/hematteo/anki-band/actions/workflows/ci.yml/badge.svg)](https://github.com/hematteo/anki-band/actions/workflows/ci.yml)

A Claude Code mod that turns the time you spend waiting for Claude into Anki reviews. While Claude works, a band above the prompt shows your next due card: one key shows the answer, one more grades it, and the grade goes straight into your collection through AnkiConnect, as if you had reviewed in Anki.

```text
Languages › Japanese                                             14 due · 6 done
What does 予約 mean?
0: Show answer
```

```text
Languages › Japanese                                             14 due · 6 done
What does 予約 mean?
1: Again  2: Hard  3: Good  4: Easy
a reservation, a booking
```

The status line keeps the count (`Anki: 14 due · 6 done`), so you know what is waiting without the band.

## Before you install

The mod talks to Anki through the **AnkiConnect** add-on, so it needs Anki itself running on the same machine:

1. In Anki, open Tools › Add-ons › Get Add-ons and enter the code `2055492159` (AnkiConnect).
2. Restart Anki and leave it open while you work. AnkiConnect listens on `127.0.0.1:8765`; the default settings are what the mod expects.

If Anki is closed, the status line says `Anki: AnkiConnect not reachable` and the band stays away; the next turn after Anki opens picks the reviews up again.

## Install

At the prompt of a Claude Code terminal session:

```text
/plugin install anki-band --marketplace hematteo/anki-band
```

Answer `y` to add the marketplace, then pick a scope. From a shell:

```sh
claude plugin install anki-band --marketplace hematteo/anki-band
```

It needs a Claude Code version with hooks-module plugins ("mods"); it was built and tested on 2.1.308.

## Using it

| Key, in an empty prompt | What it does |
| --- | --- |
| `0` | Show the answer |
| `1`–`4` | Grade it Again, Hard, Good or Easy, then load the next card |
| `/anki` | Pause the reviews, or resume them |

The band appears only while Claude is working, so it never sits between you and your next prompt. With `showWhenIdle` on it stays up while Claude waits too, but gives way then to any other mod with something to draw above the prompt (a box of suggested commands after a turn, say); while Claude works, the card keeps the band. Cards come in the order Anki would show them: learning steps that have come due, then reviews, then new cards in their deck position, up to the day's new-card limit. A card revealed but not graded stays until you grade it.

Grades go to Anki as answers (`answerCards`), so the scheduling is Anki's own, and anything you review in Anki itself between turns is not shown again.

### Syncing with AnkiWeb

Grades land in the collection on this machine. To have them on AnkiWeb, and so on your phone, without opening Anki, set `syncAfter` to a number of grades: after that many the mod asks Anki to sync (AnkiConnect's `sync`), and when the session ends it asks once more if anything graded since has not gone up. With `"syncAfter": 10`, for example, Anki syncs after the 10th and 20th grade, and again at the end of a session that stopped at 25.

The sync runs in the background once the next card is up, so it never holds up a grade or the band; only a failure shows, as a toast. Anki has to be logged in to AnkiWeb: if it is not, the toast says so, and pressing Sync in Anki once logs you in.

## Choosing cards

The `query` option is an ordinary Anki search: `deck:"Japanese"`, `deck:ML tag:core`, `"note:Cloze" -tag:leech`. Left empty, the whole collection is reviewed.

New cards per day: with `newPerDay` at `-1` (the default) and a search that names exactly one deck, that deck's own new-card limit applies; otherwise 20, Anki's default. Set a number to choose your own. Cards matching the search that were first studied today count against it, whether you studied them here or in Anki.

## Layout for your own note types

By default a card is shown as Anki renders it: the question side as the question, the part of the answer side below the `<hr id=answer>` line as the answer, and the deck as the heading. That suits Basic and Cloze cards.

For a note type of your own, three options take Anki's template syntax over the note's fields: `{{Field}}`, `{{#Field}}…{{/Field}}` (kept when the field has text) and `{{^Field}}…{{/Field}}` (kept when it is empty). Each line of `back` becomes its own row. For example, for a paper-reading deck:

```json
{
  "pluginConfigs": {
    "anki-band@anki-band": {
      "options": {
        "query": "deck:\"ML::Papers\" \"note:Paper card\"",
        "heading": "{{Paper}} · {{Section}}{{#Core}} · ★ core{{/Core}}",
        "front": "{{Question}}",
        "back": "{{Answer}}\n{{#Critique}}Critique: {{Critique}}{{/Critique}}"
      }
    }
  }
}
```

## How it works

It is a single hooks module, `hooks/register.tsx`, on these surfaces:

| Hook or call | What it does there |
| --- | --- |
| `$.http.fetch` | AnkiConnect on `127.0.0.1:8765`: `findCards`, `cardsInfo`, `answerCards`, `getDeckConfig`, `sync` |
| `ui.render` on `AbovePrompt` | Draws the band, with digit `hotkey`s on its buttons. While Claude waits it calls `next(e)` first and returns what a mod beneath drew; core's own `{ type: 'engine' }` drawing means nothing did |
| `turn.start` | Picks the next card for the turn, so a card reviewed in Anki meanwhile is skipped |
| `session.end` | Sends the last AnkiWeb sync, without waiting on it, when grades are left unsynced |
| `$.clock.every` | Refreshes the due count every five minutes |
| `$.ui.status`, `$.ui.toast` | The due count, and the rare error from Anki |
| `command.run` | `/anki` |

State lives in `$.state` (`card`, `isRevealed`, `due`, `reviewed`, `isPaused`); `types/index.d.ts` declares it. Its only network traffic is to AnkiConnect on your own machine; with `syncAfter` on, Anki itself then talks to AnkiWeb.

## Options

Set them in `/config`, or under `pluginConfigs` in `~/.claude/settings.json`:

| Option | Default | |
| --- | --- | --- |
| `query` | empty | Anki search for the cards to review; empty is the whole collection |
| `newPerDay` | `-1` | New cards a day; `-1` is the searched deck's own limit, else 20 |
| `heading` | empty | Template for the dim line above the question; empty shows the deck |
| `front` | empty | Template for the question; empty uses Anki's rendering |
| `back` | empty | Template for the answer, one row per line; empty uses Anki's rendering |
| `showWhenIdle` | `false` | Keep the band up while Claude waits for you, unless another mod draws there |
| `syncAfter` | `0` | Sync with AnkiWeb after this many grades, and as the session ends; `0` never syncs |

## Limitations

- Text only: images, audio and typing-in answers are left out, and formatting is flattened to plain text.
- The new-card limit is the mod's own count against one number. It does not reproduce Anki's per-subdeck limits or the review limit.
- The first new card is found with Anki's `prop:pos` search, reading only that card. On an Anki without that search, the mod reads every new card once a session to sort them, megabytes on a deck with thousands of new cards.
- The band shares its place above the prompt with other mods that draw there, and only one drawing shows. While Claude waits, the card gives way to any of them. While it works, the card wins over a mod loaded beneath it but not over one loaded above it, and Claude Code does not promise which order mods load in.
- Syncing needs Anki logged in to AnkiWeb. When AnkiWeb asks for a one-way full sync, Anki itself settles it: recent AnkiConnect versions ask you in Anki which side to keep, older ones refuse and the toast says to sync in Anki. The last sync is sent as the session ends without waiting for an answer, so on exit a failure there goes unreported.
- AnkiConnect must be reachable at its default address on the same machine.

## Development

Load it from a clone for one session:

```sh
claude --plugin-dir /path/to/anki-band
```

Run the tests, check the manifest and hooks, and type-check (the type definitions are written into `.claude-plugin/types/` the first time Claude Code loads the plugin):

```sh
claude plugin test .
claude plugin validate .
npx -p typescript tsc -p . --noEmit
```

`tests/anki-band.test.tsx` runs the mod against a fake AnkiConnect: card order, daily limits, learning steps, large decks (with and without `prop:pos`), templates, AnkiConnect going away, AnkiWeb sync, and the band given way to another mod.

## License

MIT
