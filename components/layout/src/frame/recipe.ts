/**
 * States what a frame is: a box of a fixed shape that holds a picture, a video or a map, clipped
 * to its corners.
 *
 * @remarks
 *   The shapes and the corners are the theme's, so a theme that states a ratio reaches every frame
 *   through it and a component adds nothing to the vocabulary. Whatever the frame holds is drawn
 *   at the frame's own size, so a picture of any dimensions fills the shape rather than setting
 *   it, and the fit axis decides whether the picture is cropped to fill or held whole inside it.
 */

import { cornerVariants, defineRecipe, ratioVariants } from "@stealthscale/theme/authoring";

/**
 * Draws a square frame that crops what it holds until a caller says otherwise.
 */
export const recipe = defineRecipe({
  base: {
    "& > *": { blockSize: "100%", inlineSize: "100%" },
    display: "block",
    overflow: "hidden",
    position: "relative",
  },
  className: "frame",
  defaultVariants: { fit: "cover", ratio: "square" },
  jsx: [/^Frame$/u],
  variants: {
    fit: {
      contain: { "& > *": { objectFit: "contain" } },
      cover: { "& > *": { objectFit: "cover" } },
    },
    radius: cornerVariants(),
    ratio: ratioVariants(),
  },
});
