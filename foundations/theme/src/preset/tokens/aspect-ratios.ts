/**
 * Defines the aspect ratios a media frame is drawn at.
 *
 * @remarks
 *   The compiler's own set, restated here as data so the vocabulary defines each ratio once.
 *   `wide` and `video` are the same ratio under two names, because a caller framing a video and a
 *   caller framing a wide image are asking for different things and should read a name for each.
 */

import { type Tokens } from "#pandacss.ts";

/**
 * Describes the ratios a theme states.
 */
type AspectRatios = NonNullable<Tokens["aspectRatios"]>;

/**
 * Lists the ratios, each written as CSS reads one.
 */
export const aspectRatios: AspectRatios = {
  golden: { value: "1.618 / 1" },
  landscape: { value: "4 / 3" },
  portrait: { value: "3 / 4" },
  square: { value: "1 / 1" },
  ultrawide: { value: "18 / 5" },
  video: { value: "16 / 9" },
  wide: { value: "16 / 9" },
};
