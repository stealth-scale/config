/**
 * Defines what the page itself is before anything is drawn on it.
 *
 * @remarks
 *   The compiler's reset and its focus-ring utility read six custom properties, and this is where
 *   the vocabulary fills them, so a placeholder, a selection and a focus ring are drawn in the
 *   page's own colors. The root carries the page's ink, surface and palette, and `color-scheme`
 *   is what makes a scrollbar, a caret and a native control follow the mode. No recipe can set
 *   any of this, because no recipe owns the page.
 */

import { COLOR_MODE_ATTRIBUTE } from "#attributes.ts";
import { type GlobalStyleObject } from "#pandacss.ts";

/**
 * Lists the global styles.
 */
export const globalCss: GlobalStyleObject = {
  ":root": {
    "--global-color-border": "colors.border",
    "--global-color-focus-ring": "colors.border.focus",
    "--global-color-placeholder": "colors.fg.muted",
    "--global-color-selection": "colors.neutral.emphasized",
    "--global-font-body": "fonts.body",
    "--global-font-mono": "fonts.mono",
  },
  [`[${COLOR_MODE_ATTRIBUTE}=dark]`]: {
    colorScheme: "dark",
  },
  html: {
    background: "bg",
    color: "fg",
    colorPalette: "neutral",
    colorScheme: "light",
    textSizeAdjust: "100%",
  },
};
