---
name: skill-creator
description: Create or update skills. Use when designing, structuring, or writing a new skill folder with SKILL.md and optional resources.
---

# Skill Creator

## What is a skill

A skill is a folder that extends an agent's capabilities with specialized knowledge and workflows:

```
skill-name/
├── SKILL.md          # required — frontmatter + instructions
├── scripts/          # optional — executable scripts
├── references/       # optional — docs loaded on demand
└── assets/           # optional — templates, images, files used in output
```

## SKILL.md structure

```markdown
---
name: skill-name
description: What this skill does and when to use it. Be specific about triggers.
requires: bin:tool,env:API_KEY   # optional
os: darwin,linux                  # optional, omit for all platforms
always: false                     # optional, set true to inject on every agent run
tags: category,label              # optional, comma-separated
---

# Skill Name

Instructions for the agent...
```

Only `name` and `description` are required. All other frontmatter fields are optional.

## Writing good descriptions

The description is the primary trigger. Include:
- What the skill does
- When to use it (specific contexts and phrases that should trigger it)

Example: `"Create and edit .docx files with tracked changes support. Use when working with Word documents, professional reports, or any .docx task."`

## Body guidelines

- Write for another agent instance — include what would be non-obvious
- Prefer concise examples over verbose explanations
- Keep under 500 lines; move details to `references/` files
- Link to reference files explicitly so the agent knows they exist

## Resource types

**scripts/** — Deterministic code run repeatedly. Test each script before including.

**references/** — Docs loaded on demand. Keep SKILL.md lean; put schemas, API docs, and detailed guides here. Reference them from SKILL.md with a note on when to load.

**assets/** — Files used in output (templates, images, fonts). Not loaded into context.

## Progressive disclosure

Three loading levels:
1. **Name + description** — always in context (~100 tokens)
2. **SKILL.md body** — loaded when skill triggers (<5k tokens)
3. **references/ and scripts/** — loaded or executed on demand

Design each level to be independently useful.

## Naming

- Lowercase, hyphens only: `my-skill`, `gh-review`, `pdf-editor`
- Short and action-oriented
- Namespace by tool when helpful: `gh-address-comments`
