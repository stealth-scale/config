import { describe, expect, test } from "vitest";

import { PATHS, routed } from "#routes.tsx";

describe("routes", () => {
  test("answers its own address and the one the other application's module sits at", () => {
    expect([...PATHS]).toStrictEqual(["/", "/reports"]);
  });

  test("builds a router holding every path it names", () => {
    const held = Object.keys(routed().routesById);

    for (const path of PATHS) {
      expect(held).toContain(path);
    }
  });

  test("builds a router of its own each time, so one test cannot navigate another's", () => {
    expect(routed()).not.toBe(routed());
  });
});
