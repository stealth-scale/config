/**
 * Naming a command a repository runs often enough to name.
 */

import { type Preset, preset } from "@stealthscale/vite-config-core";

import { type Doing } from "#run/settings.ts";

/**
 * Names a command, so it is run by what it does rather than by how it is spelled.
 *
 * A task is cached on what it reads and restores what it wrote, which a script written into
 * `package.json` also gets once `run.cache` is on. What a task adds is the rest: an order between
 * packages through `dependsOn`, a working directory, and the environment variables that count
 * towards its fingerprint.
 *
 * One preset per task, each naming the task it carries, so a repository can take back exactly one
 * rather than the set. Two layers naming the same task are the one case that does not compose, and
 * the nearer one wins — which is how a repository replaces a task the house named.
 *
 * @param named - The name the task is run by.
 * @param does - The command, or the command with what it reads and writes.
 * @returns The preset.
 */
export function task(named: string, does: Doing): Preset {
  return preset({
    config: { run: { tasks: { [named]: does } } },
    name: `run.task(${named})`,
  });
}
