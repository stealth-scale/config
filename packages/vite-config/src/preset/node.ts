/**
 * Configures a published package that runs on node.
 */

import { configuring, type Defining, type Extendable } from "@stealthscale/vite-config-core";

import * as lint from "#lint/index.ts";
import * as pack from "#pack/index.ts";
import { house } from "#preset/house.ts";
import * as test from "#test/index.ts";

/**
 * Lists the layers a node package is linted, packed and tested with.
 *
 * @remarks
 *   Node's globals are in scope and the browser's are withheld, so a stray
 *   reference to `document` is a lint error here rather than a runtime failure
 *   in whoever installs the package.
 */
export function layers(): readonly Extendable[] {
  return [...house(), lint.preset.node(), pack.preset.node(), test.preset.node()];
}

/**
 * Composes the Vite configuration of a package published for node.
 *
 * @remarks
 *   The configuration packages themselves are defined with this tier, so a
 *   change to it is felt on the next check of this repository before it reaches
 *   anybody else's.
 */
export const defineConfig: Defining = configuring(layers);
