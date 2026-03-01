import fs from 'node:fs/promises';
import path from 'node:path';
import type { SkillValidator } from '../validator.js';

/**
 * Default SkillValidator for Node.js environments.
 * - checkBin: walks PATH segments and probes for the executable via fs.access
 * - checkEnv: reads process.env
 * - checkOs: compares against process.platform
 */
export const defaultValidator: SkillValidator = {
  /**
   * Checks whether a binary exists somewhere on PATH.
   * On Windows, also probes .exe / .cmd / .bat extensions.
   */
  async checkBin(name: string): Promise<boolean> {
    const pathEnv = process.env.PATH;
    if (!pathEnv) return false;
    const segments = pathEnv.split(path.delimiter).filter(Boolean);
    const candidates =
      process.platform === 'win32'
        ? [name, `${name}.exe`, `${name}.cmd`, `${name}.bat`]
        : [name];
    for (const seg of segments) {
      for (const candidate of candidates) {
        try {
          await fs.access(path.join(seg, candidate));
          return true;
        } catch { /* not found in this segment, continue */ }
      }
    }
    return false;
  },

  /** Returns true if the env var exists and is not blank. */
  checkEnv(name: string): boolean {
    const v = process.env[name];
    return typeof v === 'string' && v.trim().length > 0;
  },

  /** Returns true if process.platform is in the allowed list. */
  checkOs(platforms: string[]): boolean {
    return platforms.includes(process.platform);
  },
};
