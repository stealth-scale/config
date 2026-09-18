/**
 * Defines the styles a strong element is drawn with.
 *
 * @remarks
 *   The recipe declares `fontWeight` as a step of the foundation's scale. The browser's `bolder`
 *   keyword resolves against the inherited weight and reaches a different step in each context.
 *   The recipe offers no variant axis. A theme changes the weight for every important run by
 *   extending the recipe.
 */

import { defineRecipe } from "@stealthscale/theme/authoring";

/**
 * Applies the semibold step of the weight scale.
 */
export const recipe = defineRecipe({
  base: { fontWeight: "semibold" },
  className: "strong",
  jsx: [/Strong$/u],
});
