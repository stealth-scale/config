import { describe, expect, it } from "vitest";

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
  "named",
  "override",
  "owned",
  "pack",
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

describe("vite-config", () => {
  it("publishes what a config and a config package need", () => {
    for (const name of SURFACE) {
      expect(Object.keys(published), `${name} is not published`).toContain(name);
    }
  });

  it("exports none of the machinery that composes them", () => {
    for (const name of WITHHELD) {
      expect(Object.keys(published), `${name} is published`).not.toContain(name);
    }
  });

  it("publishes nothing beyond what is named here", () => {
    expect(Object.keys(published).toSorted()).toStrictEqual(SURFACE.toSorted());
  });
});
