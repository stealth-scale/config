import { describe, expect, it } from "vitest";

import { routerDefaults } from "#defaults.ts";
import { routeMap } from "#map.ts";
import { routerOptions } from "#options.ts";
import { createRootRoute } from "#tanstack.ts";

describe("routerOptions", () => {
  it("returns every default this design system states", () => {
    expect(routerOptions({})).toMatchObject(routerDefaults);
  });

  it("hands the router whatever context a caller states", () => {
    const scope = { query: "a client" };

    expect(routerOptions({ scope }).context.scope).toBe(scope);
  });

  it("carries the route map a component resolves a declared id through", () => {
    const named = routeMap(createRootRoute({}));

    expect(routerOptions({ routes: named }).context.routes).toBe(named);
  });

  it("returns nothing beside the defaults but the context", () => {
    expect(Object.keys(routerOptions({}))).toStrictEqual([
      ...Object.keys(routerDefaults),
      "context",
    ]);
  });
});
