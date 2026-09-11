/**
 * Reading a defined config back, which every preset's specification has to do.
 */

import { type ConfigEnv, type UserConfig } from "vite-plus";

/**
 * The environment a build is read in.
 */
export const BUILDING: ConfigEnv = { command: "build", mode: "production" };

/**
 * Reads a defined config back, the way Vite+ does.
 *
 * A config composed of layers is always answered as a function of the environment, so calling it is
 * what a specification has to do to see the result.
 *
 * @param held - What `defineConfig` answered.
 * @param env - The environment to read it in.
 * @returns The composed config.
 */
export function readBack(held: unknown, env: ConfigEnv = BUILDING): Promise<UserConfig> {
  return (held as (given: ConfigEnv) => Promise<UserConfig>)(env);
}
