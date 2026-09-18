/**
 * Collects the layers a package that holds specimens extends its tier with.
 */

import { type Layer } from "@stealthscale/vite-config-core";

import { uncounted } from "#uncounted.ts";

/**
 * Returns the layers a package holding specimens extends its tier with.
 *
 * @remarks
 *   A list rather than a tier, because a component package picks whichever tier its framework
 *   calls for and adds these. A package that keeps its specimens somewhere other than beside its
 *   source calls `uncounted()` with its own globs instead. The lint departures are not among these
 *   layers: the linter runs from the workspace root, so a root config states them through
 *   `workspace()`.
 */
export function layers(): readonly Layer[] {
  return [...uncounted()];
}
