/**
 * Adds one named task to the runner's table.
 */

import { type Preset, preset } from "@stealthscale/vite-config-core";

import { type Doing } from "#run/settings.ts";

/**
 * Declares a task under the name the runner and a developer both invoke it by.
 *
 * @remarks
 *   The layer is named for its task, so a repository can drop one the house
 *   declared and put its own under the same name. A task stating its inputs and
 *   outputs becomes cacheable; one stating nothing but a command runs on every
 *   invocation.
 * @param named - The name to invoke the task by.
 * @param does - The command, or the record declaring that command with its
 *   inputs and outputs.
 */
export function task(named: string, does: Doing): Preset {
  return preset({
    config: { run: { tasks: { [named]: does } } },
    name: `run.task(${named})`,
  });
}
