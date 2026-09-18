/**
 * Reports whether the reader's main pointer is a finger rather than a mouse or a pen.
 */

import { useMediaQuery } from "#use-media-query.ts";

/**
 * Reads whether the reader's main pointer is coarse.
 *
 * @remarks
 *   A coarse pointer is a finger on a phone or a tablet, which cannot rest on something or aim at
 *   a hairline. Where it is coarse, rows grow to a touch size and anything needing a hover or a
 *   drag is left out.
 * @returns `true` for a finger, and `false` for a mouse or a pen and before the window has been
 *   read.
 */
export function useCoarsePointer(): boolean {
  return useMediaQuery(["(pointer: coarse)"]).includes(true);
}
