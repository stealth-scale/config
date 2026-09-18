import { describe, expect, it } from "vitest";

import { routed } from "#routes.ts";

describe("routes", () => {
  it("serves the list and the invoice beneath it", () => {
    expect(Object.keys(routed().routesById)).toStrictEqual([
      "__root__",
      "/invoices",
      "/invoices/$id",
    ]);
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
