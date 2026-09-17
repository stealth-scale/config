/**
 * Draws a container through its recipe.
 *
 * @remarks
 *   The element is `div`, because a container states a measure and says nothing about what it
 *   holds. A page whose container is its main region changes the element with `as="main"`, which
 *   is what a screen reader skips to.
 */

import { type ComponentProps } from "react";

import { withContext } from "#container/context.ts";

/**
 * Draws a page at one measure, centred in whatever holds it, with a gutter down each side.
 */
export const Container = withContext("div");

/**
 * Describes what a container takes: the variants its recipe offers, and everything a styled div
 * element takes.
 */
export type ContainerProps = ComponentProps<typeof Container>;
