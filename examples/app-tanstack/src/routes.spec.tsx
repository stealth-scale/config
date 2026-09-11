import { expect, test } from "vite-plus/test";

import { PATHS, routed } from "#routes.tsx";

test("answers its own address and the one the other application's module sits at", () => {
  expect([...PATHS]).toEqual(["/", "/reports"]);
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
