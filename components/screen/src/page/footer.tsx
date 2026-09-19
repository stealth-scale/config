/**
 * Draws the band at the foot of the page.
 *
 * @remarks
 *   The element is `footer`, which is plain content inside a page rather than a contentinfo
 *   landmark, because the shell around it owns the one a screen has.
 *   The column is at least as tall as what holds it, so this sits at the foot of the screen on a
 *   short page rather than partway up it.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#page/context.ts";
import { type StickyProps, stuck } from "#page/sticky.ts";

/**
 * Draws the band at the room the column states.
 */
const Banded = withContext("footer", "footer");

/**
 * Describes what the footer takes.
 */
export interface FooterProps extends ComponentProps<typeof Banded>, StickyProps {}

/**
 * Closes the page, and stays put where a caller asks.
 *
 * @param props - Whether it stays put, and everything a styled footer takes.
 * @returns The band, carrying whether it sticks.
 */
export function Footer({ sticky, ...rest }: FooterProps): ReactElement {
  return <Banded {...rest} data-sticky={stuck(sticky)} />;
}
