/**
 * States the values that do not change with the color mode: the ramps, the faces and the type
 * scale.
 *
 * @remarks
 *   Roboto is taken from the package that ships it, and a system stack follows it. The code face is
 *   a system monospace stack.
 */

import { fontSizes, type Tokens } from "@stealthscale/theme/authoring";

import { ramps } from "#quartz/ramps.ts";

/**
 * Fixes the body size in rem: body text is set at 14 pixels.
 */
export const BODY = 0.875;

/**
 * Fixes the ratio the type scale climbs by.
 */
export const RATIO = 1.187;

/**
 * Lists the tokens: the ramps, the three faces and the type scale.
 */
export const tokens: Tokens = {
  colors: ramps,
  fonts: {
    body: {
      value:
        '"Roboto Variable", -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", sans-serif',
    },
    heading: {
      value:
        '"Roboto Variable", -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", sans-serif',
    },
    mono: { value: 'Consolas, "Courier New", Courier, monospace' },
  },
  fontSizes: fontSizes(BODY, RATIO),
};
