/**
 * Draws a row that becomes a column below a threshold width.
 *
 * @remarks
 *   Each child's basis is the room left below the threshold multiplied by a large number, which
 *   is negative while the row is wide, so the children share a line, and huge once it is narrow,
 *   so each child takes a line of its own. No breakpoint is written.
 */

import type {
  ConditionalValue,
  SystemProperties,
  SystemStyleObject,
} from "#generated/types/system.d.mts";
import { responsive } from "#patterns/responsive.ts";

/**
 * Describes what a switcher takes.
 */
export interface SwitcherProps {
  /**
   * The gap between children, as a step of the semantic scale.
   */
  gap?: SystemProperties["gap"];

  /**
   * The width below which the row becomes a column, as CSS writes a length.
   */
  threshold?: ConditionalValue<string> | undefined;
}

/**
 * Fixes the gap between children when a caller states none.
 */
const GAP = "gap.md";

/**
 * Fixes the width below which the row becomes a column when a caller states none.
 */
const THRESHOLD = "30rem";

/**
 * Draws a switcher from the props given.
 */
export function switcher(props: SwitcherProps = {}): SystemStyleObject {
  return {
    "& > *": {
      flexBasis: responsive(
        props.threshold ?? THRESHOLD,
        (threshold) => `calc((${threshold} - 100%) * 999)`,
      ),
      flexGrow: 1,
    },
    display: "flex",
    flexWrap: "wrap",
    gap: props.gap ?? GAP,
  };
}
