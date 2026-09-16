/**
 * The `staged` block: what happens to files in the moment before they are committed.
 *
 * Read from the workspace root's config, because `vp staged` runs from the hook and the hook runs
 * at the root of the repository. A package stating its own is stating it where nothing looks.
 *
 * Nothing here installs the hook. A repository writes `lefthook.yml` and lefthook runs `vp staged`
 * from `pre-commit`. Which hook manager a repository uses is a decision about one clone of it
 * rather than about how it is configured, and a config package that installed a git hook would be
 * reaching a long way past what it was asked to do.
 */

export { checked } from "#staged/checked.ts";
export { command } from "#staged/command.ts";
export { formatted } from "#staged/formatted.ts";
export { type Runs, type Staging } from "#staged/settings.ts";
