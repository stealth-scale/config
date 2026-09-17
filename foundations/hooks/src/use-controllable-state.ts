/**
 * Holds state the caller may own, and holds it internally where the caller does not.
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
   * Told whenever the value changes, controlled or not, so a caller that owns the value learns
   * what to set it to and one that does not can still follow along.
   */
  onChange?: ((value: Held) => void) | undefined;

  /**
   * The value, where the caller owns it. Stating this at all is what makes the state controlled,
   * so a caller that passes `undefined` owns nothing.
   */
  value?: Held | undefined;
}

/**
 * Returns the value and a setter, taking the value from the caller where the caller states one.
 *
 * @remarks
 *   A component takes both `value` and `defaultValue` so that one component serves a caller that
 *   drives it and a caller that wants it to look after itself. Which of the two is in force is
 *   decided on every render rather than once, so a caller that starts driving partway through is
 *   followed. The setter takes a value or a function of the current one, as React's own does, and
 *   tells `onChange` either way. Setting the value it already holds is passed over, so a caller
 *   listening for changes hears about changes.
 * @typeParam Held - The value that is held.
 * @param props - The value, the default and what to tell.
 * @returns The value, and the function that sets it.
 */
export function useControllableState<Held>(
  props: UseControllableStateProps<Held>,
): [Held, (next: ((previous: Held) => Held) | Held) => void] {
  const { defaultValue, onChange, value: stated } = props;

  const told = useCallbackRef(onChange);

  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- an uncontrolled caller that states no default holds `undefined`, which is a value of `Held` as far as that caller is concerned
  const [held, setHeld] = useState<Held>(defaultValue as Held);

  const owned = stated !== undefined;
  const value = owned ? stated : held;

  const setValue = useCallback(
    (next: ((previous: Held) => Held) | Held): void => {
      // eslint-disable-next-line typescript/no-unsafe-type-assertion -- an updater is the one kind of value this calls rather than stores, and the two are told apart by nothing but their type
      const settled = typeof next === "function" ? (next as (previous: Held) => Held)(value) : next;

      if (settled === value) return;

      if (!owned) setHeld(settled);

      told(settled);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps -- useCallbackRef holds one identity for the life of the component, so naming it here adds a dependency that never changes
    [owned, value],
  );

  return [value, setValue];
}
