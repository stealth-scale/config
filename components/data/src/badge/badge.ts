/**
 * Draws a badge through its recipe.
 *
 * @remarks
 *   The element is `span`, which carries no role and says nothing to a screen reader beyond its
 *   own text. A badge whose meaning is in its colour needs that meaning in words as well: a red
 *   badge reading `3` tells a sighted reader that three things failed and tells a screen reader
 *   `3`. Where the count matters as it changes, a caller states `role="status"`, which a screen
 *   reader reads out as it updates. The component adds no ink, no size and no corner. All of that
 *   is the recipe's, so a theme moves every badge by extending it.
 */

import { type ComponentProps } from "react";

import { withContext } from "#badge/context.ts";

/**
 * Labels something in a word or a count, in a look, a size, a corner and a status.
 */
export const Badge = withContext("span");

/**
 * Describes what a badge takes: the variants its recipe offers, and everything a styled span
 * takes.
 */
export type BadgeProps = ComponentProps<typeof Badge>;
