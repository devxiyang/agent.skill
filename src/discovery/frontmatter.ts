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
 *
 * Supports two requirement sources:
 * 1. Top-level `requires` field: `bin:git,env:GITHUB_TOKEN`
 * 2. `metadata` field: a JSON string with a namespaced object (`octoii` or `openclaw`)
 *    containing `requires`, `bins`, `env`, and `os` keys.
 *
 * Values from both sources are merged and deduplicated.
 */
export function parseFrontmatter(content: string): SkillFrontmatter {
  const { data, content: body } = matter(content);
  void body;

  const meta = parseMetadataJson(data.metadata);
  const requires = extractRequirements(data, meta);

  return {
    name: normalizeString(data.name),
    description: normalizeString(data.description),
    always: data.always === true || meta.always === true,
    tags: parseCsv(data.tags ?? meta.tags),
    requiresBins: requires.bins,
    requiresEnvs: requires.envs,
    requiresOs: parseCsv(meta.os),
  };
}

/**
 * Strips the frontmatter block from a SKILL.md file and returns the trimmed body.
 * This is the markdown content passed to the agent as skill instructions.
 */
export function stripFrontmatter(content: string): string {
  return matter(content).content.trim();
}

// ---------------------------------------------------------------------------

/**
 * Parses the `metadata` field, which is an embedded JSON string that may contain
 * a scoped namespace (`octoii` or `openclaw`). Returns an empty object on failure.
 */
function parseMetadataJson(raw: unknown): Record<string, unknown> {
  if (typeof raw !== 'string') return {};
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!isRecord(parsed)) return {};
    return pickScopedNamespace(parsed);
  } catch {
    return {};
  }
}

/**
 * If the object has a known namespace key (`octoii`, `openclaw`), returns that
 * nested object. Otherwise returns the object as-is for flat metadata structures.
 */
function pickScopedNamespace(input: Record<string, unknown>): Record<string, unknown> {
  for (const ns of ['octoii', 'openclaw']) {
    if (ns in input && isRecord(input[ns])) {
      return input[ns] as Record<string, unknown>;
    }
  }
  return input;
}

/**
 * Merges `requires` strings and explicit `bins`/`env` lists from both the
 * top-level frontmatter and the metadata namespace, deduplicating results.
 */
function extractRequirements(
  data: Record<string, unknown>,
  meta: Record<string, unknown>,
): { bins: string[]; envs: string[] } {
  const bins = new Set<string>();
  const envs = new Set<string>();

  for (const { b, e } of [
    parseRequireString(data.requires),
    parseRequireString(meta.requires),
  ]) {
    b.forEach((v) => bins.add(v));
    e.forEach((v) => envs.add(v));
  }

  parseCsv(meta.bins).forEach((v) => bins.add(v));
  parseCsv(meta.env).forEach((v) => envs.add(v));

  return { bins: [...bins], envs: [...envs] };
}

/**
 * Parses a `requires` string of the form `bin:git,env:TOKEN` into separate
 * bin and env arrays. Supports both comma and semicolon as delimiters.
 */
function parseRequireString(raw: unknown): { b: string[]; e: string[] } {
  if (typeof raw !== 'string') return { b: [], e: [] };
  const b: string[] = [];
  const e: string[] = [];
  for (const part of raw.split(/[;,]/)) {
    const v = part.trim();
    if (v.startsWith('bin:')) b.push(v.slice(4).trim());
    else if (v.startsWith('env:')) e.push(v.slice(4).trim());
  }
  return { b, e };
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

function isRecord(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === 'object' && !Array.isArray(v);
}
