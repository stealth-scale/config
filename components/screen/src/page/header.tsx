/**
 * Draws the band holding the title and everything that names or acts on the page.
 *
 * @remarks
 *   The element is `header`, which is plain content inside a page rather than a banner landmark,
 *   because the shell around it owns the one banner a screen has.
 *   It is a grid, so the parts inside are written flat and placed by name. A part left out takes no
 *   room at all.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#page/context.ts";
import { type StickyProps, stuck } from "#page/sticky.ts";

/**
 * Draws the band at the room the column states.
 */
const Banded = withContext("header", "header");

/**
 * Describes what the header takes.
 */
export interface HeaderProps extends ComponentProps<typeof Banded>, StickyProps {}

/**
 * Labels the page, and carries what acts on it.
 *
 * @param props - Whether it stays put, and everything a styled header takes.
 * @returns The band, carrying whether it sticks.
 */
export function Header({ sticky, ...rest }: HeaderProps): ReactElement {
  return <Banded {...rest} data-sticky={stuck(sticky)} />;
}
