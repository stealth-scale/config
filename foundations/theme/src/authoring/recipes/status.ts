/**
 * Writes the `status` axis of a recipe, which sets the palette and nothing else.
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
