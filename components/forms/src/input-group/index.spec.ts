import { describe, expect, it } from "vitest";

import * as barrel from "#input-group/index.ts";

describe("index", () => {
  it("names every part and nothing beside them", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual(["End", "Field", "Root", "Start"]);
  });

  it("publishes neither the recipe nor the binding", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use|PropsProvider)/u);
    }
  });
});
