import { describe, expect, it } from "vitest";

import * as barrel from "#index.ts";

describe("index", () => {
  it("names every component the package publishes and what narrows their rows", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "Listbox",
      "Table",
      "useFilter",
      "useListCollection",
    ]);
  });

  it("publishes a component with parts as a namespace of its short names", () => {
    expect(Object.keys(barrel.Listbox).toSorted()).toStrictEqual([
      "Content",
      "Input",
      "Item",
      "ItemGroup",
      "ItemGroupLabel",
      "ItemIndicator",
      "ItemText",
      "Label",
      "Root",
      "ValueText",
    ]);
  });

  it("publishes neither a recipe nor a binding", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with)/u);
    }
  });
});
