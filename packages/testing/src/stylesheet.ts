/**
 * Reads a declaration out of a compiled stylesheet.
 *
 * @remarks
 *   A specification that drives a style compiler gets one string back, and what it wants to know
 *   is what a named selector declares a property as. Parsing the whole sheet to answer that would
 *   put a CSS parser in the test tier, so this matches the rule the selector opens and reads the
 *   property out of it. A compiler writes a selector list where several selectors share a rule, so
 *   a selector is found wherever it sits in the list.
 */

/**
 * Lists every character a regular expression reads as syntax.
 */
const SYNTAX = /[$()*+.?[\\\]^{|}]/gu;

/**
 * Writes a selector as a pattern that matches it literally.
 */
function literal(selector: string): string {
  return selector.replaceAll(SYNTAX, String.raw`\$&`);
}

/**
 * Reads what one selector declares a property as, or nothing where it declares it nowhere.
 *
 * @param css - The compiled stylesheet.
 * @param selector - The selector, as the compiler wrote it, including its spacing.
 * @param property - The property, which may be a custom property.
 * @returns The value with its surrounding space removed, or undefined.
 */
export function declared(css: string, selector: string, property: string): string | undefined {
  const pattern = new RegExp(
    `(?:^|[\\n,{}])\\s*${literal(selector)}\\s*(?:,[^{}]*)?\\{[^{}]*?${literal(property)}:\\s*([^;}]+)`,
    "u",
  );

  return pattern.exec(css)?.[1]?.trim();
}
