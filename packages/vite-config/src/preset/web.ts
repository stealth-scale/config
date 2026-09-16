/**
 * Configures a published package that runs in a browser.
 */

import { configuring, type Defining, type Extendable } from "@stealthscale/vite-config-core";

import * as lint from "#lint/index.ts";
import * as pack from "#pack/index.ts";
import { house } from "#preset/house.ts";
import * as test from "#test/index.ts";

/**
 * Lists the layers a browser library is linted, packed and tested with.
 *
 * @remarks
 *   The browser's globals are in scope, node's are withheld, and a test runs
 *   against a DOM rather than a bare runtime. A package needing both sets of
 *   globals is two packages.
 */
export function layers(): readonly Extendable[] {
  return [...house(), lint.preset.web(), pack.preset.web(), test.preset.web()];
}

/**
 * Composes the Vite configuration of a package published for a browser.
 *
 * @remarks
 *   The output is packed rather than built, so a consumer receives modules to
 *   bundle alongside its own code instead of a bundle it has to load whole.
 */
export const defineConfig: Defining = configuring(layers);
