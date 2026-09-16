/**
 * Draws a stack: a flex container with a gap between its children, in either direction.
 *
 * @remarks
 *   A recipe reads a pattern as its base, `stack({ gap: "gap.sm" })`, and a theme extends the
 *   recipe. The gap defaults to a step of the semantic scale rather than to a raw length, so a
 *   stack a recipe left at its default is one a theme can still move.
 */

import type { SystemProperties, SystemStyleObject } from "#generated/types/system.d.mts";

/**
 * Describes what a stack takes.
 */
export interface StackProps {
  /**
   * How the children line up across the stack.
   */
  align?: SystemProperties["alignItems"];

  /**
   * Which way the stack runs. A column unless the caller says otherwise.
   */
  direction?: SystemProperties["flexDirection"];

  /**
   * The gap between children, as a step of the semantic scale.
   */
  gap?: SystemProperties["gap"];

  /**
   * How the children are placed along the stack.
   */
  justify?: SystemProperties["justifyContent"];
}

/**
 * Describes what a stack fixed in one direction takes.
 */
export type FixedStackProps = Omit<StackProps, "align" | "direction">;

/**
 * Fixes the gap a stack is drawn with when a caller states none.
 */
const GAP = "gap.md";

/**
 * Draws a stack in the direction given, a column by default.
 */
export function stack(props: StackProps = {}): SystemStyleObject {
  return {
    ...(props.align === undefined ? {} : { alignItems: props.align }),
    display: "flex",
    flexDirection: props.direction ?? "column",
    gap: props.gap ?? GAP,
    ...(props.justify === undefined ? {} : { justifyContent: props.justify }),
  };
}

/**
 * Draws a row of children centred across it.
 */
export function hstack(props: FixedStackProps = {}): SystemStyleObject {
  return stack({ ...props, align: "center", direction: "row" });
}

/**
 * Draws a column of children centred across it.
 */
export function vstack(props: FixedStackProps = {}): SystemStyleObject {
  return stack({ ...props, align: "center", direction: "column" });
}
