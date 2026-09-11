/**
 * How a stealth package is tested.
 */

import { type Layer } from "@stealthscale/vite-config-core";

import { assertion } from "#test/assertion.ts";
import { coverage } from "#test/coverage.ts";
import { environment } from "#test/environment.ts";
import { files } from "#test/files.ts";
import { isolation } from "#test/isolation.ts";
import { order } from "#test/order.ts";

/**
 * What every package's tests are run under, wherever the package runs.
 *
 * @returns The layers.
 */
export function base(): readonly Layer[] {
  return [files(), isolation(), assertion(), order(), coverage()];
}

/**
 * What a package the console runs is tested under.
 *
 * @returns The layers, with the runner's own environment.
 */
export function node(): readonly Layer[] {
  return [...base(), environment("node")];
}

/**
 * What a package the browser runs is tested under.
 *
 * A document rather than node's globals, so a component can be rendered and read back. `happy-dom`
 * over `jsdom` because it implements less and runs faster, and what it leaves out is the part a
 * component test rarely reaches.
 *
 * @returns The layers, with a document.
 */
export function web(): readonly Layer[] {
  return [...base(), environment("happy-dom")];
}
