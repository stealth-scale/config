/**
 * Draws a flex container, and a box that centres one child.
 */

import type { SystemProperties, SystemStyleObject } from "#generated/types/system.d.mts";

/**
 * Describes what a flex container takes, each prop the flex property it stands for.
 */
export interface FlexProps {
  /**
   * How the children line up across the axis.
   */
  align?: SystemProperties["alignItems"];

  /**
   * The size each child starts from.
   */
  basis?: SystemProperties["flexBasis"];

  /**
   * Which way the container runs.
   */
  direction?: SystemProperties["flexDirection"];

  /**
   * How much each child grows into the room left.
   */
  grow?: SystemProperties["flexGrow"];

  /**
   * How the children are placed along the axis.
   */
  justify?: SystemProperties["justifyContent"];

  /**
   * How much each child shrinks when the room runs out.
   */
  shrink?: SystemProperties["flexShrink"];

  /**
   * Whether the children wrap onto another line.
   */
  wrap?: SystemProperties["flexWrap"];
}

/**
 * Describes what a centring box takes.
 */
export interface CenterProps {
  /**
   * Whether the box sits inline with the text around it rather than on a line of its own.
   */
  inline?: boolean | undefined;
}

/**
 * Draws a flex container from the props given, leaving out every property a caller left out.
 */
export function flex(props: FlexProps = {}): SystemStyleObject {
  return {
    ...(props.align === undefined ? {} : { alignItems: props.align }),
    display: "flex",
    ...(props.basis === undefined ? {} : { flexBasis: props.basis }),
    ...(props.direction === undefined ? {} : { flexDirection: props.direction }),
    ...(props.grow === undefined ? {} : { flexGrow: props.grow }),
    ...(props.shrink === undefined ? {} : { flexShrink: props.shrink }),
    ...(props.wrap === undefined ? {} : { flexWrap: props.wrap }),
    ...(props.justify === undefined ? {} : { justifyContent: props.justify }),
  };
}

/**
 * Draws a box that centres its child on both axes.
 */
export function center(props: CenterProps = {}): SystemStyleObject {
  return {
    alignItems: "center",
    display: props.inline === true ? "inline-flex" : "flex",
    justifyContent: "center",
  };
}
