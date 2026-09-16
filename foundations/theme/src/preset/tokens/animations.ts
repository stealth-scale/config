/**
 * Defines the named animations a recipe reads with `animation`, each a keyframe run at a pace.
 *
 * @remarks
 *   Four are the compiler's own, restated here so the vocabulary defines them once. `shimmer` is
 *   this vocabulary's: it sweeps a placeholder's background across it at the slow ambient pace,
 *   which is what a loading state is drawn with.
 */

import { type Tokens } from "#pandacss.ts";

/**
 * Describes the animations a theme states.
 */
type Animations = NonNullable<Tokens["animations"]>;

/**
 * Lists the animations, each naming a keyframe this preset defines.
 */
export const animations: Animations = {
  bounce: { value: "bounce 1s infinite" },
  ping: { value: "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite" },
  pulse: { value: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" },
  shimmer: { value: "bg-position {durations.ambientSlow} linear infinite" },
  spin: { value: "spin 1s linear infinite" },
};
