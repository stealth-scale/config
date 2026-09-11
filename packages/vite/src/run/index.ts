/**
 * The `run` block: what a workspace runs, and what it remembers about having run it.
 *
 * Read from the workspace root's config for everything shared — the cache and whether a `preX`
 * script runs before `X`, both of which the runner refuses in a package, because one package cannot
 * decide them for the rest. A task is the exception and may be named anywhere.
 *
 * Nothing here states `enablePrePostScripts`. The runner already runs `pretest` before `test`, and
 * a repository turning that off is saying something about its own scripts rather than choosing
 * between two house answers.
 */

export { cache } from "#run/cache.ts";
export { ci } from "#run/ci.ts";
export { type Doing, type Running } from "#run/settings.ts";
export { task } from "#run/task.ts";
