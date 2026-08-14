You have access to 49 developer tools via the SnapTool API at `https://snaptools.uk/api/tools`.

## When to use
- Formatting JSON, CSS, HTML, SQL, or XML
- Encoding/decoding Base64, URLs, or HTML entities
- Generating hashes (MD5, SHA-256/384/512), UUIDs, passwords, slugs
- Converting CSV↔JSON, colors, units, timestamps, number bases
- Testing regex patterns, decoding JWT tokens
- Any text manipulation: case conversion, word count, diff, find-replace

## API call
```bash
curl -X POST https://snaptools.uk/api/tools \\
  -H "x-api-key: sk-YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"tool":"json-format","input":"{\\"key\\":\\"value\\"}","params":{"indent":2}}'
```

- **Free:** 50 calls/month at [snaptools.uk/pricing](https://snaptools.uk/pricing)
- **Docs:** [snaptools.uk/docs/api](https://snaptools.uk/docs/api)
- **Skills:** [github.com/RexHuang/snaptool-skills](https://github.com/RexHuang/snaptool-skills)
