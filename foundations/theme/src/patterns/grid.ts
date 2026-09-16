/**
 * Draws a grid: counted columns, or as many columns as fit a narrowest width.
 *
 * @remarks
 *   `minChildWidth` is the one to reach for. The count then follows the room the grid is given
 *   rather than the window's width, so a grid inside a narrow panel drops a column without a
 *   breakpoint written for it. A width is read against the size scale where it is a name, and as
 *   it stands where it is a length.
 */

import type {
  ConditionalValue,
  SystemProperties,
  SystemStyleObject,
} from "#generated/types/system.d.mts";
import { responsive } from "#patterns/responsive.ts";

/**
 * Describes what a grid takes.
 */
export interface GridProps {
  /**
   * The gap between columns, where it differs from the gap.
   */
  columnGap?: SystemProperties["columnGap"];

  /**
   * How many equal columns to draw.
   */
  columns?: ConditionalValue<number> | undefined;

  /**
   * The gap between children, as a step of the semantic scale.
   */
  gap?: SystemProperties["gap"];

  /**
   * The narrowest a column may be, as a size token or a length, for a grid that fits as many
   * columns as the room allows.
   */
  minChildWidth?: ConditionalValue<string> | undefined;

  /**
   * The gap between rows, where it differs from the gap.
   */
  rowGap?: SystemProperties["rowGap"];
}

/**
 * Describes what a grid of equal columns takes, which is the same as a grid without the two
 * separate gaps.
 */
export type SimpleGridProps = Omit<GridProps, "columnGap" | "rowGap">;

/**
 * Matches a value that already carries a unit or a function, which is read as it stands.
 */
const LENGTH =
  /^(?:[+-]?\d*\.?\d+(?:e[+-]?\d+)?[a-z%]+|var\(--.+\)|(?:min|max|clamp|calc)\(.*\))$/iu;

/**
 * Fixes the gap a grid is drawn with when a caller states no gap at all.
 */
const GAP = "gap.md";

/**
 * Writes a column width as CSS reads one, against the size scale where it is a name.
 */
function width(least: string): string {
  return LENGTH.test(least) ? least : `token(sizes.${least}, ${least})`;
}

/**
 * Writes the template the columns are drawn from: counted, fitted, or none.
 */
function columns(props: GridProps): SystemStyleObject {
  if (props.columns !== undefined) {
    return {
      gridTemplateColumns: responsive(
        props.columns,
        (count) => `repeat(${String(count)}, minmax(0, 1fr))`,
      ),
    };
  }

  if (props.minChildWidth !== undefined) {
    return {
      gridTemplateColumns: responsive(
        props.minChildWidth,
        (least) => `repeat(auto-fit, minmax(${width(least)}, 1fr))`,
      ),
    };
  }

  return {};
}

/**
 * Draws a grid from the props given.
 *
 * @remarks
 *   The gap defaults to a step of the semantic scale unless the caller stated either separate
 *   gap, in which case the other axis is left to the caller as well.
 */
export function grid(props: GridProps = {}): SystemStyleObject {
  const separate = props.columnGap !== undefined || props.rowGap !== undefined;

  return {
    ...(props.columnGap === undefined ? {} : { columnGap: props.columnGap }),
    display: "grid",
    ...(separate ? {} : { gap: props.gap ?? GAP }),
    ...(props.gap === undefined || !separate ? {} : { gap: props.gap }),
    ...columns(props),
    ...(props.rowGap === undefined ? {} : { rowGap: props.rowGap }),
  };
}

/**
 * Draws a grid of equal columns, counted or fitted to a narrowest column, with one gap.
 */
export function simpleGrid(props: SimpleGridProps = {}): SystemStyleObject {
  return grid(props);
}
