/**
 * Sorts the index into the groups a rail lists.
 */

import { type Indexed } from "#types.ts";

/**
 * The heading a page with no group of its own is listed under.
 */
export const UNGROUPED = "Other";

/**
 * One heading of a rail, and the pages under it.
 */
export interface Group {
  /**
   * The heading.
   */
  name: string;

  /**
   * The pages, in the order the index gave them.
   */
  pages: readonly Indexed[];
}

/**
 * Returns the pages by group, the groups sorted by name and each page kept in index order.
 *
 * @remarks
 *   The index is already sorted by path, so the pages under a heading come out in the order the
 *   packages sit in the tree. A page that declares no group is listed last, under `UNGROUPED`.
 */
export function grouped(pages: readonly Indexed[]): readonly Group[] {
  const held = new Map<string, Indexed[]>();

  for (const page of pages) {
    const name = page.group === "" ? UNGROUPED : page.group;

    held.set(name, [...(held.get(name) ?? []), page]);
  }

  return [...held]
    .map(([name, under]) => ({ name, pages: under }))
    .toSorted((one, next) => {
      if (one.name === UNGROUPED) return 1;
      if (next.name === UNGROUPED) return -1;

      return one.name.localeCompare(next.name);
    });
}
