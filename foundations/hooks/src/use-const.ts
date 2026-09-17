/**
 * Holds a value built once, for as long as the component that asked for it is mounted.
 */

import { useState } from "react";

/**
 * Builds a value on the first render and returns that same value on every render after it.
 *
 * @remarks
 *   State without a setter is the only thing React promises to build once. `useMemo` is a cache
 *   the runtime may drop and rebuild, which is what a caller relying on identity cannot have. Use
 *   this for a collator, an observer, or an object used as a key.
 * @typeParam Held - The value that is built.
 * @param initial - The value, or a function that builds it. A function is called once, so a caller
 *   whose value is itself a function wraps it in one that returns it.
 * @returns The same value on every render.
 */
export function useConst<Held>(initial: (() => Held) | Held): Held {
  const [held] = useState(initial);

  return held;
}
