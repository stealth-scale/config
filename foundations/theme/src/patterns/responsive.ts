/**
 * Applies a function to a prop's value, or to every branch of a responsive one.
 *
 * @remarks
 *   A pattern may be given `{ base: 2, md: 4 }` where it expected `2`, and what it computes from
 *   the number has to happen once per breakpoint rather than once on the object.
 */

import type { ConditionalValue } from "#generated/types/system.d.mts";

/**
 * Selects the values a responsive prop can take a branch of.
 */
type Primitive = number | string;

/**
 * Applies a function to a value, or to every branch of a responsive one, and keeps the shape.
 *
 * @remarks
 *   An array branch that is null stays null, because null is how a breakpoint is skipped in the
 *   array form. A key whose value is undefined is dropped.
 * @typeParam Value - The value each branch holds.
 */
export function responsive<Value extends Primitive>(
  value: ConditionalValue<Value>,
  transform: (each: Value) => string,
): ConditionalValue<string> {
  if (Array.isArray(value)) {
    return value.map((each) => (each === null || each === undefined ? null : transform(each)));
  }

  if (typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).flatMap(([condition, each]) =>
        each === undefined ? [] : [[condition, responsive(each, transform)]],
      ),
    );
  }

  return transform(value);
}
