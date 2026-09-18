import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-theme";
import foundation from "@stealthscale/theme/theme";

import { steel } from "#steel/index.ts";

describe("steel", () => {
  it("keeps the theme contract and clears every contrast pair at 4.5:1 in both modes", () => {
    expect(
      violations(steel, {
        at: import.meta.dirname,
        base: foundation,
        recipes: {},
        thresholds: { text: 4.5 },
      }),
    ).toStrictEqual([]);
  });

  it("names itself as a page writes the attribute", () => {
    expect(steel.name).toBe("steel");
  });

  it("names the font packages it depends on", () => {
    expect(steel.fonts).toStrictEqual([
      "@fontsource-variable/ibm-plex-sans",
      "@fontsource/ibm-plex-mono",
    ]);
  });

  it("extends no recipe", () => {
    expect(steel.preset.theme?.extend?.recipes).toBeUndefined();
  });

  it("carries its values in the shape an attribute switches to", () => {
    expect(steel.variant.tokens).toBeDefined();
    expect(steel.variant.semanticTokens).toBeDefined();
  });
});
