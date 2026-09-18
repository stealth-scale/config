/**
 * Writes the axes that give a box its shape, so a theme that restates the ratios or the corners
 * moves every box drawn in them.
 *
 * @remarks
 *   Each helper offers every shape the theme states where a recipe names none, so a component
 *   adds nothing of its own to the vocabulary and a theme that states a ratio reaches every
 *   component through it.
 */

import type { SystemStyleObject } from "#generated/types/system.d.mts";
import { recordOf } from "#record.ts";
import { type Corner, CORNERS, type Ratio, RATIOS } from "#scales/geometry.ts";

/**
 * Writes the `ratio` axis of a box, each value one of the theme's aspect ratios.
 */
export function ratioVariants(): Record<Ratio, SystemStyleObject>;

/**
 * Writes the `ratio` axis for the shapes a recipe names.
 *
 * @typeParam Offered - The shapes the recipe offers.
 */
export function ratioVariants<const Offered extends Ratio>(
  ratios: readonly Offered[],
): Record<Offered, SystemStyleObject>;

/**
 * Writes one entry per shape, each reading the aspect ratio of that name.
 */
export function ratioVariants(
  ratios: readonly Ratio[] = RATIOS,
): Record<string, SystemStyleObject> {
  return recordOf(ratios, (ratio) => ({ aspectRatio: ratio }));
}

/**
 * Writes the `radius` axis of a box, each value one of the theme's corners.
 */
export function cornerVariants(): Record<Corner, SystemStyleObject>;

/**
 * Writes the `radius` axis for the corners a recipe names.
 *
 * @typeParam Offered - The corners the recipe offers.
 */
export function cornerVariants<const Offered extends Corner>(
  corners: readonly Offered[],
): Record<Offered, SystemStyleObject>;

/**
 * Writes one entry per corner, each reading the radius of that name.
 */
export function cornerVariants(
  corners: readonly Corner[] = CORNERS,
): Record<string, SystemStyleObject> {
  return recordOf(corners, (corner) => ({ borderRadius: corner }));
}
