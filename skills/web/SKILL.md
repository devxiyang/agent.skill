---
name: web
description: Fetch web pages, call REST APIs, download files, and extract content from URLs using curl.
requires: bin:curl
---

# Web Skill

## Preflight

Verify curl is available before proceeding:

```bash
curl --version
```

If missing, load `references/install.md` for installation instructions.

## Fetch a web page

```bash
curl -sL "https://example.com"
```

## REST API calls

```bash
# GET with JSON response
curl -s "https://api.example.com/users" | jq .

# POST JSON
curl -s -X POST "https://api.example.com/items" \
  -H "Content-Type: application/json" \
  -d '{"name": "foo"}'

# PUT
curl -s -X PUT "https://api.example.com/items/1" \
  -H "Content-Type: application/json" \
  -d '{"name": "bar"}'

# DELETE
curl -s -X DELETE "https://api.example.com/items/1"

# With auth header
curl -s "https://api.example.com/data" \
  -H "Authorization: Bearer $TOKEN"
```

## Form data & file upload

```bash
# Submit a form (application/x-www-form-urlencoded)
curl -s -X POST "https://example.com/login" \
  -d "username=alice&password=secret"

# Multipart file upload
curl -s -X POST "https://example.com/upload" \
  -F "file=@/path/to/file.pdf" \
  -F "description=My file"
```

## Cookies & sessions

```bash
# Save cookies to a file
curl -s -c cookies.txt "https://example.com/login" \
  -d "user=alice&pass=secret"

# Reuse saved cookies
curl -s -b cookies.txt "https://example.com/dashboard"
```

## Download a file

```bash
curl -sL "https://example.com/file.zip" -o /tmp/file.zip

# Resume interrupted download
curl -C - -L "https://example.com/large.zip" -o /tmp/large.zip
```

## Extract content from a page

Prefer Python for reliable HTML parsing over fragile sed/grep:

```bash
curl -sL "https://example.com" | python3 -c "
import sys, html.parser

class TextExtractor(html.parser.HTMLParser):
    skip = {'script', 'style'}
    def __init__(self):
        super().__init__()
        self._tag = None
        self.parts = []
    def handle_starttag(self, tag, attrs):
        self._tag = tag
    def handle_data(self, data):
        if self._tag not in self.skip and data.strip():
            self.parts.append(data.strip())

p = TextExtractor()
p.feed(sys.stdin.read())
print('\n'.join(p.parts))
"
```

## Inspect response

```bash
# Headers only
curl -sI "https://example.com"

# Show both headers and body
curl -sD - "https://example.com"

# Show HTTP status code only
curl -s -o /dev/null -w "%{http_code}" "https://example.com"
```

## HTTPS & certificates

```bash
# Skip certificate verification (use only for testing)
curl -sk "https://self-signed.example.com"

# Use a specific CA certificate
curl -s --cacert /path/to/ca.crt "https://example.com"
```

## Tips

- `-s` silences progress output
- `-L` follows redirects
- `-I` fetches headers only
- `--max-time 10` sets a timeout in seconds
- `--compressed` requests gzip encoding automatically
- `-v` shows full request/response for debugging
