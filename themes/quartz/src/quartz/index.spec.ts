import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-theme";
import foundation from "@stealthscale/theme/theme";

import { quartz } from "#quartz/index.ts";

describe("quartz", () => {
  it("keeps the theme contract and clears every contrast pair at 4.5:1 in both modes", () => {
    expect(
      violations(quartz, {
        at: import.meta.dirname,
        base: foundation,
        recipes: {},
        thresholds: { text: 4.5 },
      }),
    ).toStrictEqual([]);
  });

  it("names itself as a page writes the attribute", () => {
    expect(quartz.name).toBe("quartz");
  });

  it("names the font packages it depends on", () => {
    expect(quartz.fonts).toStrictEqual(["@fontsource-variable/roboto"]);
  });

  it("extends no recipe", () => {
    expect(quartz.preset.theme?.extend?.recipes).toBeUndefined();
  });

  it("carries its values in the shape an attribute switches to", () => {
    expect(quartz.variant.tokens).toBeDefined();
    expect(quartz.variant.semanticTokens).toBeDefined();
  });
});
