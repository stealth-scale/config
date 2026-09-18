import { describe, expect, it } from "vitest";

import * as barrel from "#fieldset/index.ts";

describe("index", () => {
  it("names every part and the hook that reads the group's state", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "ErrorText",
      "HelperText",
      "Legend",
      "Root",
      "useFieldset",
    ]);
  });

  it("publishes neither the recipe nor the binding", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|PropsProvider)/u);
    }
  });
});
