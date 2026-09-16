/**
 * Builds a record from a list of keys, typed by the list rather than as a string index.
 *
 * @remarks
 *   `Object.fromEntries` types its result with a string index, and a string index is not
 *   assignable to a record that requires every key of a list. One assertion here, made where the
 *   keys are the list, saves one at every call.
 */

/**
 * Builds a record with one entry per key, each filled by the callback.
 *
 * @typeParam Key - The keys the record carries.
 * @typeParam Value - The value under each key.
 */
export function recordOf<Key extends string, Value>(
  keys: readonly Key[],
  fill: (key: Key) => Value,
): Record<Key, Value> {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- built from every key in the list, so it carries every key
  return Object.fromEntries(keys.map((key) => [key, fill(key)])) as Record<Key, Value>;
}
