/**
 * Defines the motions a recipe reads by name: how a thing enters and leaves, and the loops that
 * run while nothing is pressed.
 *
 * @remarks
 *   Every motion names a keyframe, a pace from the duration tokens and a curve from the easing
 *   tokens, so a theme moves the whole set by moving three tokens. An entering motion eases out at
 *   the moderate pace and a leaving one eases in at the fast pace, because a thing arriving is
 *   watched and a thing going is not. Every motion is turned off for a reader who asked for less.
 */

import { type AnimationStyle, type AnimationStyles } from "#pandacss.ts";

/**
 * Describes one motion as the compiler reads it.
 */
type Motion = Record<"value", AnimationStyle>;

/**
 * Lists each placement against the side the anchored element sits on.
 */
const SLIDES: ReadonlyArray<readonly [placement: string, anchored: string]> = [
  ["top", "bottom"],
  ["bottom", "top"],
  ["left", "right"],
  ["right", "left"],
];

/**
 * Writes one motion that runs once.
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
 * Writes one motion that runs until the element goes.
 */
function loop(name: string, pace: string, curve: string): Motion {
  const { value } = motion(name, pace, curve);

  return { value: { ...value, animationIterationCount: "infinite" } };
}

/**
 * Writes a slide that reads the side to move from off the placement a floating element states.
 */
function slide(direction: "from" | "to", fade: string, pace: string, curve: string): Motion {
  const { value } = motion(`slide-${direction}-top, ${fade}`, pace, curve);

  return {
    value: {
      ...value,
      ...Object.fromEntries(
        SLIDES.map(([placement, anchored]) => [
          `&[data-placement^=${placement}]`,
          { animationName: `slide-${direction}-${anchored}, ${fade}` },
        ]),
      ),
      transformOrigin: "var(--transform-origin)",
    },
  };
}

/**
 * Writes one motion the scroll position drives rather than the clock.
 *
 * @remarks
 *   The timeline is the scroll of the nearest scroller or the element's own passage through the
 *   viewport, so the motion runs forward as the reader scrolls down and back as they scroll up. A
 *   browser without scroll-driven animations leaves the element at rest.
 */
function scrolled(name: string, timeline: string, more: AnimationStyle): Motion {
  return {
    value: {
      _motionReduce: { animation: "none" },
      animationName: name,
      animationTimeline: timeline,
      animationTimingFunction: "linear",
      ...more,
    },
  };
}

/**
 * Lists the motions: the entering and leaving pairs, the loops, and the scrolled ones.
 */
export const animationStyles: AnimationStyles = {
  aurora: loop("bg-drift", "ambientSlower", "in-out"),
  collapse: {
    in: motion("expand-height, fade-in", "moderate", "out"),
    out: motion("collapse-height, fade-out", "fast", "in"),
  },
  fade: {
    in: motion("fade-in", "moderate", "out"),
    out: motion("fade-out", "fast", "in"),
  },
  float: loop("float", "ambientSlow", "in-out"),
  marquee: loop("marquee", "ambientSlower", "linear"),
  meteor: {
    value: {
      ...loop("meteor", "ambientSlow", "linear").value,
      animationDelay: "calc(-1 * var(--stagger, 0) * {durations.ambient})",
    },
  },
  parallax: scrolled("parallax", "scroll()", {}),
  progress: scrolled("progress", "scroll()", { transformOrigin: "left" }),
  pulse: loop("pulse", "ambient", "in-out"),
  "pulse-glow": {
    value: { ...loop("pulse-glow", "ambient", "in-out").value, animationDirection: "alternate" },
  },
  reveal: scrolled("rise", "view()", {
    animationFillMode: "both",
    animationRange: "entry 0% cover 30%",
    animationTimingFunction: "out",
  }),
  rise: {
    value: {
      ...motion("rise", "slower", "out").value,
      animationDelay: "calc(var(--stagger, 0) * {durations.faster})",
      animationFillMode: "both",
    },
  },
  "scale-fade": {
    in: motion("scale-in, fade-in", "moderate", "out"),
    out: motion("scale-out, fade-out", "fast", "in"),
  },
  shimmer: loop("bg-position", "ambientSlow", "linear"),
  "slide-fade": {
    in: slide("from", "fade-in", "moderate", "out"),
    out: slide("to", "fade-out", "fast", "in"),
  },
  spin: loop("spin", "ambient", "linear"),
  sweep: loop("rotate-angle", "ambientSlow", "linear"),
  twinkle: {
    value: {
      ...loop("twinkle", "ambient", "in-out").value,
      animationDelay: "calc(var(--stagger, 0) * {durations.slowest})",
      animationDirection: "alternate",
    },
  },
};
