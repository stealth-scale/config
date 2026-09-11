/**
 * Remembering what a task produced, so it runs once per change rather than once per ask.
 */

import { type Preset, preset } from "#core/layer.ts";

/**
 * Caches every task and every script, keyed on what each one reads.
 *
 * The runner caches the tasks a config names and leaves `package.json` scripts alone, which splits
 * a workspace in two: `vp run -r build` re-runs every package whose script has not changed, because
 * a script is not a task as far as the cache is concerned. A script is a task that happens to be
 * written somewhere else, and the runner fingerprints both the same way.
 *
 * Belongs in the workspace root's config and nowhere else. The runner refuses it in a package,
 * because a cache shared by every package cannot be configured by one of them.
 *
 * @returns The preset.
 */
export function cache(): Preset {
  return preset({
    config: { run: { cache: { scripts: true, tasks: true } } },
    name: "run.cache",
  });
}
