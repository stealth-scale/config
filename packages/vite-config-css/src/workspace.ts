/**
 * What a workspace with stylesheets states once, at its root.
 */

import { type Layer } from "@stealthscale/vite-config-core";

/**
 * The layers a workspace root adds on behalf of the stylesheets below it.
 *
 * None. A stylesheet is checked while the package that imports it is built, and nothing about
 * that is read from the root. The function exists so a root's config has the same shape whichever
 * add-ons it lists.
 *
 * @returns No layers.
 */
export function workspace(): readonly Layer[] {
  return [];
}
