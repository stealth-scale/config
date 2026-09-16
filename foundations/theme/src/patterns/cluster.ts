/**
 * Draws a cluster: items that wrap onto the next line with a gap between them, for a row of tags
 * or a toolbar.
 */

import type { SystemProperties, SystemStyleObject } from "#generated/types/system.d.mts";

/**
 * Describes what a cluster takes.
 */
export interface ClusterProps {
  /**
   * How the items line up across each line.
   */
  align?: SystemProperties["alignItems"];

  /**
   * The gap between items, as a step of the semantic scale.
   */
  gap?: SystemProperties["gap"];

  /**
   * How the items are placed along each line.
   */
  justify?: SystemProperties["justifyContent"];
}

/**
 * Fixes the gap a cluster is drawn with when a caller states none.
 */
const GAP = "gap.sm";

/**
 * Draws a cluster from the props given.
 */
export function cluster(props: ClusterProps = {}): SystemStyleObject {
  return {
    alignItems: props.align ?? "center",
    display: "flex",
    flexWrap: "wrap",
    gap: props.gap ?? GAP,
    ...(props.justify === undefined ? {} : { justifyContent: props.justify }),
  };
}
