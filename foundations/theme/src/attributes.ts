/**
 * Fixes the two attributes a page is switched with, on the document root or on any element for a
 * subtree.
 *
 * @remarks
 *   The runtime publishes both for a provider to write, and the conditions and the global styles
 *   select on the color mode. One module defines each name, so a page and the stylesheet cannot
 *   disagree on it.
 */

/**
 * Fixes the attribute a page writes its theme in.
 *
 * @remarks
 *   The compiler emits every theme under an attribute of its own naming, and the build plugin
 *   rewrites it to this one, so nothing a page sees names the compiler.
 */
export const THEME_ATTRIBUTE = "data-theme";

/**
 * Fixes the attribute a page writes its color mode in.
 *
 * @remarks
 *   An attribute rather than a class, so the mode is written the same way as the theme and can be
 *   set on the document root or on any element for a subtree.
 */
export const COLOR_MODE_ATTRIBUTE = "data-color-mode";
