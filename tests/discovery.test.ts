import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { SkillDiscovery } from '../src/discovery/discovery.js';
import type { SkillValidator } from '../src/validator.js';

// ---------------------------------------------------------------------------
// Fixture helpers
// ---------------------------------------------------------------------------

async function makeSkillDir(root: string, name: string, frontmatter: string, body = '') {
  const dir = path.join(root, name);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, 'SKILL.md'), `---\n${frontmatter}\n---\n${body}`);
  return dir;
}

let tmpDir: string;
beforeAll(async () => {
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'agent-skill-test-'));
});
afterAll(async () => {
  await fs.rm(tmpDir, { recursive: true, force: true });
});

// ---------------------------------------------------------------------------

describe('SkillDiscovery.list()', () => {
  it('returns empty list when root does not exist', async () => {
    const d = new SkillDiscovery([{ path: '/nonexistent/path', scope: 'system' }]);
    expect(await d.list()).toEqual([]);
  });

  it('discovers a valid skill', async () => {
    const root = path.join(tmpDir, 'basic');
    await makeSkillDir(root, 'git', 'name: git\ndescription: Git skill');
    const d = new SkillDiscovery([{ path: root, scope: 'system' }]);
    const entries = await d.list();
    expect(entries).toHaveLength(1);
    expect(entries[0].name).toBe('git');
    expect(entries[0].description).toBe('Git skill');
    expect(entries[0].scope).toBe('system');
  });

  it('skips directories without SKILL.md', async () => {
    const root = path.join(tmpDir, 'skip');
    await fs.mkdir(path.join(root, 'empty-dir'), { recursive: true });
    await makeSkillDir(root, 'real', 'name: real');
    const d = new SkillDiscovery([{ path: root, scope: 'system' }]);
    const entries = await d.list();
    expect(entries).toHaveLength(1);
    expect(entries[0].name).toBe('real');
  });

  it('user scope takes priority over system scope for same name', async () => {
    const userRoot = path.join(tmpDir, 'priority-user');
    const sysRoot = path.join(tmpDir, 'priority-sys');
    await makeSkillDir(userRoot, 'shared', 'name: shared\ndescription: user version');
    await makeSkillDir(sysRoot, 'shared', 'name: shared\ndescription: system version');

    const d = new SkillDiscovery([
      { path: userRoot, scope: 'user' },
      { path: sysRoot, scope: 'system' },
    ]);
    const entries = await d.list();
    expect(entries).toHaveLength(1);
    expect(entries[0].description).toBe('user version');
    expect(entries[0].scope).toBe('user');
  });

  it('returns entries sorted by name', async () => {
    const root = path.join(tmpDir, 'sorted');
    for (const name of ['zebra', 'alpha', 'mango']) {
      await makeSkillDir(root, name, `name: ${name}`);
    }
    const d = new SkillDiscovery([{ path: root, scope: 'system' }]);
    const names = (await d.list()).map((e) => e.name);
    expect(names).toEqual([...names].sort());
  });

  it('marks skill ineligible when validator reports missing bin', async () => {
    const root = path.join(tmpDir, 'ineligible-bin');
    await makeSkillDir(root, 'gh', 'name: gh\nrequires: bin:definitely-not-a-real-bin-xyz');

    const validator: SkillValidator = {
      checkBin: async () => false,
      checkEnv: () => true,
      checkOs: () => true,
    };
    const d = new SkillDiscovery([{ path: root, scope: 'system' }], validator);
    const [entry] = await d.list();
    expect(entry.eligible).toBe(false);
    expect(entry.missing[0].kind).toBe('bin');
  });

  it('marks skill ineligible when validator reports missing env', async () => {
    const root = path.join(tmpDir, 'ineligible-env');
    await makeSkillDir(root, 'api', 'name: api\nrequires: env:MISSING_API_KEY');

    const validator: SkillValidator = {
      checkBin: async () => true,
      checkEnv: () => false,
      checkOs: () => true,
    };
    const d = new SkillDiscovery([{ path: root, scope: 'system' }], validator);
    const [entry] = await d.list();
    expect(entry.eligible).toBe(false);
    expect(entry.missing[0].kind).toBe('env');
  });

  it('marks skill ineligible when OS does not match', async () => {
    const root = path.join(tmpDir, 'ineligible-os');
    await makeSkillDir(root, 'platform', `name: platform\nos: unsupported-os-xyz`);

    const validator: SkillValidator = {
      checkBin: async () => true,
      checkEnv: () => true,
      checkOs: () => false,
    };
    const d = new SkillDiscovery([{ path: root, scope: 'system' }], validator);
    const [entry] = await d.list();
    expect(entry.eligible).toBe(false);
    expect(entry.missing[0].kind).toBe('os');
  });

  it('exposes always flag', async () => {
    const root = path.join(tmpDir, 'always');
    await makeSkillDir(root, 'memory', 'name: memory\nalways: true');
    const d = new SkillDiscovery([{ path: root, scope: 'system' }]);
    const [entry] = await d.list();
    expect(entry.always).toBe(true);
  });
});

describe('SkillDiscovery.load()', () => {
  it('returns full SKILL.md content including frontmatter', async () => {
    const root = path.join(tmpDir, 'load');
    const dir = await makeSkillDir(root, 'mskill', 'name: mskill', 'This is the body.');
    const filePath = path.join(dir, 'SKILL.md');
    const d = new SkillDiscovery([{ path: root, scope: 'system' }]);
    const content = await d.load(filePath);
    expect(content).toContain('name: mskill');
    expect(content).toContain('This is the body.');
  });
});
