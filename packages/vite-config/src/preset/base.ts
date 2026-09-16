/**
 * Configures a published package that commits to no runtime.
 */

import { configuring, type Defining, type Extendable } from "@stealthscale/vite-config-core";

import * as lint from "#lint/index.ts";
import * as pack from "#pack/index.ts";
import { house } from "#preset/house.ts";
import * as test from "#test/index.ts";

/**
 * Lists the layers a runtime-agnostic package is linted, packed and tested
 * with.
 *
 * @remarks
 *   No globals are declared, so neither a node built-in nor a browser API is in
 *   scope without an import. A package that reaches for either compiles here
 *   and fails in whatever consumes it, which is the reason to move it to the
 *   node or web tier rather than to widen this one.
 */
export function layers(): readonly Extendable[] {
  return [...house(), lint.preset.base(), pack.preset.base(), test.preset.base()];
}

/**
 * Composes the Vite configuration of a package that names no runtime.
 *
 * @remarks
 *   A repository's own keys are merged over the layers, so departing from a
 *   house decision means writing the key rather than removing the layer that
 *   set it.
 */
export const defineConfig: Defining = configuring(layers);
