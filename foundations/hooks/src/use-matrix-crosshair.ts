/**
 * Marks the row and the column under the pointer in a grid.
 *
 * @remarks
 *   A grid wide enough to be worth drawing as a grid is wide enough that "row 14, column 9" is a
 *   counting exercise. Column headers cannot carry full names, because rotated text is unreadable
 *   and out of reach of most magnifiers, so they carry short ones and this turns a short one back
 *   into a row somebody can read. The marks are written through the DOM rather than through state.
 *   A matrix of a few hundred items either way is tens of thousands of cells, and re-rendering that
 *   tree on every pointer move costs more than setting an attribute.
 */

import { type PointerEvent, type RefObject, useCallback, useRef } from "react";

/**
 * Describes what {@link useMatrixCrosshair} returns.
 *
 * @typeParam Grid - The element the grid is drawn as, which is a table unless it is not.
 */
export interface MatrixCrosshair<Grid extends HTMLElement> {
  /**
   * Removes every mark, for the pointer leaving the grid.
   */
  clear: () => void;

  /**
   * Goes on the grid, so the marked elements can be found and written.
   */
  ref: RefObject<Grid | null>;

  /**
   * Reads where the pointer is and marks that row and that column.
   */
  track: (event: PointerEvent<HTMLElement>) => void;
}

/**
 * Returns the ref to put on a grid and the two handlers that mark it as the pointer crosses.
 *
 * @remarks
 *   Mark the cells and the headers of a row with `data-row`, and those of a column with
 *   `data-column`, then style the marked elements against `&[data-lit]`. An element may carry both
 *   attributes, which is what lets a matrix of one set against itself mark the row a hovered column
 *   stands for.
 * @typeParam Grid - The element the grid is drawn as.
 * @returns The ref and the two handlers.
 */
export function useMatrixCrosshair<
  Grid extends HTMLElement = HTMLElement,
>(): MatrixCrosshair<Grid> {
  const grid = useRef<Grid>(null);
  const lit = useRef<HTMLElement[]>([]);

  /**
   * Removes the current marks and marks the named row and column instead.
   *
   * @remarks
   *   Written as what to gather rather than as what to return early from. A grid attached to
   *   nothing cannot raise a pointer event, so an early return would be a line no specification can
   *   reach, and gathering nothing removes every mark, which is the same result. The names are
   *   escaped because they are the caller's own, so a label carrying a quote is a matched selector
   *   rather than a broken one.
   */
  const light = useCallback((row: null | string, column: null | string): void => {
    for (const element of lit.current) delete element.dataset["lit"];

    const held = grid.current;
    const next =
      held === null
        ? []
        : [
            ...(row === null
              ? []
              : held.querySelectorAll<HTMLElement>(`[data-row="${CSS.escape(row)}"]`)),
            ...(column === null
              ? []
              : held.querySelectorAll<HTMLElement>(`[data-column="${CSS.escape(column)}"]`)),
          ];

    for (const element of next) element.dataset["lit"] = "";
    lit.current = next;
  }, []);

  /**
   * Reads the row and column the pointer is over and marks them.
   *
   * @remarks
   *   The target is narrowed to `Element` rather than to `HTMLElement`. What a pointer hits in a
   *   grid is usually the icon inside a cell, and an `svg` is an `SVGElement`, so the narrower test
   *   reads every hover over an icon as a hover over nothing and the crosshair never appears.
   */
  const track = useCallback(
    (event: PointerEvent<HTMLElement>): void => {
      const target = event.target instanceof Element ? event.target : null;

      light(
        target?.closest<HTMLElement>("[data-row]")?.dataset["row"] ?? null,
        target?.closest<HTMLElement>("[data-column]")?.dataset["column"] ?? null,
      );
    },
    [light],
  );

  /**
   * Removes every mark.
   */
  const clear = useCallback((): void => {
    light(null, null);
  }, [light]);

  return { clear, ref: grid, track };
}
