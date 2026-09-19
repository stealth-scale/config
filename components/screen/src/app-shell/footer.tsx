/**
 * Draws a bar across the bottom of the shell.
 *
 * @remarks
 *   The element is `footer`, which carries the `contentinfo` landmark at the bottom of a document.
 *   Draw as many as the layout needs and they stack in the order written.
 *   A bar told to stick pins to the bottom of the window and clears the home bar where the
 *   application draws under it. It goes inert while a panel is laid over the page, for the same
 *   reason a bar across the top does.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#app-shell/context.ts";
import { useOverlaid } from "#app-shell/state.ts";

/**
 * Draws the bar at the room the shell states.
 */
const Barred = withContext("footer", "footer");

/**
 * Describes what a bar across the bottom takes.
 */
export interface FooterProps extends ComponentProps<typeof Barred> {
  /**
   * Whether the bar pins to the bottom of the window while the window scrolls.
   */
  readonly sticky?: boolean | undefined;
}

/**
 * Draws a bar across the bottom, the height of what it holds.
 *
 * @param props - Whether it pins, and everything a styled footer takes.
 * @returns The bar.
 */
export function Footer({ sticky = false, ...rest }: FooterProps): ReactElement {
  const sheets = useOverlaid();

  return <Barred {...rest} data-sticky={sticky ? "" : undefined} inert={sheets.length > 0} />;
}
