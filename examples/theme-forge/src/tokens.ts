/**
 * Draws the values that do not change with the color mode: the two ramps the theme redraws.
 *
 * @remarks
 *   The greys are tinted warm enough to sit under the amber without going green, and the shadows
 *   are cast in the same hue. Every other ramp is the foundation's.
 */

import { colorScale, type Tokens } from "@stealthscale/theme/authoring";

/**
 * Fixes the hue the product is drawn in: a hot amber.
 */
export const PRODUCT = 45;

/**
 * Fixes the hue the greys are tinted with and the shadows are cast in.
 */
export const NEUTRAL = 70;

/**
 * Lists the ramps the theme redraws, keyed as the foundation keys them.
 */
export const tokens: Tokens = {
  colors: { gray: colorScale(NEUTRAL, 0.014), orange: colorScale(PRODUCT, 0.17) },
};
