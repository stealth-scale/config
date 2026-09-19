/**
 * Carries what a page knows about itself down to its parts and to whatever it holds.
 *
 * @remarks
 *   A section inside a page reads its size from here rather than being told, so a page set to `lg`
 *   is a page whose sections are `lg` and a caller states the size once.
 *   The width is here too, because a part that is drawn at one width only has to know which width
 *   the page is at, and the page is the only thing that measured it.
 */

import { createRequiredContext } from "@stealthscale/hooks";

/**
 * Selects how large a page draws what names it.
 */
export type PageSize = "lg" | "md" | "sm";

/**
 * Selects which width a part is drawn at.
 */
export type PageWidth = "narrow" | "wide";

/**
 * Describes what a page hands down.
 */
export interface PageState {
  /**
   * Whether the page is too narrow for a header laid out in one row.
   */
  narrow: boolean;

  /**
   * How large the page draws its title, its description and what acts on it.
   */
  size: PageSize;
}

/**
 * Hands the page's state down, and reads it back.
 */
export const [PageProvider, usePage, useOptionalPage] = createRequiredContext<PageState>("Page");

/**
 * Describes what any part drawn at one width only takes.
 */
export interface WhenProps {
  /**
   * The width to draw the part at. `narrow` draws it on a folded page alone and `wide` drops it
   * there, which is how a full trail of crumbs is swapped for a single way back. Left out, the
   * part is drawn at every width.
   */
  readonly when?: PageWidth | undefined;
}

/**
 * Answers whether a part drawn at one width only is drawn at this one.
 *
 * @remarks
 *   The width is the page's own measurement rather than the window's, so a part inside a page
 *   beside an open sidebar is swapped on the room the page has.
 * @param when - The width the part is drawn at, or nothing for every width.
 * @param narrow - Whether the page has folded.
 * @returns Whether to draw it.
 */
export function shown(when: PageWidth | undefined, narrow: boolean): boolean {
  return when === undefined || (when === "narrow") === narrow;
}
