import matter from 'gray-matter';

/** Parsed and normalized representation of a SKILL.md frontmatter block. */
export type SkillFrontmatter = {
  name: string | null;
  description: string | null;
  always: boolean;
  tags: string[];
  requiresBins: string[];
  requiresEnvs: string[];
  requiresOs: string[];
};

/**
 * Parses the YAML frontmatter of a SKILL.md file into a normalized structure.
 */
export function parseFrontmatter(content: string): SkillFrontmatter {
  const { data } = matter(content);
  const { bins, envs } = parseRequireString(data.requires);

  return {
    name: normalizeString(data.name),
    description: normalizeString(data.description),
    always: data.always === true,
    tags: parseCsv(data.tags),
    requiresBins: bins,
    requiresEnvs: envs,
    requiresOs: parseCsv(data.os),
  };
}

// ---------------------------------------------------------------------------

/**
 * Parses a `requires` string of the form `bin:git,env:TOKEN` into separate
 * bin and env arrays. Supports both comma and semicolon as delimiters.
 */
function parseRequireString(raw: unknown): { bins: string[]; envs: string[] } {
  if (typeof raw !== 'string') return { bins: [], envs: [] };
  const bins: string[] = [];
  const envs: string[] = [];
  for (const part of raw.split(/[;,]/)) {
    const v = part.trim();
    if (v.startsWith('bin:')) bins.push(v.slice(4).trim());
    else if (v.startsWith('env:')) envs.push(v.slice(4).trim());
  }
  return { bins, envs };
}

/**
 * Parses a value that may be a comma-separated string or an array of strings.
 * Returns an empty array for any other type.
 */
function parseCsv(raw: unknown): string[] {
  if (typeof raw === 'string') {
    return raw.split(',').map((v) => v.trim()).filter(Boolean);
  }
  if (Array.isArray(raw)) {
    return raw.filter((v): v is string => typeof v === 'string');
  }
  return [];
}

/** Returns the trimmed string, or null if it is empty or not a string. */
function normalizeString(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  const v = raw.trim();
  return v.length > 0 ? v : null;
}
