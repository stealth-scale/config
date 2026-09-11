/**
 * What this library exports.
 */

/**
 * Joins names the way a sentence does.
 *
 * @param names - The names to join.
 * @returns The names as a phrase, or an empty string where there are none.
 */
export function listed(names: readonly string[]): string {
  const last = names.at(-1);

  if (last === undefined) return "";
  if (names.length === 1) return last;

  return `${names.slice(0, -1).join(", ")} and ${last}`;
}
