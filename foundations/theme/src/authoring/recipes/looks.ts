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
 * @typeParam Offered - The looks the recipe offers, which is every one unless it names them.
 */
export function lookVariants(): Record<Look, SystemStyleObject>;

/**
 * Writes the `variant` axis for the looks a recipe names.
 *
 * @typeParam Offered - The looks the recipe offers.
 */
export function lookVariants<const Offered extends Look>(
  looks: readonly Offered[],
): Record<Offered, SystemStyleObject>;

/**
 * Writes one entry per look, each reading the layer style that draws it.
 */
export function lookVariants(looks: readonly Look[] = LOOKS): Record<string, SystemStyleObject> {
  return recordOf(looks, (look) => ({ layerStyle: LAYER_STYLES[look] }));
}

/**
 * Selects one of the looks a thing that is read rather than pressed can be drawn in.
 */
export type Flat = "outline" | "plain" | "solid" | "subtle" | "surface";

/**
 * Lists every flat look, in the order a documentation page shows them.
 *
 * @remarks
 *   Ghost is not among them. A ghost control is a transparent box that fills in under a pointer,
 *   and a look that never repaints leaves it identical to plain.
 */
export const FLATS: readonly Flat[] = ["solid", "subtle", "surface", "outline", "plain"];

/**
 * Writes the `variant` axis of a thing that holds still, each look one layer style.
 *
 * @remarks
 *   A badge, a tag or a chip reads as part of what it labels. Drawn in a fill it would repaint
 *   under a pointer, which reads as something to press, so it reads a flat look instead.
 * @typeParam Offered - The looks the recipe offers, which is every one unless it names them.
 */
export function flatVariants(): Record<Flat, SystemStyleObject>;

/**
 * Writes the `variant` axis for the flat looks a recipe names.
 *
 * @typeParam Offered - The looks the recipe offers.
 */
export function flatVariants<const Offered extends Flat>(
  looks: readonly Offered[],
): Record<Offered, SystemStyleObject>;

/**
 * Writes one entry per look, each reading the flat layer style of its name.
 */
export function flatVariants(looks: readonly Flat[] = FLATS): Record<string, SystemStyleObject> {
  return recordOf(looks, (look) => ({ layerStyle: `flat.${look}` }));
}
