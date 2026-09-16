/**
 * Defines the animation styles: the motions a recipe names with `animationStyle` when a thing
 * opens, closes or waits.
 *
 * @remarks
 *   Each motion states its keyframes, its pace and its curve, and turns itself off for a reader
 *   who asked for less motion. The slide reads the placement its machine stamps, so a popover
 *   slides in from the side its anchor is on without the recipe knowing which side that is.
 */

import { type AnimationStyle, type AnimationStyles } from "#pandacss.ts";

/**
 * Describes one motion as the compiler reads it.
 */
type Motion = Record<"value", AnimationStyle>;

/**
 * Lists the sides a placement can start with against the side a panel slides in from.
 */
const SLIDES: ReadonlyArray<readonly [placement: string, from: string]> = [
  ["top", "bottom"],
  ["bottom", "top"],
  ["left", "right"],
  ["right", "left"],
];

/**
 * Writes one motion: its keyframes at a pace and a curve, off under reduced motion.
 */
function motion(name: string, pace: string, curve: string): Motion {
  return {
    value: {
      _motionReduce: { animation: "none" },
      animationDuration: pace,
      animationName: name,
      animationTimingFunction: curve,
    },
  };
}

/**
 * Writes a slide that reads the placement its machine stamps.
 *
 * @param direction - Whether the panel slides in or out, which decides the keyframe name.
 */
function slide(direction: "from" | "to", fade: string, pace: string, curve: string): Motion {
  const { value } = motion(`slide-${direction}-top, ${fade}`, pace, curve);

  return {
    value: {
      ...value,
      ...Object.fromEntries(
        SLIDES.map(([placement, from]) => [
          `&[data-placement^=${placement}]`,
          {
            animationName: `slide-${direction}-${direction === "from" ? from : placement}, ${fade}`,
          },
        ]),
      ),
      transformOrigin: "var(--transform-origin)",
    },
  };
}

/**
 * Lists the motions: an entering and a leaving form of each, and the ambient shimmer.
 */
export const animationStyles: AnimationStyles = {
  collapse: {
    in: motion("expand-height, fade-in", "moderate", "out"),
    out: motion("collapse-height, fade-out", "fast", "in"),
  },
  fade: {
    in: motion("fade-in", "moderate", "out"),
    out: motion("fade-out", "fast", "in"),
  },
  "scale-fade": {
    in: motion("scale-in, fade-in", "moderate", "out"),
    out: motion("scale-out, fade-out", "fast", "in"),
  },
  shimmer: {
    value: {
      _motionReduce: { animation: "none" },
      animationDuration: "ambientSlow",
      animationIterationCount: "infinite",
      animationName: "bg-position",
      animationTimingFunction: "linear",
    },
  },
  "slide-fade": {
    in: slide("from", "fade-in", "moderate", "out"),
    out: slide("to", "fade-out", "fast", "in"),
  },
};
