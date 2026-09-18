/**
 * Makes a context a reader has to be inside, and the hook that reads it.
 *
 * @remarks
 *   A component drawn in parts hands its parts something they all need, and a part drawn outside
 *   its root has nothing to read. React answers that with the default value, so the part draws
 *   wrongly and says nothing, and the fault surfaces somewhere else entirely. This throws where the
 *   part was written instead, and names the component so the message says which root is missing.
 */

import { createContext, createElement, type FunctionComponent, type ReactNode, use } from "react";

/**
 * Describes what a provider takes: the value every reader below it gets.
 *
 * @typeParam Held - The value the context carries.
 */
export interface ProvidedProps<Held> {
  /**
   * The tree that reads the value.
   */
  readonly children?: ReactNode | undefined;

  /**
   * The value itself.
   */
  readonly value: Held;
}

/**
 * Makes a context whose reader throws where no provider stands above it.
 *
 * @typeParam Held - The value the context carries.
 * @param name - The component the context belongs to, which the error names.
 * @returns The provider, and the hook that reads what it holds.
 */
export function createRequiredContext<Held>(
  name: string,
): readonly [provider: FunctionComponent<ProvidedProps<Held>>, use: () => Held] {
  const Carried = createContext<Held | undefined>(undefined);

  /**
   * Hands the value to everything below it.
   *
   * @param props - The value and the tree that reads it.
   * @returns The tree, under the context.
   */
  function Provider({ children, value }: ProvidedProps<Held>): ReactNode {
    return createElement(Carried, { value }, children);
  }

  /**
   * Reads what the provider above holds.
   *
   * @returns The value.
   * @throws {@link Error} Where no provider stands above the reader.
   */
  function useHeld(): Held {
    const held = use(Carried);

    if (held === undefined) {
      throw new Error(`A part of ${name} was drawn outside the root that holds it together.`);
    }

    return held;
  }

  return [Provider, useHeld];
}
