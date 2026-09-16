/**
 * Turns on the task runner's result cache for a whole repository.
 */

import { type Preset, preset } from "@stealthscale/vite-config-core";

/**
 * Caches the result of a package script as readily as the result of a declared
 * task.
 *
 * @remarks
 *   Scripts are included so that a package which never moved its build into the
 *   task table still skips work it has already done. A task declaring no inputs
 *   has nothing to fingerprint and runs every time whatever this layer says.
 */
export function cache(): Preset {
  return preset({
    config: { run: { cache: { scripts: true, tasks: true } } },
    name: "run.cache",
  });
}
