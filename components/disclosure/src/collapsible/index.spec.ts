import { describe, expect, it } from "vitest";

import { rootedViolations } from "@stealthscale/testing-react";

import { Content } from "#collapsible/content.tsx";
import * as barrel from "#collapsible/index.ts";
import { Indicator } from "#collapsible/indicator.tsx";
import { Trigger } from "#collapsible/trigger.tsx";

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

  it("refuses every part drawn outside the root that holds it together", () => {
    expect(
      rootedViolations(
        { Content, Indicator, Trigger },
        "A part of Collapsible was drawn outside the root that holds it together.",
      ),
    ).toStrictEqual([]);
  });
});
