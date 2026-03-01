/** Whether a skill came from a user-managed directory or a system-provided one. */
export type SkillScope = 'user' | 'system';

/** A directory root that SkillDiscovery scans for skill folders. */
export type SkillRoot = {
  /** Absolute path to the directory containing skill subfolders. */
  path: string;
  /** Metadata tag for the origin of skills found in this root. Does not affect priority. */
  scope: SkillScope;
};

/** The category of an unmet dependency. */
export type SkillMissingReasonKind = 'bin' | 'env' | 'os' | 'invalid';

/** Describes a single unmet requirement that makes a skill ineligible. */
export type SkillMissingReason = {
  kind: SkillMissingReasonKind;
  /** The specific value that failed the check (e.g. binary name, env var name). */
  value: string;
  /** Human-readable explanation shown to the user. */
  message: string;
};

/** A discovered skill with its metadata and eligibility status. */
export type SkillEntry = {
  /** Display name from frontmatter, or the folder name if not set. */
  name: string;
  description: string | null;
  /** Absolute path to the skill folder. */
  path: string;
  /** Absolute path to the SKILL.md file inside the skill folder. */
  filePath: string;
  scope: SkillScope;
  /**
   * True when all requires/os constraints are satisfied in the current environment.
   * Informational only — the skill content should still be passed to the agent even
   * when false, so the agent can autonomously resolve missing dependencies.
   */
  eligible: boolean;
  /** Unmet requirements; empty when eligible is true. */
  missing: SkillMissingReason[];
  /** When true, this skill should be injected into every agent run automatically. */
  always: boolean;
  tags: string[];
};
