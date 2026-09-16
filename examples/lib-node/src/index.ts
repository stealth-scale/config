/**
 * A library built for Node, whose configuration is the part worth reading.
 *
 * @remarks
 *   The one function here is deliberately small. The Node preset beside it
 *   decides the target, the externals and the output format, and this file
 *   exists to give that preset something to build.
 * @packageDocumentation
 */

/**
 * Joins names into the phrase an English sentence would use.
 *
 * @remarks
 *   The last pair is joined with `and` and every earlier pair with a comma, so
 *   three names read `Ada, Grace and Barbara`. No comma precedes the `and`. An
 *   empty list gives back the empty string, which a caller writing a sentence
 *   around the result has to notice.
 */
export function listed(names: readonly string[]): string {
  const last = names.at(-1);

  if (last === undefined) return "";
  if (names.length === 1) return last;

  return `${names.slice(0, -1).join(", ")} and ${last}`;
}
