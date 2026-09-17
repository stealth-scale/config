/**
 * Draws the page itself: the six properties the compiler's reset and focus ring read, and the
 * ink, surface, palette and color scheme of the document.
 *
 * @remarks
 *   The compiler's reset and its focus-ring utility read six custom properties, and this is where
 *   the vocabulary fills them, so a placeholder, a selection and a focus ring are drawn in the
 *   theme's colors.
 *   A property set on the root computes there and is inherited as its computed value, so an element
 *   switched to another theme or mode below the root declares the six properties, the ink, the
 *   palette and the font again from its own tokens. Without that it kept the root's font and ink
 *   while its tokens said otherwise.
 *   The color scheme follows the attribute where one is written, and the operating system's
 *   preference where none is, the same way the color mode condition does. Either attribute states
 *   it, so a subtree switched to light inside a page drawn dark draws its form controls, its
 *   scrollbars and its selection in light, even though the colors a theme states do not follow it
 *   there.
 *   The page scrolls smoothly to an anchor, and jumps for a reader who asked for less motion.
 */

import { COLOR_MODE_ATTRIBUTE, THEME_ATTRIBUTE } from "#attributes.ts";
import { type GlobalStyleObject } from "#pandacss.ts";

/**
 * Selects the document root and every element that switches a theme or a color mode below it.
 */
export const SWITCHED = `:root, [${THEME_ATTRIBUTE}], [${COLOR_MODE_ATTRIBUTE}]`;

/**
 * Lists the global styles.
 */
export const globalCss: GlobalStyleObject = {
  [`[${COLOR_MODE_ATTRIBUTE}=dark]`]: {
    colorScheme: "dark",
  },
  [`[${COLOR_MODE_ATTRIBUTE}=light]`]: {
    colorScheme: "light",
  },
  html: {
    "@media (prefers-color-scheme: dark)": {
      [`&:not([${COLOR_MODE_ATTRIBUTE}=light])`]: { colorScheme: "dark" },
    },
    "@media (prefers-reduced-motion: reduce)": { scrollBehavior: "auto" },
    background: "bg",
    colorScheme: "light",
    scrollBehavior: "smooth",
    textSizeAdjust: "100%",
  },
  [SWITCHED]: {
    "--global-color-border": "colors.border",
    "--global-color-focus-ring": "colors.border.focus",
    "--global-color-placeholder": "colors.fg.muted",
    "--global-color-selection": "colors.neutral.emphasized",
    "--global-font-body": "fonts.body",
    "--global-font-mono": "fonts.mono",
    color: "fg",
    colorPalette: "neutral",
    fontFamily: "body",
  },
};
