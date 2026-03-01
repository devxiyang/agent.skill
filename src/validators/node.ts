import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import type { SkillValidator } from '../validator.js';

/**
 * Returns well-known binary directories that are commonly missing from PATH
 * when a process is launched outside a shell (e.g. Electron from Dock/Finder,
 * GUI apps, some CI environments). These are prepended to the process PATH so
 * that checkBin reflects what is actually installed on the system.
 */
function extraPaths(): string[] {
  const home = os.homedir();

  if (process.platform === 'darwin') {
    return [
      '/opt/homebrew/bin',      // Homebrew — Apple Silicon
      '/opt/homebrew/sbin',
      '/usr/local/bin',         // Homebrew — Intel, manually installed tools
      '/usr/local/sbin',
      path.join(home, '.local', 'bin'), // pip --user, pipx, etc.
    ];
  }

  if (process.platform === 'win32') {
    const localAppData = process.env.LOCALAPPDATA ?? path.join(home, 'AppData', 'Local');
    const appData = process.env.APPDATA ?? path.join(home, 'AppData', 'Roaming');
    return [
      path.join(localAppData, 'Microsoft', 'WindowsApps'), // winget-installed tools
      path.join(localAppData, 'Programs', 'Git', 'cmd'),   // Git for Windows (user install)
      'C:\\Program Files\\Git\\cmd',                        // Git for Windows (system install)
      path.join(appData, 'npm'),                            // npm global binaries
    ];
  }

  // Linux
  return [
    '/usr/local/bin',
    path.join(home, '.local', 'bin'), // pip --user, pipx, etc.
    '/snap/bin',                       // snap packages
  ];
}

/**
 * Default SkillValidator for Node.js environments.
 * - checkBin: walks an expanded PATH (process PATH + well-known install locations)
 *   so that tools installed via Homebrew, winget, pip, etc. are found even when
 *   the process was launched with a minimal PATH (e.g. Electron from Dock/Finder).
 * - checkEnv: reads process.env
 * - checkOs: compares against process.platform
 */
export const defaultValidator: SkillValidator = {
  /**
   * Checks whether a binary exists on PATH or in well-known install locations.
   * On Windows, also probes .exe / .cmd / .bat extensions.
   */
  async checkBin(name: string): Promise<boolean> {
    const fromEnv = (process.env.PATH ?? '').split(path.delimiter).filter(Boolean);
    const segments = [...extraPaths(), ...fromEnv];
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
