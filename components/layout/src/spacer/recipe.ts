/**
 * States what a spacer is: the room left over in a stack, taken by an element that draws nothing.
 *
 * @remarks
 *   A spacer states no size of its own. It grows into whatever a stack has not given its other
 *   children, which is how a row puts one thing at each end without stating a width for either.
 *   The recipe states no axis, because there is nothing about empty room a caller picks.
 */

import { defineRecipe } from "@stealthscale/theme/authoring";

/**
 * Takes the room a stack has left over.
 */
export const recipe = defineRecipe({
  base: { alignSelf: "stretch", flexBasis: "0", flexGrow: "1", justifySelf: "stretch" },
  className: "spacer",
  jsx: [/^Spacer$/u],
});
