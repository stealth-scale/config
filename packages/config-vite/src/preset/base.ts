/**
 * Configuring a package that publishes and says nothing about where it runs.
 */

import { configuring, type Defining, type Extendable } from "@stealthscale/config-core";

import * as lint from "#lint/index.ts";
import * as pack from "#pack/index.ts";
import { house } from "#preset/house.ts";
import * as test from "#test/index.ts";

/**
 * The layers a package that reaches for neither node's globals nor the browser's is built on.
 *
 * A package that publishes, which is what the `pack` layers are for. An application is the other
 * kind and reads `preset/app`: it is built rather than packed, and the two blocks do not overlap.
 *
 * Answered as a list as well as bound below, so that a config package for a framework composes
 * these with its own rather than sitting beside them. Sitting beside them is what lets a repository
 * pair the wrong tier with the right framework and lose half its rules without being told.
 *
 * @returns Each layer the tier is built on, in the order they compose.
 */
export function layers(): readonly Extendable[] {
  return [...house(), lint.preset.base(), pack.preset.base(), test.preset.base()];
}

/**
 * Composes a config for a package that reaches for neither node's globals nor the browser's.
 */
export const defineConfig: Defining = configuring(layers);
