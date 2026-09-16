/**
 * The `lint` block: what a package is checked by.
 *
 * Stated once, at the workspace root, the same as `fmt`. Every entry point here takes globs for
 * that reason: a package's own answer is expressed as the files it applies to, not as a config file
 * of its own, which the linter does not read.
 */

export {
  defaultExported,
  enforce,
  forbid,
  type Forbidden,
  type LintOverride,
  relax,
  type Ruled,
  specified,
  undocumented,
} from "#lint/departure.ts";
export * as preset from "#lint/preset.ts";
