/**
 * Holds a callback in a ref, so an effect that depends on it does not re-run when it changes.
 */

import { type DependencyList, useCallback, useInsertionEffect, useRef } from "react";

/**
 * Returns a stable function that calls whichever callback the latest render passed.
 *
 * @remarks
 *   An effect naming a handler in its dependencies re-runs whenever the caller passes a new
 *   closure, which is every render for anything written inline. Naming this instead re-runs the
 *   effect when the dependencies say to and never because the handler was rewritten. The ref is
 *   written in an insertion effect rather than during the render, because a render may be thrown
 *   away and a discarded one must not leave the ref holding a callback that never mounted.
 *   The React Compiler is told to leave this alone. It refuses any function whose hook rules were
 *   suppressed, and the suppression below is the point of the hook. Without the directive it
 *   raises the refusal as an error and fails the build of every package that carries this.
 * @typeParam Args - The arguments the callback takes.
 * @typeParam Held - The value the callback returns.
 * @param callback - The function to call, or nothing where the caller passes none.
 * @param deps - The values the stable function's identity changes with. Stating none keeps one
 *   identity for the life of the component.
 * @returns A function that calls the latest callback, and returns nothing where there is none.
 */
export function useCallbackRef<Args extends unknown[], Held>(
  callback?: (...args: Args) => Held,
  deps: DependencyList = [],
): (...args: Args) => Held | undefined {
  "use no memo";

  const held = useRef(callback);

  useInsertionEffect(() => {
    held.current = callback;
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps -- the dependencies are the caller's to state, because the callback is read off the ref rather than closed over
  return useCallback((...args: Args) => held.current?.(...args), deps);
}
