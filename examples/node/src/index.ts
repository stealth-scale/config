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
  if (names.length < 2) return names[0] ?? "";

  return `${names.slice(0, -1).join(", ")} and ${names.at(-1) ?? ""}`;
}
