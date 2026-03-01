/**
 * Pluggable interface for environment dependency checks.
 * Implement this to replace the default Node.js-based checks with
 * custom logic (e.g. Electron shell lookups, mocked environments in tests).
 */
export interface SkillValidator {
  /** Returns true if the named executable is available in the current environment. */
  checkBin(name: string): Promise<boolean>;
  /** Returns true if the named environment variable is set to a non-empty value. */
  checkEnv(name: string): boolean;
  /** Returns true if the current OS matches at least one of the given platform strings. */
  checkOs(platforms: string[]): boolean;
}
