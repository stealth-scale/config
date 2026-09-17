/**
 * Measures an element against a width, rather than measuring the window.
 */

import { type RefObject, useLayoutEffect, useState } from "react";

import { useBreakpoint } from "#breakpoint.ts";

/**
 * The breakpoint under which the viewport counts as narrow before an element has been measured.
 */
const BELOW = "md";

/**
 * Reads whether an element is narrower than a width.
 *
 * @remarks
 *   The element is measured once it is laid out and again whenever its size changes, so a page
 *   beside an open sidebar answers for its own width rather than the window's. Before it is
 *   measured, and while the ref holds nothing, the answer comes from the viewport: narrow under the
 *   breakpoint given, which is what a phone is, so a phone never lays out wide first.
 * @param ref - The element to measure, which may hold nothing yet.
 * @param width - The width in pixels under which the element counts as narrow.
 * @param below - The breakpoint under which the viewport counts as narrow before the element is
 *   measured.
 * @returns Whether the element is narrower than the width.
 */
export function useNarrow(
  ref: RefObject<HTMLElement | null>,
  width: number,
  below = BELOW,
): boolean {
  const at = useBreakpoint({ breakpoints: [below] });
  const guessed = at !== below;
  const [measured, setMeasured] = useState<boolean | undefined>();

  useLayoutEffect((): (() => void) | undefined => {
    const element = ref.current;

    if (element === null) return undefined;

    const observer = new ResizeObserver(() => {
      setMeasured(element.getBoundingClientRect().width < width);
    });

    observer.observe(element);

    return (): void => {
      observer.disconnect();
    };
  }, [ref, width]);

  return measured ?? guessed;
}
