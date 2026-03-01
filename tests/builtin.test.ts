import { describe, it, expect } from 'vitest';
import fs from 'node:fs/promises';
import path from 'node:path';
import { builtinSkillsRoot } from '../src/builtin.js';

describe('builtinSkillsRoot', () => {
  it('returns an absolute path', () => {
    expect(path.isAbsolute(builtinSkillsRoot())).toBe(true);
  });

  it('points to a directory that exists', async () => {
    await expect(fs.access(builtinSkillsRoot())).resolves.toBeUndefined();
  });

  it('contains at least one skill subfolder with SKILL.md', async () => {
    const root = builtinSkillsRoot();
    const entries = await fs.readdir(root, { withFileTypes: true });
    const skillDirs = entries.filter((e) => e.isDirectory());
    expect(skillDirs.length).toBeGreaterThan(0);

    const checks = await Promise.all(
      skillDirs.map((d) =>
        fs.access(path.join(root, d.name, 'SKILL.md')).then(() => true).catch(() => false)
      )
    );
    expect(checks.some(Boolean)).toBe(true);
  });
});
