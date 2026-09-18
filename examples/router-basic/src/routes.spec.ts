import { type RegisteredRouter, type RouteIds } from "@tanstack/react-router";
import { describe, expect, expectTypeOf, it } from "vitest";

import { routed } from "#routes.ts";

/**
 * Every route this application serves, which the library only knows once the router is registered.
 */
type Served = "__root__" | "/" | "/invoices" | "/invoices/$id";

describe("routes", () => {
  it("registers this application's router with the library", () => {
    expectTypeOf<RouteIds<RegisteredRouter["routeTree"]>>().toEqualTypeOf<Served>();

    expect(routed().routesById).toBeDefined();
  });

  it("serves the list and the invoice beneath it", () => {
    expect(Object.keys(routed().routesById)).toStrictEqual([
      "__root__",
      "/",
      "/invoices",
      "/invoices/$id",
    ]);
  });

  it("sends the site root to the list", async () => {
    const router = routed();

    await router.navigate({ to: "/" });
    await router.load();

    expect(router.state.location.pathname).toBe("/invoices");
  });

  it("builds a router of its own each time", () => {
    expect(routed()).not.toBe(routed());
  });

  it("preloads a page the pointer rests on", () => {
    expect(routed().options.defaultPreload).toBe("intent");
  });

  it("restores the scroll position on the way back", () => {
    expect(routed().options.scrollRestoration).toBe(true);
  });
});
