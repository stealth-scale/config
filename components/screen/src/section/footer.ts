/**
 * Draws the band under the body, which usually holds what confirms or cancels.
 *
 * @remarks
 *   The element is `footer`, which is a contentinfo landmark only at the top of a document and
 *   plain content inside a `section`. It shares the space out to both ends, so a note at the start
 *   and the controls at the end need no spacer between them.
 */

import { type ComponentProps } from "react";

import { withContext } from "#section/context.ts";

/**
 * Draws the band at the room the block states.
 */
export const Footer = withContext("footer", "footer");

/**
 * Describes what the footer takes.
 */
export type FooterProps = ComponentProps<typeof Footer>;
