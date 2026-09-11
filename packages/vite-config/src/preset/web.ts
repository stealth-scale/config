/**
 * Configuring a package that publishes and runs in a browser.
 */

import { configuring, type Defining, type Extendable } from "@stealthscale/config-core";

import * as lint from "#lint/index.ts";
import * as pack from "#pack/index.ts";
import { house } from "#preset/house.ts";
import * as test from "#test/index.ts";

/**
 * The layers a library the browser runs is built on.
 *
 * A library rather than an application: it is packed and installed by something else, which is what
 * the `pack` layers are for and why nothing here decides anything about a page. An application
 * reads `preset/app` instead.
 *
 * Answered as a list as well as bound below, so that a config package for a framework composes
 * these with its own rather than sitting beside them. Sitting beside them is what lets a repository
 * pair the wrong tier with the right framework and lose half its rules without being told.
 *
 * @returns Each layer the tier is built on, in the order they compose.
 */
export function layers(): readonly Extendable[] {
  return [...house(), lint.preset.web(), pack.preset.web(), test.preset.web()];
}

/**
 * Composes a config for a library the browser runs.
 */
export const defineConfig: Defining = configuring(layers);
