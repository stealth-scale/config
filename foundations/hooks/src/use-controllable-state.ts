/**
 * Holds state the caller may control, and holds it internally where the caller does not.
 */

import { useCallback, useState } from "react";

import { useCallbackRef } from "#use-callback-ref.ts";

/**
 * Describes what {@link useControllableState} takes.
 *
 * @typeParam Held - The value that is held.
 */
export interface UseControllableStateProps<Held> {
  /**
   * The value held until the caller sets one, for the uncontrolled case.
   */
  defaultValue?: Held | undefined;

  /**
   * Called whenever the value changes, controlled or not, so a caller that controls the value
   * receives what to set it to and one that does not can still track it.
   */
  onChange?: ((value: Held) => void) | undefined;

  /**
   * The value, where the caller controls it. Passing this is what makes the state controlled, so a
   * caller that passes `undefined` controls nothing.
   */
  value?: Held | undefined;
}

/**
 * Returns the value and a setter, and takes the value from the caller when the caller passes one.
 *
 * @remarks
 *   A component takes both `value` and `defaultValue` so that one component serves a caller that
 *   sets the value and a caller that leaves the component to hold it. The hook re-reads `value` on
 *   every render rather than once, so a caller that starts setting it partway through takes over
 *   from that render. The setter takes a value or a function of the current one, as React's own
 *   does, and calls `onChange` either way. A set to the value already held is dropped, so a caller
 *   listening for changes receives only changes.
 *   The React Compiler is disabled for this function. It refuses any function whose hook rules were
 *   suppressed, and the setter below suppresses one so that a stable callback is not listed as a
 *   dependency. The hook memoises by hand instead, which a consumer without the compiler needs
 *   anyway.
 * @typeParam Held - The value that is held.
 * @param props - The value, the default, and the callback run on every change.
 * @returns The value, and the function that sets it.
 */
export function useControllableState<Held>(
  props: UseControllableStateProps<Held>,
): [Held, (next: ((previous: Held) => Held) | Held) => void] {
  "use no memo";

  const { defaultValue, onChange, value: stated } = props;

  const told = useCallbackRef(onChange);

  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- an uncontrolled caller that states no default holds `undefined`, which is a value of `Held` as far as that caller is concerned
  const [held, setHeld] = useState<Held>(defaultValue as Held);

  const owned = stated !== undefined;
  const value = owned ? stated : held;

  const setValue = useCallback(
    (next: ((previous: Held) => Held) | Held): void => {
      // eslint-disable-next-line typescript/no-unsafe-type-assertion -- an updater is the one kind of value this calls rather than stores, and nothing but the type distinguishes the two
      const settled = typeof next === "function" ? (next as (previous: Held) => Held)(value) : next;

      if (settled === value) return;

      if (!owned) setHeld(settled);

      told(settled);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps -- useCallbackRef holds one identity for the life of the component, so listing it here adds a dependency that never changes
    [owned, value],
  );

  return [value, setValue];
}
