# agent.skill

[![npm version](https://img.shields.io/npm/v/@devxiyang/agent-skill)](https://www.npmjs.com/package/@devxiyang/agent-skill)
[![npm downloads](https://img.shields.io/npm/dm/@devxiyang/agent-skill)](https://www.npmjs.com/package/@devxiyang/agent-skill)
[![node >=18](https://img.shields.io/node/v/@devxiyang/agent-skill)](https://www.npmjs.com/package/@devxiyang/agent-skill)

SDK for skill discovery and registration — integrates into any agent.

A **skill** is a folder containing a `SKILL.md` file (with YAML frontmatter + instructions) and optional resources (scripts, references, assets). This SDK provides the tooling to discover, validate, and load skills into an agent's context.

## Installation

```bash
npm install @devxiyang/agent-skill
```

## Concepts

### Skill folder structure

```
skill-name/
├── SKILL.md          # required — frontmatter metadata + instructions
├── scripts/          # optional — executable scripts
├── references/       # optional — docs loaded on demand
└── assets/           # optional — files used in output
```

### SKILL.md frontmatter

```yaml
---
name: github
description: Interact with GitHub using the gh CLI.
requires: bin:gh,env:GITHUB_TOKEN
os: darwin,linux
always: false
tags: github,vcs
---
```

| Field | Required | Description |
|---|---|---|
| `name` | yes | Skill identifier |
| `description` | yes | What the skill does and when to use it |
| `requires` | no | `bin:<name>` and/or `env:<NAME>` comma-separated |
| `os` | no | Allowed platforms: `darwin`, `linux`, `win32` |
| `always` | no | If `true`, inject into agent context on every run |
| `tags` | no | Comma-separated labels for categorisation |

## Usage

```typescript
import { SkillDiscovery, builtinSkillsRoot } from '@devxiyang/agent-skill';

const discovery = new SkillDiscovery([
  { path: '/my/workspace/skills', scope: 'user' },  // checked first — higher priority
  { path: builtinSkillsRoot(), scope: 'system' },   // fallback
]);

// Discover all skills with eligibility info
const entries = await discovery.list();

// Load full SKILL.md content (frontmatter + body) for injection into agent context
const content = await discovery.load(entries[0].filePath);
```

**Priority is determined by roots array order** — the first root that contains a skill with a given name wins; later roots are skipped for that name. The `scope` field is metadata only and does not affect priority.

To override a built-in skill, place a skill folder with the same name in an earlier root:

```
/my/workspace/skills/
└── git/           ← overrides the built-in git skill
    └── SKILL.md
```

## Built-in skills

| Skill | Requires | Description |
|---|---|---|
| `git` | `git` | Local git operations |
| `github` | `gh` | GitHub issues, PRs, CI via gh CLI |
| `tmux` | `tmux` (macOS/Linux) | Remote-control interactive terminal sessions |
| `weather` | `curl` | Current weather and forecasts, no API key |
| `web` | `curl` | Fetch pages, call REST APIs, download files |
| `skill-creator` | — | Guide for creating and structuring new skills |

## Copying skills

Copy skill folders from any source root into a target directory. Useful for seeding a workspace with built-in or third-party skill sets.

```typescript
import { copySkills, builtinSkillsRoot } from '@devxiyang/agent-skill';

// Copy all built-in skills
await copySkills({
  from: builtinSkillsRoot(),
  to: '/my/workspace/skills',
});

// Copy a subset
await copySkills({
  from: builtinSkillsRoot(),
  to: '/my/workspace/skills',
  skills: ['git', 'github'],
});

// Overwrite existing
await copySkills({
  from: builtinSkillsRoot(),
  to: '/my/workspace/skills',
  overwrite: true,
});
```

Returns `{ copied: string[], skipped: string[] }`. Existing skills are skipped by default (`overwrite: false`). Directories without a `SKILL.md` are ignored.

## Custom validator

By default, dependency checks use the built-in `defaultValidator` (Node.js PATH lookup, `process.env`, `process.platform`). You can provide your own:

```typescript
import { SkillDiscovery, SkillValidator } from '@devxiyang/agent-skill';

const myValidator: SkillValidator = {
  async checkBin(name) { /* custom bin check */ return true; },
  checkEnv(name) { return !!process.env[name]; },
  checkOs(platforms) { return platforms.includes(process.platform); },
};

const discovery = new SkillDiscovery([{ path: myRoot, scope: 'user' }], myValidator);
```

## API

### `SkillDiscovery`

```typescript
new SkillDiscovery(roots: SkillRoot[], validator?: SkillValidator)

discovery.list(): Promise<SkillEntry[]>
discovery.load(filePath: string): Promise<string>
```

### `copySkills(options): Promise<CopySkillsResult>`

```typescript
type CopySkillsOptions = {
  from: string;        // source skills root
  to: string;          // target directory
  skills?: string[];   // filter by skill name (default: all)
  overwrite?: boolean; // overwrite existing (default: false)
};

type CopySkillsResult = {
  copied: string[];
  skipped: string[];
};
```

### `builtinSkillsRoot(): string`

Returns the absolute path to the built-in skills directory bundled with this package.

### `defaultValidator`

The built-in `SkillValidator` implementation for Node.js environments.

### Types

```typescript
type SkillEntry = {
  name: string;
  description: string | null;
  path: string;        // skill folder path
  filePath: string;    // SKILL.md path
  scope: 'user' | 'system';
  eligible: boolean;   // all dependencies satisfied
  always: boolean;
  tags: string[];
  missing: SkillMissingReason[];
};

type SkillMissingReason = {
  kind: 'bin' | 'env' | 'os' | 'invalid';
  value: string;
  message: string;
};
```

## License

MIT
