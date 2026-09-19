import { describe, expect, it } from "vitest";

import * as barrel from "#toolbar/index.ts";

describe("index", () => {
  it("names every part a caller composes", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "Action",
      "Center",
      "End",
      "Folded",
      "Item",
      "Root",
      "Search",
      "Separator",
      "Start",
    ]);
  });

  it("publishes neither the recipe nor the binding", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use|GAP)/u);
    }
  });
});
