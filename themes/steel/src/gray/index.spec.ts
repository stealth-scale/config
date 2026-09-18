import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-theme";
import foundation from "@stealthscale/theme/theme";

import { steelGray } from "#gray/index.ts";
import { steel } from "#steel/index.ts";

describe("steelGray", () => {
  it("keeps the theme contract and clears every contrast pair at 4.5:1 in both modes", () => {
    expect(
      violations(steelGray, {
        at: import.meta.dirname,
        base: foundation,
        recipes: {},
        thresholds: { text: 4.5 },
      }),
    ).toStrictEqual([]);
  });

  it("names itself as a page writes the attribute", () => {
    expect(steelGray.name).toBe("steel-gray");
  });

  it("nests Steel's preset beneath its own", () => {
    expect(steelGray.preset.presets).toStrictEqual([steel.preset]);
  });

  it("names the same font packages as Steel", () => {
    expect(steelGray.fonts).toStrictEqual(steel.fonts);
  });
});
