import { describe, expect, it } from "vitest";

import { extendedRecipes, violations } from "@stealthscale/testing-theme";
import foundation from "@stealthscale/theme/theme";

import { forge } from "#index.ts";

describe("forge", () => {
  it("keeps the theme contract and clears every contrast pair in both modes", () => {
    expect(
      violations(forge, { at: import.meta.dirname, base: foundation, recipes: ["button"] }),
    ).toStrictEqual([]);
  });

  it("names itself as a page writes the attribute", () => {
    expect(forge.name).toBe("forge");
  });

  it("extends the button and nothing else", () => {
    expect(extendedRecipes(forge)).toStrictEqual(["button"]);
  });

  it("reports the extension under a key no package publishes", () => {
    expect(violations(forge, { base: foundation, recipes: [] })).toStrictEqual([
      "contract.extensions: forge extends button, which no package publishes",
    ]);
  });
});
