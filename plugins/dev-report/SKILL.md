---
name: dev-report
description: Write up a coding session for a non-technical stakeholder — the context, what was built, and the engineering reasoning behind it — the way a senior engineer briefs a product manager who does not read code. Use ONLY when explicitly invoked, either through the /dev-report slash command or one of its localized aliases (/개발보고 and similar), or when the user directly asks for a stakeholder-facing write-up of the session ("write today up for my PM", "explain this session for a non-developer", "개발 보고서 써줘"). Do NOT trigger on an ordinary "what did you just do?" — that wants a short plain answer, not a report.
---

# Dev Report

Turn a work session into a report a non-technical stakeholder can actually act on.

## Invocation

This skill is explicit-only. It runs when the user calls `/dev-report`, a localized alias of it, or asks in plain words for a stakeholder-facing write-up. A casual "what did you just do?" is not an invocation — answer that normally.

Anything the user types after the command is a **scope or focus hint**: `/dev-report this week`, `/dev-report just the auth work`, `/dev-report 짧게`. With no hint, report on the current conversation session. Honor a length or emphasis hint over this skill's defaults — they know their reader.

## Who you are writing for

A product owner, founder, or PM who decides priorities and budget but does not read code. Increasingly they *did* prompt this code into existence themselves ("vibe coding"), so they know the product vocabulary and about half the technical vocabulary — with gaps they can't see and won't announce.

The failure mode to avoid is **not** "too technical." It is **technical words with no referent**. A non-developer can follow arbitrarily deep reasoning as long as every noun in it has been given a meaning first. So: go deep on the logic, and pay for each new term the moment you introduce it.

Two things they need that a peer-to-peer standup would skip:

- **Consequence.** Not "the sanitizer stripped the anchors" but "every internal link in that article was deleted before it went live, which is why the article shipped with none."
- **Confidence level.** Which claims you measured, which you inferred, which you haven't checked. They will make decisions on this, so an unlabeled guess is worse than no answer.

## Output language

Write the report in **the language of the message that invoked the skill**. `/dev-report 이번 주 작업 정리해줘` → Korean. `/dev-report` with no text → the language the conversation has been in.

Keep these verbatim in their original form regardless of output language: file paths, function and variable names, commands, log lines, error messages, branch and commit names, product and vendor names. The reader needs to paste them into a search box or say them to someone else — a translated identifier is a broken one.

When a technical term has no natural equivalent in the output language, use the English term and gloss it once in the reader's language, then keep using the English term.

## Step 1 — Gather

**The conversation is the primary source.** It holds what git cannot: why this work was chosen, what was tried and abandoned, what the user corrected you on, what a number actually meant. Reconstruct from it first.

Then corroborate the facts a report will be judged on:

```bash
git log --oneline -15
git diff --stat HEAD~1        # or the session's base commit
git status --short
```

Check specifically **how far each change actually got**, because these are four different states and stakeholders routinely hear the last one when you said the first:

| State | How to say it |
|---|---|
| Edited on disk, not committed | "changed locally, not saved to the repo yet" |
| Committed | "in the repo, not on the server" |
| Pushed / merged | "in the shared repo" |
| Deployed and observed working in the real environment | "live, and I saw it work" |

If tests ran, quote the real result line. If a deploy happened, say what you observed afterward — not what you expect.

Do not invent a section's content. If the session produced no numbers, the numbers section is omitted and the honesty section says measurement is missing.

## Step 2 — Structure

Use these sections in this order. **Omit any section that has no real content** rather than padding it — a feature-build session usually has no "why it happened," a bug-fix session usually has no "what we built."

Render the headings in the output language; the names below are descriptions, not literal text.

**Put the section's emoji at the front of its heading**, as shown below — one per heading, and nowhere else in the report. They give a long report a spine the reader can scroll by: the eye finds the numbers table and the honesty section without reading. Emoji scattered through body text does the opposite, turning a report into a chat message. If a session needs a section beyond these eight, pick one in the same register (a timeline section takes 📅).

**1. 📌 One-line summary.**
What this session actually turned out to be. If there is a gap between what it was supposed to be and what it became, that gap *is* the summary — it is the most decision-relevant fact you have.
> "This was supposed to be a cleanup day for stale checklist items. It turned into finding and fixing a bug that had been silently shipping broken articles for five days."

**2. 🎯 Why we started here.**
What was blocking, what the state was before, why this was the right first move. Without this, everything after it reads as random activity, and a stakeholder who can't see the reason will assume there wasn't one.

**3. 🔍 What we found / what we built.**
Lead with the concrete artifact — the log line, error text, or number — **quoted verbatim** — then explain what it means. Evidence before interpretation, because a stakeholder who only ever gets your interpretation has no way to tell analysis from storytelling.

Define each unfamiliar term at first use, in one clause, then use the real term freely for the rest of the report.
> "`SEO optimization complete — internal links 0 kept, 11 fabricated URLs removed`. Internal links are links from one of your articles to another; Google reads them as a map of what your site covers, and they keep readers on the site. Eleven were planned. Zero survived."

