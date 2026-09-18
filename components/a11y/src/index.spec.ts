import { describe, expect, it } from "vitest";

import * as barrel from "#index.ts";

describe("index", () => {
  it("names every component the package publishes and nothing beside them", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "RovingFocus",
      "SkipNav",
      "VisuallyHidden",
      "VisuallyHiddenPropsProvider",
    ]);
  });

  it("publishes a component with parts as a namespace of its short names", () => {
    expect(Object.keys(barrel.SkipNav).toSorted()).toStrictEqual([
      "Link",
      "SKIP_NAV_TARGET",
      "Target",
    ]);
    expect(Object.keys(barrel.RovingFocus).toSorted()).toStrictEqual(["Item", "Root"]);
  });

  it("publishes neither a recipe nor a binding", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use)/u);
    }
  });
});
