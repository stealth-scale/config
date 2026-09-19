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
 *   exclusions reach a tool that ships with none.
 *   `.claude` holds the worktrees an agent session checks out, each a second
 *   copy of this repository. A run from the root that descended into one would
 *   count every file twice and run every specification again.
 */
export const FOREIGN = [
  "**/node_modules/**",
  "**/.git/**",
  "**/.claude/**",
  "**/dist/**",
  "**/coverage/**",
];
