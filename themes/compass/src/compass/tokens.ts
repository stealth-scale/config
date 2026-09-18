/**
 * States the values that do not change with the color mode: the ramps, the faces and the type
 * scale.
 *
 * @remarks
 *   Ubuntu Sans and Ubuntu Sans Mono are taken from the packages that ship them, and a system stack
 *   follows each.
 */

import { fontSizes, type Tokens } from "@stealthscale/theme/authoring";

import { ramps } from "#compass/ramps.ts";

/**
 * Fixes the body size in rem: body text is set at 14 pixels.
 */
export const BODY = 0.875;

/**
 * Fixes the ratio the type scale climbs by.
 */
export const RATIO = 1.185;

/**
 * Lists the tokens: the ramps, the three faces and the type scale.
 */
export const tokens: Tokens = {
  colors: ramps,
  fonts: {
    body: {
      value:
        '"Ubuntu Sans Variable", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", sans-serif',
    },
    heading: {
      value:
        '"Ubuntu Sans Variable", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", sans-serif',
    },
    mono: { value: '"Ubuntu Sans Mono Variable", ui-monospace, Menlo, "Segoe UI Mono", monospace' },
  },
  fontSizes: fontSizes(BODY, RATIO),
};
