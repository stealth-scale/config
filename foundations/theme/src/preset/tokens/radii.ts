/**
 * Defines the reference radii, from a square corner to a pill.
 *
 * @remarks
 *   A recipe reads the semantic radii, `l1` to `l3`, which a theme draws from one value so nested
 *   corners stay concentric. The reference scale exists for the corner a recipe fixes regardless
 *   of the theme: a pill is `full` in every theme, and a checkbox's `xs` corner does not grow
 *   with a theme's cards.
 */

import { type Tokens } from "#pandacss.ts";

/**
 * Describes the radii a theme states.
 */
type Radii = NonNullable<Tokens["radii"]>;

/**
 * Lists the radii, from none to a pill.
 */
export const radii: Radii = {
  "2xl": { value: "1rem" },
  "2xs": { value: "0.0625rem" },
  "3xl": { value: "1.5rem" },
  "4xl": { value: "2rem" },
  full: { value: "9999px" },
  lg: { value: "0.5rem" },
  md: { value: "0.375rem" },
  none: { value: "0" },
  sm: { value: "0.25rem" },
  xl: { value: "0.75rem" },
  xs: { value: "0.125rem" },
};
