/**
 * Defines the breakpoints the compiler builds its responsive conditions and its container sizes
 * from.
 *
 * @remarks
 *   Written here as data rather than taken from the compiler's own preset, so the vocabulary
 *   defines each breakpoint once and a theme package has a file to move them in. The values are
 *   the compiler's defaults, measured from `@pandacss/preset-panda` at 2.0.0-beta.17.
 */

/**
 * Lists the breakpoints, narrowest first.
 *
 * @remarks
 *   Stated in rem rather than pixels, so a reader who enlarges the text crosses a breakpoint at
 *   the same number of characters per line. A screen component folds on a measured attribute and
 *   never on one of these; they exist for page layout.
 */
export const breakpoints: Readonly<Record<string, string>> = {
  "2xl": "96rem",
  lg: "64rem",
  md: "48rem",
  sm: "40rem",
  xl: "80rem",
};
