import fs from 'node:fs/promises';
import path from 'node:path';
import type { SkillEntry, SkillMissingReason, SkillRoot } from '../types.js';
import type { SkillValidator } from '../validator.js';
import { defaultValidator } from '../validators/index.js';
import { parseFrontmatter, stripFrontmatter } from './frontmatter.js';

/**
 * Discovers and loads skills from one or more root directories.
 *
 * Priority is determined by the order of the `roots` array — the first root
 * that contains a skill folder with a given name wins; subsequent roots are
 * skipped for that name. Place higher-priority roots (e.g. user overrides)
 * before lower-priority ones (e.g. built-in skills).
 *
 * ```ts
 * const discovery = new SkillDiscovery([
 *   { path: userSkillsDir, scope: 'user' },        // checked first
 *   { path: builtinSkillsRoot(), scope: 'system' }, // fallback
 * ]);
 * ```
 */
export class SkillDiscovery {
  private readonly validator: SkillValidator;

  constructor(
    private readonly roots: SkillRoot[],
    validator?: SkillValidator,
  ) {
    this.validator = validator ?? defaultValidator;
  }

  /**
   * Scans all roots and returns every discovered skill with its eligibility status.
   *
   * Skills are deduplicated by folder name (first-root-wins). The returned array
   * is sorted alphabetically by skill name.
   */
  async list(): Promise<SkillEntry[]> {
    const byName = new Map<string, SkillEntry>();

    for (const root of this.roots) {
      if (!(await exists(root.path))) continue;

      const dirents = await fs.readdir(root.path, { withFileTypes: true });
      for (const dirent of dirents) {
        if (!dirent.isDirectory() || dirent.name.startsWith('.')) continue;
        // First root wins — skip if already discovered from a higher-priority root.
        if (byName.has(dirent.name)) continue;

        const skillPath = path.join(root.path, dirent.name);
        const filePath = path.join(skillPath, 'SKILL.md');
        if (!(await exists(filePath))) continue;

        const content = await fs.readFile(filePath, 'utf8');
        const fm = parseFrontmatter(content);
        const missing = await this.resolveMissing(fm);

        byName.set(dirent.name, {
          name: fm.name ?? dirent.name,
          description: fm.description,
          path: skillPath,
          filePath,
          scope: root.scope,
          eligible: missing.length === 0,
          always: fm.always,
          tags: fm.tags,
          missing,
        });
      }
    }

    return [...byName.values()].sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Reads a SKILL.md file and returns its body with the frontmatter block stripped.
   * This is the content suitable for injecting into an agent's context.
   */
  async load(filePath: string): Promise<string> {
    const content = await fs.readFile(filePath, 'utf8');
    return stripFrontmatter(content);
  }

  // ---------------------------------------------------------------------------

  /**
   * Checks all requires/os constraints declared in the frontmatter against the
   * current environment and returns a list of unmet requirements.
   */
  private async resolveMissing(fm: ReturnType<typeof parseFrontmatter>): Promise<SkillMissingReason[]> {
    const missing: SkillMissingReason[] = [];

    for (const bin of fm.requiresBins) {
      if (!(await this.validator.checkBin(bin))) {
        missing.push({ kind: 'bin', value: bin, message: `Missing executable: ${bin}` });
      }
    }

    for (const env of fm.requiresEnvs) {
      if (!this.validator.checkEnv(env)) {
        missing.push({ kind: 'env', value: env, message: `Missing env var: ${env}` });
      }
    }

    if (fm.requiresOs.length > 0 && !this.validator.checkOs(fm.requiresOs)) {
      missing.push({
        kind: 'os',
        value: fm.requiresOs.join(','),
        message: `Requires OS: ${fm.requiresOs.join(' or ')}`,
      });
    }

    return missing;
  }
}

async function exists(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}
