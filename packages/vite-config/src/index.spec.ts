import { expect, test } from "vite-plus/test";

import * as published from "#index.ts";

/**
 * What a config is written with, and what another config package builds layers with.
 *
 * A block's namespace joins this list when that block exists, which is what the exact comparison
 * below is for: a surface grows because somebody meant it to.
 */
const SURFACE = [
  "build",
  "configuring",
  "contribute",
  "define",
  "defineConfig",
  "deps",
  "federation",
  "fmt",
  "lint",
  "override",
  "pack",
  "owned",
  "preset",
  "preview",
  "remove",
  "resolve",
  "run",
  "server",
  "serving",
  "ssr",
  "staged",
  "test",
  "worker",
];

/**
 * How layers are composed, and where a contribution finds its list.
 *
 * Every one of these is machinery `defineConfig` uses. Published, each becomes API that cannot
 * change without a major version, for nobody's benefit.
 */
const WITHHELD = ["appended", "flattened", "isLayer", "resolved", "surviving"];

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
