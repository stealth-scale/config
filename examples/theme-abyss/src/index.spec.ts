import { describe, expect, it } from "vitest";

import { fathom } from "@stealthscale/example-theme-fathom";
import { extendedRecipes, violations } from "@stealthscale/testing-theme";
import foundation from "@stealthscale/theme/theme";

import { abyss } from "#index.ts";

describe("abyss", () => {
  it("keeps the theme contract and clears every contrast pair in both modes", () => {
    expect(
      violations(abyss, {
        at: import.meta.dirname,
        base: foundation,
        recipes: ["badge", "button"],
      }),
    ).toStrictEqual([]);
  });

  it("names itself as a page writes the attribute", () => {
    expect(abyss.name).toBe("abyss");
  });

  it("nests Fathom's preset beneath its own", () => {
    expect(abyss.preset.presets).toStrictEqual([fathom.preset]);
  });

  it("carries Fathom's values where it states none of its own", () => {
    expect(abyss.variant.semanticTokens?.["colors"]).toMatchObject({
      fg: fathom.variant.semanticTokens?.["colors"]?.["fg"],
      teal: fathom.variant.semanticTokens?.["colors"]?.["teal"],
    });
    expect(abyss.variant.tokens?.["colors"]).toStrictEqual(fathom.variant.tokens?.["colors"]);
  });

  it("states its own values over Fathom's", () => {
    expect(abyss.variant.semanticTokens?.["colors"]).toMatchObject({
      primary: { solid: { DEFAULT: { value: "{colors.indigo.solid}" } } },
    });
    expect(abyss.variant.semanticTokens?.["radii"]).toMatchObject({ l3: { value: "0.5rem" } });
  });

  it("extends the badge and the button and nothing else", () => {
    expect(extendedRecipes(abyss)).toStrictEqual(["badge", "button"]);
  });
});
