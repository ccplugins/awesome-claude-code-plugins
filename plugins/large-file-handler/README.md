# Large File Handler

Prevent Claude Code crashes and context exhaustion when encountering large files. Provides smart blocking, size warnings, and chunking guidance.

## Problem Solved

Claude Code can crash or hang when attempting to read:
- Files > 50MB (system freeze reported in GitHub #1452)
- Database files (.db, .sqlite)
- Large binary files
- Files exceeding the 25K token read limit

This plugin intercepts file reads and:
- **Blocks** dangerous files before they crash your session
- **Warns** about large files that may exhaust context
- **Guides** you on how to safely read large files in chunks

## Features

### PreToolUse Hook

Automatically intercepts `Read` tool calls and checks:
- File size (warns at 10MB, blocks at 50MB)
- File extension (blocks databases, archives, binaries)
- PDF size (blocks PDFs > 5MB)

### Commands

- `/file-check <path>` - Check if a file is safe to read
- `/file-chunk <path> [focus]` - Get chunking strategy for large files
- `/scan-large-files [dir]` - Find problematic files in a directory

### Skill

Provides guidance on:
- Using offset/limit parameters for chunked reading
- Alternative approaches for different file types
- .claudeignore best practices

## Installation

```bash
claude plugin marketplace add aimakemoney/aimakemoney
claude plugin install large-file-handler@aimakemoney-plugins
```

Or from GitHub:
```bash
claude plugins add github:ojallington/large-file-handler
```

## Usage

### Check a specific file
```
/file-check path/to/large-file.log
```

### Get chunking strategy
```
/file-chunk path/to/large-file.log
/file-chunk path/to/large-file.log focus=end
/file-chunk path/to/large-file.log focus=search:ERROR
```

### Scan directory for issues
```
/scan-large-files
/scan-large-files path/to/directory
```

### Reading large files safely

Instead of reading an entire large file:
```
Read large-file.log  # May crash!
```

Use chunked reading:
```
Read large-file.log with offset=0 limit=500      # First 500 lines
Read large-file.log with offset=9500 limit=500   # Last 500 lines
```

Or search first:
```bash
grep -n "ERROR" large-file.log | tail -20
```
Then read around the specific line numbers.

## File Type Handling

| File Type | Status | Alternative |
|-----------|--------|-------------|
| Text < 10MB | Safe | Read directly |
| Text 10-50MB | Warning | Use chunking |
| Text > 50MB | Blocked | grep/head/tail |
| .db/.sqlite | Blocked | sqlite3 CLI |
| .zip/.tar/.gz | Blocked | Extract first |
| PDF < 5MB | Warning | May work |
| PDF > 5MB | Blocked | pdftotext |
| .exe/.dll/.so | Blocked | Not readable |

## Suggested .claudeignore

```gitignore
# Databases
*.db
*.sqlite
*.sqlite3

# Archives
*.zip
*.tar
*.gz
*.7z

# Large generated
*.min.js
*.bundle.js
package-lock.json

# Dependencies
node_modules/
vendor/
.venv/

# Build output
dist/
build/
.next/

# Logs
*.log
logs/
```

## License

MIT
