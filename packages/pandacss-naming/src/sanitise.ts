/**
 * Rewrites one segment of a class name into the readable form of the scheme.
 *
 * @remarks
 *   The compiler writes a token reference, a function call and a space into a class name as the
 *   author typed them, with a space as `_`. A stylesheet escapes each of those characters and a
 *   person reads past them. The scheme keeps a letter, a digit, a hyphen, `%`, `/` and `!`, keeps
 *   the two underscores between a recipe and its slot, and replaces every other character with one
 *   hyphen. A value with two spaces in a row reaches the sanitiser as two underscores and keeps
 *   them the same way. The same function runs in the browser and on the stylesheet, so the two
 *   sides agree by construction, and the stylesheet rewrite reports a clash between two classes.
 */

/**
 * Separates a recipe's class from its slot's, and is the one underscore run the scheme keeps.
 */
const SLOT = "__";

/**
 * Matches a run of replaced characters together with the hyphens on either side of it.
 *
 * @remarks
 *   The hyphens merge into the run, so `ar-{sizes.32}` reads `ar-sizes-32` and `calc(100%_-_2rem)`
 *   reads `calc-100%-2rem`. A run of hyphens on its own is not matched, so the compiler's `m--4`
 *   for a negative value and the scheme's own `button--lg` are kept.
 */
const RUN = /-*(?:[^\p{L}\p{N}%/!-]+-*)+/gu;

/**
 * Matches the hyphen a run leaves at the end of a segment, before an importance mark.
 */
const TRAILING = /-+(?=!*$)/u;

/**
 * Matches the boundary between a lower-case letter or a digit and a capital letter.
 */
const CAMEL = /(?<=[a-z0-9])(?=[A-Z])/gu;

/**
 * Rewrites a camel-case name in kebab-case.
 */
export function kebab(name: string): string {
  return name.replaceAll(CAMEL, "-").toLowerCase();
}

/**
 * Replaces every character of a segment that a stylesheet would escape, and collapses each run of
 * them into one hyphen.
 */
export function sanitise(segment: string): string {
  return segment
    .split(SLOT)
    .map((part) => part.replaceAll(RUN, "-"))
    .join(SLOT)
    .replace(TRAILING, "");
}
