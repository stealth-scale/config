/**
 * Waits for a state machine to settle, and reports a part that draws without the root it needs.
 *
 * @remarks
 *   A component built on a state machine answers two things no plain component does. It schedules
 *   its own update rather than making one during the event, so a case that reads the result back
 *   straight after an interaction reads what was there before. And it hands its parts an api
 *   through a context, so a part drawn on its own has nothing to read and has to say so rather than
 *   draw wrongly in silence.
 */

import { type ComponentType, createElement } from "react";

import { act, render } from "@testing-library/react";

/**
 * Waits for whatever the last interaction started to finish.
 *
 * @remarks
 *   A machine updates on a microtask, so the assertion after `fireEvent` runs first and reads the
 *   state the interaction was meant to change. This flushes it inside `act`, which is also what
 *   keeps React from warning about an update it did not see.
 * @returns Nothing. The caller reads the screen.
 */
export async function settled(): Promise<void> {
  await act(async () => {
    await Promise.resolve();
  });
}

/**
 * Tells whether a throw said what it was expected to.
 */
function matches(thrown: unknown, expected: RegExp | string): boolean {
  const said = thrown instanceof Error ? thrown.message : String(thrown);

  return typeof expected === "string" ? said.includes(expected) : expected.test(said);
}

/**
 * Draws one part on its own and reports what it did.
 */
function drawn(
  name: string,
  Part: ComponentType<never>,
  expected: RegExp | string,
): readonly string[] {
  try {
    render(createElement(Part));
  } catch (error) {
    return matches(error, expected)
      ? []
      : [`${name} throws ${String(error)}, which is not what it says`];
  }

  return [`${name} draws outside the root it needs above it`];
}

/**
 * Reports every part that draws without the root that holds it together.
 *
 * @remarks
 *   A part reads its machine through a context the root provides, so one drawn on its own has no
 *   api. Answering nothing there draws a part with no behaviour and no complaint, and the fault
 *   surfaces somewhere else entirely, so each part is expected to throw where it was written.
 * @param parts - Each part, against the name a violation calls it.
 * @param expected - The words the throw is expected to carry, in full or as a pattern.
 * @returns One violation per part that drew, or threw something else, or an empty array.
 */
export function rootedViolations(
  parts: Readonly<Record<string, ComponentType<never>>>,
  expected: RegExp | string,
): readonly string[] {
  return Object.entries(parts).flatMap(([name, Part]) => drawn(name, Part, expected));
}
