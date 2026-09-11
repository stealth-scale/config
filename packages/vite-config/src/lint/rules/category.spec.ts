import { expect, test } from "vite-plus/test";

import { CATEGORIES } from "#lint/rules/category.ts";

test("denies the categories that name a defect", () => {
  expect(CATEGORIES).toEqual({
    correctness: "error",
    pedantic: "error",
    perf: "error",
    suspicious: "error",
  });
});

test("leaves the categories that name a position, which a linter cannot settle", () => {
  expect(CATEGORIES).not.toHaveProperty("restriction");
  expect(CATEGORIES).not.toHaveProperty("style");
});
