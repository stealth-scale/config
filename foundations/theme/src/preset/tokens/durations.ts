/**
 * Defines how long a motion takes.
 *
 * @remarks
 *   A motion in answer to a press runs from `fastest` to `slowest`, under half a second, because
 *   a reader connects motion under a second to something they did. The two ambient paces are for
 *   a loop that runs on its own, such as a placeholder breathing while it waits, and they are
 *   slower than any answer for the same reason. `none` is no time at all, so turning a motion off
 *   is a step of the scale rather than a nought written into a recipe.
 */

import { type Tokens } from "#pandacss.ts";

/**
 * Describes the durations a theme states.
 */
type Durations = NonNullable<Tokens["durations"]>;

/**
 * Lists the durations, from none to the slow ambient loop.
 */
export const durations: Durations = {
  ambient: { value: "1.2s" },
  ambientSlow: { value: "5s" },
  fast: { value: "150ms" },
  faster: { value: "100ms" },
  fastest: { value: "50ms" },
  moderate: { value: "200ms" },
  none: { value: "0s" },
  slow: { value: "300ms" },
  slower: { value: "400ms" },
  slowest: { value: "500ms" },
};
