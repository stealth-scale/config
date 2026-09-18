import { describe, expect, it } from "vitest";

import { PATHS, routed } from "#routes.ts";

describe("routes", () => {
  it("answers its own address and the one the other application's module sits at", () => {
    expect([...PATHS]).toStrictEqual(["/", "/reports"]);
  });

  it("builds a router holding every path it names", () => {
    const held = Object.keys(routed().routesById);

    for (const path of PATHS) {
      expect(held).toContain(path);
    }
  });

  it("builds a router of its own each time", () => {
    expect(routed()).not.toBe(routed());
  });
});
