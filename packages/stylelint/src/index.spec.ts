import { expect, test } from "vite-plus/test";

import * as published from "#index.ts";

/**
 * What a repository with stylesheets reaches for.
 *
 * A block's namespace joins this list when that block exists, which is what the exact comparison
 * below is for: a surface grows because somebody meant it to.
 */
const SURFACE = ["override", "plugin", "rules"];

test("publishes what a repository with stylesheets needs", () => {
  expect(Object.keys(published).toSorted()).toEqual(SURFACE.toSorted());
});
