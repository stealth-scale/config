import { describe, expect, it } from "vitest";

import * as barrel from "#focus/index.ts";

describe("index", () => {
  it("names the one hook a screen component takes the reader with", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual(["useFocused"]);
  });

  it("publishes neither a recipe nor a binding", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with)/u);
    }
  });
});
