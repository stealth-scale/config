import { describe, expect, it } from "vitest";

import { compileRoutes } from "#compile.ts";
import { routerOptions } from "#options.ts";
import { createAppRootRoute } from "#root.ts";
import { createMemoryHistory, createRoute, createRouter, rootRouteId } from "#tanstack.ts";

/**
 * Draws nothing, standing in for a page.
 *
 * @returns Nothing.
 */
function Page(): null {
  return null;
}

describe("createAppRootRoute", () => {
  it("returns a factory that builds the tree's root route", () => {
    const root = createAppRootRoute()({});

    createRouter({
      history: createMemoryHistory({ initialEntries: ["/"] }),
      routeTree: root,
    });

    expect(root.id).toBe(rootRouteId);
  });

  it("types a context the route map and an application's own scope both fit", async () => {
    const root = createAppRootRoute<{ routes?: never; scope: string }>()();
    const parent = createRoute({ getParentRoute: () => root, path: "/app" });
    const routes = compileRoutes([{ component: Page, id: "acme.one", path: "/one" }], {
      parent,
    });
    const router = createRouter({
      ...routerOptions({ scope: "a scope" }),
      history: createMemoryHistory({ initialEntries: ["/app/one"] }),
      routeTree: root.addChildren([parent.addChildren([...routes])]),
    });

    await router.load();

    expect(router.options.context.scope).toBe("a scope");
  });
});
