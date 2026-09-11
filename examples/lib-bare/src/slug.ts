/**
 * Turning a title into something that can go in a URL.
 */

/**
 * What separates the words in a slug.
 */
const SEPARATOR = "-";

/**
 * Turns a title into a slug.
 *
 * Lower case, with every run of anything that is not a letter or a digit collapsed into one
 * separator, and no separator at either end.
 *
 * @param title - The text to turn into one.
 * @returns The slug, which is empty where the title held nothing to keep.
 */
export function slug(title: string): string {
  return title
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/gu, SEPARATOR)
    .replaceAll(/^-+|-+$/gu, "");
}
