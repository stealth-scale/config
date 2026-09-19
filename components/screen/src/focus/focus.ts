/**
 * Moves the reader into something a screen component has just uncovered, and puts them back where
 * they were.
 *
 * @remarks
 *   Two screen components uncover something a reader then has to reach: the shell lays a panel over
 *   the page, and the toolbar lays a search field over its row. Both take focus off the control
 *   that was pressed, the shell because the rest of it goes inert and the toolbar because the row
 *   it covers goes out of sight, so both have to take focus deliberately and hand it back. Neither
 *   claims a dialog's role, and neither needs one. What a reader needs is what the component
 *   already gives them: nothing behind it to reach, a key to leave by, and the control they pressed
 *   still under the cursor when they come back.
 */

import { type RefObject, useEffect, useRef } from "react";

/**
 * Puts the reader in an element, without scrolling the page to reach it.
 */
function enter(element: HTMLElement): void {
  element.focus({ preventScroll: true });
}

/**
 * Reads the element a reader is standing on, where that is one focus can be given back to.
 */
function standing(): HTMLElement | null {
  const held = document.activeElement;

  return held instanceof HTMLElement ? held : null;
}

/**
 * Takes the reader into what was uncovered while it is shown, and returns them afterwards.
 *
 * @remarks
 *   Where the control has left the document by the time the thing closes, the reader is left where
 *   they were put rather than thrown to the top of the page.
 *   `from` exists because of what `inert` does. A component that makes the rest of itself inert has
 *   already done so by the time this runs, and a browser takes focus off anything it just made
 *   inert, so reading the document here would find the body rather than the control. A component in
 *   that position remembers the control while the press is still being handled and hands the ref
 *   over. A component that makes nothing inert states none, and this reads the document when the
 *   thing opens, which is the same answer one render earlier.
 * @param ref - The element that was uncovered, which may hold nothing yet.
 * @param shown - Whether it is uncovered now.
 * @param into - Selects what inside it the reader is taken to. The element itself where this is
 *   absent, which is what a panel of destinations wants, and the field where a search states one.
 * @param from - Where the reader stood when they asked for it, for a component that has since made
 *   that place inert.
 */
export function useFocused(
  ref: RefObject<HTMLElement | null>,
  shown: boolean,
  into?: string,
  from?: RefObject<HTMLElement | null>,
): void {
  const returning = useRef<HTMLElement | null>(null);

  useEffect((): (() => void) | undefined => {
    const uncovered = ref.current;

    if (!shown || uncovered === null) return undefined;

    const element = into === undefined ? uncovered : uncovered.querySelector<HTMLElement>(into);

    returning.current = from?.current ?? standing();

    if (element !== null) enter(element);

    return (): void => {
      const back = returning.current;

      returning.current = null;

      if (back !== null && back.isConnected) enter(back);
    };
  }, [from, into, ref, shown]);
}
