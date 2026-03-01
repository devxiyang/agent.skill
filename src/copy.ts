import fs from 'node:fs/promises';
import path from 'node:path';

export type CopySkillsOptions = {
  /** Source skills root directory (e.g. builtinSkillsRoot()). */
  from: string;
  /** Target directory to copy skills into. Created if it does not exist. */
  to: string;
  /** Only copy these skill names. Copies all if omitted. */
  skills?: string[];
  /** Overwrite existing skill folders. Default: false. */
  overwrite?: boolean;
};

export type CopySkillsResult = {
  /** Names of skills that were successfully copied. */
  copied: string[];
  /** Names of skills that were skipped because they already exist and overwrite is false. */
  skipped: string[];
};

/**
 * Copy skill folders from a source root into a target directory.
 *
 * Only directories that contain a SKILL.md are treated as valid skills;
 * everything else is silently ignored.
 *
 * ```ts
 * import { copySkills, builtinSkillsRoot } from '@devxiyang/agent-skill';
 *
 * await copySkills({ from: builtinSkillsRoot(), to: '/my/workspace/skills' });
 * ```
 */
export async function copySkills(options: CopySkillsOptions): Promise<CopySkillsResult> {
  const { from, to, skills, overwrite = false } = options;

  await fs.mkdir(to, { recursive: true });

  const dirents = await fs.readdir(from, { withFileTypes: true });
  const candidates = dirents.filter(
    (d) => d.isDirectory() && !d.name.startsWith('.'),
  );

  // Apply optional name filter.
  const targets = skills
    ? candidates.filter((d) => skills.includes(d.name))
    : candidates;

  const copied: string[] = [];
  const skipped: string[] = [];

  for (const dirent of targets) {
    const srcPath = path.join(from, dirent.name);
    const destPath = path.join(to, dirent.name);

    // Validate: must contain a SKILL.md to be considered a skill folder.
    try {
      await fs.access(path.join(srcPath, 'SKILL.md'));
    } catch {
      continue;
    }

    const destExists = await exists(destPath);
    if (destExists && !overwrite) {
      skipped.push(dirent.name);
      continue;
    }

    if (destExists) {
      await fs.rm(destPath, { recursive: true });
    }

    await copyDir(srcPath, destPath);
    copied.push(dirent.name);
  }

  return { copied, skipped };
}

/** Recursively copies a directory tree from src to dest. */
async function copyDir(src: string, dest: string): Promise<void> {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcEntry = path.join(src, entry.name);
    const destEntry = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(srcEntry, destEntry);
    } else {
      await fs.copyFile(srcEntry, destEntry);
    }
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
