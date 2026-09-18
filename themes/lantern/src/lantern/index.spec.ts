import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-theme";
import foundation from "@stealthscale/theme/theme";

import { lantern } from "#lantern/index.ts";

describe("lantern", () => {
  it("keeps the theme contract and clears every contrast pair at 4.5:1 in both modes", () => {
    expect(
      violations(lantern, {
        at: import.meta.dirname,
        base: foundation,
        recipes: {},
        thresholds: { text: 4.5 },
      }),
    ).toStrictEqual([]);
  });

  it("names itself as a page writes the attribute", () => {
    expect(lantern.name).toBe("lantern");
  });

  it("names the font packages it depends on", () => {
    expect(lantern.fonts).toStrictEqual([]);
  });

  it("extends no recipe", () => {
    expect(lantern.preset.theme?.extend?.recipes).toBeUndefined();
  });

  it("carries its values in the shape an attribute switches to", () => {
    expect(lantern.variant.tokens).toBeDefined();
    expect(lantern.variant.semanticTokens).toBeDefined();
  });
});
