/**
 * Excludes the directories holding nothing this repository wrote.
 */

/**
 * The globs matching installed, built, reported and bookkeeping trees.
 *
 * @remarks
 *   A coverage report and a test run both walk from the repository root, and
 *   either would descend into every installed package given the chance. These
 *   are ordinary globs rather than one runner's built-in defaults, so the same
 *   four exclusions reach a tool that ships with none.
 */
export const FOREIGN = ["**/node_modules/**", "**/.git/**", "**/dist/**", "**/coverage/**"];
