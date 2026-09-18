/**
 * Draws the menu from the declarations, rather than from the router.
 */

import { type ReactElement } from "react";

import { type RouteDeclaration, RouteLink } from "@stealthscale/provider-router";

import { type Condition } from "#catalogue.ts";
import { type Entry, entryOf } from "#entry.ts";

/**
 * Describes the menu.
 */
export interface MenuProps {
  /**
   * The routes that arrived as data, whichever of them are listed.
   */
  readonly declarations: ReadonlyArray<RouteDeclaration<Condition>>;
}

/**
 * One declaration the menu draws, with the entry it carried.
 */
interface Listed {
  /**
   * The entry the declaration carried.
   */
  readonly entry: Entry;

  /**
   * The id the link resolves through.
   */
  readonly id: string;
}

/**
 * Draws one link per declaration carrying a menu entry, in the order they state.
 *
 * @remarks
 *   The menu reads declarations rather than the router, because a route in no menu is common and
 *   the router knows nothing about which pages a person should be offered.
 * @param props - The declarations to draw from.
 * @returns One link per listed page, in the order they state.
 */
export function Menu({ declarations }: MenuProps): ReactElement {
  const entries = declarations
    .map((declaration) => ({ entry: entryOf(declaration), id: declaration.id }))
    .filter((listed): listed is Listed => listed.entry !== undefined)
    .toSorted((first, second) => first.entry.order - second.entry.order);

  return (
    <nav aria-label="Pages">
      {entries.map(({ entry, id }) => (
        <RouteLink key={id} to={id}>
          {entry.label}
        </RouteLink>
      ))}
    </nav>
  );
}
