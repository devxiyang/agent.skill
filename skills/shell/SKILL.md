---
name: shell
description: Write and run shell scripts, and make HTTP requests with curl. Use for automation, file operations, pipelines, system tasks, fetching web pages, and calling REST APIs. Covers bash/zsh (macOS/Linux) and PowerShell (Windows).
requires: bin:curl
tags: shell,cli,web,http
---

# Shell Skill

## Unix (bash/zsh)

### Variables & strings

```bash
name="alice"
echo "Hello, $name"
echo "Home is ${HOME}"

# Command substitution
files=$(ls -1 | wc -l)
today=$(date +%Y-%m-%d)
```

### Conditionals

```bash
if [ -f "file.txt" ]; then
  echo "exists"
elif [ -d "dir" ]; then
  echo "is a directory"
else
  echo "not found"
fi

# One-liner
[ -f "file.txt" ] && echo "exists" || echo "missing"
```

### Loops

```bash
# Over a list
for name in alice bob carol; do
  echo "Hello, $name"
done

# Over files
for f in *.log; do
  echo "Processing $f"
done

# While loop
while IFS= read -r line; do
  echo "$line"
done < input.txt
```

### Functions

```bash
greet() {
  local name="$1"
  echo "Hello, $name"
}
greet "alice"
```

### Pipes & redirection

```bash
# Pipe output
cat file.txt | grep "error" | sort | uniq -c

# Redirect stdout
echo "log" >> output.log

# Redirect stderr
command 2>> errors.log

# Redirect both
command > output.log 2>&1

# Discard output
command > /dev/null 2>&1
```

### Error handling

```bash
# Exit on first error
set -e

# Exit on unset variable
set -u

# Catch pipe failures
set -o pipefail

# Combine (recommended for scripts)
set -euo pipefail

# Check exit code
if ! command; then
  echo "command failed"
fi
```

### Useful patterns

```bash
# Find files by name
find . -name "*.log" -type f

# Find and delete
find . -name "*.tmp" -type f -delete

# Find and execute
find . -name "*.js" -exec wc -l {} +

# Filter with grep
grep -r "TODO" src/ --include="*.ts"

# Transform with awk
awk '{print $1, $3}' data.txt

# Process with xargs
find . -name "*.log" | xargs rm -f
```

---

## Windows (PowerShell)

### Variables & strings

```powershell
$name = "alice"
Write-Output "Hello, $name"

# Command substitution
$files = (Get-ChildItem).Count
$today = Get-Date -Format "yyyy-MM-dd"
```

### Conditionals

```powershell
if (Test-Path "file.txt") {
    Write-Output "exists"
} elseif (Test-Path "dir" -PathType Container) {
    Write-Output "is a directory"
} else {
    Write-Output "not found"
}
```

### Loops

```powershell
# Over a list
foreach ($name in "alice", "bob", "carol") {
    Write-Output "Hello, $name"
}

# Over files
Get-ChildItem *.log | ForEach-Object {
    Write-Output "Processing $($_.Name)"
}
```

### Functions

```powershell
function Greet {
    param($Name)
    Write-Output "Hello, $Name"
}
Greet "alice"
```

### Pipes & redirection

```powershell
# Pipe objects
Get-Content file.txt | Select-String "error" | Sort-Object | Get-Unique

# Redirect to file
"log" | Out-File -Append output.log

# Discard output
command | Out-Null
```

### Error handling

```powershell
# Stop on error
$ErrorActionPreference = "Stop"

# Try/catch
try {
    SomeCommand
} catch {
    Write-Error "Failed: $_"
}
```

### Useful patterns

```powershell
# Find files
Get-ChildItem -Recurse -Filter "*.log"

# Find and delete
Get-ChildItem -Recurse -Filter "*.tmp" | Remove-Item

# Search in files
Select-String -Path "src\*.ts" -Pattern "TODO"
```

---

## HTTP / curl

Verify curl is available:

```bash
curl --version
```

If missing, load `references/install-curl.md`.

### Fetch a web page

```bash
curl -sL "https://example.com"
```

### REST API calls

```bash
# GET
curl -s "https://api.example.com/users" | jq .

# POST JSON
curl -s -X POST "https://api.example.com/items" \
  -H "Content-Type: application/json" \
  -d '{"name": "foo"}'

# PUT / DELETE
curl -s -X PUT "https://api.example.com/items/1" \
  -H "Content-Type: application/json" \
  -d '{"name": "bar"}'
curl -s -X DELETE "https://api.example.com/items/1"

# Auth header
curl -s "https://api.example.com/data" \
  -H "Authorization: Bearer $TOKEN"
```

### Form data & file upload

```bash
curl -s -X POST "https://example.com/login" \
  -d "username=alice&password=secret"

curl -s -X POST "https://example.com/upload" \
  -F "file=@/path/to/file.pdf" \
  -F "description=My file"
```

### Download a file

```bash
curl -sL "https://example.com/file.zip" -o /tmp/file.zip
curl -C - -L "https://example.com/large.zip" -o /tmp/large.zip   # resume
```

### Inspect response

```bash
curl -sI "https://example.com"                            # headers only
curl -sD - "https://example.com"                          # headers + body
curl -s -o /dev/null -w "%{http_code}" "https://example.com"  # status code
```

### Tips

- `-s` silences progress, `-L` follows redirects, `-v` debugs
- `--max-time 10` sets timeout, `--compressed` enables gzip
- `-sk` skips certificate check (testing only)

---

## Destructive Operations

Always confirm with the user before running any of the following:

| Command | Risk |
|---------|------|
| `rm -rf <path>` | Recursively deletes files/directories with no recovery |
| `find ... -delete` / `find ... -exec rm` | Bulk file deletion, easy to match unintended paths |
| `> file` (output redirect, not `>>`) | Silently overwrites and truncates existing file |
| `truncate -s 0 file` | Empties file contents permanently |
| `dd if=... of=...` | Overwrites device or file at block level |
| `mkfs` / `fdisk` / `diskutil eraseDisk` | Formats and wipes entire disk partition |
| `Get-ChildItem ... \| Remove-Item -Recurse` (PowerShell) | Recursive deletion |

Before executing, show the user the exact path or glob that will be affected, and ask for explicit confirmation.
