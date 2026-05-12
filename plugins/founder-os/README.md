# founder-os

Multi-agent primitives for Claude Code: consensus, debate, fanout research, skill building, and measured optimization.

## Overview

`founder-os` gives Claude Code reusable coordination patterns when one pass is not enough:

- `/stochastic` polls N agents with the same prompt and aggregates consensus, divergences, and outliers.
- `/model-chat` runs a multi-agent debate room.
- `/fanout` runs parallel research and synthesizes findings.
- `/skillbuilder` helps create stronger Claude Code skills.
- `/autoresearch` runs measured hill-climb optimization loops.

## Install

```bash
claude plugin install rhinehart514/founder-os
```

Marketplace install:

```bash
claude plugin marketplace add rhinehart514/founder-os
claude plugin install founder-os@founder-os
```

## Links

- Repository: https://github.com/rhinehart514/founder-os
- npm: https://www.npmjs.com/package/@rhinehart514/founder-os
