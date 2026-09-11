import { expect, test } from "vite-plus/test";

import { FOREIGN } from "#ignore/foreign.ts";

test("names what was installed, built, reported, and the repository's own bookkeeping", () => {
  expect(FOREIGN).toEqual(["**/node_modules/**", "**/.git/**", "**/dist/**", "**/coverage/**"]);
});

test("keeps the two a runner walks past on its own, since naming the list replaces it", () => {
  expect(FOREIGN).toContain("**/node_modules/**");
  expect(FOREIGN).toContain("**/.git/**");
});
