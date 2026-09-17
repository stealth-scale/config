/**
 * Draws a sticky element: one that scrolls with its container until it reaches the top, and
 * stays there while the rest scrolls past.
 *
 * @remarks
 *   The element sits on the sticky rung of the z-index ladder, so it stays over the content it
 *   sticks above and under a dropdown or a dialog. The distance from the top is a step of the
 *   semantic spacing scale, so a theme moves it.
 */

import type { SystemProperties, SystemStyleObject } from "#generated/types/system.d.mts";

/**
 * Describes what a sticky element takes.
 */
export interface StickyProps {
  /**
   * The distance from the top of the scroller the element stops at, as a step of the semantic
   * spacing scale. Zero when nothing is stated.
   */
  top?: SystemProperties["top"];
}

/**
 * Draws a sticky element at the top of its scroller.
 */
export function sticky(props?: StickyProps): SystemStyleObject {
  return { position: "sticky", top: props?.top ?? "0", zIndex: "sticky" };
}
