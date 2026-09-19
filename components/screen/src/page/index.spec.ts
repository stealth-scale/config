import { describe, expect, it } from "vitest";

import * as barrel from "#page/index.ts";

describe("index", () => {
  it("names every part a caller composes", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "Action",
      "Actions",
      "Aside",
      "Banner",
      "Body",
      "Context",
      "Description",
      "Folded",
      "Footer",
      "Header",
      "Leading",
      "Meta",
      "Nav",
      "Palette",
      "Picker",
      "Root",
      "Tabs",
      "Title",
      "Toolbar",
      "Trail",
      "When",
    ]);
  });

  it("publishes neither the recipe nor the binding", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use|GUTTER|MEASURE|stuck)/u);
    }
  });
});
