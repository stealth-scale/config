/**
 * Draws a reel: a row that scrolls sideways and snaps each item into place.
 */

import type { SystemProperties, SystemStyleObject } from "#generated/types/system.d.mts";

/**
 * Describes what a reel takes.
 */
export interface ReelProps {
  /**
   * The gap between items, as a step of the semantic scale.
   */
  gap?: SystemProperties["gap"];

  /**
   * The width of each item, as a size token or a length. Each item keeps its own width when the
   * caller states none.
   */
  itemWidth?: SystemProperties["flexBasis"];
}

/**
 * Fixes the gap between items when a caller states none.
 */
const GAP = "gap.md";

/**
 * Draws a reel from the props given.
 */
export function reel(props: ReelProps = {}): SystemStyleObject {
  return {
    "& > *": {
      flexBasis: props.itemWidth ?? "auto",
      flexGrow: 0,
      flexShrink: 0,
      scrollSnapAlign: "start",
    },
    display: "flex",
    gap: props.gap ?? GAP,
    overflowX: "auto",
    overflowY: "hidden",
    scrollSnapType: "x mandatory",
  };
}
