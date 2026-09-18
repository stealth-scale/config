import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-theme";
import foundation from "@stealthscale/theme/theme";

import { graphite } from "#graphite/index.ts";

describe("graphite", () => {
  it("keeps the theme contract and clears every contrast pair at 4.5:1 in both modes", () => {
    expect(
      violations(graphite, {
        at: import.meta.dirname,
        base: foundation,
        recipes: {},
        thresholds: { text: 4.5 },
      }),
    ).toStrictEqual([]);
  });

  it("names itself as a page writes the attribute", () => {
    expect(graphite.name).toBe("graphite");
  });

  it("names the font packages it depends on", () => {
    expect(graphite.fonts).toStrictEqual(["@fontsource-variable/mona-sans"]);
  });

  it("extends no recipe", () => {
    expect(graphite.preset.theme?.extend?.recipes).toBeUndefined();
  });

  it("carries its values in the shape an attribute switches to", () => {
    expect(graphite.variant.tokens).toBeDefined();
    expect(graphite.variant.semanticTokens).toBeDefined();
  });
});
