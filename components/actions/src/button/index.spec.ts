import { describe, expect, it } from "vitest";

import * as barrel from "#button/index.ts";

describe("index", () => {
  it("names every export and nothing beside it", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "Button",
      "ButtonPropsProvider",
      "IconButton",
    ]);
  });

  it("publishes neither the recipe nor the binding", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use|PropsProvider)/u);
    }
  });
});
