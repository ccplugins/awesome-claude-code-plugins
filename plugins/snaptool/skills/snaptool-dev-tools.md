---
name: snaptool-dev-tools
description: Use when formatting JSON/CSS/HTML/SQL/XML, encoding or decoding Base64/URL/HTML entities, generating hashes (MD5/SHA), creating UUIDs/passwords/slugs, converting case/text/data/timestamps/colors/units, testing regex, decoding JWT, or comparing text
---

# SnapTool Developer Tools

## Overview

SnapTool provides 49 instant developer utilities via a single REST API endpoint. Call `https://snaptools.uk/api/tools` with an API key to format, encode, hash, generate, or convert data.

## API Setup

**Base URL:** `https://snaptools.uk/api/tools`
**Auth:** `x-api-key: sk-YOUR_KEY` header
**Get a key:** [snaptools.uk/pricing](https://snaptools.uk/pricing) — 50 free calls/month, no credit card required

## How to Call

### GET (short inputs)
```
curl -H "x-api-key: sk-KEY" "https://snaptools.uk/api/tools?tool=json-format&input={\"key\":\"value\"}"
```

### POST (long inputs, recommended)
```
curl -X POST https://snaptools.uk/api/tools \
  -H "x-api-key: sk-KEY" \
  -H "Content-Type: application/json" \
  -d '{"tool":"json-format","input":"{\"key\":\"value\"}","params":{"indent":4}}'
```

### Response Format
```json
{"tool": "json-format", "result": "{\n  \"key\": \"value\"\n}"}
```

Error: `{"error": "error message"}`

## When to Use Each Tool

### Formatting messy code or data
- `json-format` — Beautify JSON (params: `indent`=2)
- `json-minify` — Minify JSON to one line
- `json-validate` — Check if string is valid JSON
- `css-format` / `css-minify` — Format or minify CSS
- `html-format` / `html-minify` — Format or minify HTML
- `sql-format` / `sql-minify` — Format or minify SQL
- `xml-format` / `xml-minify` — Format or minify XML

### Encoding or decoding text
- `base64-encode` — Text → Base64
- `base64-decode` — Base64 → text
- `url-encode` — URL-encode text (%20, %2F, etc.)
- `url-decode` — Decode percent-encoded text
- `html-entity-encode` — Text → HTML entities (&amp; &lt; etc.)
- `html-entity-decode` — HTML entities → text

### Generating hashes or checksums
- `hash-md5` — MD5 hash
- `hash-sha1` — SHA-1 hash
- `hash-sha256` — SHA-256 hash (most common)
- `hash-sha384` — SHA-384 hash
- `hash-sha512` — SHA-512 hash

### Generating data
- `uuid` — Generate UUIDs (params: `count`=1-100, default 1)
- `password` — Generate password (params: `length`=16, `upper`=true, `lower`=true, `numbers`=true, `symbols`=true)
- `slug` — URL slug from text ("Hello World" → "hello-world")
- `lorem-ipsum` — Placeholder text (params: `count`=3, `type`=paragraphs|sentences|words)
- `meta-tag-generate` — SEO meta tags (input: `title\ndescription\nurl\nimage`, one per line)
- `robots-txt-generate` — robots.txt (input: Allow/Disallow rules, one per line)

### Converting text case
- `case-camel` — camelCase
- `case-pascal` — PascalCase
- `case-snake` — snake_case
- `case-kebab` — kebab-case
- `case-constant` — CONSTANT_CASE
- `case-title` — Title Case
- `case-upper` — UPPERCASE
- `case-lower` — lowercase

### Working with text
- `reverse` — Reverse a string
- `word-count` — Count words, characters, lines, sentences
- `text-diff` — Compare two texts (separate with `\n---\n`)
- `find-replace` — Find and replace (params: `regex`=true for regex mode)

### Converting data formats
- `csv-to-json` — CSV → JSON array (params: `delimiter`=",")
- `json-to-csv` — JSON array → CSV
- `number-base-convert` — Convert number bases (params: `from`=10, `to`=16)
- `timestamp-convert` — Timestamp ↔ date (Unix, ISO, relative)
- `color-convert` — HEX → RGB, HSL, CMYK
- `unit-convert` — Convert units (params: `category`=length|weight|temperature|data|speed|time, `from`, `to`)

### Network & crypto tools
- `regex-test` — Test regex patterns (input: `pattern\ntest text`, params: `flags`=g|gi etc.)
- `url-to-markdown` — Fetch a webpage and convert to Markdown
- `jwt-decode` — Decode JWT token to header + payload

## Common Scenarios

### "Format this JSON response"
```
{"tool": "json-format", "input": "<the messy JSON>", "params": {"indent": 2}}
```

### "Base64 encode this string"
```
{"tool": "base64-encode", "input": "Hello World"}
```

### "What's the SHA-256 hash?"
```
{"tool": "hash-sha256", "input": "the text to hash"}
```

### "Generate 5 UUIDs"
```
{"tool": "uuid", "input": "", "params": {"count": 5}}
```

### "Convert this CSV to JSON"
```
{"tool": "csv-to-json", "input": "name,age\nAlice,30\nBob,25"}
```

### "Generate a strong password"
```
{"tool": "password", "input": "", "params": {"length": 24, "upper": true, "lower": true, "numbers": true, "symbols": true}}
```

### "Test this regex"
```
{"tool": "regex-test", "input": "\\d{3}-\\d{4}\nPhone: 555-1234 and 555-5678", "params": {"flags": "g"}}
```

### "Decode this JWT"
```
{"tool": "jwt-decode", "input": "eyJhbGciOiJIUzI1NiIs..."}
```

### "Convert this hex color"
```
{"tool": "color-convert", "input": "#6c5ce7"}
```

### "Convert 100km to miles"
```
{"tool": "unit-convert", "input": "100", "params": {"category": "length", "from": 0, "to": 1}}
```

### "Convert snake_case to camelCase"
```
{"tool": "case-camel", "input": "my_variable_name"}
```

### "Generate SEO meta tags"
```
{"tool": "meta-tag-generate", "input": "My Page\nA great description\nhttps://example.com\nhttps://example.com/og.png"}
```

## Notes

- Always use POST for inputs longer than ~500 characters
- The `input` field is required for most tools (except uuid, password, lorem-ipsum)
- The `params` object is optional and tool-specific
- For free tier: get your key at https://snaptools.uk/pricing — 50 calls/month, no credit card
- For heavy usage: $9/month API plan with 10,000 calls/month
- Full docs: https://snaptools.uk/docs/api
