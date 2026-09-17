import { describe, expect, it } from "vitest";

import { semanticTokens } from "#semantic-tokens.ts";

describe("semanticTokens", () => {
  it("points the primary palette at the teal ramp", () => {
    expect(semanticTokens.colors.primary.solid.DEFAULT.value).toBe("{colors.teal.solid}");
  });

  it("places the page near white in light mode and near black in dark mode", () => {
    expect(semanticTokens.colors.bg.DEFAULT.value).toStrictEqual({
      _dark: "oklch(11.0% 0.0160 195.0)",
      base: "oklch(96.0% 0.0160 195.0)",
    });
  });

  it("rounds the largest corner to one rem", () => {
    expect(semanticTokens.radii?.["l3"]).toStrictEqual({ value: "1rem" });
  });

  it("casts every shadow in the neutral hue", () => {
    expect(JSON.stringify(semanticTokens.shadows)).not.toMatch(/0\.02 (?!200 )/u);
  });
});
