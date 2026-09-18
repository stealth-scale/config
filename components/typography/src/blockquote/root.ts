/**
 * Draws the figure a quotation sits in, which takes the variants for every part below it.
 *
 * @remarks
 *   The element is `figure`, because a quotation with a caption is a self-contained figure, and
 *   the caption is its `figcaption`. The root takes the look, the size, the alignment, the status
 *   and the motion, and hands them to the parts.
 */

import { type ComponentProps } from "react";

import { withProvider } from "#blockquote/context.ts";

/**
 * Draws the figure, in a look, a size, an alignment, a status and a motion, and hands them to
 * every part.
 */
export const Root = withProvider("figure", "root");

/**
 * Describes what a blockquote takes: the variants its recipe offers, and everything a styled
 * figure element takes.
 */
export type RootProps = ComponentProps<typeof Root>;
