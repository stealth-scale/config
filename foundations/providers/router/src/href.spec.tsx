import { type ReactNode } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { compileRoutes } from "#compile.ts";
import { routeHref, useRouteHref, useRouteMap } from "#href.ts";
import { type RouteMap, routeMap } from "#map.ts";
import { routerOptions } from "#options.ts";
import { createAppRootRoute } from "#root.ts";
import {
  type AnyRoute,
  createMemoryHistory,
  createRoute,
  createRouter,
  RouterProvider,
} from "#tanstack.ts";

/**
 * Draws nothing, standing in for a page a declaration names.
 *
 * @returns Nothing.
 */
function Page(): null {
  return null;
}

/**
 * Compiles two declarations, one with a parameter, and processes the tree through a router.
 *
 * @remarks
 *   The router is built because the library works a full path out while it processes the tree, and
 *   a map read before that holds routes with no path.
 * @returns The map, and the tree it was compiled into.
 */
function compiled(): { map: RouteMap; root: AnyRoute } {
  const root = createAppRootRoute()();
  const parent = createRoute({ getParentRoute: () => root, path: "/app" });
  const routes = compileRoutes(
    [
      { component: Page, id: "acme.files", path: "/files/$" },
      { component: Page, id: "acme.list", path: "/invoices" },
      { component: Page, id: "acme.maybe", path: "/maybe/{-$tab}" },
      { component: Page, id: "acme.one", path: "/invoices/$id" },
    ],
    { parent },
  );

  const tree = root.addChildren([parent.addChildren([...routes])]);

  createRouter({ history: createMemoryHistory({ initialEntries: ["/app"] }), routeTree: tree });

  return { map: routeMap(tree), root };
}

/**
 * Renders a component inside a router carrying the map, so a hook can read it.
 *
 * @param map - The map to put in the router context, or nothing to leave it out.
 * @param drawn - The component the one route draws.
 * @returns Nothing. The caller reads the screen.
 */
async function mounted(map: RouteMap | undefined, drawn: () => ReactNode): Promise<void> {
  const root = createAppRootRoute()();
  const only = createRoute({
    component: drawn,
    errorComponent: ({ error }) => <span data-testid="failed">{String(error)}</span>,
    getParentRoute: () => root,
    path: "/",
  });
  const router = createRouter({
    ...routerOptions({ routes: map }),
    history: createMemoryHistory({ initialEntries: ["/"] }),
    routeTree: root.addChildren([only]),
  });

  await router.load();

  render(<RouterProvider router={router} />);
}

describe("routeHref", () => {
  it("resolves a declared id to the full path its route compiled to", () => {
    const { map } = compiled();

    expect(routeHref(map, "acme.list")).toBe("/app/invoices");
  });

  it("fills in a parameter the path names", () => {
    const { map } = compiled();

    expect(routeHref(map, "acme.one", { id: "42" })).toBe("/app/invoices/42");
  });

  it("throws where the map holds no such id", () => {
    const { map } = compiled();

    expect(() => routeHref(map, "acme.absent")).toThrow(
      "No route is declared with the id acme.absent.",
    );
  });

  it("throws where a parameter the path names was not given, rather than resolving a wrong path", () => {
    const { map } = compiled();

    expect(() => routeHref(map, "acme.one")).toThrow(
      "The route acme.one names a parameter that was not given.",
    );
  });

  it("ignores a parameter the path does not name", () => {
    const { map } = compiled();

    expect(routeHref(map, "acme.list", { unused: "x" })).toBe("/app/invoices");
  });

  it("fills a wildcard from the splat the library names", () => {
    const { map } = compiled();

    expect(routeHref(map, "acme.files", { _splat: "a/b" })).toBe("/app/files/a/b");
  });

  it("leaves an optional segment out where nothing fills it", () => {
    const { map } = compiled();

    expect(routeHref(map, "acme.maybe")).toBe("/app/maybe");
  });

  it("throws where no router has processed the tree, rather than returning the site root", () => {
    const root = createAppRootRoute()();
    const parent = createRoute({ getParentRoute: () => root, path: "/app" });
    const routes = compileRoutes([{ component: Page, id: "acme.list", path: "/invoices" }], {
      parent,
    });
    const map = routeMap(root.addChildren([parent.addChildren([...routes])]));

    expect(() => routeHref(map, "acme.list")).toThrow(
      "The route acme.list has no path yet, because no router has processed the tree it was placed in.",
    );
  });
});

describe("useRouteMap", () => {
  it("returns the map the router was built with", async () => {
    const { map } = compiled();

    await mounted(map, () => <span data-testid="href">{String(useRouteMap().size)}</span>);

    expect(screen.getByTestId("href").textContent).toBe("4");
  });

  it("throws where the router was built without one", async () => {
    await mounted(undefined, () => <span>{String(useRouteMap().size)}</span>);

    expect(screen.getByTestId("failed").textContent).toContain(
      "The router context holds no route map",
    );
  });
});

describe("useRouteHref", () => {
  it("resolves a declared id through the map the router context holds", async () => {
    const { map } = compiled();

    await mounted(map, () => <span data-testid="href">{useRouteHref("acme.list")}</span>);

    expect(screen.getByTestId("href").textContent).toBe("/app/invoices");
  });

  it("throws where the router context holds no map", async () => {
    await mounted(undefined, () => <span>{useRouteHref("acme.list")}</span>);

    expect(screen.getByTestId("failed").textContent).toContain(
      "The router context holds no route map",
    );
  });
});
