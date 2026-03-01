---
name: python
description: Run Python scripts, manage environments, and use common stdlib patterns. Use for scripting, data processing, automation, and general Python development.
requires: bin:python3
tags: python,scripting
---

# Python Skill

## Preflight

Verify Python is available before proceeding:

```bash
python3 --version
```

If missing, load `references/install.md` for installation instructions.

## Running scripts

```bash
python3 script.py
python3 script.py arg1 arg2
python3 -c "print('hello')"

# Run a module
python3 -m http.server 8000
python3 -m json.tool data.json
```

## Virtual environments

### venv (built-in)

```bash
# Create
python3 -m venv .venv

# Activate
source .venv/bin/activate        # macOS/Linux
.venv\Scripts\activate           # Windows

# Deactivate
deactivate
```

### uv (fast, recommended)

```bash
# Install uv
curl -LsSf https://astral.sh/uv/install.sh | sh  # macOS/Linux
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"  # Windows

# Create and activate venv
uv venv
source .venv/bin/activate

# Run without activating
uv run script.py
```

## Package management

### pip

```bash
pip install requests
pip install -r requirements.txt
pip freeze > requirements.txt
pip list --outdated
```

### uv (faster alternative)

```bash
uv pip install requests
uv pip install -r requirements.txt
uv pip freeze > requirements.txt
```

## Common stdlib patterns

### File I/O (pathlib)

```python
from pathlib import Path

p = Path("data/file.txt")
text = p.read_text()
p.write_text("content")

# Iterate files
for f in Path("src").rglob("*.py"):
    print(f)
```

### JSON

```python
import json

# Parse
data = json.loads('{"key": "value"}')
data = json.load(open("data.json"))

# Serialize
json.dumps(data, indent=2)
json.dump(data, open("out.json", "w"), indent=2)
```

### HTTP requests

```python
# Built-in (no deps)
from urllib.request import urlopen
import json

with urlopen("https://api.example.com/data") as r:
    data = json.loads(r.read())

# With requests (install first)
import requests
r = requests.get("https://api.example.com/data")
data = r.json()
```

### Subprocess

```python
import subprocess

# Run and capture output
result = subprocess.run(["git", "status"], capture_output=True, text=True)
print(result.stdout)

# Check for errors
result = subprocess.run(["npm", "test"], check=True)
```

### Argument parsing

```python
import argparse

parser = argparse.ArgumentParser(description="My script")
parser.add_argument("input", help="Input file")
parser.add_argument("--output", "-o", default="out.txt")
parser.add_argument("--verbose", "-v", action="store_true")
args = parser.parse_args()
```

## Destructive Operations

Always confirm with the user before running any of the following:

| Pattern | Risk |
|---------|------|
| `shutil.rmtree(path)` | Recursively deletes entire directory tree permanently |
| `os.remove(path)` in a loop or with glob | Bulk file deletion, easy to match unintended files |
| `open(path, 'w')` on an existing file | Silently overwrites and truncates file content |
| `Path.write_text` / `Path.write_bytes` on existing file | Same as above |
| `subprocess.run(['rm', '-rf', ...])` | Shell deletion triggered from Python code |

Before executing, show the user the exact path or pattern that will be affected, and ask for explicit confirmation.
