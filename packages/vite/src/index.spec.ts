import { expect, test } from "vite-plus/test";

import * as published from "#index.ts";

/**
 * What a config is written with, and what another config package builds layers with.
 *
 * A block's namespace joins this list when that block exists, which is what the exact comparison
 * below is for: a surface grows because somebody meant it to.
 */
const SURFACE = [
  "configuring",
  "contribute",
  "define",
  "defineConfig",
  "fmt",
  "layout",
  "lint",
  "override",
  "owned",
  "preset",
  "remove",
  "resolve",
  "server",
];

/**
 * How layers are merged, where a contribution finds its list, how provenance is recorded.
 *
 * Every one of these is machinery `defineConfig` uses. Published, each becomes API that cannot
 * change without a major version, for nobody's benefit.
 */
const WITHHELD = [
  "appended",
  "at",
  "flattened",
  "isLayer",
  "leaves",
  "merged",
  "NOTHING",
  "replaced",
  "resolved",
  "surviving",
  "why",
  "wrote",
];

test("publishes what a config and a config package need", () => {
  for (const name of SURFACE) {
    expect(Object.keys(published), `${name} is not published`).toContain(name);
  }
});

test("withholds the machinery that composes them", () => {
  for (const name of WITHHELD) {
    expect(Object.keys(published), `${name} is published`).not.toContain(name);
  }
});

test("publishes nothing beyond what is named here, so a surface grows deliberately", () => {
  expect(Object.keys(published).toSorted()).toEqual(SURFACE.toSorted());
});
