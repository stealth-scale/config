/**
 * Defines the styles a span element is drawn with.
 *
 * @remarks
 *   The base is empty and there is no size axis, which is what separates a span from a paragraph
 *   drawn as one. `Text` defaults `size` to `md`, so a `Text` with `as="span"` inside a heading
 *   resets the run to body size. A span states nothing and inherits the line it sits in, and every
 *   axis here is off until a caller picks it.
 *   The truncate value sets `display` beside the three properties the helper writes. `overflow`
 *   has no effect on a non-replaced inline box, so a span cut to one line has to become an
 *   inline-block first.
 */

import {
  defineRecipe,
  motionVariants,
  toneVariants,
  truncate,
  weightVariants,
} from "@stealthscale/theme/authoring";

/**
 * Draws a run of words in the ink, the weight and the size of the line around it.
 */
export const recipe = defineRecipe({
  className: "span",
  jsx: [/Span$/u],
  variants: {
    motion: motionVariants(["fade", "rise", "reveal"]),
    tone: toneVariants(),

    /**
     * Cuts the run to one line and ends it with an ellipsis.
     */
    truncate: { true: { ...truncate(), display: "inline-block", maxWidth: "full" } },

    weight: weightVariants(),
  },
});
