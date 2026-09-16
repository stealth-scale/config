/**
 * Defines the container sizes a container query names.
 *
 * @remarks
 *   Written here as data rather than taken from the compiler's own preset, for the same reason
 *   as the breakpoints: the vocabulary defines each size once and a theme has a file to move
 *   them in. The values are the compiler's defaults, measured from `@pandacss/preset-panda` at
 *   2.0.0-beta.17.
 */

/**
 * Lists the container sizes, narrowest first.
 *
 * @remarks
 *   The ladder runs from `3xs` at 16rem to `8xl` at 90rem in steps a panel is likely to be given,
 *   and a component that folds at one of them reads the size by name in a `@container` condition.
 */
export const containers: Readonly<Record<string, string>> = {
  "2xl": "42rem",
  "2xs": "18rem",
  "3xl": "48rem",
  "3xs": "16rem",
  "4xl": "56rem",
  "5xl": "64rem",
  "6xl": "72rem",
  "7xl": "80rem",
  "8xl": "90rem",
  lg: "32rem",
  md: "28rem",
  sm: "24rem",
  xl: "36rem",
  xs: "20rem",
};
