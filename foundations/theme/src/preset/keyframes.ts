/**
 * Defines the keyframes a motion runs: fades, scales, the height and width of a panel that
 * expands, the sixteen slides, and the four loops.
 *
 * @remarks
 *   A panel's expansion reads its size from a custom property its machine measures, and a slide
 *   reads its distance from one a recipe sets, so the movement is written once and the numbers
 *   stay with the thing that moves.
 */

import { type CssKeyframes } from "#pandacss.ts";
import { slides } from "#scales/motion.ts";

/**
 * Lists the keyframes.
 */
export const keyframes: CssKeyframes = {
  "bg-position": {
    from: { backgroundPosition: "var(--animate-from, 200%) 0" },
    to: { backgroundPosition: "var(--animate-to, -200%) 0" },
  },
  bounce: {
    "0%, 100%": {
      animationTimingFunction: "cubic-bezier(0.8, 0, 1, 1)",
      transform: "translateY(-25%)",
    },
    "50%": { animationTimingFunction: "cubic-bezier(0, 0, 0.2, 1)", transform: "none" },
  },
  "collapse-height": {
    from: { height: "var(--height)" },
    to: { height: "var(--collapsed-height, 0)" },
  },
  "collapse-width": {
    from: { width: "var(--width)" },
    to: { width: "var(--collapsed-width, 0)" },
  },
  "expand-height": {
    from: { height: "var(--collapsed-height, 0)" },
    to: { height: "var(--height)" },
  },
  "expand-width": {
    from: { width: "var(--collapsed-width, 0)" },
    to: { width: "var(--width)" },
  },
  "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
  "fade-out": { from: { opacity: "1" }, to: { opacity: "0" } },
  ping: { "75%, 100%": { opacity: "0", transform: "scale(2)" } },
  pulse: { "0%, 100%": { opacity: "1" }, "50%": { opacity: "0.5" } },
  "scale-in": {
    from: { opacity: "0", transform: "scale(0.96)" },
    to: { opacity: "1", transform: "scale(1)" },
  },
  "scale-out": {
    from: { opacity: "1", transform: "scale(1)" },
    to: { opacity: "0", transform: "scale(0.96)" },
  },
  spin: { from: { transform: "rotate(0deg)" }, to: { transform: "rotate(360deg)" } },
  ...slides(),
};
