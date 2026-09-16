/**
 * The tiers a package extends instead of naming every layer itself.
 */

import { type Layer } from "@stealthscale/vite-config-core";

import { assertion } from "#test/assertion.ts";
import { coverage } from "#test/coverage.ts";
import { environment } from "#test/environment.ts";
import { files } from "#test/files.ts";
import { isolation } from "#test/isolation.ts";
import { order } from "#test/order.ts";

/**
 * Lists the layers every package gets, whatever it runs on.
 *
 * @remarks
 *   No environment is named, so a package extending this alone runs in whatever
 *   the runner falls back to. The other two tiers each add one.
 */
export function base(): readonly Layer[] {
  return [files(), isolation(), assertion(), order(), coverage()];
}

/**
 * Lists the layers a package that runs on the console gets.
 *
 * @remarks
 *   The tests run in the runner's own process, so a test reaches the file
 *   system and the network with no document standing between it and them.
 */
export function node(): readonly Layer[] {
  return [...base(), environment("node")];
}

/**
 * Lists the layers a package that renders into a document gets.
 *
 * @remarks
 *   The document is happy-dom, which is JavaScript rather than a browser. A
 *   test that depends on layout, on painting, or on how a real engine schedules
 *   work belongs in a browser run instead.
 */
export function web(): readonly Layer[] {
  return [...base(), environment("happy-dom")];
}
