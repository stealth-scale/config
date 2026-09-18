/**
 * Draws a skeleton through its recipe.
 *
 * @remarks
 *   The element is `div` and carries no role. A stand-in is not a thing a screen reader should
 *   announce, and a reader who is told a region is busy learns more from the region than from each
 *   box inside it. A page states `aria-busy` on whatever is waiting, which is one announcement
 *   rather than one per bar.
 */

import { type ComponentProps } from "react";

import { withContext } from "#skeleton/context.ts";

/**
 * Stands in for content that has not arrived, taking the box of whatever it wraps.
 */
export const Skeleton = withContext("div");

/**
 * Describes what a skeleton takes: the variants its recipe offers, and everything a styled div
 * takes.
 */
export type SkeletonProps = ComponentProps<typeof Skeleton>;
