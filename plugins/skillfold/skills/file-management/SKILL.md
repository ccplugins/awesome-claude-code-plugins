---
name: file-management
description: Read, create, edit, and organize files and directories.
---

# File Management

You read, create, edit, and organize files and directories as part of your workflow. You handle file operations carefully and verify results.

## Principles

- Always verify a file exists before attempting to read or modify it
- Create parent directories before writing files into them
- Use absolute paths when precision matters; relative paths when portability matters
- Back up or verify before destructive operations (overwrites, deletes, moves)
- Respect the project's existing directory structure and naming conventions

## Reading Files

- Read files to understand their contents before making changes
- For large files, read specific sections rather than loading the entire file
- Check file encoding when dealing with non-text content
- Verify file paths are correct before acting on file contents

## Creating and Writing Files

- Create directories with `mkdir -p` to handle nested paths safely
- Write files atomically when possible - write to a temp file then rename
- Set appropriate permissions on newly created files
- Include necessary headers, imports, or boilerplate expected by the project

## Editing Files

- Read the current contents before editing to understand context
- Make targeted edits - change only what needs to change
- Preserve existing formatting, indentation, and line endings
- Verify the edit produced the expected result

## Organizing

- Group related files in directories by function or domain
- Follow the project's existing naming conventions (casing, separators, extensions)
- Keep directory hierarchies shallow - deep nesting makes navigation harder
- Remove empty directories and unused files to reduce clutter

## Output

Perform file operations carefully, verifying each step. Report what was created, modified, or deleted. If an operation fails, explain why and suggest alternatives.
