/**
 * Evaluates a layer for a test that has no Vite running around it.
 */

import { type UserConfig } from "vite";

import { type Context, type Preset } from "@stealthscale/vite-config-core";

/**
 * Describes a package inside a repository, with every field open to being
 * restated.
 *
 * @remarks
 *   The two paths put the package two directories below the root, which is the
 *   shape a layer reading a workspace has to cope with. A test needing one
 *   field different states that field and inherits the rest.
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
 * Reads what a layer contributes, whether it holds a plain object or a function
 * of the context.
 *
 * @remarks
 *   The two forms are indistinguishable from the type alone, and a test that
 *   guessed wrong would assert against a function instead of a configuration.
 *   Both come back the same way here, so an assertion is written once whichever
 *   form the layer chose.
 * @param layer - The layer to read.
 * @param stated - The context fields to restate before reading it.
 */
export function answered(
  layer: Preset,
  stated: Partial<Context> = {},
): Promise<UserConfig> | UserConfig {
  const held = layer.config;

  return typeof held === "function" ? held(told(stated)) : held;
}
