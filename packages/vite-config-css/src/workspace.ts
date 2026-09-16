/**
 * Gives a workspace root the add-on call every package offers, contributing no
 * layer.
 */

import { type Layer } from "@stealthscale/vite-config-core";

/**
 * Contributes no layer to a workspace root.
 *
 * @remarks
 *   A stylesheet is checked while the package importing it builds, and a root
 *   builds no package. The call exists so a root config lists every add-on the
 *   same way, and dropping it changes nothing about what gets checked.
 */
export function workspace(): readonly Layer[] {
  return [];
}
