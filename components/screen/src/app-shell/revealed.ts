/**
 * Holds whether a panel laid over the page is shown, and forgets it whenever the shell crosses the
 * width the panel folds at.
 *
 * @remarks
 *   A panel over the page is a sheet, and a sheet is shown because a reader asked for it. Whatever
 *   the panel was doing in the body says nothing about that, so the sheet starts closed and starts
 *   closed again every time the shell narrows anew. An application opened on a phone should not
 *   open with its navigation across the page, and one dragged narrow after the navigation was open
 *   should not put it over the page unasked. The width is held beside the answer and compared while
 *   rendering, which is how React asks a component to drop state a prop has made stale. An effect
 *   would show the sheet for one frame before taking it away again.
 */

import { useCallback, useState } from "react";

/**
 * Describes what is held: whether the sheet is shown, and the width that was true when it was set.
 */
interface Revealed {
  /**
   * Whether the shell was narrow when the answer was set.
   */
  readonly narrow: boolean;

  /**
   * Whether the sheet is shown.
   */
  readonly open: boolean;
}

/**
 * Answers whether the sheet is shown, across one spell of narrowness.
 *
 * @param narrow - Whether the shell is too narrow to hold the panel beside the page.
 * @returns Whether the sheet is shown, and how to show or hide it.
 */
export function useRevealed(narrow: boolean): readonly [boolean, (open: boolean) => void] {
  const [held, setHeld] = useState<Revealed>({ narrow, open: false });
  const setOpen = useCallback(
    (open: boolean): void => {
      setHeld({ narrow, open });
    },
    [narrow],
  );

  if (held.narrow !== narrow) setHeld({ narrow, open: false });

  return [held.narrow === narrow && held.open, setOpen];
}
