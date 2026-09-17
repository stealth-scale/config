/**
 * Draws the list itself, which takes the variants for every entry below it.
 *
 * @remarks
 *   The element is `ul`, and a caller draws a numbered list with `as="ol"`. The markers are the
 *   browser's, and a screen reader counts an `ol` and does not count a `ul`, so nothing here
 *   styles one differently from the other. The role is stated because Safari drops the list
 *   semantics from an element whose markers are removed, which the plain look does, and the count
 *   is the part a reader needs.
 */

import { type ComponentProps } from "react";

import { withProvider } from "#list/context.ts";

/**
 * Draws the list, in a look, a gap, an alignment and a motion, and hands them to every entry.
 */
export const Root = withProvider("ul", "root", { defaultProps: { role: "list" } });

/**
 * Describes what a list takes: the variants its recipe offers, and everything a styled list
 * element takes.
 */
export type RootProps = ComponentProps<typeof Root>;
