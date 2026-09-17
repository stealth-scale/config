import { describe, expect, it } from "vitest";

import { semanticTokens } from "#semantic-tokens.ts";

describe("semanticTokens", () => {
  it("moves the pages and two palettes and the corners and nothing else", () => {
    expect(Object.keys(semanticTokens).toSorted()).toStrictEqual(["colors", "radii"]);
    expect(Object.keys(semanticTokens.colors ?? {}).toSorted()).toStrictEqual([
      "accent",
      "bg",
      "primary",
    ]);
  });

  it("points the primary palette at the indigo and the accent at the teal", () => {
    expect(semanticTokens.colors?.["primary"]).toMatchObject({
      solid: { DEFAULT: { value: "{colors.indigo.solid}" } },
    });
    expect(semanticTokens.colors?.["accent"]).toMatchObject({
      solid: { DEFAULT: { value: "{colors.teal.solid}" } },
    });
  });

  it("places the page deeper than Fathom's in both modes", () => {
    expect(semanticTokens.colors?.["bg"]).toMatchObject({
      DEFAULT: { value: { _dark: "oklch(6.0% 0.0200 195.0)", base: "oklch(93.0% 0.0200 195.0)" } },
    });
  });

  it("rounds the largest corner to half a rem", () => {
    expect(semanticTokens.radii?.["l3"]).toStrictEqual({ value: "0.5rem" });
  });
});
