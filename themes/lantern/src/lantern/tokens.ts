/**
 * States the values that do not change with the color mode: the ramps, the faces and the type
 * scale.
 *
 * @remarks
 *   Both faces are system stacks, so the theme depends on no font package.
 */

import { fontSizes, type Tokens } from "@stealthscale/theme/authoring";

import { ramps } from "#lantern/ramps.ts";

/**
 * Fixes the body size in rem: body text is set at 14 pixels.
 */
export const BODY = 0.875;

/**
 * Fixes the ratio the type scale climbs by.
 */
export const RATIO = 1.21;

/**
 * Lists the tokens: the ramps, the three faces and the type scale.
 */
export const tokens: Tokens = {
  colors: ramps,
  fonts: {
    body: {
      value:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
    },
    heading: {
      value:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
    },
    mono: { value: "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace" },
  },
  fontSizes: fontSizes(BODY, RATIO),
};
