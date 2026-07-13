# ClauDex 🧡🖤

**Claude writes. Codex reviews. You ship.**

Cross-model pair programming: `/claudex` runs a write→review loop where Claude implements and OpenAI Codex reviews the diff (read-only) until both agree; `/claudex:verdict` has both models review the same diff independently and surfaces where they disagree (🤝 both / 🧡 only Claude / 🖤 only Codex); `/claudex:debate` has them argue a design decision while you arbitrate; `/claudex:demo` is a two-minute guided first run over planted bugs.

Requires the Codex CLI (`npm i -g @openai/codex` + `codex login`) — every command refuses to run a one-model duet.

Canonical repo, docs, and latest version: **https://github.com/hamza-ali-shahjahan/claudex**

```
/plugin marketplace add hamza-ali-shahjahan/claudex
/plugin install claudex@claudex
```
