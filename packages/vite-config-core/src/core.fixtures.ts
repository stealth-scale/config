/**
 * Reading a defined config back, which every preset's specification has to do.
 */

import { type ConfigEnv, type UserConfig } from "vite-plus";

import { type Context } from "#context.ts";

/**
 * The environment a build is read in.
 *
 * Stated as the whole of what a layer is told, so the same value stands in wherever a layer, a
 * refinement or `resolved` is called directly. Where only `ConfigEnv` is wanted, as `readBack`
 * wants, it satisfies that too.
 *
 * The variables are empty rather than the repository's own, so no test turns on what is in a `.env`
 * file or in the surrounding shell.
 */
export const BUILDING: Context = {
  at: "/repository/packages/one",
  command: "build",
  env: {},
  manifest: {},
  mode: "production",
  root: "/repository",
};

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
