import { expect, test } from "vite-plus/test";

import * as published from "#index.ts";

/**
 * What a repository that renders reaches for.
 *
 * A block's namespace joins this list when that block exists, which is what the exact comparison
 * below is for: a surface grows because somebody meant it to.
 */
const SURFACE = ["fmt", "lint", "override", "plugin", "preset"];

test("publishes what a repository that renders needs", () => {
  expect(Object.keys(published).toSorted()).toEqual(SURFACE.toSorted());
});
