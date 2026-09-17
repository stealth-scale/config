import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-theme";
import foundation from "@stealthscale/theme/theme";

import { folio } from "#index.ts";

describe("folio", () => {
  it("keeps the theme contract and clears every contrast pair in both modes", () => {
    expect(
      violations(folio, { at: import.meta.dirname, base: foundation, recipes: [] }),
    ).toStrictEqual([]);
  });

  it("names itself as a page writes the attribute", () => {
    expect(folio.name).toBe("folio");
  });

  it("states its text styles in the preset alone", () => {
    expect(folio.preset.theme?.extend?.textStyles).toBeDefined();
    expect(folio.variant).not.toHaveProperty("textStyles");
  });

  it("extends no recipe", () => {
    expect(folio.preset.theme?.extend?.recipes).toBeUndefined();
  });
});
