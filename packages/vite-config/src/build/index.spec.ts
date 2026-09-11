import { expect, test } from "vite-plus/test";

import * as build from "#build/index.ts";

test("publishes the presets an application picks from, under one name", () => {
  expect(Object.keys(build.preset).toSorted()).toEqual(["base", "web"]);
});

test("publishes the layers an application states one at a time, beside them", () => {
  for (const verb of ["inventory", "licences", "manifest", "preload", "served", "sourcemaps"]) {
    expect(Object.keys(build), `${verb} is not published`).toContain(verb);
  }
});

test("publishes nothing a layer here reaches for on its own", () => {
  expect(Object.keys(build).toSorted()).toEqual([
    "inventory",
    "licences",
    "manifest",
    "preload",
    "preset",
    "served",
    "sourcemaps",
  ]);
});
