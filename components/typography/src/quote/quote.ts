/**
 * Binds the q element to its recipe.
 *
 * @remarks
 *   `q` is the quotation that sits inside a line. The browser draws the marks from the `quotes`
 *   property, which resolves against the `lang` the element sits under, so a German page gets its
 *   own marks without the caller writing them. A quotation that stands on its own is
 *   `Blockquote.Root`. A caller quoting a source states `cite` with its address.
 */

import { type ComponentProps } from "react";

import { withContext } from "#quote/context.ts";

/**
 * Quotes a run of words inside the line around it.
 */
export const Quote = withContext("q");

/**
 * Describes the props a q element takes.
 */
export type QuoteProps = ComponentProps<typeof Quote>;
