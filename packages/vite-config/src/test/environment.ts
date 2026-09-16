/**
 * The globals a test file is handed before it runs.
 */

import { type UserConfig } from "vite";

import { type Preset, preset } from "@stealthscale/vite-config-core";

/**
 * The environments the runner knows how to build.
 */
export type Environment = NonNullable<NonNullable<UserConfig["test"]>["environment"]>;

/**
 * Runs every test file inside the environment it is given.
 *
 * @remarks
 *   The environment goes into the layer's name, so a composed configuration
 *   shows which one a package chose without anybody opening its config file.
 */
export function environment(inside: Environment): Preset {
  return preset({ config: { test: { environment: inside } }, name: `test.environment(${inside})` });
}
