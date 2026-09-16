/**
 * Gives a workspace root the add-on call every package offers, contributing no layer.
 */

import { type Layer } from "@stealthscale/vite-config-core";

/**
 * Contributes no layer to a workspace root.
 *
 * @remarks
 *   The runtime is generated and the stylesheet is compiled while a package builds, and a root
 *   builds no package. The call exists so a root config lists every add-on the same way.
 */
export function workspace(): readonly Layer[] {
  return [];
}
