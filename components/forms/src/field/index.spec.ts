import { describe, expect, it } from "vitest";

import * as barrel from "#field/index.ts";

describe("index", () => {
  it("names every part and the hook that reads the field's state", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "Control",
      "Counter",
      "ErrorText",
      "HelperText",
      "Label",
      "RequiredIndicator",
      "Root",
      "useField",
    ]);
  });

  it("publishes neither the recipe nor the binding", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|PropsProvider)/u);
    }
  });
});
