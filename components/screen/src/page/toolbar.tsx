/**
 * Draws the band between the navigation and the body, holding what filters or searches what is
 * shown.
 *
 * @remarks
 *   A slot of its own rather than the top of the body, so it keeps the page's gutter and measure
 *   and can stay put while the rows scroll under it. Put the toolbar component inside it.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#page/context.ts";
import { type StickyProps, stuck } from "#page/sticky.ts";

/**
 * Draws the band at the room the column states.
 */
const Banded = withContext("div", "toolbar");

/**
 * Describes what the band takes.
 */
export interface ToolbarProps extends ComponentProps<typeof Banded>, StickyProps {}

/**
 * Carries what narrows the body, and stays put where a caller asks.
 *
 * @param props - Whether it stays put, and everything a styled div takes.
 * @returns The band, carrying whether it sticks.
 */
export function Toolbar({ sticky, ...rest }: ToolbarProps): ReactElement {
  return <Banded {...rest} data-sticky={stuck(sticky)} />;
}
