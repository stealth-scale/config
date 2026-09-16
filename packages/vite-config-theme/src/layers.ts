/**
 * Gives a component package and a theme package the add-on call every package offers,
 * contributing no layer.
 */

import { type Layer } from "@stealthscale/vite-config-core";

/**
 * Contributes no layer to a package that publishes a preset or a theme.
 *
 * @remarks
 *   A component package writes its preset and a theme package writes its theme by hand, and the
 *   theme testing kit reports a recipe or an extension file the hand-written list leaves out. The
 *   call exists so every package lists every add-on the same way.
 */
export function layers(): readonly Layer[] {
  return [];
}
