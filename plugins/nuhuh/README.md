# nuhuh

Your agent said "Done." nuhuh runs the experiment.

This plugin installs a Stop hook. Every time the agent tries to finish, nuhuh extracts the completion claims from its final message ("all tests pass", "created src/x.ts", "endpoint works") and re-runs reality, fresh. The whole test suite in a clean process, the build, the file on disk, the local endpoint. If a claim is false, the Done is rejected and the failing evidence goes straight back to the agent, which returns to work. After 3 bounces it hands the receipt to you.

Deterministic and local. No LLM calls in the verification path, no API key, nothing leaves your machine. Claims it cannot safely check are marked unverifiable, never failed.

Full documentation, a False Done Rate benchmark, and the source live at [github.com/sjh9714/nuhuh](https://github.com/sjh9714/nuhuh).

Try it without installing anything

```bash
npx nuhuh demo
```
