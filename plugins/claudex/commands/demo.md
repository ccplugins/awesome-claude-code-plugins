---
description: A two-minute guided duet — plants bugs in a throwaway repo and lets Claude and Codex argue about them
---

You are running the **ClauDex demo** — a safe, self-contained first experience
of the duet. You will plant bugs, let both models review them independently,
and reveal who caught what. Everything happens in a throwaway directory;
the user's own files are never touched.

**Sign-off contract:** this is a real review, so the normal rules apply — end
with `reviewed with love by ClauDex 🧡🖤` ONLY if Codex successfully delivered
its review; if the Codex call fails (after one retry), end unsigned with the
interruption message.

## Preflight — it takes two to ClauDex

Run `codex --version` and check auth (`codex login status` or equivalent).
If either fails, STOP and reply with exactly:

> **It takes two to ClauDex.** 🧡 Claude is here — 🖤 Codex is not, so there is
> no duet to demo. Fix it in two lines, then come back:
> ```
> npm i -g @openai/codex
> codex login
> ```

(No git preflight — the demo brings its own repo.)

## The demo

1. **Set the stage.** Create a throwaway workspace and repo:
   `DEMO=$(mktemp -d "${TMPDIR:-/tmp}/claudex-demo.XXXXXX") && git -C "$DEMO" init -q`
2. **Plant the bugs.** Write exactly this to `$DEMO/discount.js`:

   ```js
   // discount.js — apply coupon discounts to a shopping cart
   function applyDiscount(cart, coupon) {
     let total = 0;
     for (let i = 0; i <= cart.length; i++) {
       total += cart[i].price * cart[i].qty;
     }

     if (coupon.type == "percent") {
       total = total - (total * coupon.value) / 100;
     } else {
       total = total - coupon.value;
     }

     cart.forEach((item) => (item.discounted = true));

     return "$" + total.toFixed(2);
   }

   module.exports = { applyDiscount };
   ```

   For your own reveal later, the planted issues are: (a) off-by-one
   `i <= cart.length` — guaranteed crash; (b) no validation of
   `coupon.value` — negative totals, >100% discounts; (c) loose `==`
   comparison; (d) the function silently mutates the caller's cart;
   (e) floating-point money math. Do NOT tell either reviewer this list.
3. **Tell the user what's happening** in two sentences: bugs are planted —
   some obvious, some subtle, one a pure judgment call — and the two models
   will now review the same file *independently*.
4. **Claude's review (yours).** Review `discount.js` and write down your
   findings BEFORE consulting Codex.
5. **Codex's review.** With a hard timeout of ~10 minutes:

   ```
   codex exec --sandbox read-only "You are reviewing a teammate's new file before merge. Read the file at $DEMO/discount.js and find real bugs, risky design choices, and missing edge cases. Be specific — cite lines."
   ```

   If it fails or times out, retry ONCE; if that fails too, clean up the
   demo directory and STOP unsigned: "The duet was interrupted — Codex never
   completed its review. Try `/claudex:demo` again in a little while (rate
   limits usually clear within the hour)."
6. **The Verdict table.** Merge both reviews:
   - 🤝 **Both flagged**
   - 🧡 **Only Claude flagged**
   - 🖤 **Only Codex flagged**
7. **The reveal.** Show the planted-bug scoreboard: for each of (a)–(e),
   which models caught it — and highlight anything either model found that
   you didn't plant. Spell out the lesson in one line: agreement is signal,
   disagreement is where a human looks.
8. **Clean up.** Remove the throwaway directory (`rm -rf "$DEMO"` — it is a
   directory you created under the system temp path this run; never remove
   anything else).
9. **Point at real life:** "That was a toy. Run `/claudex:verdict` on your
   actual uncommitted changes, or `/claudex <task>` to build with the
   reviewer in the loop." Then close with:

   `reviewed with love by ClauDex 🧡🖤`
