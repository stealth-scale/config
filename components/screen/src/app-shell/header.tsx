/**
 * Draws a bar across the top of the shell.
 *
 * @remarks
 *   The element is `header`, which carries the `banner` landmark at the top of a document. Draw as
 *   many as the layout needs and they stack in the order written.
 *   A bar told to stick pins to the top of the window under the bars pinned before it, which the
 *   root measures for it. It stands still either way where the page is what scrolls.
 *   It goes inert while a panel is laid over the page, because a bar under a backdrop is a bar a
 *   reader can see and cannot reach, and Tab should not say otherwise.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#app-shell/context.ts";
import { useOverlaid } from "#app-shell/state.ts";

/**
 * Draws the bar at the room the shell states.
 */
const Barred = withContext("header", "header");

/**
 * Describes what a bar across the top takes.
 */
export interface HeaderProps extends ComponentProps<typeof Barred> {
  /**
   * Whether the bar pins to the top of the window while the window scrolls.
   */
  readonly sticky?: boolean | undefined;
}

/**
 * Draws a bar across the top, the height of what it holds.
 *
 * @param props - Whether it pins, and everything a styled header takes.
 * @returns The bar.
 */
export function Header({ sticky = false, ...rest }: HeaderProps): ReactElement {
  const sheets = useOverlaid();

  return <Barred {...rest} data-sticky={sticky ? "" : undefined} inert={sheets.length > 0} />;
}
