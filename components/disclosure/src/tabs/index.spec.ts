import { describe, expect, it } from "vitest";

import { rootedViolations } from "@stealthscale/testing-react";

import { Content } from "#tabs/content.tsx";
import * as barrel from "#tabs/index.ts";
import { Indicator } from "#tabs/indicator.tsx";
import { List } from "#tabs/list.tsx";
import { Trigger } from "#tabs/trigger.tsx";

describe("index", () => {
  it("names every part and nothing beside it", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "Content",
      "Indicator",
      "List",
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
        { Content, Indicator, List, Trigger },
        "A part of Tabs was drawn outside the root that holds it together.",
      ),
    ).toStrictEqual([]);
  });
});
