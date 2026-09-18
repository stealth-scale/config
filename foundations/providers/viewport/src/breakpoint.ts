/**
 * Reads which breakpoint the viewport is at, and the value stated for it.
 */

import { useMediaQuery } from "@stealthscale/hooks";

import { useViewport } from "#context.ts";
import { BASE_SIZE, type Breakpoint, type Size } from "#size.ts";

/**
 * Describes what {@link useBreakpoint} takes.
 */
export interface UseBreakpointOptions {
  /**
   * Which breakpoints count. Only these are matched, and the widest matching one is answered.
   * Naming none answers the fallback.
   */
  breakpoints?: readonly Breakpoint[] | undefined;

  /**
   * The answer where no breakpoint named starts under the width, and on the first render where the
   * window is waited for. `base` where this is absent.
   */
  fallback?: Breakpoint | undefined;

  /**
   * Finds the window to ask, for a tree drawn in another document. The page's own where this is
   * absent.
   */
  getWindow?: (() => typeof window) | undefined;

  /**
   * Whether to answer the fallback on the first render and ask the window after it, which keeps a
   * server's markup and the client's first paint the same.
   */
  ssr?: boolean | undefined;
}

/**
 * Describes what {@link useBreakpointValue} takes, which is the same less the breakpoints. Those
 * are the ones the value itself states.
 */
export type UseBreakpointValueOptions = Omit<UseBreakpointOptions, "breakpoints">;

/**
 * A value stated per breakpoint, keyed by name or listed in the theme's order.
 *
 * @remarks
 *   A list carries a gap where a breakpoint states nothing, which is why its member type admits
 *   null. A key is a breakpoint the vocabulary states, so a misspelt one is refused where it is
 *   written.
 * @typeParam Value - The value stated for each breakpoint.
 */
export type Responsive<Value> = Array<null | Value> | Partial<Record<Breakpoint, Value>>;

/**
 * Lists the breakpoints asked for, narrowest first.
 *
 * @param sizes - Where the theme's breakpoints start.
 * @param breakpoints - Which of them count.
 * @returns The ones that count, in the theme's order, with `base` first where it was asked for.
 */
function askedOf(sizes: readonly Size[], breakpoints: readonly string[]): Size[] {
  return [BASE_SIZE, ...sizes].filter(({ name }) => breakpoints.includes(name));
}

/**
 * Keys a value stated per breakpoint by name, whichever way it was stated.
 *
 * @typeParam Value - The value stated for each breakpoint.
 * @param value - The value, keyed or listed.
 * @param names - The theme's breakpoints in order, `base` first, which is what a list is read
 *   against.
 * @returns The value keyed by breakpoint, with a gap in a list and anything past the last
 *   breakpoint left out.
 */
function keyed<Value>(
  value: Responsive<Value>,
  names: readonly string[],
): Partial<Record<string, Value>> {
  if (!Array.isArray(value)) return value;

  return Object.fromEntries(
    value.flatMap((one, index) => {
      const name = names[index];

      return one === null || name === undefined ? [] : [[name, one]];
    }),
  );
}

/**
 * Reads which breakpoint the viewport is at, among the ones asked for.
 *
 * @remarks
 *   The stated width where a provider states one, and the window's otherwise. The window is asked
 *   the way the styling engine asks it, one `min-width` query per breakpoint, so a component and
 *   its stylesheet switch at the same pixel. Where a provider states the width, the window is
 *   asked nothing, so no listener is kept for an answer nothing reads.
 * @param options - Which breakpoints count and how to ask the window.
 * @returns The breakpoint's name.
 */
export function useBreakpoint({
  breakpoints = [],
  fallback = "base",
  getWindow,
  ssr,
}: UseBreakpointOptions = {}): Breakpoint {
  const { sizes, width } = useViewport();
  const asked = askedOf(sizes, breakpoints);
  const until = asked.findIndex(({ name }) => name === fallback);
  const matching = useMediaQuery(
    width === undefined ? asked.map(({ min }) => `(min-width: ${String(min)}px)`) : [],
    {
      fallback: asked.map((_, index) => index <= until),
      ssr,
      ...(getWindow === undefined ? {} : { getWindow }),
    },
  );
  const matched = width === undefined ? matching : asked.map(({ min }) => min <= width);
  const at = asked[matched.lastIndexOf(true)];

  return breakpoints.find((name) => name === at?.name) ?? fallback;
}

/**
 * Reads the value stated for the breakpoint the viewport is at.
 *
 * @remarks
 *   A breakpoint that states nothing takes the nearest narrower one's value, which is how a value
 *   stated for `base` and `md` alone holds at `lg`.
 * @typeParam Value - The value stated for each breakpoint.
 * @param value - The value per breakpoint, keyed by name or listed in the theme's order.
 * @param options - How to ask the window.
 * @returns The value, or nothing where no breakpoint at or under the viewport states one.
 */
export function useBreakpointValue<Value>(
  value: Responsive<Value>,
  options: UseBreakpointValueOptions = {},
): undefined | Value {
  const { sizes } = useViewport();
  const table = keyed(
    value,
    [BASE_SIZE, ...sizes].map(({ name }) => name),
  );
  // The table is keyed by the breakpoints the value named or the vocabulary lists, which are the
  // breakpoints a hook may ask for, and a value keyed by text needs its keys read back as those.
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- see above
  const named = Object.keys(table) as Breakpoint[];
  const at = useBreakpoint({ ...options, breakpoints: named });

  return table[at];
}
