/**
 * Turns a human title into the identifier a URL can carry.
 */

/**
 * The character standing in for every run a title cannot keep.
 */
const SEPARATOR = "-";

/**
 * Rewrites a title as lowercase ASCII letters and digits joined by hyphens.
 *
 * @remarks
 *   Only `a-z` and `0-9` survive. An accented letter is not folded onto its
 *   plain form, so `café` slugs to `caf` and `Ökonomie` to `konomie`. A title
 *   holding nothing to keep slugs to the empty string, which is a valid result
 *   and not an error. A caller using the slug as a key has to reject that
 *   string itself, and two titles that differ only in punctuation slug alike.
 * @returns The slug, with no separator at either end.
 */
export function slug(title: string): string {
  return title
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/gu, SEPARATOR)
    .replaceAll(/^-+|-+$/gu, "");
}
