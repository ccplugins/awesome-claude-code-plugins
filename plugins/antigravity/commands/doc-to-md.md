---
description: Convert a PDF, docx, image, or other document to clean Markdown using Antigravity (agy) multimodal Gemini. Saves to docs/agy/converted/.
argument-hint: "<file-path> [extraction focus instructions]"
context: fork
allowed-tools: Bash, Write
---

Route this to the `antigravity:agy-rescue` subagent in MODE: doc-to-md.

Raw user request:
$ARGUMENTS

## Routing rules

1. **Parse the file path**: the first whitespace-separated token of `$ARGUMENTS` that resolves to an existing file (check with `test -f`) IS the source file. Convert relative paths to absolute. If no valid file is found, ask once: "Which file should I convert?".

2. **Extraction focus**: everything else in `$ARGUMENTS` (anything that's not the path) is optional natural-language guidance on what to focus on (e.g., "extract only the pricing tables and ignore the legal boilerplate"). Empty by default = "produce a faithful full-fidelity markdown conversion".

3. **Detect file type** via extension:
   - `.pdf` → PDF (multimodal)
   - `.docx`, `.doc` → Word (multimodal or text)
   - `.png`, `.jpg`, `.jpeg`, `.webp`, `.gif` → image (multimodal — OCR + structure inference)
   - `.html`, `.htm` → HTML (text)
   - other → text or warn

4. **Slug**: lowercase the source filename base (without extension), non-alphanumeric → `-`, collapse repeats, trim to 60 chars.

5. **Date**: today in `YYYY-MM-DD` (local time).

6. **Paths** (relative to current working directory):
   - `OUTPUT_DIR` = `docs/agy/converted/`
   - `WRITE_FILE` = `docs/agy/converted/<date>-<slug>.md`

7. **Pre-flight** (ONE `Bash` call):
   ```bash
   mkdir -p docs/agy/converted
   ```

8. **Hand off**: pass this header to the subagent:

   ```
   MODE: doc-to-md
   SOURCE_FILE: <absolute path>
   FILE_TYPE: pdf|docx|image|html|other
   FOCUS: <natural-language focus or empty>
   CWD: <absolute path to current working directory>
   WRITE_FILE: docs/agy/converted/<date>-<slug>.md
   ```

## Operating rules

- The subagent invokes agy with `--add-dir <CWD>` so it can write the result.
- For PDF / docx / image, agy uses Gemini's multimodal vision capabilities — preserves tables, lists, headings, code blocks. Inline images become `![description](image-extraction-note)` placeholders.
- The subagent reports:
  1. Saved markdown path.
  2. Original file path and detected type.
  3. First ~30 lines of the conversion (preview).
  4. Pages/sections processed.
- Present that to the user as-is.
- If the file is too large (>200 MB) or the format is unsupported, surface the error verbatim. Suggest splitting or pre-processing.

## Notes

- Large PDFs (>100 pages) consume significant input tokens. Consider chunking for very large docs.
- For images, OCR quality is excellent for printed text, decent for handwriting.
- This is NOT a replacement for `pandoc` if you need lossless format conversion — it's for "give me a clean markdown version I can read/edit/reuse".
- For sensitive documents (NDAs, internal contracts), be aware the content is sent to Google's Gemini servers. Use `vertex-creative` skill with Vertex AI ADC if you need stricter data residency control.
