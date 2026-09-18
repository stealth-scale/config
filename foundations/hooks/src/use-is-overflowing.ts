/**
 * Reports whether the content of an element is larger than the box drawn for it.
 */

import { type RefObject, useEffect, useRef, useState } from "react";

/**
 * Describes what {@link useIsOverflowing} returns.
 */
export interface Overflow {
  /**
   * Whether the content is cut off across.
   */
  horizontal: boolean;

  /**
   * Whether the content is cut off on either axis, which is what decides whether to offer a
   * tooltip or a way to read the rest.
   */
  overflows: boolean;

  /**
   * Whether the content is cut off down the page.
   */
  vertical: boolean;
}

/**
 * The result for an element that fits, and for one nothing has measured yet.
 */
const FITS: Overflow = { horizontal: false, overflows: false, vertical: false };

/**
 * Measures whether an element is cut off, on each axis.
 *
 * @remarks
 *   A pixel of tolerance, because sub-pixel layout and zoom leave the scroll size a fraction over
 *   the client size for content that fits, and reporting that flickers the affordance on resize.
 * @returns Which way the element is cut off, if either.
 */
function overflowOf(element: HTMLElement): Overflow {
  const horizontal = element.scrollWidth - element.clientWidth > 1;
  const vertical = element.scrollHeight - element.clientHeight > 1;

  return { horizontal, overflows: horizontal || vertical, vertical };
}

/**
 * Watches an element and returns whether what is inside it is cut off.
 *
 * @remarks
 *   Measured again whenever the element resizes, whenever its content changes, whenever the parent
 *   resizes, and once more after the fonts have loaded. The returned object keeps one identity
 *   while the result stands, so a component reading it renders again only when the element crosses
 *   between fitting and not. The wiring effect lists no dependencies, because a ref changing is not
 *   a render and nothing else would detect a new element. It rewires only when the element differs
 *   from the one
 *   it is already watching, so running on every render costs one comparison. The teardown is held
 *   in a ref and run by a second effect, because the wiring effect returning it would disconnect
 *   the observers on every render.
 * @param ref - The element to watch, which may hold nothing yet.
 * @returns Which way the element is cut off.
 */
export function useIsOverflowing(ref: RefObject<HTMLElement | null>): Overflow {
  const [overflow, setOverflow] = useState<Overflow>(FITS);

  const watched = useRef<HTMLElement | null>(null);
  const unwire = useRef<(() => void) | null>(null);

  useEffect(() => {
    const element = ref.current;

    if (element === watched.current) return;

    unwire.current?.();
    unwire.current = null;
    watched.current = element;

    if (element === null) return;

    /**
     * Measures the element again, and stores the result only where it changed.
     */
    const measure = (): void => {
      if (watched.current !== element) return;

      const next = overflowOf(element);

      setOverflow((current) =>
        current.horizontal === next.horizontal && current.vertical === next.vertical
          ? current
          : next,
      );
    };

    measure();

    const resized = new ResizeObserver(measure);

    resized.observe(element);
    if (element.parentElement !== null) resized.observe(element.parentElement);

    const changed = new MutationObserver(measure);

    changed.observe(element, { characterData: true, childList: true, subtree: true });

    const fonts = document.fonts as FontFaceSet | undefined;

    void fonts?.ready.then(measure);

    unwire.current = (): void => {
      resized.disconnect();
      changed.disconnect();
    };
  });

  useEffect(() => {
    return (): void => {
      unwire.current?.();
      unwire.current = null;
    };
  }, []);

  return overflow;
}
