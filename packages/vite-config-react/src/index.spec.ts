import { describe, expect, it } from "vitest";

import * as published from "#index.ts";

/**
 * What a repository that renders reaches for.
 *
 * A block's namespace joins this list when that block exists, which is what the exact comparison
 * below is for: a surface grows because somebody meant it to.
 */
const SURFACE = ["federation", "fmt", "layers", "lint", "plugin", "test", "workspace"];

describe("vite-config-react", () => {
  it("publishes what a repository that renders needs", () => {
    expect(Object.keys(published).toSorted()).toStrictEqual(SURFACE.toSorted());
  });
});
