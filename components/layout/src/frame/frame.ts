/**
 * Draws a frame through its recipe.
 *
 * @remarks
 *   The element is `div` and what it holds is the caller's picture, video or map. A frame that is
 *   a figure on the page changes the element with `as="figure"`. The frame names nothing itself,
 *   so the alternative text stays with the picture inside it, where a screen reader reads it.
 */

import { type ComponentProps } from "react";

import { withContext } from "#frame/context.ts";

/**
 * Draws a box of one shape, clipped to its corners, round the picture it is given.
 */
export const Frame = withContext("div");

/**
 * Describes what a frame takes: the variants its recipe offers, and everything a styled div
 * element takes.
 */
export type FrameProps = ComponentProps<typeof Frame>;
