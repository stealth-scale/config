/**
 * Sets on each sticky band of a column the height of what sticks above it.
 */

import { type RefObject, useLayoutEffect } from "react";

/**
 * Describes what {@link useStickyOffsets} takes.
 */
export interface UseStickyOffsetsOptions {
  /**
   * Selects the bands that stick, among the column's descendants, in the order they stack.
   */
  bands: string;

  /**
   * The custom property set on each band, holding the height of what sticks above it, in pixels.
   */
  offset: string;

  /**
   * The custom property set on the column, holding the height of every band, in pixels.
   */
  total: string;
}

/**
 * Sets a custom property on each sticky band holding the height of the bands before it, and one on
 * the column holding the height of all of them.
 *
 * @remarks
 *   A second band sticks under the first, so each band needs the height of those above it, which a
 *   sticky offset in CSS alone cannot express. Measured when the column is laid out and whenever
 *   the column or a band changes size. A band rendered later is measured when the column next
 *   changes size rather than on a size change of its own. The effect depends on the options
 *   encoded rather than on the object, because a caller writing the object inline passes a new one
 *   every render and the observers would be torn down and rebuilt each time.
 * @param column - The element the bands sit in, which may hold nothing yet.
 * @param measuring - Whether anything sticks. Nothing is measured while this is `false`.
 * @param options - Which bands to measure, and which properties to set.
 */
export function useStickyOffsets(
  column: RefObject<HTMLElement | null>,
  measuring: boolean,
  options: UseStickyOffsetsOptions,
): void {
  const stated = JSON.stringify(options);

  useLayoutEffect((): (() => void) | undefined => {
    const element = column.current;

    if (!measuring || element === null || typeof ResizeObserver === "undefined") return undefined;

    // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the text was encoded from the options by the line above, so it decodes to what it came from
    const { bands, offset, total } = JSON.parse(stated) as UseStickyOffsetsOptions;

    const observer = new ResizeObserver(() => {
      let stuck = 0;

      element.querySelectorAll<HTMLElement>(bands).forEach((band) => {
        band.style.setProperty(offset, `${String(stuck)}px`);
        stuck += band.getBoundingClientRect().height;
      });

      element.style.setProperty(total, `${String(stuck)}px`);
    });

    observer.observe(element);
    element.querySelectorAll(bands).forEach((band) => {
      observer.observe(band);
    });

    return (): void => {
      observer.disconnect();
    };
  }, [column, measuring, stated]);
}
