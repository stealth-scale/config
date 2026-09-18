import { describe, expect, it } from "vitest";

import { compileRoutes } from "#compile.ts";
import { namedRoute, routeMap } from "#map.ts";
import { type AnyRoute, createRootRoute, createRoute } from "#tanstack.ts";

/**
 * Draws nothing, standing in for a page.
 *
 * @returns Nothing.
 */
function Page(): null {
  return null;
}

/**
 * Builds a route a host wrote itself, named so a link reaches it.
 *
 * @param root - The route it hangs under.
 * @param id - The id to name it under, or nothing to leave it unnamed.
 * @param path - The path it serves.
 * @returns The route.
 */
function written(root: AnyRoute, id: string | undefined, path: string): AnyRoute {
  return createRoute({
    ...(id === undefined ? {} : namedRoute(id)),
    component: Page,
    getParentRoute: () => root,
    path,
  });
}

describe("namedRoute", () => {
  it("states the id under the key the compiler writes", () => {
    expect(namedRoute("app.settings")).toStrictEqual({
      staticData: { declared: { id: "app.settings" } },
    });
  });
});

describe("routeMap", () => {
  it("names a route a host wrote itself", () => {
    const root = createRootRoute({});
    const settings = written(root, "app.settings", "/settings");

    expect(routeMap(root.addChildren([settings])).get("app.settings")).toBe(settings);
  });

  it("names a route a compilation built beside one a host wrote", () => {
    const root = createRootRoute({});
    const compiled = compileRoutes([{ component: Page, id: "acme.one", path: "/one" }], {
      parent: root,
    });
    const tree = root.addChildren([written(root, "app.home", "/"), ...compiled]);

    expect([...routeMap(tree).keys()].toSorted()).toStrictEqual(["acme.one", "app.home"]);
  });

  it("names a route nested below another", () => {
    const root = createRootRoute({});
    const list = written(root, "app.invoices", "/invoices");
    const one = written(list, "app.invoice", "$id");

    expect(
      [...routeMap(root.addChildren([list.addChildren([one])])).keys()].toSorted(),
    ).toStrictEqual(["app.invoice", "app.invoices"]);
  });

  it("returns an empty map for a tree that names nothing", () => {
    const root = createRootRoute({});

    expect(routeMap(root.addChildren([written(root, undefined, "/")])).size).toBe(0);
  });

  it("returns an empty map for a tree with no children", () => {
    expect(routeMap(createRootRoute({})).size).toBe(0);
  });

  it("refuses two routes carrying one id", () => {
    const root = createRootRoute({});
    const tree = root.addChildren([
      written(root, "app.home", "/"),
      written(root, "app.home", "/elsewhere"),
    ]);

    expect(() => routeMap(tree)).toThrow("Two routes are named app.home.");
  });

  it("refuses an id a compilation already claimed", () => {
    const root = createRootRoute({});
    const compiled = compileRoutes([{ component: Page, id: "acme.one", path: "/one" }], {
      parent: root,
    });
    const tree = root.addChildren([written(root, "acme.one", "/elsewhere"), ...compiled]);

    expect(() => routeMap(tree)).toThrow("Two routes are named acme.one.");
  });

  it("refuses two routes serving one path under a shared parent", () => {
    const root = createRootRoute({});
    const tree = root.addChildren([
      written(root, "app.home", "/one"),
      written(root, "app.other", "/one"),
    ]);

    expect(() => routeMap(tree)).toThrow("Two routes serve the path /one under the same parent.");
  });

  it("refuses one path written with and without the slashes around it", () => {
    const root = createRootRoute({});
    const tree = root.addChildren([
      written(root, "app.slashed", "/home"),
      written(root, "app.bare", "home"),
      written(root, "app.trailing", "home/"),
    ]);

    expect(() => routeMap(tree)).toThrow("Two routes serve the path /home under the same parent.");
  });

  it("refuses a path a compilation placed under a layout that a host also wrote", () => {
    const root = createRootRoute({});
    const compiled = compileRoutes(
      [{ component: Page, id: "acme.one", layout: ["frame"], path: "/one" }],
      {
        layouts: { frame: ({ children }) => children },
        parent: root,
      },
    );
    const tree = root.addChildren([written(root, "app.one", "/one"), ...compiled]);

    expect(() => routeMap(tree)).toThrow("Two routes serve the path /one under the same parent.");
  });

  it("allows one path per parent at different levels", () => {
    const root = createRootRoute({});
    const list = written(root, "app.invoices", "/one");
    const nested = written(list, "app.invoice", "/one");

    expect(routeMap(root.addChildren([list.addChildren([nested])])).size).toBe(2);
  });

  it("looks through however many pathless routes stand between", () => {
    const root = createRootRoute({});
    const outer = createRoute({ getParentRoute: () => root, id: "_outer" });
    const middle = createRoute({ getParentRoute: () => outer, id: "_middle" });
    const inner = createRoute({ getParentRoute: () => middle, id: "_inner" });
    const tree = root.addChildren([
      outer.addChildren([
        middle.addChildren([inner.addChildren([written(inner, "app.deep", "/settings")])]),
      ]),
      written(root, "app.flat", "/settings"),
    ]);

    expect(() => routeMap(tree)).toThrow(
      "Two routes serve the path /settings under the same parent.",
    );
  });
});
