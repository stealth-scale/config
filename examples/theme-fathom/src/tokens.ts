/**
 * Draws the values that do not change with the color mode: the two ramps the theme redraws.
 *
 * @remarks
 *   The grey is tinted a little bluer than the product, so a grey beside the teal reads as
 *   neutral rather than as a washed-out teal. Every other ramp is the foundation's.
 */

import { colorScale, type Tokens } from "@stealthscale/theme/authoring";

/**
 * Fixes the hue the product is drawn in: a deep marine teal.
 */
export const PRODUCT = 185;

/**
 * Fixes the hue the greys are tinted with and the shadows are cast in.
 */
export const NEUTRAL = 200;

/**
 * Lists the ramps the theme redraws, keyed as the foundation keys them.
 */
export const tokens: Tokens = {
  colors: { gray: colorScale(NEUTRAL, 0.012), teal: colorScale(PRODUCT, 0.12) },
};
