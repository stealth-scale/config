/**
 * States what stressed words are: a run set apart from the line around it by its face alone.
 *
 * @remarks
 *   The style is stated rather than left to the browser's own default for the element, so a theme
 *   has something to extend and a face that ships no italic can be told what to do instead. There
 *   is no axis. Stress is one thing a writer either means or does not, and a caller picking how
 *   loud it is would be picking for the reader.
 */

import { defineRecipe } from "@stealthscale/theme/authoring";

/**
 * Draws stressed words in the italic of whatever face the line is set in.
 */
export const recipe = defineRecipe({
  base: { fontStyle: "italic" },
  className: "em",
  jsx: [/Em$/u],
});
