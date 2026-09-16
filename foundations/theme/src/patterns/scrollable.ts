/**
 * Draws a scroll container on one axis or both, with or without a visible scrollbar.
 */

import type { SystemStyleObject } from "#generated/types/system.d.mts";

/**
 * Describes what a scroll container takes.
 */
export interface ScrollableProps {
  /**
   * Which axis scrolls. Vertical unless the caller says otherwise.
   */
  direction?: "both" | "horizontal" | "vertical" | undefined;

  /**
   * Whether the scrollbar is hidden, for a reel or a strip the reader scrolls by touch or wheel.
   */
  hideScrollbar?: boolean | undefined;
}

/**
 * Sets the overflow of each axis for each direction.
 */
const OVERFLOW: Readonly<Record<NonNullable<ScrollableProps["direction"]>, SystemStyleObject>> = {
  both: { overflow: "auto" },
  horizontal: { overflowX: "auto", overflowY: "hidden" },
  vertical: { overflowX: "hidden", overflowY: "auto" },
};

/**
 * Hides the scrollbar in every engine without disabling the scroll.
 */
const HIDDEN: SystemStyleObject = {
  "&::-webkit-scrollbar": { display: "none" },
  scrollbarWidth: "none",
};

/**
 * Draws a scroll container from the props given.
 */
export function scrollable(props: ScrollableProps = {}): SystemStyleObject {
  return {
    ...OVERFLOW[props.direction ?? "vertical"],
    ...(props.hideScrollbar === true ? HIDDEN : {}),
  };
}
