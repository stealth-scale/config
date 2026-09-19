/**
 * Shapes what a page's parts accept into the rows a table draws.
 */

import { type Anatomy, type Dropped, type Member, type Prop } from "#catalogue/types.ts";

/**
 * Describes one row: the prop, and the members of every named type it refers to.
 */
export interface Row {
  /**
   * The prop the row is drawn for.
   */
  prop: Prop;

  /**
   * The members of each named type the prop refers to, in the order the prop named them. Empty
   * where a type is named but not listed, which is what the reader does past its cap or its depth.
   */
  shows: readonly Member[];
}

/**
 * Describes one part, split into the two groups a table heads separately.
 */
export interface Part {
  /**
   * The counts of what the reader resolved and no table draws.
   */
  dropped: Dropped;

  /**
   * The name the part is exported under.
   */
  name: string;

  /**
   * The props a caller sets, sorted by name.
   */
  options: readonly Row[];

  /**
   * The axes a theme moves, sorted by name.
   */
  variants: readonly Row[];
}

/**
 * The counts to report for a part the reader recorded no drops against.
 */
const NONE: Dropped = { conditions: 0, foreign: 0 };

/**
 * Returns one row per prop, each carrying the members of the types it refers to.
 */
function rowsOf(props: readonly Prop[], shapes: Anatomy["shapes"]): readonly Row[] {
  return props.map((prop) => ({
    prop,
    shows: prop.refers.flatMap((named) => shapes[named] ?? []),
  }));
}

/**
 * Returns each part of a page, its props split by kind and its dropped counts beside them.
 *
 * @remarks
 *   Sorted by part name, and the rows within a group by prop name, so a table drawn from this is
 *   stable across reads. A part the reader found no props for is kept, because its dropped counts
 *   are the answer to why the table is empty.
 */
export function parted(anatomy: Anatomy): readonly Part[] {
  return Object.entries(anatomy.parts)
    .map(([name, props]) => {
      const rows = rowsOf(props, anatomy.shapes);

      return {
        dropped: anatomy.dropped[name] ?? NONE,
        name,
        options: rows.filter((row) => row.prop.kind === "option"),
        variants: rows.filter((row) => row.prop.kind === "variant"),
      };
    })
    .toSorted((one, next) => one.name.localeCompare(next.name));
}
