/**
 * Draws a block with one centred child and whatever comes before and after it pushed to the
 * edges, for a hero or an empty state.
 *
 * @remarks
 *   The child marked `data-centered` takes the room above and below it, so it sits in the middle
 *   of whatever height the block has, and the block is at least as tall as the caller asks.
 */

import type { SystemProperties, SystemStyleObject } from "#generated/types/system.d.mts";

/**
 * Describes what a cover takes.
 */
export interface CoverProps {
  /**
   * The least height the block has, as a size token or a length.
   */
  minHeight?: SystemProperties["minHeight"];

  /**
   * The space between the children and around them, as a step of the semantic scale.
   */
  space?: SystemProperties["padding"];
}

/**
 * Fixes the space between the children when a caller states none.
 */
const SPACE = "inset.lg";

/**
 * Draws a cover from the props given.
 */
export function cover(props: CoverProps = {}): SystemStyleObject {
  const space = props.space ?? SPACE;

  return {
    "& > :first-child:not([data-centered])": { marginBlockStart: "0" },
    "& > :last-child:not([data-centered])": { marginBlockEnd: "0" },
    "& > [data-centered]": { marginBlock: "auto" },
    "& > *": { marginBlock: space },
    display: "flex",
    flexDirection: "column",
    minHeight: props.minHeight ?? "100dvh",
    padding: space,
  };
}
