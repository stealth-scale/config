/**
 * Writes a width as CSS reads one, against the size scale where it is a name.
 */

/**
 * Matches a value that already carries a unit, a custom property or a function, which is read as
 * it stands.
 */
const LENGTH =
  /^(?:[+-]?\d*\.?\d+(?:e[+-]?\d+)?[a-z%]+|var\(--.+\)|(?:min|max|clamp|calc)\(.*\))$/iu;

/**
 * Writes a width as CSS reads one: a length as it stands, and a name as the size token it names,
 * with the name itself as the fallback.
 */
export function sized(width: string): string {
  return LENGTH.test(width) ? width : `token(sizes.${width}, ${width})`;
}
