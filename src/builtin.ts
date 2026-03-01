import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Returns the absolute path to the built-in skills directory bundled with this package.
 *
 * Resolves relative to this file's location so the path remains correct regardless
 * of where the consuming project is installed. Pass the result to SkillDiscovery
 * as a system-scoped root:
 *
 * ```ts
 * new SkillDiscovery([
 *   { path: userSkillsDir, scope: 'user' },
 *   { path: builtinSkillsRoot(), scope: 'system' },
 * ])
 * ```
 *
 * Note for Electron apps: if the app is packaged with asar, add
 * `node_modules/@devxiyang/agent-skill/skills` to `asarUnpack` in
 * electron-builder config so the directory is accessible via the filesystem.
 */
export function builtinSkillsRoot(): string {
  const dir = path.dirname(fileURLToPath(import.meta.url));
  return path.resolve(dir, '..', 'skills');
}
