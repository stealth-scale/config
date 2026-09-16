import { describe, expect, it } from "vitest";

import * as build from "#build/index.ts";

describe("vite-config", () => {
  it("publishes the presets an application picks from", () => {
    expect(Object.keys(build.preset).toSorted()).toStrictEqual(["base", "web"]);
  });

  it("publishes the layers an application adds one at a time", () => {
    for (const verb of [
      "base",
      "chunks",
      "inventory",
      "licences",
      "manifest",
      "preload",
      "sourcemaps",
    ]) {
      expect(Object.keys(build), `${verb} is not published`).toContain(verb);
    }
  });

  it("publishes nothing a layer here uses internally", () => {
    expect(Object.keys(build).toSorted()).toStrictEqual([
      "base",
      "chunks",
      "inventory",
      "licences",
      "manifest",
      "preload",
      "preset",
      "sourcemaps",
    ]);
  });
});
