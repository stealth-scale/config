import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-theme";
import foundation from "@stealthscale/theme/theme";

import { prism } from "#prism/index.ts";

describe("prism", () => {
  it("keeps the theme contract and clears every contrast pair at 4.5:1 in both modes", () => {
    expect(
      violations(prism, {
        at: import.meta.dirname,
        base: foundation,
        recipes: {},
        thresholds: { text: 4.5 },
      }),
    ).toStrictEqual([]);
  });

  it("names itself as a page writes the attribute", () => {
    expect(prism.name).toBe("prism");
  });

  it("names the font packages it depends on", () => {
    expect(prism.fonts).toStrictEqual([
      "@fontsource-variable/source-sans-3",
      "@fontsource-variable/source-code-pro",
    ]);
  });

  it("extends no recipe", () => {
    expect(prism.preset.theme?.extend?.recipes).toBeUndefined();
  });

  it("carries its values in the shape an attribute switches to", () => {
    expect(prism.variant.tokens).toBeDefined();
    expect(prism.variant.semanticTokens).toBeDefined();
  });
});
