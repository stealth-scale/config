/**
 * Draws the panel every band of a card sits in.
 *
 * @remarks
 *   The element is `article`, which a screen reader announces and lets a reader move between, so a
 *   page of cards is navigable rather than one run of text. A card that is part of its surroundings
 *   rather than a composition of its own takes `as="div"`.
 *   An article carries no name of its own. Point `aria-labelledby` at the title's `id` where the
 *   card stands alone, or state `aria-label`. An unnamed one is announced as `article` and nothing
 *   more.
 *   The root takes every variant and hands them to the bands below it.
 */

import { type ComponentProps } from "react";

import { withProvider } from "#card/context.ts";

/**
 * Draws the panel, and states the variants every band reads.
 */
export const Root = withProvider("article", "root");

/**
 * Describes what a card takes: the recipe's variants, and everything an article takes.
 */
export type RootProps = ComponentProps<typeof Root>;
