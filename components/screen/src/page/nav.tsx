/**
 * Draws the band under the header holding the ways through the page.
 *
 * @remarks
 *   The element is `nav`. Name it: a screen holds more than one navigation landmark, and an unnamed
 *   one is announced with nothing to tell it from the shell's.
 *   It carries the hairline the header would otherwise draw, so the tabs inside sit on one line
 *   rather than two.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#page/context.ts";
import { type StickyProps, stuck } from "#page/sticky.ts";

/**
 * Draws the band at the room the column states.
 */
const Banded = withContext("nav", "nav");

/**
 * Describes what the navigation takes.
 */
export interface NavProps extends ComponentProps<typeof Banded>, StickyProps {}

/**
 * Carries the ways through the page, and stays put where a caller asks.
 *
 * @param props - Whether it stays put, and everything a styled nav takes.
 * @returns The band, carrying whether it sticks.
 */
export function Nav({ sticky, ...rest }: NavProps): ReactElement {
  return <Banded {...rest} data-sticky={stuck(sticky)} />;
}
