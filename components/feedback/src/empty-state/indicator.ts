/**
 * Draws the mark above the words.
 *
 * @remarks
 *   The box is the icon scale at the panel's own size and whatever is drawn inside fills it, so a
 *   caller hands over a glyph without sizing it. A mark says nothing a screen reader needs, the
 *   title beneath it saying the same thing in words, so a caller hides it with `aria-hidden`.
 */

import { type ComponentProps } from "react";

import { withContext } from "#empty-state/context.ts";

/**
 * Draws the mark at the box its size states.
 */
export const Indicator = withContext("div", "indicator");

/**
 * Describes what the indicator takes.
 */
export type IndicatorProps = ComponentProps<typeof Indicator>;
