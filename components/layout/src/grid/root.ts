/**
 * Draws the grid itself, which takes the variants for every entry below it.
 *
 * @remarks
 *   The element is `div`, because a grid arranges what is already there and says nothing about
 *   what it holds. A caller arranging a list of things changes the element with `as`, so a screen
 *   reader counts them.
 */

import { type ComponentProps } from "react";

import { withProvider } from "#grid/context.ts";

/**
 * Lays its entries out in columns, and hands the variants to each of them.
 */
export const Root = withProvider("div", "root");

/**
 * Describes what a grid takes: the variants its recipe offers, and everything a styled div
 * element takes.
 */
export type RootProps = ComponentProps<typeof Root>;
