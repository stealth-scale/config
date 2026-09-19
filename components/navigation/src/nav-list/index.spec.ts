import { describe, expect, it } from "vitest";

import * as barrel from "#nav-list/index.ts";

describe("index", () => {
  it("names every part a caller composes", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "Action",
      "Badge",
      "Branch",
      "Content",
      "Indicator",
      "Item",
      "Link",
      "Root",
      "Skeleton",
      "Trigger",
    ]);
  });

  it("publishes neither the recipe nor the binding", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use)/u);
    }
  });
});
