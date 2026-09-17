/**
 * Extends the badge for deep water: every label set in capitals.
 *
 * @remarks
 *   The badge is a recipe the application registers through its statement rather than one a
 *   package publishes. The extension names the recipe by its key alone, as it would for a
 *   package's recipe, and compiles under Abyss's attribute wherever that recipe is installed.
 */

import { type RecipeExtension } from "@stealthscale/theme/authoring";

/**
 * Sets every badge's label in capitals.
 */
export const extension: RecipeExtension = {
  base: { textTransform: "uppercase" },
};
