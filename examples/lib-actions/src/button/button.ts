/**
 * Draws a button through its recipe.
 *
 * @remarks
 *   The binding stamps the recipe's name on the element and writes the class of each variant a
 *   caller picks. The component adds no color, no size and no margin. All of that is the recipe's,
 *   so a theme moves every button by extending it.
 */

import { type ComponentProps } from "react";

import { createRecipeContext } from "@stealthscale/theme";

import { recipe } from "#button/button.recipe.ts";

/**
 * Binds the recipe to the elements that draw it.
 */
const { withContext } = createRecipeContext(recipe);

/**
 * Draws a button in a look, a size and the palette of its status.
 */
export const Button = withContext("button");

/**
 * Describes what a button takes: the variants its recipe offers, and everything a styled button
 * element takes.
 */
export type ButtonProps = ComponentProps<typeof Button>;
