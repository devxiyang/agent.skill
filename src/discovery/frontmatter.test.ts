import { describe, it, expect } from 'vitest';
import { parseFrontmatter } from './frontmatter.js';

const wrap = (body: string, content = '') =>
  `---\n${body}\n---\n${content}`;

describe('parseFrontmatter', () => {
  it('returns defaults when no frontmatter', () => {
    const fm = parseFrontmatter('just markdown');
    expect(fm.name).toBeNull();
    expect(fm.description).toBeNull();
    expect(fm.always).toBe(false);
    expect(fm.requiresBins).toEqual([]);
    expect(fm.requiresEnvs).toEqual([]);
    expect(fm.requiresOs).toEqual([]);
  });

  it('parses basic fields', () => {
    const fm = parseFrontmatter(wrap('name: github\ndescription: GitHub CLI skill\nalways: true'));
    expect(fm.name).toBe('github');
    expect(fm.description).toBe('GitHub CLI skill');
    expect(fm.always).toBe(true);
  });

  it('parses requires string', () => {
    const fm = parseFrontmatter(wrap('name: git\nrequires: bin:git,env:GITHUB_TOKEN'));
    expect(fm.requiresBins).toContain('git');
    expect(fm.requiresEnvs).toContain('GITHUB_TOKEN');
  });

  it('parses metadata JSON — octoii namespace', () => {
    const meta = JSON.stringify({ octoii: { os: 'darwin,linux', bins: 'gh', env: 'GH_TOKEN' } });
    const fm = parseFrontmatter(wrap(`name: gh\nmetadata: '${meta}'`));
    expect(fm.requiresBins).toContain('gh');
    expect(fm.requiresEnvs).toContain('GH_TOKEN');
    expect(fm.requiresOs).toContain('darwin');
    expect(fm.requiresOs).toContain('linux');
  });

  it('deduplicates bins and envs from both sources', () => {
    const meta = JSON.stringify({ octoii: { bins: 'git' } });
    const fm = parseFrontmatter(wrap(`name: dup\nrequires: bin:git\nmetadata: '${meta}'`));
    expect(fm.requiresBins.filter((b) => b === 'git')).toHaveLength(1);
  });

  it('handles quoted description', () => {
    const fm = parseFrontmatter(wrap('name: x\ndescription: "hello world"'));
    expect(fm.description).toBe('hello world');
  });

  it('ignores unknown boolean values and uses fallback', () => {
    const fm = parseFrontmatter(wrap('name: x\nalways: maybe'));
    expect(fm.always).toBe(false);
  });
});

