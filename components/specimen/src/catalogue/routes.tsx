/**
 * Turns the pages a build indexed into the routes and the frame an application compiles.
 */

import { type FunctionComponent } from "react";

import { type LayoutProps, type RouteDeclaration } from "@stealthscale/provider-router";

import { Catalogue } from "#catalogue/catalogue.tsx";
import { Page } from "#catalogue/page.tsx";
import { type Indexed } from "#catalogue/types.ts";

/**
 * The prefix every page of a catalogue is named under, so an application's own routes and these
 * never collide.
 */
export const NAMED = "specimen";

/**
 * The frame every page of a catalogue is drawn inside.
 */
export const FRAME = "specimen.catalogue";

/**
 * Returns the id a page is routed under.
 *
 * @remarks
 *   The identifier's slashes become dots, because a route id names a route and a path addresses it.
 *   `actions/button` is served at `actions/button` under its parent, and referred to as
 *   `specimen.actions.button`.
 */
export function routeId(id: string): string {
  return `${NAMED}.${id.replaceAll("/", ".")}`;
}

/**
 * Returns one declaration per page, each drawing that page inside the catalogue's frame.
 *
 * @remarks
 *   The component is a closure over the entry rather than a lazy import, because every page is the
 *   same component against different data. The page's own module is still loaded only when somebody
 *   opens it, by the loader the index put on the entry.
 *   The path carries no leading slash, so every page hangs beneath whatever parent the application
 *   compiles them under. Mounting that parent at `/docs` addresses this page at
 *   `/docs/actions/button` without the package knowing.
 * @param pages - The pages the index found, which is what `virtual:specimen-index` exports.
 * @returns One declaration per page, in the order the index gave them.
 */
export function declarations(pages: readonly Indexed[]): readonly RouteDeclaration[] {
  return pages.map((page) => ({
    component: () => <Page entry={page} />,
    id: routeId(page.id),
    layout: [FRAME],
    navigation: { group: page.group, label: page.title },
    path: page.id,
  }));
}

/**
 * Returns the default frame those declarations name, drawn over every route the rail lists.
 *
 * @remarks
 *   Handed to `compileRoutes` beside the declarations, and given every declaration compiled rather
 *   than the specimen pages alone, so a page an application wrote is listed beside a page the
 *   plugin found. A pathless route draws the frame, so it adds no segment to any page's address and
 *   the rail is rendered once above all of them.
 *   An application wanting a frame of its own passes one under `FRAME` instead of calling this, and
 *   draws `Rail` wherever it likes inside it.
 * @param compiled - Every declaration the catalogue is compiled from.
 * @returns The frame, under the name every declaration asks for.
 */
export function layouts(
  compiled: readonly RouteDeclaration[],
): Readonly<Record<string, FunctionComponent<LayoutProps>>> {
  return {
    [FRAME]: ({ children }: LayoutProps) => (
      <Catalogue declarations={compiled}>{children}</Catalogue>
    ),
  };
}
