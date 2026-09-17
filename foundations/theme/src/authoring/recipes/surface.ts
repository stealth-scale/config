/**
 * Writes the base of a panel, how far a control is lifted off the page, and a hairline between
 * things.
 */

import type { SystemStyleObject } from "#generated/types/system.d.mts";
import { recordOf } from "#record.ts";

/**
 * Selects how far a panel is lifted from the page, as a step of the shadow scale.
 */
export type Elevation = "2xl" | "lg" | "md" | "sm" | "xl" | "xs";

/**
 * Writes the base of a panel: the panel surface, an edge, the middle corner, and a shadow at the
 * elevation given.
 *
 * @param elevation - How far the panel is lifted. A little unless the caller says otherwise.
 */
export function surface(elevation: Elevation = "sm"): SystemStyleObject {
  return {
    background: "bg.panel",
    borderColor: "border",
    borderRadius: "l2",
    borderWidth: "sm",
    boxShadow: elevation,
    color: "fg",
  };
}

/**
 * Writes a hairline in the border ink along one axis.
 *
 * @param orientation - Which way the line runs. Across the page unless the caller says otherwise.
 */
/**
 * Selects how far off the page a thing is lifted.
 */
export type Lift = "floating" | "raised";

/**
 * Maps each lift to the shadow it rests at, the one it lifts to under a pointer, and the one it
 * drops to under a press.
 */
const LIFTS: Readonly<Record<Lift, readonly [rest: string, hovered: string, pressed: string]>> = {
  floating: ["lg", "xl", "sm"],
  raised: ["sm", "md", "none"],
};

/**
 * Lists the lifts in the order they rise.
 */
export const LIFTED: readonly Lift[] = ["raised", "floating"];

/**
 * Writes the `elevation` axis of a control, which lifts under a pointer and drops towards the
 * page under a press.
 *
 * @remarks
 *   The lift is named rather than keyed by a step of the shadow scale, because a class carries
 *   the value alone and a control offering both a size and an elevation on the same steps would
 *   write one class for two axes.
 */
export function liftVariants(): Record<Lift, SystemStyleObject>;

/**
 * Writes the `elevation` axis for the lifts a recipe names.
 *
 * @typeParam Offered - The lifts the recipe offers.
 */
export function liftVariants<const Offered extends Lift>(
  lifts: readonly Offered[],
): Record<Offered, SystemStyleObject>;

/**
 * Writes one entry per lift, each with the shadow it rests, hovers and presses at.
 */
export function liftVariants(lifts: readonly Lift[] = LIFTED): Record<string, SystemStyleObject> {
  return recordOf(lifts, (lift) => {
    const [rest, hovered, pressed] = LIFTS[lift];

    return { _active: { boxShadow: pressed }, _hover: { boxShadow: hovered }, boxShadow: rest };
  });
}

/**
 * Writes a hairline between things, along the page or down a row.
 *
 * @param orientation - Which way the line runs. Across unless the caller says otherwise.
 */
export function divider(orientation: "horizontal" | "vertical" = "horizontal"): SystemStyleObject {
  return orientation === "horizontal"
    ? { borderBlockEndWidth: "sm", borderColor: "border", inlineSize: "100%" }
    : { alignSelf: "stretch", borderColor: "border", borderInlineEndWidth: "sm" };
}
