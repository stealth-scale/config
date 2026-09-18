/**
 * Writes the `status` axis of a recipe, which sets the palette, and of a form field, which draws
 * its edge beside it.
 *
 * @remarks
 *   An alert with four statuses and six looks is one recipe: the status sets the palette, the
 *   look reads the palette's roles, and no value in the recipe is a color. A theme decides what
 *   hue an error is.
 */

import { type Status, STATUSES } from "#authoring/contract.ts";
import type { SystemStyleObject } from "#generated/types/system.d.mts";
import { recordOf } from "#record.ts";

/**
 * Writes the `status` axis, each status pointing the palette at the semantic palette of its
 * name.
 */
export function statusVariants(): Record<Status, SystemStyleObject> {
  return recordOf(STATUSES, (status) => ({ colorPalette: status }));
}

/**
 * Writes the `status` axis of a form field, each status pointing the palette at the semantic
 * palette of its name and drawing the edge in the line family's member of the same name.
 *
 * @remarks
 *   A field states its edge outright rather than leaving it to the palette. The line family holds
 *   one border per status at the step the contrast gate measured against a panel, and the palette's
 *   own border role sits two steps darker, so a field that read the palette for its edge would be
 *   drawn heavier than the invalid state the same field already has.
 */
export function fieldStatusVariants(): Record<Status, SystemStyleObject> {
  return recordOf(STATUSES, (status) => ({
    borderColor: `border.${status}`,
    colorPalette: status,
  }));
}
