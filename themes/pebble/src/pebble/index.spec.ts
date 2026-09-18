import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-theme";
import foundation from "@stealthscale/theme/theme";

import { pebble } from "#pebble/index.ts";

describe("pebble", () => {
  it("keeps the theme contract and clears every contrast pair at 4.5:1 in both modes", () => {
    expect(
      violations(pebble, {
        at: import.meta.dirname,
        base: foundation,
        recipes: {},
        thresholds: { text: 4.5 },
      }),
    ).toStrictEqual([]);
  });

  it("names itself as a page writes the attribute", () => {
    expect(pebble.name).toBe("pebble");
  });

  it("names the font packages it depends on", () => {
    expect(pebble.fonts).toStrictEqual([
      "@fontsource-variable/geist",
      "@fontsource-variable/geist-mono",
    ]);
  });

  it("extends no recipe", () => {
    expect(pebble.preset.theme?.extend?.recipes).toBeUndefined();
  });

  it("carries its values in the shape an attribute switches to", () => {
    expect(pebble.variant.tokens).toBeDefined();
    expect(pebble.variant.semanticTokens).toBeDefined();
  });
});
