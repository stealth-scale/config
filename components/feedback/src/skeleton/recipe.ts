/**
 * States what a skeleton is: a box standing in for content that has not arrived, drawn in one of
 * the theme's own motions and revealed once the content does.
 *
 * @remarks
 *   A skeleton wraps the content it stands in for rather than replacing it, so a caller writes one
 *   tree and flips one prop. While it is loading it takes the content's own box and hides
 *   everything inside it, which is what makes the stand-in the size of the thing it stands in for
 *   without anybody stating a width. Once it has loaded it fades the content in and gets out of
 *   the way.
 *   Every motion is an animation style the theme owns, so a reader who asked for less motion is
 *   answered once in the theme rather than in every recipe. Nothing here states a colour, a length
 *   or a duration of its own.
 */

import { cornerVariants, defineRecipe } from "@stealthscale/theme/authoring";

/**
 * Draws a pulsing stand-in at the middle corner until a caller says otherwise.
 */
export const recipe = defineRecipe({
  base: {},
  className: "skeleton",
  defaultVariants: { loading: true, motion: "pulse", radius: "l2" },
  jsx: [/^Skeleton$/u],
  variants: {
    /**
     * Whether the content it stands in for has arrived.
     */
    loading: {
      false: { animationStyle: "fade.in" },
      true: {
        "&::before, &::after, *": { visibility: "hidden" },
        backgroundClip: "padding-box",
        boxShadow: "none",
        color: "transparent",
        flexShrink: "0",
        pointerEvents: "none",
        userSelect: "none",
      },
    },

    /**
     * How it moves while it waits.
     */
    motion: {
      none: { animation: "none" },
      pulse: { animationStyle: "pulse", background: "bg.emphasized" },
      shimmer: {
        animationStyle: "shimmer",
        backgroundImage: "linear-gradient(270deg, {colors.bg.muted}, {colors.bg.emphasized})",
        backgroundSize: "400% 100%",
      },
    },

    radius: cornerVariants(),
  },
});
