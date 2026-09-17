/**
 * Draws the page itself: the six properties the compiler's reset and focus ring read, and the
 * ink, surface, palette and color scheme of the document.
 *
 * @remarks
 *   The compiler's reset and its focus-ring utility read six custom properties, and this is where
 *   the vocabulary fills them, so a placeholder, a selection and a focus ring are drawn in the
 *   theme's colors. The color scheme follows the attribute where one is written, and the operating
 *   system's preference where none is, the same way the color mode condition does. The page
 *   scrolls smoothly to an anchor, and jumps for a reader who asked for less motion.
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
    "@media (prefers-color-scheme: dark)": {
      [`&:not([${COLOR_MODE_ATTRIBUTE}=light])`]: { colorScheme: "dark" },
    },
    "@media (prefers-reduced-motion: reduce)": { scrollBehavior: "auto" },
    background: "bg",
    color: "fg",
    colorPalette: "neutral",
    colorScheme: "light",
    scrollBehavior: "smooth",
    textSizeAdjust: "100%",
  },
};
