---
allowed-tools: Bash(python:*)
description: "Save the current session to persistent context memory"
argument-hint: "[note]"
---

# /remember Command

Save the current session to context memory with an optional annotation.

## Usage

```
/remember [note]
```

**Arguments:**
- `note` (optional): A personal annotation or tag to help find this session later

## Examples

```
/remember
/remember "Fixed the auth bug with refresh tokens"
/remember "Important: OAuth2 implementation details"
```

## Workflow

When the user runs `/remember`:

1. **Generate Session Summary**

   Analyze the current conversation and create:

   - **brief**: A single sentence summarizing what was accomplished
   - **detailed**: 2-3 paragraphs with full context of what happened
   - **key_decisions**: List of important decisions made during the session
   - **problems_solved**: List of problems that were resolved
   - **technologies**: List of technologies, frameworks, or tools discussed
   - **outcome**: One of: `success`, `partial`, `abandoned`

2. **Extract Topics**

   Identify 3-8 relevant topics from the conversation. Use lowercase, common terms like:
   - Technology names: `react`, `python`, `sqlite`
   - Concepts: `authentication`, `debugging`, `refactoring`
   - Domains: `api`, `frontend`, `database`

3. **Identify Key Code**

   If significant code was written or discussed, extract important snippets with:
   - The code itself
   - The programming language
   - A brief description of what it does
   - The file path if applicable

4. **Extract Key Messages**

   Select 5-15 important messages from the conversation that capture:
   - The initial request/problem statement
   - Key decisions and their reasoning
   - Solution descriptions
   - Important caveats or warnings

5. **Pipe JSON via Stdin and Save to Database**

   Pipe JSON directly via `--json -` (stdin):

   ```bash
   python "~/.claude/skills/context-memory/scripts/db_save.py" --json - << 'ENDJSON'
   {
     "session_id": "<UNIQUE_ID>",
     "project_path": "<PROJECT_PATH>",
     "messages": [
       {"role": "user", "content": "The initial question or request"},
       {"role": "assistant", "content": "The response or solution"}
     ],
     "summary": {
       "brief": "One-line summary of what was accomplished",
       "detailed": "2-3 paragraphs with full context...",
       "key_decisions": ["Decision 1", "Decision 2"],
       "problems_solved": ["Problem 1", "Problem 2"],
       "technologies": ["python", "sqlite", "fts5"],
       "outcome": "success"
     },
     "topics": ["topic1", "topic2", "topic3"],
     "code_snippets": [
       {
         "code": "def example(): pass",
         "language": "python",
         "description": "What this code does",
         "file_path": "src/example.py"
       }
     ],
     "user_note": "User's note if provided, or null"
   }
   ENDJSON
   ```

6. **Confirm to User**

   Report back: confirmation, brief summary, topics, message/snippet counts, user note.

## Notes

- Requires the full context-memory plugin: https://github.com/ErebusEnigma/context-memory
- Install with: `git clone https://github.com/ErebusEnigma/context-memory && cd context-memory && python install.py`
- Sessions are stored globally and can be searched across all projects
- Use `/recall` to search past sessions
