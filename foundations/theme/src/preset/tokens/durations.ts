/**
 * Defines how long a motion takes: seven paces for an answer to a press, and three for a loop
 * that runs while nothing is pressed.
 *
 * @remarks
 *   Every answer to a press stays under half a second, because a control that takes longer reads
 *   as slow. The ambient paces are for a loop the reader watches rather than waits for: a pulse,
 *   a shimmer, a drift across a backdrop.
 */

import { type Tokens } from "#pandacss.ts";

/**
 * Describes the durations a theme states.
 */
type Durations = NonNullable<Tokens["durations"]>;

/**
 * Lists the durations.
 */
export const durations: Durations = {
  ambient: { value: "1.2s" },
  ambientSlow: { value: "5s" },
  ambientSlower: { value: "20s" },
  fast: { value: "150ms" },
  faster: { value: "100ms" },
  fastest: { value: "50ms" },
  moderate: { value: "200ms" },
  none: { value: "0s" },
  slow: { value: "300ms" },
  slower: { value: "400ms" },
  slowest: { value: "500ms" },
};
