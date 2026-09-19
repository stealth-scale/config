/**
 * Draws what it holds at one width of the page and not the other.
 *
 * @remarks
 *   A page swaps parts rather than shrinking them. A trail of four crumbs becomes a single way
 *   back, a strip of tabs becomes a picker, a row of controls becomes a menu. Each pair is two
 *   different things rather than one thing at two sizes, so each is written out and this decides
 *   which is in the document.
 *   It draws no element of its own, so a part inside keeps the place in the header's grid that its
 *   own slot gives it. A wrapper would take that place instead and the part would land in the wrong
 *   cell.
 *   The width is the page's own measurement, not the window's, so a page beside an open sidebar
 *   swaps on the room it actually has.
 */

import { type ReactNode } from "react";

import { shown, usePage, type WhenProps } from "#page/state.ts";

/**
 * Describes what the switch takes.
 */
export interface WhenComponentProps extends WhenProps {
  /**
   * The parts drawn at that width.
   */
  readonly children?: ReactNode | undefined;
}

/**
 * Draws its children at the width it names, and nothing at the other.
 *
 * @param props - The width to draw at, and the parts to draw there.
 * @returns The parts it holds, or nothing.
 */
export function When({ children, when }: WhenComponentProps): ReactNode {
  const page = usePage();

  return shown(when, page.narrow) ? children : null;
}
