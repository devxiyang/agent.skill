---
name: jq
description: Process and transform JSON data using jq. Use when filtering API responses, extracting fields, reshaping JSON, or querying structured data.
requires: bin:jq
tags: json,jq
---

# jq Skill

## Preflight

Verify jq is available before proceeding:

```bash
jq --version
```

If missing, load `references/install.md` for installation instructions.

## Basic filtering

```bash
# Pretty-print JSON
cat data.json | jq .

# Extract a field
echo '{"name":"alice","age":30}' | jq '.name'

# Nested field
echo '{"user":{"email":"a@b.com"}}' | jq '.user.email'

# Array index
echo '[1,2,3]' | jq '.[0]'

# Array slice
echo '[1,2,3,4,5]' | jq '.[2:4]'
```

## Iterating arrays

```bash
# Iterate all elements
curl -s "https://api.example.com/users" | jq '.[]'

# Extract field from each element
curl -s "https://api.example.com/users" | jq '.[].name'

# Same with pipe
curl -s "https://api.example.com/users" | jq '.[] | .name'
```

## Selecting & filtering

```bash
# Filter array by condition
jq '[.[] | select(.age > 25)]' data.json

# Filter by string match
jq '[.[] | select(.status == "active")]' data.json

# Filter by field existence
jq '[.[] | select(.email != null)]' data.json
```

## Transforming

```bash
# Build a new object
jq '{id: .id, label: .name}' data.json

# Map over array
jq '[.[] | {id: .id, label: .name}]' data.json

# Append a field
jq '. + {processed: true}' data.json

# keys, values, length
jq 'keys' data.json
jq '.items | length' data.json
```

## String interpolation

```bash
jq '.[] | "User \(.name) is \(.age) years old"' data.json
```

## Combining with curl

```bash
# Extract specific field from API response
curl -s "https://api.example.com/item/1" | jq '.data.title'

# Filter and format a list
curl -s "https://api.example.com/items" | jq '[.[] | select(.active) | {id, name}]'
```

## Raw output & compact

```bash
# Raw string output (no quotes)
jq -r '.name' data.json

# Compact output (no whitespace)
jq -c '.' data.json

# Read from file
jq '.items' data.json
```
