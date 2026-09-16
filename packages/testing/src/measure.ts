/**
 * Reads geometry off a rendered element.
 *
 * A specification asserts the position a reader sees rather than the class name that produced it.
 */

/**
 * Describes the box a measurement reads: the two inline edges of a rendered element.
 */
export interface Box {
  /**
   * The distance from the viewport's left edge to the element's left edge, in pixels.
   */
  left: number;

  /**
   * The distance from the viewport's left edge to the element's right edge, in pixels.
   */
  right: number;
}

/**
 * A measurement needs only an element's box.
 *
 * Structural rather than `Element` for two reasons. This package compiles without the DOM library,
 * and a specification supplies the boxes it is measuring rather than laying out a document, which
 * jsdom measures as zero. A real element satisfies it because `DOMRect` has both edges.
 */
export interface Measured {
  /**
   * Reads the element's box.
   *
   * @returns The box the element currently occupies.
   */
  getBoundingClientRect: () => Box;
}

/**
 * Reads a CSS length as a number.
 *
 * `getComputedStyle` returns `px` strings. A comparison against `NaN` is false rather than an
 * error, so a measurement that failed to parse would pass having measured nothing. A length with no
 * number in it returns `0` instead.
 *
 * @param length - A computed length, with its unit.
 * @returns The number in front of the unit. `0` for a length with no number.
 */
export function pixels(length: string): number {
  // eslint-disable-next-line unicorn/prefer-number-coercion -- `Number('16px')` is NaN
  const value = Number.parseFloat(length);
  return Number.isNaN(value) ? 0 : value;
}

/**
 * Measures the inline distance between two elements.
 *
 * Zero means the two are flush, which a segmented control requires. Measuring the boxes reports a
 * disagreement between the rounding and the border that a class name would hide.
 *
 * @param first - The left-hand element in a row.
 * @param second - The element after it.
 * @returns The gap between them, in pixels. Never negative.
 */
export function seamBetween(first: Measured, second: Measured): number {
  return Math.abs(second.getBoundingClientRect().left - first.getBoundingClientRect().right);
}
