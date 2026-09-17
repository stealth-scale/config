/**
 * Lights the row and the column under the pointer in a grid.
 *
 * @remarks
 *   A grid wide enough to be worth drawing as a grid is wide enough that "row 14, column 9" is a
 *   counting exercise. Column headers cannot carry full names, because rotated text is unreadable
 *   and out of reach of most magnifiers, so they carry short ones and this turns a short one back
 *   into a row somebody can read. The lights are written through the DOM rather than through
 *   state: a matrix of a few hundred items either way is tens of thousands of cells, and rendering
 *   that tree sixty times a second is not something to ask of anybody's machine.
 */

import { type PointerEvent, type RefObject, useCallback, useRef } from "react";

/**
 * Describes what {@link useMatrixCrosshair} returns.
 *
 * @typeParam Grid - The element the grid is drawn as, which is a table unless it is not.
 */
export interface MatrixCrosshair<Grid extends HTMLElement> {
  /**
   * Puts every light out, for the pointer leaving the grid.
   */
  clear: () => void;

  /**
   * Goes on the grid, so the lights can be found and written.
   */
  ref: RefObject<Grid | null>;

  /**
   * Reads where the pointer is and lights that row and that column.
   */
  track: (event: PointerEvent<HTMLElement>) => void;
}

/**
 * Returns the ref to hang on a grid and the two handlers that light it as the pointer crosses.
 *
 * @remarks
 *   Mark the cells and the headers of a row with `data-row`, and those of a column with
 *   `data-column`, then style what is lit against `&[data-lit]`. An element may carry both, which
 *   is what lets a matrix of one set against itself light the row a hovered column stands for.
 * @typeParam Grid - The element the grid is drawn as.
 * @returns The ref and the two handlers.
 */
export function useMatrixCrosshair<
  Grid extends HTMLElement = HTMLElement,
>(): MatrixCrosshair<Grid> {
  const grid = useRef<Grid>(null);
  const lit = useRef<HTMLElement[]>([]);

  /**
   * Puts the current lights out and lights the named row and column instead.
   *
   * @remarks
   *   Written as what to gather rather than as what to return early from. A grid hung on nothing
   *   cannot raise a pointer event, so an early return would be a line no specification can reach,
   *   and gathering nothing puts the lights out, which is the same answer. The names are escaped
   *   because they are the caller's own, so a label carrying a quote is a matched selector rather
   *   than a broken one.
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
   * Reads the row and column the pointer is over and lights them.
   *
   * @remarks
   *   The target is narrowed to `Element` rather than to `HTMLElement`. What a pointer lands on in
   *   a grid is usually the icon inside a cell, and an `svg` is an `SVGElement`, so the narrower
   *   test reads every hover over a mark as a hover over nothing and the crosshair never lights.
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
   * Puts every light out.
   */
  const clear = useCallback((): void => {
    light(null, null);
  }, [light]);

  return { clear, ref: grid, track };
}
