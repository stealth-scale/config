import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-theme";
import foundation from "@stealthscale/theme/theme";

import { asphalt } from "#asphalt/index.ts";

describe("asphalt", () => {
  it("keeps the theme contract and clears every contrast pair at 4.5:1 in both modes", () => {
    expect(
      violations(asphalt, {
        at: import.meta.dirname,
        base: foundation,
        recipes: {},
        thresholds: { text: 4.5 },
      }),
    ).toStrictEqual([]);
  });

  it("names itself as a page writes the attribute", () => {
    expect(asphalt.name).toBe("asphalt");
  });

  it("names the font packages it depends on", () => {
    expect(asphalt.fonts).toStrictEqual(["@fontsource-variable/inter"]);
  });

  it("extends no recipe", () => {
    expect(asphalt.preset.theme?.extend?.recipes).toBeUndefined();
  });

  it("carries its values in the shape an attribute switches to", () => {
    expect(asphalt.variant.tokens).toBeDefined();
    expect(asphalt.variant.semanticTokens).toBeDefined();
  });
});
