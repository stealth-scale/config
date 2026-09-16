/**
 * Writes the base of a panel, and a hairline between things.
 */

import type { SystemStyleObject } from "#generated/types/system.d.mts";

/**
 * Selects how far a panel is lifted from the page, as a step of the shadow scale.
 */
export type Level = "2xl" | "lg" | "md" | "sm" | "xl" | "xs";

/**
 * Writes the base of a panel: the panel surface, an edge, the middle corner, and a shadow at the
 * level given.
 *
 * @param level - How far the panel is lifted. A little unless the caller says otherwise.
 */
export function surface(level: Level = "sm"): SystemStyleObject {
  return {
    background: "bg.panel",
    borderColor: "border",
    borderRadius: "l2",
    borderWidth: "sm",
    boxShadow: level,
    color: "fg",
  };
}

/**
 * Writes a hairline in the border ink along one axis.
 *
 * @param orientation - Which way the line runs. Across the page unless the caller says otherwise.
 */
export function divider(orientation: "horizontal" | "vertical" = "horizontal"): SystemStyleObject {
  return orientation === "horizontal"
    ? { borderBlockEndWidth: "sm", borderColor: "border", inlineSize: "100%" }
    : { alignSelf: "stretch", borderColor: "border", borderInlineEndWidth: "sm" };
}
