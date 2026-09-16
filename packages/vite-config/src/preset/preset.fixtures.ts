/**
 * Lets a test read back the configuration a tier's defineConfig produced.
 */

import { type ConfigEnv, type UserConfig } from "vite-plus";

/**
 * The command and mode a configuration is evaluated under unless a test names
 * another.
 */
export const BUILDING: ConfigEnv = { command: "build", mode: "production" };

/**
 * Evaluates what a defineConfig call returned and hands back the configuration
 * it produced.
 *
 * @remarks
 *   A tier returns a function rather than an object, because a layer is
 *   entitled to read the command and the mode before deciding anything. A test
 *   asserting on a key has to run that function first, and this is the single
 *   cast that does it.
 * @param held - The value a defineConfig call returned.
 * @param env - The command and mode to evaluate under.
 */
export function readBack(held: unknown, env: ConfigEnv = BUILDING): Promise<UserConfig> {
  return (held as (given: ConfigEnv) => Promise<UserConfig>)(env);
}
