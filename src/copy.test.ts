import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { copySkills } from './copy.js';

let tmpDir: string;
let srcRoot: string;

beforeAll(async () => {
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'agent-skill-copy-test-'));
  srcRoot = path.join(tmpDir, 'src');

  // Create fixture skills
  for (const name of ['git', 'github', 'web']) {
    const dir = path.join(srcRoot, name);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, 'SKILL.md'), `---\nname: ${name}\n---\n`);
  }

  // A dir without SKILL.md (should be ignored)
  await fs.mkdir(path.join(srcRoot, 'not-a-skill'), { recursive: true });
});

afterAll(async () => {
  await fs.rm(tmpDir, { recursive: true, force: true });
});

describe('copySkills', () => {
  it('copies all skills to target', async () => {
    const to = path.join(tmpDir, 'dest-all');
    const result = await copySkills({ from: srcRoot, to });

    expect(result.copied.sort()).toEqual(['git', 'github', 'web']);
    expect(result.skipped).toEqual([]);

    for (const name of result.copied) {
      const skillMd = path.join(to, name, 'SKILL.md');
      await expect(fs.access(skillMd)).resolves.toBeUndefined();
    }
  });

  it('filters by skill names', async () => {
    const to = path.join(tmpDir, 'dest-filter');
    const result = await copySkills({ from: srcRoot, to, skills: ['git', 'web'] });

    expect(result.copied.sort()).toEqual(['git', 'web']);
    expect(result.skipped).toEqual([]);
    await expect(fs.access(path.join(to, 'github'))).rejects.toThrow();
  });

  it('skips existing skills by default', async () => {
    const to = path.join(tmpDir, 'dest-skip');
    await copySkills({ from: srcRoot, to });

    const result = await copySkills({ from: srcRoot, to });
    expect(result.copied).toEqual([]);
    expect(result.skipped.sort()).toEqual(['git', 'github', 'web']);
  });

  it('overwrites existing skills when overwrite: true', async () => {
    const to = path.join(tmpDir, 'dest-overwrite');
    await copySkills({ from: srcRoot, to });

    const result = await copySkills({ from: srcRoot, to, overwrite: true });
    expect(result.copied.sort()).toEqual(['git', 'github', 'web']);
    expect(result.skipped).toEqual([]);
  });

  it('ignores directories without SKILL.md', async () => {
    const to = path.join(tmpDir, 'dest-no-skill-md');
    const result = await copySkills({ from: srcRoot, to });
    expect(result.copied).not.toContain('not-a-skill');
  });

  it('creates target directory if it does not exist', async () => {
    const to = path.join(tmpDir, 'new', 'nested', 'dest');
    await copySkills({ from: srcRoot, to });
    await expect(fs.access(to)).resolves.toBeUndefined();
  });
});
