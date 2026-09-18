/**
 * Makes a context a reader has to be inside, and the hook that reads it.
 *
 * @remarks
 *   A component drawn in parts hands its parts something they all need, and a part drawn outside
 *   its root has nothing to read. React returns the default value, so the part draws wrongly,
 *   reports nothing, and fails somewhere else. This throws where the part was written instead, and
 *   names the component so the message says which root is missing. A second hook returns undefined
 *   rather than throwing, for a root that nests inside another of its own kind and has to find out
 *   whether one stands above it.
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
 * @returns The provider, the hook that reads what it holds, and the hook that reads it where a
 *   provider may be absent.
 */
export function createRequiredContext<Held>(
  name: string,
): readonly [
  provider: FunctionComponent<ProvidedProps<Held>>,
  use: () => Held,
  useOptional: () => Held | undefined,
] {
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

  /**
   * Reads what the provider above holds, where there may be no provider above.
   *
   * @remarks
   *   A root that nests inside another of its own kind reads this to find the root it sits in, and
   *   gets undefined at the top level. A part reads the throwing hook instead, because a part
   *   outside its root is a mistake rather than a case.
   * @returns The value, or undefined where no provider stands above the reader.
   */
  function useOptionalHeld(): Held | undefined {
    return use(Carried);
  }

  return [Provider, useHeld, useOptionalHeld];
}
