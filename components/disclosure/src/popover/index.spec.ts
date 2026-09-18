import { describe, expect, it } from "vitest";

import { rootedViolations } from "@stealthscale/testing-react";

import * as barrel from "#popover/index.ts";

describe("index", () => {
  it("names every part and nothing beside it", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "Anchor",
      "Arrow",
      "ArrowTip",
      "CloseTrigger",
      "Content",
      "Description",
      "Indicator",
      "Positioner",
      "Root",
      "Title",
      "Trigger",
    ]);
  });

  it("publishes neither the recipe nor the binding nor the machine", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use|split|ApiProvider|PropsProvider)/u);
    }
  });

  it("refuses every part drawn outside the root that holds it together", () => {
    // The root is the one part that runs without another above it.
    const { Root: _root, ...parts } = barrel;

    expect(
      rootedViolations(
        parts,
        "A part of Popover was drawn outside the root that holds it together.",
      ),
    ).toStrictEqual([]);
  });
});
