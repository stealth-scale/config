/**
 * Writes the `variant` axis of a recipe from the looks it offers, each a layer style the theme
 * owns.
 *
 * @remarks
 *   A recipe that offers six looks would otherwise write six fills, six inks and six hovers by
 *   hand. Each look here is one layer style, so a theme that changes how a solid control is drawn
 *   changes it for every recipe that offers the look.
 */

import type { SystemStyleObject } from "#generated/types/system.d.mts";
import { recordOf } from "#record.ts";

/**
 * Selects one of the looks a control can be drawn in.
 */
export type Look = "ghost" | "outline" | "plain" | "solid" | "subtle" | "surface";

/**
 * Lists every look a control can be drawn in, in the order a documentation page shows them.
 */
export const LOOKS: readonly Look[] = ["solid", "subtle", "surface", "outline", "ghost", "plain"];

/**
 * Maps each look to the layer style that draws it.
 */
const LAYER_STYLES: Readonly<Record<Look, string>> = {
  ghost: "fill.ghost",
  outline: "outline.solid",
  plain: "fill.plain",
  solid: "fill.solid",
  subtle: "fill.subtle",
  surface: "fill.surface",
};

/**
 * Writes the `variant` axis for the looks given, each reading its layer style.
 *
 * @typeParam Offered - The looks the recipe offers.
 */
export function lookVariants<const Offered extends Look>(
  looks: readonly Offered[],
): Record<Offered, SystemStyleObject> {
  return recordOf(looks, (look) => ({ layerStyle: LAYER_STYLES[look] }));
}
