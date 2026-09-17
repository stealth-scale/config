/**
 * Draws a bento: a dense grid of equal columns whose cells span columns and rows, so a page is
 * laid out as a box of tiles of different sizes with no holes.
 *
 * @remarks
 *   The grid fills backwards into any gap a span leaves, which is what keeps a bento tight when a
 *   wide cell pushes the next one down. Every row takes the same minimum height, so a cell that
 *   spans two rows is exactly twice a cell that spans one. A cell states its span with
 *   `bentoCell`, per breakpoint where it wants to, so a tile that is wide on a desk is one
 *   column on a phone.
 */

import type { ConditionalValue } from "#generated/types/system.d.mts";
import type { SystemProperties, SystemStyleObject } from "#generated/types/system.d.mts";
import { responsive } from "#patterns/responsive.ts";

/**
 * Describes what a bento takes.
 */
export interface BentoProps {
  /**
   * The number of equal columns, per breakpoint where it changes. Three when nothing is stated.
   */
  columns?: ConditionalValue<number>;

  /**
   * The gap between tiles, as a step of the semantic scale.
   */
  gap?: SystemProperties["gap"];

  /**
   * The least height of one row, as a size token. A cell spanning two rows is twice it.
   */
  rowHeight?: SystemProperties["gridAutoRows"];
}

/**
 * Describes what one tile takes: how many columns and rows it covers.
 */
export interface BentoCellProps {
  /**
   * The columns the tile spans, per breakpoint where it changes. One when nothing is stated.
   */
  columns?: ConditionalValue<number>;

  /**
   * The rows the tile spans, per breakpoint where it changes. One when nothing is stated.
   */
  rows?: ConditionalValue<number>;
}

/**
 * Fixes the number of columns a bento has when nothing is stated.
 */
const COLUMNS = 3;

/**
 * Fixes the least height of a row when nothing is stated, as a size token.
 */
const ROW = "40";

/**
 * Writes a span of a number of tracks.
 */
function span(tracks: number): string {
  return `span ${String(tracks)}`;
}

/**
 * Draws the bento container.
 */
export function bento(props?: BentoProps): SystemStyleObject {
  return {
    display: "grid",
    gap: props?.gap ?? "gap.md",
    gridAutoFlow: "dense",
    gridAutoRows: props?.rowHeight ?? ROW,
    gridTemplateColumns: responsive(
      props?.columns ?? COLUMNS,
      (count) => `repeat(${String(count)}, minmax(0, 1fr))`,
    ),
  };
}

/**
 * Draws one tile of a bento, spanning the columns and rows it states.
 */
export function bentoCell(props?: BentoCellProps): SystemStyleObject {
  return {
    gridColumn: responsive(props?.columns ?? 1, span),
    gridRow: responsive(props?.rows ?? 1, span),
  };
}
