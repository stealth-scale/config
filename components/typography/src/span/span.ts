/**
 * Binds the span element to its recipe.
 *
 * @remarks
 *   `span` carries no meaning, so a screen reader reads its words as part of the line around it.
 *   Reach for a span where part of a sentence needs a class, a ref or a data attribute and nothing
 *   else. A run that carries meaning takes the element that states it: `Em` for stress, `Strong`
 *   for importance, `Mark` for a highlight, `Quote` for a quotation.
 */

import { type ComponentProps } from "react";

import { withContext } from "#span/context.ts";

/**
 * Draws a run of words inside a line without starting a block.
 */
export const Span = withContext("span");

/**
 * Describes the props a span element takes.
 */
export type SpanProps = ComponentProps<typeof Span>;
