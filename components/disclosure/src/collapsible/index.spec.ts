import { describe, expect, it } from "vitest";

import * as barrel from "#collapsible/index.ts";

describe("index", () => {
  it("names every part and nothing beside it", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "Content",
      "Indicator",
      "Root",
      "Trigger",
    ]);
  });

  it("publishes neither the recipe nor the binding nor the machine", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use|split|ApiProvider|PropsProvider)/u);
    }
  });
});
