---
description: Use /agent-manager-skill to orchestrate multiple local CLI agents via tmux using agent-manager-skill (start/stop/monitor/assign + cron-friendly scheduling).
author: fractalmind-ai
version: 0.1.0
---

## Usage

`/agent-manager-skill <TASK>`

## Goal

Help the user run and coordinate multiple local agents in parallel using `tmux`.

## Instructions

1. Ask the user where `agent-manager-skill` is installed (or have them clone it):

   ```bash
   git clone https://github.com/fractalmind-ai/agent-manager-skill.git
   ```

2. Run a quick environment check:

   ```bash
   python3 agent-manager/scripts/main.py doctor
   ```

3. List configured agents:

   ```bash
   python3 agent-manager/scripts/main.py list
   ```

4. Based on the user task ($ARGUMENTS), start/assign/monitor agents:

   ```bash
   python3 agent-manager/scripts/main.py start EMP_0001
   python3 agent-manager/scripts/main.py assign EMP_0001 <<'EOF'
   $ARGUMENTS
   EOF
   python3 agent-manager/scripts/main.py monitor EMP_0001 --follow
   ```

## Output

- Summarize which agents were started and what they are doing.
- Provide the exact commands to reproduce.
