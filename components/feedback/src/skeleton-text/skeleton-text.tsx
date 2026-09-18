/**
 * Draws a paragraph of skeleton: a column of bars, one per line of text that has not arrived.
 *
 * @remarks
 *   The bars are drawn by the skeleton, so the motion a theme gives a stand-in is the motion these
 *   have, and a caller states it once on the paragraph rather than once per bar. The column is
 *   bound to its own recipe, which owns the layout and reads every length off the line it stands
 *   in for.
 *   A caller draws this while the text is loading and draws the text itself once it arrives, so
 *   nothing here takes a loading state. A stand-in that has to decide whether to stand in is two
 *   components in one.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#skeleton-text/context.ts";
import { Skeleton, type SkeletonProps } from "#skeleton/skeleton.ts";

/**
 * Draws the column the bars sit in.
 */
const Column = withContext("div");

/**
 * Describes what a paragraph of skeleton takes.
 */
export interface SkeletonTextProps extends ComponentProps<typeof Column> {
  /**
   * How many lines of text it stands in for.
   */
  readonly lines?: number | undefined;

  /**
   * How each bar moves while it waits, which every bar takes together.
   */
  readonly motion?: SkeletonProps["motion"] | undefined;

  /**
   * The corner each bar is drawn with.
   */
  readonly radius?: SkeletonProps["radius"] | undefined;
}

/**
 * Stands in for a paragraph of text that has not arrived.
 *
 * @param props - The column's own, plus the count and what each bar is drawn like.
 * @returns The column, holding one bar per line.
 */
export function SkeletonText({
  lines = 3,
  motion,
  radius,
  ...rest
}: SkeletonTextProps): ReactElement {
  const drawn = {
    ...(motion === undefined ? {} : { motion }),
    ...(radius === undefined ? {} : { radius }),
  };

  return (
    <Column {...rest}>
      {Array.from({ length: Math.max(lines, 1) }, (_, at) => (
        // The bars are positional and identical, so there is nothing else to name them by.
        // eslint-disable-next-line react/no-array-index-key -- as above
        <Skeleton key={at} {...drawn} />
      ))}
    </Column>
  );
}
