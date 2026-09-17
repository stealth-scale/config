/**
 * Holds the context and the invocation every test in this package shares.
 *
 * @remarks
 *   The directories are made up rather than created, because nothing the tests
 *   using them reads the file system.
 */

import { type ConfigEnv, type UserConfig } from "vite";

import { type Context } from "#context.ts";

/**
 * A context standing for a production build of one package inside a workspace.
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
 * Invokes what `defineConfig` exported and returns the config it settles on.
 *
 * @remarks
 *   Vite's type for an exported config covers an object as well as a function,
 *   and only the function form is ever produced here. The assertion is the
 *   price of not making every test narrow it.
 * @param held - The value the config module exported.
 * @param env - The command and mode to invoke it for.
 */
export function readBack(held: unknown, env: ConfigEnv = BUILDING): Promise<UserConfig> {
  return (held as (given: ConfigEnv) => Promise<UserConfig>)(env);
}
