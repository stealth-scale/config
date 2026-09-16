/**
 * Draws a pane beside content that wraps under it when the content is narrow.
 *
 * @remarks
 *   The pane keeps its width and the content takes the rest, until the content would fall below
 *   its minimum, at which point the flex wrap puts the pane above or below it. No breakpoint is
 *   written, so the layout folds on the room it is given rather than on the window.
 */

import type {
  ConditionalValue,
  SystemProperties,
  SystemStyleObject,
} from "#generated/types/system.d.mts";
import { responsive } from "#patterns/responsive.ts";

/**
 * Describes what a sidebar layout takes.
 */
export interface SidebarProps {
  /**
   * The share of the row the content must keep before the pane wraps, as a percentage.
   */
  contentMin?: ConditionalValue<number> | undefined;

  /**
   * The gap between the pane and the content, as a step of the semantic scale.
   */
  gap?: SystemProperties["gap"];

  /**
   * Which side the pane is on, which is which child it is: the first or the last.
   */
  side?: "end" | "start" | undefined;

  /**
   * The width the pane keeps, as a size token or a length.
   */
  sideWidth?: SystemProperties["flexBasis"];
}

/**
 * Fixes the share of the row the content keeps when a caller states none.
 */
const CONTENT_MIN = 50;

/**
 * Fixes the gap between the pane and the content when a caller states none.
 */
const GAP = "gap.lg";

/**
 * Fixes the width the pane keeps when a caller states none.
 */
const SIDE_WIDTH = "sm";

/**
 * Draws a sidebar layout from the props given.
 */
export function sidebar(props: SidebarProps = {}): SystemStyleObject {
  const pane: SystemStyleObject = { flexBasis: props.sideWidth ?? SIDE_WIDTH, flexGrow: 1 };
  const content: SystemStyleObject = {
    flexBasis: "0",
    flexGrow: 999,
    minInlineSize: responsive(props.contentMin ?? CONTENT_MIN, (share) => `${String(share)}%`),
  };

  return {
    ...(props.side === "end"
      ? { "& > :first-child": content, "& > :last-child": pane }
      : { "& > :first-child": pane, "& > :last-child": content }),
    display: "flex",
    flexWrap: "wrap",
    gap: props.gap ?? GAP,
  };
}
