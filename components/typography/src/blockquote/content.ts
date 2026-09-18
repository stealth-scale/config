/**
 * Draws the words of a quotation.
 *
 * @remarks
 *   The element is `blockquote`, which a screen reader announces as a quotation. The content draws
 *   its slot in the variants the root was given, and the size sets its body role.
 */

import { type ComponentProps } from "react";

import { withContext } from "#blockquote/context.ts";

/**
 * Draws the quotation itself, in the body role of the size the root was given.
 */
export const Content = withContext("blockquote", "content");

/**
 * Describes what the content takes: everything a styled blockquote element takes.
 */
export type ContentProps = ComponentProps<typeof Content>;
