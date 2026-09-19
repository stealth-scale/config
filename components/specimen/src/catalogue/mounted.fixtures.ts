/**
 * Builds a tree over a set of pages, so a specification renders the catalogue as a reader meets it.
 *
 * @remarks
 *   The package publishes declarations and a frame, and no tree. The parent a catalogue hangs
 *   beneath is the application's, so a specification supplies one, which is also what proves a
 *   consumer can mount the pages wherever they like and compile their own pages beside them.
 */

import {
  type AnyRoute,
  compileRoutes,
  createAppRootRoute,
  createRoute,
  namedRoute,
  Outlet,
  type RouteDeclaration,
} from "@stealthscale/provider-router";

import { declarations, FRAME, layouts } from "#catalogue/routes.tsx";
import { type Indexed } from "#catalogue/types.ts";

/**
 * Returns one page as the index lists it.
 *
 * @param id - The identifier the page is addressed by.
 * @param group - The group a rail lists it under.
 * @param title - The words the rail writes.
 * @returns The entry.
 */
export function entry(id: string, group: string, title: string): Indexed {
  return {
    about: "",
    group,
    id,
    load: () => Promise.resolve({}),
    package: "@stealthscale/component-actions",
    path: `src/${id}.specimen.tsx`,
    source: () => Promise.resolve({ default: "" }),
    title,
  };
}

/**
 * Returns a page an application wrote itself, which is not a specimen.
 *
 * @param id - The identifier the route is named under.
 * @param group - The group a rail lists it under, or empty for none.
 * @param label - The words the rail writes.
 * @returns The declaration.
 */
export function written(id: string, group: string, label: string): RouteDeclaration {
  return {
    component: () => null,
    id,
    layout: [FRAME],
    navigation: group === "" ? { label } : { group, label },
    path: id.replaceAll(".", "/"),
  };
}

/**
 * Builds a tree drawing the pages given, beneath a parent of its own.
 *
 * @param listed - The specimen pages to list.
 * @param beside - Whatever the application declared beside them.
 * @param mounted - The path the catalogue hangs beneath.
 * @returns The tree, as `createRouter` takes it.
 */
export function treeOver(
  listed: readonly Indexed[],
  beside: readonly RouteDeclaration[] = [],
  mounted = "/docs",
): AnyRoute {
  const compiled = [...declarations(listed), ...beside];
  const root = createAppRootRoute()({ component: Outlet });
  const under = createRoute({
    ...namedRoute("test.docs"),
    getParentRoute: () => root,
    path: mounted,
  });

  return root.addChildren([
    under.addChildren([...compileRoutes(compiled, { layouts: layouts(compiled), parent: under })]),
  ]);
}
