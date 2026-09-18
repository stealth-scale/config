/**
 * States the values that do not change with the color mode: the ramps, the faces and the type
 * scale.
 *
 * @remarks
 *   Mona Sans is taken from the package that ships it, and a system stack follows it. The code face
 *   is a system monospace stack.
 */

import { fontSizes, type Tokens } from "@stealthscale/theme/authoring";

import { ramps } from "#graphite/ramps.ts";

/**
 * Fixes the body size in rem: body text is set at 14 pixels.
 */
export const BODY = 0.875;

/**
 * Fixes the ratio the type scale climbs by.
 */
export const RATIO = 1.2;

/**
 * Lists the tokens: the ramps, the three faces and the type scale.
 */
export const tokens: Tokens = {
  colors: ramps,
  fonts: {
    body: {
      value:
        '"Mona Sans Variable", -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
    },
    heading: {
      value:
        '"Mona Sans Variable", -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
    },
    mono: {
      value: "ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace",
    },
  },
  fontSizes: fontSizes(BODY, RATIO),
};
