/**
 * Answers whether each of a set of media queries matches, and follows them as they change.
 */

import { useEffect, useState } from "react";

import { useCallbackRef } from "#use-callback-ref.ts";

/**
 * Describes what {@link useMediaQuery} takes beside the queries themselves.
 */
export interface UseMediaQueryOptions {
  /**
   * The answer for each query before the window has been asked. A query with no entry answers
   * `false`.
   */
  fallback?: readonly boolean[] | undefined;

  /**
   * Finds the window to ask, for a tree drawn in another document. The page's own window is asked
   * where this is absent.
   */
  getWindow?: (() => typeof window) | undefined;

  /**
   * Whether to answer the fallback on the first render and ask the window after it, which keeps a
   * server's markup and the client's first paint the same. Asking the window on the first render
   * needs this set to `false`.
   */
  ssr?: boolean | undefined;
}

/**
 * Asks a window whether each query matches.
 *
 * @param window - The window whose `matchMedia` is asked.
 * @returns Whether each query matches, in the order asked.
 */
function matching(window: Window, queries: readonly string[]): boolean[] {
  return queries.map((query) => window.matchMedia(query).matches);
}

/**
 * Reads whether each query matches, and re-reads them whenever any of them changes.
 *
 * @remarks
 *   Every query is asked of one window and answered in the order given, so a caller comparing a
 *   ladder of `min-width` queries reads it as a ladder. One list changing can change what another
 *   answers, so a change re-reads all of them rather than the one that fired. The effect depends
 *   on the queries encoded rather than on the array, because a caller writing the array inline
 *   passes a new one every render and the listeners would be torn down and rebuilt each time. A
 *   media query list is itself comma-separated, so the encoding is JSON rather than a join.
 * @param queries - The queries to ask, in the order the answers come back.
 * @param options - The fallback to answer before the window is asked, and which window to ask.
 * @returns Whether each query matches, in the order asked.
 */
export function useMediaQuery(
  queries: readonly string[],
  options: UseMediaQueryOptions = {},
): boolean[] {
  const { fallback, getWindow, ssr = true } = options;
  const findWindow = useCallbackRef(getWindow);

  const [matches, setMatches] = useState<boolean[]>(() =>
    ssr
      ? queries.map((_, index) => fallback?.[index] ?? false)
      : matching(getWindow?.() ?? globalThis.window, queries),
  );

  const asked = JSON.stringify(queries);

  useEffect((): (() => void) => {
    const window = findWindow() ?? globalThis.window;
    // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the text was encoded from the queries by the line above, so it decodes to the array it came from
    const list = JSON.parse(asked) as string[];
    const lists = list.map((query) => window.matchMedia(query));

    /**
     * Reads every query again and reports the answers.
     */
    function read(): void {
      setMatches(matching(window, list));
    }

    read();

    for (const one of lists) one.addEventListener("change", read);

    return (): void => {
      for (const one of lists) one.removeEventListener("change", read);
    };
  }, [asked, findWindow]);

  return matches;
}
