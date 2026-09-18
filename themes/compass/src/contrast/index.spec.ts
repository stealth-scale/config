import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-theme";
import foundation from "@stealthscale/theme/theme";

import { compass } from "#compass/index.ts";
import { compassContrast } from "#contrast/index.ts";

describe("compassContrast", () => {
  it("keeps the theme contract and clears every contrast pair at 4.5:1 in both modes", () => {
    expect(
      violations(compassContrast, {
        at: import.meta.dirname,
        base: foundation,
        recipes: {},
        thresholds: { text: 4.5 },
      }),
    ).toStrictEqual([]);
  });

  it("names itself as a page writes the attribute", () => {
    expect(compassContrast.name).toBe("compass-contrast");
  });

  it("nests Compass's preset beneath its own", () => {
    expect(compassContrast.preset.presets).toStrictEqual([compass.preset]);
  });

  it("names the same font packages as Compass", () => {
    expect(compassContrast.fonts).toStrictEqual(compass.fonts);
  });
});
