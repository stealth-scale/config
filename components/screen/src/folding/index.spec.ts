import { describe, expect, it } from "vitest";

import * as barrel from "#folding/index.ts";

describe("index", () => {
  it("names the rules a row folds by and the priority an action states", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "FOLDED",
      "FOLDING",
      "PRIORITIES",
      "PRIORITY",
    ]);
  });

  it("publishes neither a recipe nor a binding", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use)/u);
    }
  });
});
