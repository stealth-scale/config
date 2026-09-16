/**
 * Specifies which linter categories are denied and which are left alone.
 */

import { describe, expect, it } from "vitest";

import { CATEGORIES } from "#lint/rules/category.ts";

describe("category", () => {
  it("denies the categories that name a defect", () => {
    expect(CATEGORIES).toStrictEqual({
      correctness: "error",
      pedantic: "error",
      perf: "error",
      suspicious: "error",
    });
  });

  it("leaves the categories that name a position", () => {
    expect(CATEGORIES).not.toHaveProperty("restriction");
    expect(CATEGORIES).not.toHaveProperty("style");
  });
});
