/**
 * States Forge: a warm, quick product for an operations console. Cream surfaces and an amber
 * brand, cast flatter than the foundation, with every button's label and every card's header set
 * in capitals. Each recipe it extends is named by its key alone, the card under `slotRecipes`
 * because it draws several parts.
 *
 * @packageDocumentation
 */

import { defineTheme, type Theme } from "@stealthscale/theme/authoring";

import { extension as button } from "#recipes/button.ts";
import { extension as card } from "#recipes/card.ts";
import { semanticTokens } from "#semantic-tokens.ts";
import { tokens } from "#tokens.ts";

/**
 * Draws a warm amber product on cream, cast flat, with capital labels on its buttons and capital
 * headers on its cards.
 */
export const forge: Theme = defineTheme({
  name: "forge",
  recipes: { button },
  semanticTokens,
  slotRecipes: { card },
  tokens,
});
