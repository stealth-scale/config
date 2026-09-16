/**
 * Reads geometry out of a CSS length and off a laid-out element.
 *
 * @remarks
 *   A jsdom element reports every rectangle as zero, so a spec running there measures a stub of its
 *   own rather than the element it rendered. Only a browser run gives real numbers.
 */

/**
 * The horizontal edges of a rectangle, in CSS pixels.
 *
 * @remarks
 *   A DOMRect satisfies this and is accepted unchanged. The vertical edges are absent because
 *   nothing here reads them, not because an element lacks them.
 */
export interface Box {
  /**
   * Where the rectangle begins, measured from the left of the viewport.
   */
  left: number;

  /**
   * Where the rectangle ends, measured from the left of the viewport.
   */
  right: number;
}

/**
 * Reports the rectangle it occupies when asked for one.
 *
 * @remarks
 *   The shape is structural, so a DOM element satisfies it without a cast and a plain object with
 *   two fixed numbers stands in for one in a spec.
 */
export interface Measured {
  /**
   * Returns the rectangle the thing occupies at the moment of the call.
   */
  getBoundingClientRect: () => Box;
}

/**
 * Reads the number in front of a CSS unit, and returns 0 where there is no number to read.
 *
 * @remarks
 *   Reading stops at the first character that cannot continue a number, so `16px` gives 16 and
 *   `auto` gives 0. A caller cannot tell a measured zero from a length this failed to read.
 */
export function pixels(length: string): number {
  // eslint-disable-next-line unicorn/prefer-number-coercion -- `Number('16px')` is NaN
  const value = Number.parseFloat(length);
  return Number.isNaN(value) ? 0 : value;
}

/**
 * Measures how far the second element's left edge sits from the first element's right edge.
 *
 * @remarks
 *   The distance carries no sign. Two elements overlapping by 8 pixels and two separated by 8
 *   pixels both measure 8, so a caller that has to know which of the two it has compares the edges
 *   itself.
 * @returns The distance in CSS pixels, and 0 when the two elements share an edge.
 */
export function seamBetween(first: Measured, second: Measured): number {
  return Math.abs(second.getBoundingClientRect().left - first.getBoundingClientRect().right);
}
