import { describe, expect, it } from "vitest";

import * as barrel from "#index.ts";

describe("index", () => {
  it("names every component the package publishes and nothing beside them", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "Blockquote",
      "Code",
      "Heading",
      "Icon",
      "Kbd",
      "List",
      "Text",
    ]);
  });

  it("publishes a component with parts as a namespace of its short names", () => {
    expect(Object.keys(barrel.List).toSorted()).toStrictEqual(["Indicator", "Item", "Root"]);
    expect(Object.keys(barrel.Blockquote).toSorted()).toStrictEqual([
      "Caption",
      "Content",
      "Icon",
      "Root",
    ]);
  });

  it("publishes neither a recipe nor a binding", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use|PropsProvider)/u);
    }
  });
});
