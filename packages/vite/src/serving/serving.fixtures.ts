/**
 * Reading back what a server layer states, which depends on what the machine around it says.
 */

import { type UserConfig } from "vite-plus";

import { type Context, type Preset } from "@stealthscale/config-core";

/**
 * States what a layer is told, with the variables a test wants and nothing else.
 *
 * Stated rather than read, so no test turns on what is in a `.env` file or in the shell the tests
 * were started from, and so two tests wanting different variables can run in either order.
 *
 * @param env - The variables the machine holds.
 * @returns The context to hand a layer.
 */
export function told(env: Record<string, string> = {}): Context {
  return {
    at: "/repository/packages/one",
    command: "serve",
    env,
    manifest: {},
    mode: "development",
    root: "/repository",
  };
}

/**
 * Reads back the config a preset states in a machine holding the given variables.
 *
 * @param layer - The preset to read.
 * @param env - The variables the machine holds.
 * @returns The config it states.
 */
export function answered(
  layer: Preset,
  env: Record<string, string> = {},
): Promise<UserConfig> | UserConfig {
  const held = layer.config;

  return typeof held === "function" ? held(told(env)) : held;
}
