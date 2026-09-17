/**
 * Draws a badge through its recipe.
 *
 * @remarks
 *   A component written in the application, bound the way a component package binds its own. The
 *   binding stamps the recipe's name on the element and writes the class of the look a caller
 *   picks. Color and size are the recipe's, so a theme moves every badge by extending it.
 */

import { type ComponentProps } from "react";

import { createRecipeContext } from "@stealthscale/theme";

import { recipe } from "#badge/badge.recipe.ts";

/**
 * Binds the recipe to the elements that draw it.
 */
const { withContext } = createRecipeContext(recipe);

/**
 * Draws a badge in a look.
 */
export const Badge = withContext("span");

/**
 * Describes what a badge takes: the look its recipe offers, and everything a styled span takes.
 */
export type BadgeProps = ComponentProps<typeof Badge>;
