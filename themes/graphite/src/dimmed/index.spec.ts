import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-theme";
import foundation from "@stealthscale/theme/theme";

import { graphiteDimmed } from "#dimmed/index.ts";
import { graphite } from "#graphite/index.ts";

describe("graphiteDimmed", () => {
  it("keeps the theme contract and clears every contrast pair at 4.5:1 in both modes", () => {
    expect(
      violations(graphiteDimmed, {
        at: import.meta.dirname,
        base: foundation,
        recipes: {},
        thresholds: { text: 4.5 },
      }),
    ).toStrictEqual([]);
  });

  it("names itself as a page writes the attribute", () => {
    expect(graphiteDimmed.name).toBe("graphite-dimmed");
  });

  it("nests Graphite's preset beneath its own", () => {
    expect(graphiteDimmed.preset.presets).toStrictEqual([graphite.preset]);
  });

  it("names the same font packages as Graphite", () => {
    expect(graphiteDimmed.fonts).toStrictEqual(graphite.fonts);
  });
});
