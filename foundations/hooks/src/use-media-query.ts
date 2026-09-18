/**
 * Reports whether each of a set of media queries matches, and re-reads them as they change.
 */

import { useEffect, useState } from "react";

import { useCallbackRef } from "#use-callback-ref.ts";

/**
 * Describes what {@link useMediaQuery} takes beside the queries themselves.
 */
export interface UseMediaQueryOptions {
  /**
   * The result for each query before the window is read. A query with no entry returns `false`.
   */
  fallback?: readonly boolean[] | undefined;

  /**
   * Returns the window to read, for a tree drawn in another document. The page's own window is
   * read where this is absent.
   */
  getWindow?: (() => typeof window) | undefined;

  /**
   * Whether to return the fallback on the first render and read the window after it, which keeps a
   * server's markup and the client's first paint the same. Set this to `false` to read the window
   * on the first render.
   */
  ssr?: boolean | undefined;
}

/**
 * Reads from a window whether each query matches.
 *
 * @param window - The window whose `matchMedia` is called.
 * @returns Whether each query matches, in the order given.
 */
function matching(window: Window, queries: readonly string[]): boolean[] {
  return queries.map((query) => window.matchMedia(query).matches);
}

/**
 * Reads whether each query matches, and re-reads them whenever any of them changes.
 *
 * @remarks
 *   Every query is read from one window, and the results come back in the order the queries were
 *   given, so a caller can index the result by its own query. One match changing can change
 *   another, so a change re-reads every query rather than the one that reported it. The effect
 *   depends on the queries encoded rather than on the array, because a caller writing the array
 *   inline passes a new one every render and the listeners would be torn down and rebuilt each
 *   time. A media query list is itself comma-separated, so the encoding is JSON rather than a
 *   join.
 * @param queries - The queries to read, in the order the results come back.
 * @param options - The fallback returned before the window is read, and which window to read.
 * @returns Whether each query matches, in the order given.
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
     * Reads every query again and stores the results.
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
