import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-theme";
import foundation from "@stealthscale/theme/theme";

import { fathom } from "#index.ts";

describe("fathom", () => {
  it("keeps the theme contract and clears every contrast pair in both modes", () => {
    expect(
      violations(fathom, { at: import.meta.dirname, base: foundation, recipes: {} }),
    ).toStrictEqual([]);
  });

  it("names itself as a page writes the attribute", () => {
    expect(fathom.name).toBe("fathom");
  });

  it("names no font package", () => {
    expect(fathom.fonts).toStrictEqual([]);
  });

  it("extends no recipe", () => {
    expect(fathom.preset.theme?.extend?.recipes).toBeUndefined();
  });

  it("carries its values in the shape an attribute switches to", () => {
    expect(fathom.variant.tokens).toBeDefined();
    expect(fathom.variant.semanticTokens).toBeDefined();
  });
});
