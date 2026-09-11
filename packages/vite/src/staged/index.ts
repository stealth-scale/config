/**
 * The `staged` block: what happens to files in the moment before they are committed.
 *
 * Read from the workspace root's config, because `vp staged` runs from the hook and the hook runs
 * at the root of the repository. A package stating its own is stating it where nothing looks.
 *
 * Nothing here installs the hook. `vp hooks enable` writes the dispatcher and
 * `.vite-hooks/pre-commit` calls `vp staged`; both are decisions about one clone of a repository
 * rather than about how a repository is configured, and a config package that installed a git hook
 * would be reaching a long way past what it was asked to do.
 */

export { checked } from "#staged/checked.ts";
export { formatted } from "#staged/formatted.ts";
export { on } from "#staged/on.ts";
export { type Runs, type Staging } from "#staged/settings.ts";
