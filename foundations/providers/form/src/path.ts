/**
 * Types the dotted paths into a form's values, and converts between the ways a path is written.
 */

/**
 * Counts the levels a path may still descend, because a recursive template type has to stop.
 */
type Depth = [never, 0, 1, 2, 3];

/**
 * Lists the names of an object's members that a path may read.
 */
type Key<Values> = Extract<keyof Values, string>;

/**
 * Lists the paths under one member, joined to the member's own name.
 */
type Under<Name extends string, Value, Level extends number> = Value extends Date
  ? never
  : Value extends ReadonlyArray<infer Item>
    ? `${Name}[]` | (Item extends object ? `${Name}[].${Path<Item, Level>}` : never)
    : Value extends object
      ? `${Name}.${Path<Value, Level>}`
      : never;

/**
 * Lists every dotted path into a form's values, five levels deep, with `[]` for an array's items.
 *
 * @remarks
 *   `unknown` admits any string, which is what a presentation read from a manifest has. A typed
 *   form refuses a path it does not have at compile time. The data design measured the same
 *   construction at 0.28 s on a 12-field, 3-level type.
 * @typeParam Values - The form's values, or `unknown` for a form without a type.
 * @typeParam Level - How many levels remain. Four below the first, which is five in all.
 */
export type Path<Values, Level extends number = 4> = [Level] extends [never]
  ? never
  : unknown extends Values
    ? string
    : Values extends readonly unknown[]
      ? never
      : Values extends object
        ? { [Name in Key<Values>]: Name | Under<Name, Values[Name], Depth[Level]> }[Key<Values>]
        : never;

/**
 * Types one segment of a path, which is a property's name or an index into an array.
 */
export type Segment = number | string;

/**
 * Matches an index inside brackets, which the form writes and an identifier collapses.
 */
const INDEX = /\[\d+\]/gu;

/**
 * Matches the prefix a JSON pointer opens with, which a path leaves out.
 */
const POINTER_PREFIX = /^#?\/?/u;

/**
 * Matches a pointer segment that is an index.
 */
const DIGITS = /^\d+$/u;

/**
 * Collapses every index in a path to `[]`, so one identifier covers every row.
 *
 * @returns The path with `lines[0].amount` written as `lines[].amount`.
 */
export function collapse(path: string): string {
  return path.replaceAll(INDEX, "[]");
}

/**
 * Splits a JSON pointer the engine reports into the segments of a path.
 *
 * @remarks
 *   A segment that is all digits is an index and becomes a number. `~1` and `~0` are unescaped in
 *   that order, as RFC 6901 requires.
 * @returns The segments, as `["lines", 0, "amount"]` for `#/lines/0/amount`, or none for the root.
 */
export function segmentsOf(pointer: string): readonly Segment[] {
  const segments: Segment[] = [];

  for (const raw of pointer.replace(POINTER_PREFIX, "").split("/")) {
    if (raw === "") continue;

    segments.push(DIGITS.test(raw) ? Number(raw) : raw.replaceAll("~1", "/").replaceAll("~0", "~"));
  }

  return segments;
}
