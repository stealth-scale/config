/**
 * Draws a stack through its recipe.
 *
 * @remarks
 *   The element is `div`, because a stack arranges what is already there and says nothing about
 *   what it holds. A caller who is stacking a list of things changes the element with `as`, so a
 *   screen reader counts them. The component adds no surface, no ink and no border of its own.
 */

import { type ComponentProps } from "react";

import { withContext } from "#stack/context.ts";

/**
 * Lays its children out along one direction, a gap apart.
 */
export const Stack = withContext("div");

/**
 * Describes what a stack takes: the variants its recipe offers, and everything a styled div
 * element takes.
 */
export type StackProps = ComponentProps<typeof Stack>;
