import { describe, expect, it } from "vitest";

import * as barrel from "#section/index.ts";

describe("index", () => {
  it("names every part a caller composes", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "Action",
      "Actions",
      "Body",
      "Description",
      "Folded",
      "Footer",
      "Header",
      "Root",
      "Title",
    ]);
  });

  it("publishes neither the recipe nor the binding", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use|ROOM)/u);
    }
  });
});
