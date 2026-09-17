/**
 * Draws the caption under a quotation, which names who said it.
 *
 * @remarks
 *   The element is `figcaption`, which the browser ties to the figure around it. The caption
 *   draws its slot in the variants the root was given, muted and in the caption role.
 */

import { type ComponentProps } from "react";

import { withContext } from "#blockquote/context.ts";

/**
 * Draws the caption, muted, in the caption role.
 */
export const Caption = withContext("figcaption", "caption");

/**
 * Describes what the caption takes: everything a styled figcaption element takes.
 */
export type CaptionProps = ComponentProps<typeof Caption>;
