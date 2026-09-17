import { describe, expect, it } from "vitest";

import { foundationTheme, paletteTheme } from "#theme.fixtures.ts";

describe("fixtures", () => {
  it("wraps the foundation with its tokens and semantic tokens as the variant", () => {
    const theme = foundationTheme();

    expect(theme.name).toBe("foundation");
    expect(theme.variant.tokens).toBeDefined();
    expect(theme.variant.semanticTokens).toBeDefined();
  });

  it("builds a palette theme with the roles it was handed put over the ramp's", () => {
    const theme = paletteTheme({ solid: { value: "x" } });

    expect(theme.variant.semanticTokens?.colors?.["primary"]).toMatchObject({
      solid: { value: "x" },
    });
  });
});
