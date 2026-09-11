/**
 * Configuring a package that publishes and runs on node.
 */

import { configuring, type Defining, type Extendable } from "@stealthscale/vite-config-core";

import * as lint from "#lint/index.ts";
import * as pack from "#pack/index.ts";
import { house } from "#preset/house.ts";
import * as test from "#test/index.ts";

/**
 * The layers a package the console runs is built on.
 *
 * A package that publishes, which is what the `pack` layers are for. A command-line tool is one of
 * these: it is installed from a registry like any other package, and names the command it installs
 * with `pack.command`.
 *
 * Answered as a list as well as bound below, so that a config package for a framework composes
 * these with its own rather than sitting beside them. Sitting beside them is what lets a repository
 * pair the wrong tier with the right framework and lose half its rules without being told.
 *
 * @returns Each layer the tier is built on, in the order they compose.
 */
export function layers(): readonly Extendable[] {
  return [...house(), lint.preset.node(), pack.preset.node(), test.preset.node()];
}

/**
 * Composes a config for a package the console runs.
 */
export const defineConfig: Defining = configuring(layers);
