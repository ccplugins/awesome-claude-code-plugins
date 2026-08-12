# Craft — how to explain engineering work to someone who doesn't read code

Read this when a draft is technically correct but flat, or when you're stuck on how to unpack one specific concept.

## Contents

1. [The one rule](#1-the-one-rule)
2. [Evidence before interpretation](#2-evidence-before-interpretation)
3. [Unpacking a mechanism](#3-unpacking-a-mechanism)
4. [Analogies that attach instead of replace](#4-analogies-that-attach-instead-of-replace)
5. [Naming who was right](#5-naming-who-was-right)
6. [Making numbers mean something](#6-making-numbers-mean-something)
7. [Calibrated language](#7-calibrated-language)
8. [Untangling multiple changes](#8-untangling-multiple-changes)
9. [Rewrites](#9-rewrites)

---

## 1. The one rule

**Pay for each term the moment you introduce it, then spend it freely.**

A non-developer is not defeated by complexity. They are defeated by a sentence containing a word that means nothing to them, which makes the next sentence mean nothing, and by the third one they have stopped reading and started nodding.

One clause is the price. Not a paragraph — a paragraph on every term turns the report into a glossary and insults them. One clause, mid-sentence, then move on and use the real word for the rest of the report.

> A **migration** — a numbered instruction file that changes the shape of the database — has to be added at the end of the list, never inserted in the middle.

The reader now owns "migration" and you can use it eleven more times without apology. This is what lets the report go deep: depth is affordable once the vocabulary is paid for.

**The corollary:** never introduce a term you don't need. If a detail doesn't change what the reader would decide, cutting it is better than glossing it.

## 2. Evidence before interpretation

Lead with the actual artifact — the log line, the error, the count — quoted exactly. Then say what it means.

The reason is trust, not drama. A stakeholder who only ever receives your conclusions has no way to distinguish analysis from confident storytelling, and over time they either believe everything or nothing. Showing the raw thing first, even when they can't fully parse it, tells them there is a real object underneath your reasoning.

> The log line read `SEO optimization complete — internal links 0 kept, 11 fabricated URLs removed`. Internal links are links from one of your articles to another; Google uses them to understand what your site covers, and readers use them to keep reading. Eleven were planned for that article. Zero made it in.

Quote **one** line, the one that carries the finding. A wall of log output is not evidence, it's abdication.

## 3. Unpacking a mechanism

When you have to explain how something works, climb this ladder in order. Skipping a rung is what makes explanations feel simultaneously too long and unsatisfying.

1. **What it does** — the observable outcome, in product terms.
2. **When it runs** — the trigger and the moment in the sequence. Non-developers consistently misjudge this, and it's the source of most of their wrong mental models.
3. **How it decides** — the actual rule, stated as a rule.
4. **Why that rule and not another** — the tradeoff.

> **What:** before an article is published, we delete links pointing at pages that don't exist. **When:** at the last step, after the article is written and right before it goes to WordPress. **How it decides:** it compares each link against the list of pages we've actually published — anything not on that list gets unwrapped into plain text. **Why:** a link to a dead page hurts more than no link at all, both for readers and for how Google reads the site, and we would rather lose a link than ship a broken one.

Rung 4 is the one engineers skip and stakeholders most want. It is the only part they can actually weigh in on.

## 4. Analogies that attach instead of replace

An analogy should ride alongside the real term, never take its seat.

**Attached** — reader keeps the word:
> A **race condition** — two parts of the program reaching for the same thing at the same time, like two people grabbing one shopping cart — meant the counter sometimes skipped a number.

**Substituted** — reader is now unable to search, ask, or repeat:
> Think of it like two people grabbing the same shopping cart. That's what was happening.

The second version feels friendlier and leaves the reader poorer. They will eventually be in a room where someone says "race condition," and your job was to make that room survivable.

Keep analogies short and drop them once they've done their work. An analogy extended over three sentences starts making claims about the system that aren't true.

## 5. Naming who was right

When you explain a failure, explicitly name the components that behaved correctly.

Without it, a non-technical reader generalizes: something broke, so the system is unreliable, so the parts I was told are fine are probably not fine either. That generalization is expensive and hard to walk back.

> The sanitizer did exactly what it was built to do — it deletes links to pages that don't exist, and `/some-slug` genuinely returns a 404. The gap was one step upstream: nobody had told the writing step that real URLs on this site begin with `/blog/`. So it invented a plausible address, and the checker correctly threw it away.

This also happens to be better engineering communication. "The checker was right and the input was wrong" is a more precise diagnosis than "the links broke," and it points at where the fix belongs.

## 6. Making numbers mean something

**Always show the denominator.** `100%` across 3 articles and `100%` across 300 are different claims, and nothing in the number tells the reader which one they're holding.

**Convert to the unit they care about.** Milliseconds are engineer units. "The page used to take 5 seconds to appear and now takes under 1" is a product unit.

**Give a baseline for any number that isn't self-evidently good or bad.** "2,285 tests pass" means nothing alone. "2,285 tests pass, 15 of them written today to cover this specific bug" is a fact about today.

**Distinguish measured from projected.** "Should cut the cost roughly in half" and "cut it from $180 to $95 last month" are not the same sentence, and only one of them is safe to plan against.

## 7. Calibrated language

Match your wording to how much you actually know. Use a consistent vocabulary so the reader can learn to read your confidence at a glance:

| Confidence | Phrasing | What backs it |
|---|---|---|
| Measured | "I ran it and saw X" | You observed it in the real environment |
| Tested | "the tests cover this case" | It passes automated checks, not observed live |
| Reasoned | "it should behave the same because they share the code path" | Sound inference, unverified |
| Unknown | "I don't know yet; I haven't reproduced it" | Say it plainly and stop |

The most valuable sentence in most reports is the one that admits a gap. It is what makes every other sentence load-bearing. Reports that never say "I don't know" get read as marketing.

Do **not** soften facts with hedges ("it seems the tests passed") or harden guesses with confidence ("this is fixed" when you mean "this should be fixed"). Both destroy the signal.

## 8. Untangling multiple changes

When a session produced several changes, the reader's default assumption is that the extra ones mean the first didn't work. Preempt that by giving each change a role:

- **Root cause** — removes the reason the problem could happen.
- **Defense** — catches it if it happens anyway, usually because the root cause depends on something you don't fully control (a model's output, a third party, a human step).
- **Visibility** — makes it detectable next time. Logging, a counter, an alert.
- **Cleanup** — repairs damage already done.

Then say why the combination, not just the pieces:

> The root fix alone would only hold as long as the model follows instructions, which isn't something you can build a guarantee on. The safety net alone would leave the model permanently guessing, with the net quietly covering for it — and the day the net had a gap, we'd be right back here with no warning. Together, one of them has to fail loudly before anything reaches a reader.

## 9. Rewrites

**Vague → concrete**

> ❌ Improved the reliability of the publishing pipeline.
> ✅ Publishing used to fail silently when an article ran past 100 seconds — you'd see "done" and nothing would appear. It now splits the work into stages that each finish well under that limit, so a long article publishes the same as a short one.

**Jargon dump → paid-for jargon**

> ❌ Moved the LLM insertion pass out of Stage 3 and made the sanitizer idempotent.
> ✅ We used to have the AI insert internal links as a separate step near the end. That step is gone — links are now written into the article from the start, and the final check only removes bad ones instead of adding any. Running that check twice now produces the same result as running it once, which matters because a retry used to be able to mangle an article.

**Blame → diagnosis**

> ❌ The model hallucinated URLs again.
> ✅ The writing step was given article titles but not their web addresses, so when it wanted to link to one it constructed an address that looked right — `/some-slug` — and ours are actually `/blog/some-slug`. It had no way to know that. We now hand it the real addresses.

**Buried lede → decision-first**

> ❌ [three paragraphs of investigation] …and so the earliest affected article was published on the 30th.
> ✅ Five articles published since July 30th have no internal links. None of them are on the public site yet, so nothing a reader can see is affected — but the two scheduled for tomorrow would have been. Here's how I found that:

**False completion → honest state**

> ❌ Fixed and deployed.
> ✅ Fixed, tested, and pushed to the repo. It is not on the server yet — the deploy is the next step, and I'll confirm on a real article afterward, because the tests can't catch this particular failure.