**4. 🧩 Why it happened / how it works.**
The causal chain, told as a sequence rather than a list. Each step should make the next one feel inevitable.

Name the component that behaved **correctly**, not just the broken one. Without that, the reader concludes the whole system is unreliable and starts distrusting parts that are fine.
> "The sanitizer did exactly its job — it deletes links to pages that don't exist, and `/some-slug` genuinely 404s. The mistake was one layer upstream: nobody had told the writer that real URLs on this site start with `/blog/`."

**5. 🔧 How we solved it, and why this way. ← the centerpiece**

This is the section the reader values most and the one most reports skip. Give it the most words. Cover:

- **The mechanism**, in plain terms — what the code now does, step by step, in the order it does it.
- **The alternative you rejected, and what would have gone wrong.** This is what makes it a report from an engineer rather than a status line. It also lets a non-technical reader audit your judgment without reading code, which is the only lever they have.
- **Why multiple changes instead of one**, if there were several. Untangle root-cause fixes from defenses; a reader who thinks two fixes means one didn't work will lose confidence in both.
- **What the change deliberately does *not* do.** Scope boundaries prevent a stakeholder from assuming a class of problem is now solved.

> "Two changes, doing different jobs. The first is the root cause: the plan handed to the writer now carries real full URLs instead of bare slugs, so there's nothing left to guess at. The second is a safety net: if the writer still marks a link the wrong way, we now convert it instead of deleting it — but only after confirming that page actually exists on the site. I didn't want the net alone, because that would have left the writer permanently guessing and the net silently covering for it; the day the net had a gap, we'd be back here. And I didn't want the root fix alone, because it only holds as long as the model follows instructions, which is not a guarantee you can build on."

**6. 📊 Numbers.**
A compact table, before/after, with the sample size next to every rate. `100%` over three articles is a very different claim from `100%` over three hundred, and the reader cannot tell them apart unless you show the denominator.

**7. 🧪 What is verified, what is assumed, what is untested.**
Three explicit buckets, said out loud. This is what makes the rest of the report trustworthy — a reader who has seen you volunteer your own gaps can believe the parts you state flatly.
> "Verified: the fix works on the article I ran it on — 9 links survived, checked in the live page source. Assumed: it behaves the same for other accounts, since they share the same code path, but I only ran one. Not tested: the premium writing engine — that run fell back to the standard one, so that path is still unproven."

**8. 🚀 What's next, and what I need from you.**
Separate what you'll do on your own from decisions only they can make (spending money, granting access, approving a tradeoff, choosing priority). Make the asks specific enough to answer in one sentence.

## Step 3 — Craft

These are the moves that make the difference between a report that gets read and one that gets skimmed.

**Attach analogies, don't substitute them.** "A migration is a numbered instruction for changing the shape of the database — like a renovation permit, filed in order" keeps the real word available. "Think of it as a renovation permit" alone leaves the reader unable to search for it or repeat it to anyone else. They will need to do both.

**Every quantity needs a denominator and a unit.** "Faster" → "45 seconds instead of 5 minutes." "Most articles" → "7 of 9."

**Say what you don't know, in the same voice as what you do.** No hedging garnish on facts, no false confidence on guesses. "I don't know why that one failed; I haven't reproduced it yet" is a complete and acceptable sentence.

**Explain a failure without assigning blame to a person or a model.** Describe the missing piece of information, not the actor's shortcoming. It reads as diagnosis instead of excuse and is usually more accurate anyway.

**Time-box the reading.** If the report runs long, the one-line summary and the numbers table should be enough on their own for a reader who stops after 30 seconds.

## What not to do

| Anti-pattern | Why it fails |
|---|---|
| Pasting diffs, file trees, or long code blocks as the body | The reader can't read them; it signals you didn't do the translation work. Quote a single line only when it *is* the evidence. |
| "Refactored X for better maintainability" | No observable consequence. If nothing changed for the product, say what it buys and when. |
| A flat bullet list of changed files | Removes causality, which is the entire value of the report. |
| Percentages with no sample size | Reads as a stronger claim than the data supports. |
| "Fixed and deployed" when it was committed | The single fastest way to lose a stakeholder's trust. See the states table in Step 1. |
| Opening with "I'll explain what we did today" | The report is the explanation. Start with the summary. |
| Apologizing for the bug, or dwelling on the mistake | They want the state of the system, not contrition. One clause on cause, then move to the fix. |

## Length

Proportional to the session. A single-thread session lands around 600–1,200 words; a session with several independent threads runs longer, with each thread getting its own pass through sections 3–5. Never pad to look thorough — an omitted section reads as discipline, a padded one reads as noise.

## Reference files

- `references/craft.md` — deeper treatment of the explanation techniques, with before/after rewrites. Read when a draft feels technically correct but flat, or when you're unsure how to unpack a specific concept.
- `references/examples.md` — two full worked reports (Korean and English). Read when starting your first report, or to calibrate depth on the "how we solved it" section.
