/**
 * Defines the curves a motion runs on.
 *
 * @remarks
 *   The three names are the compiler's, kept because a recipe author already knows them.
 *   `in-smooth` is added from Chakra for a panel that settles rather than stops, and `linear` is
 *   there so a loop that must not ease, such as a spinner, names a step of the scale.
 */

import { type Tokens } from "#pandacss.ts";

/**
 * Describes the easings a theme states.
 */
type Easings = NonNullable<Tokens["easings"]>;

/**
 * Lists the easings.
 */
export const easings: Easings = {
  in: { value: "cubic-bezier(0.4, 0, 1, 1)" },
  "in-out": { value: "cubic-bezier(0.4, 0, 0.2, 1)" },
  "in-smooth": { value: "cubic-bezier(0.32, 0.72, 0, 1)" },
  linear: { value: "linear" },
  out: { value: "cubic-bezier(0, 0, 0.2, 1)" },
};
