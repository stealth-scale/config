/**
 * Holds a ref pointing at the value the latest render was given.
 */

import { type RefObject, useRef } from "react";

/**
 * Points a ref at the value this render was given, and returns the ref.
 *
 * @remarks
 *   The write happens during the render rather than in an effect, so a reader that runs before the
 *   effects do still sees this render's value. Nothing here is read during the render, so no
 *   update is skipped. Use it for a callback or an effect that has to read the current value
 *   without naming it as a dependency, such as a resize handler that would otherwise detach and
 *   reattach its observer on every render.
 *   The React Compiler is told to leave this alone. Writing a ref during the render is what the
 *   hook is for, and the compiler refuses any function that does it. Without the directive it
 *   raises the refusal as an error and fails the build of every package that carries this.
 * @typeParam Held - The value that is held.
 * @returns The ref, pointing at the value this render was given.
 */
export function useLiveRef<Held>(value: Held): RefObject<Held> {
  "use no memo";

  const held = useRef(value);

  // eslint-disable-next-line react/refs -- writing during the render is the whole of the hook, because a reader that runs before the effects do has to see this render's value
  held.current = value;

  return held;
}
