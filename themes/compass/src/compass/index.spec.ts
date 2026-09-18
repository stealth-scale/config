import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-theme";
import foundation from "@stealthscale/theme/theme";

import { compass } from "#compass/index.ts";

describe("compass", () => {
  it("keeps the theme contract and clears every contrast pair at 4.5:1 in both modes", () => {
    expect(
      violations(compass, {
        at: import.meta.dirname,
        base: foundation,
        recipes: {},
        thresholds: { text: 4.5 },
      }),
    ).toStrictEqual([]);
  });

  it("names itself as a page writes the attribute", () => {
    expect(compass.name).toBe("compass");
  });

  it("names the font packages it depends on", () => {
    expect(compass.fonts).toStrictEqual([
      "@fontsource-variable/ubuntu-sans",
      "@fontsource-variable/ubuntu-sans-mono",
    ]);
  });

  it("extends no recipe", () => {
    expect(compass.preset.theme?.extend?.recipes).toBeUndefined();
  });

  it("carries its values in the shape an attribute switches to", () => {
    expect(compass.variant.tokens).toBeDefined();
    expect(compass.variant.semanticTokens).toBeDefined();
  });
});
