/**
 * Draws what sits against the end of a card's header.
 *
 * @remarks
 *   The element is `div` and holds the controls a card carries beside its title: a menu, a close,
 *   a switch, a badge. It takes the last column of the header's grid and spans both of its lines.
 *   A control here is reached by a keyboard before the card's own content, which is the order a
 *   reader expects from something drawn at the top. A card whose main action belongs after its
 *   content puts that action in the footer instead.
 */

import { type ComponentProps } from "react";

import { withContext } from "#card/context.ts";

/**
 * Sets whatever the card carries beside its title against the header's end.
 */
export const Aside = withContext("div", "aside");

/**
 * Describes what the band takes: everything a styled div takes.
 */
export type AsideProps = ComponentProps<typeof Aside>;
