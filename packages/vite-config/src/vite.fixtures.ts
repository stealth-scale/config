/**
 * Standing in for what a layer is handed, and reading back what it states.
 */

import { type UserConfig } from "vite-plus";

import { type Context, type Preset } from "@stealthscale/vite-config-core";

/**
 * States what a layer is told, with whatever a test wants to differ.
 *
 * Stated rather than read, so no test turns on a `.env` file, on the shell it was started from, or
 * on a manifest written to a temporary directory. Two tests wanting different answers can then run
 * in either order.
 *
 * @param stated - Whatever differs from an ordinary package being served.
 * @returns The context to hand a layer.
 */
export function told(stated: Partial<Context> = {}): Context {
  return {
    at: "/repository/packages/one",
    command: "serve",
    env: {},
    manifest: {},
    mode: "development",
    root: "/repository",
    ...stated,
  };
}

/**
 * Reads back the config a preset states, given what it is told.
 *
 * @param layer - The preset to read.
 * @param stated - Whatever differs from an ordinary package being served.
 * @returns The config it states.
 */
export function answered(
  layer: Preset,
  stated: Partial<Context> = {},
): Promise<UserConfig> | UserConfig {
  const held = layer.config;

  return typeof held === "function" ? held(told(stated)) : held;
}
