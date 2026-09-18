import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-theme";
import foundation from "@stealthscale/theme/theme";

import { graphiteContrast } from "#contrast/index.ts";
import { graphite } from "#graphite/index.ts";

describe("graphiteContrast", () => {
  it("keeps the theme contract and clears every contrast pair at 4.5:1 in both modes", () => {
    expect(
      violations(graphiteContrast, {
        at: import.meta.dirname,
        base: foundation,
        recipes: {},
        skip: {
          "distinct.fills":
            "the dark end of the blue (dark), green (dark), orange (dark), pink (dark), purple (dark), red (dark), yellow (dark) ramp is too light for a third quiet fill under a pair of inks that read at 4.5:1, so the muted and emphasized fills share a step there",
        },
        thresholds: { text: 4.5 },
      }),
    ).toStrictEqual([]);
  });

  it("names itself as a page writes the attribute", () => {
    expect(graphiteContrast.name).toBe("graphite-contrast");
  });

  it("nests Graphite's preset beneath its own", () => {
    expect(graphiteContrast.preset.presets).toStrictEqual([graphite.preset]);
  });

  it("names the same font packages as Graphite", () => {
    expect(graphiteContrast.fonts).toStrictEqual(graphite.fonts);
  });
});
