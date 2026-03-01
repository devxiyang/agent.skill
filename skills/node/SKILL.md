---
name: node
description: Run Node.js scripts, manage packages with npm/npx, and use common built-in module patterns. Use for scripting, web tooling, automation, and general JavaScript/TypeScript development.
requires: bin:node
tags: node,javascript,typescript,scripting
---

# Node Skill

## Preflight

Verify Node.js is available before proceeding:

```bash
node --version
npm --version
```

If missing, load `references/install.md` for installation instructions.

## Running scripts

```bash
node script.js
node script.js arg1 arg2
node -e "console.log('hello')"

# TypeScript (via tsx, no compile step)
npx tsx script.ts
```

## Package management

### npm

```bash
npm install
npm install express
npm install -D typescript
npm uninstall lodash
npm list --depth=0
npm outdated
npm update
```

### npx (run without installing)

```bash
npx tsx script.ts
npx prettier --write .
npx eslint src/
```

## Common built-in patterns

### File I/O (fs/promises)

```js
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const text = await readFile('data.txt', 'utf8');
await writeFile('out.txt', 'content');

// Iterate files
const files = await readdir('src');
```

### JSON

```js
// Parse
const data = JSON.parse(text);

// Serialize
const json = JSON.stringify(data, null, 2);
await writeFile('out.json', json);
```

### HTTP requests (built-in fetch)

```js
// Node 18+ has fetch built-in
const res = await fetch('https://api.example.com/data');
const data = await res.json();

// POST JSON
const res = await fetch('https://api.example.com/items', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'foo' }),
});
```

### Child process

```js
import { execSync, exec } from 'node:child_process';
import { promisify } from 'node:util';

// Sync
const output = execSync('git status', { encoding: 'utf8' });

// Async
const execAsync = promisify(exec);
const { stdout, stderr } = await execAsync('npm test');
```

### Argument parsing

```js
// Built-in (Node 18.3+)
import { parseArgs } from 'node:util';

const { values, positionals } = parseArgs({
  args: process.argv.slice(2),
  options: {
    output: { type: 'string', short: 'o', default: 'out.txt' },
    verbose: { type: 'boolean', short: 'v' },
  },
  allowPositionals: true,
});
```

### Environment variables

```js
const token = process.env.API_TOKEN;
if (!token) throw new Error('API_TOKEN is required');
```

## TypeScript

Prefer `tsx` for running `.ts` files directly without a build step:

```bash
npx tsx script.ts

# Or install globally
npm install -g tsx
tsx script.ts
```

For projects with `tsconfig.json`, check `compilerOptions.target` and `module` before running.

## ESM vs CJS

```js
// ESM (package.json has "type": "module", or file is .mjs)
import { readFile } from 'node:fs/promises';
export function helper() {}

// CJS (default, or file is .cjs)
const { readFile } = require('fs').promises;
module.exports = { helper };
```

Check `"type"` in `package.json` to know which mode applies.

## Destructive Operations

Always confirm with the user before running any of the following:

| Command / Pattern | Risk |
|-------------------|------|
| `npm publish` | Publishes package to the public registry; cannot be fully unpublished |
| `npm unpublish` | Removes a published package version (restricted after 72h) |
| `fs.rm(path, { recursive: true })` / `fs.rmdir` recursive | Deletes directory tree permanently |
| `fs.writeFile` / `fs.truncate` on existing files | Silently overwrites file content |
| `execSync('rm -rf ...')` inside scripts | Shell deletion triggered from Node code |
| `npx <unknown-package>` | Executes remote code; verify package name and source first |

Before executing, state what files or registry resources will be affected, and ask for explicit confirmation.
