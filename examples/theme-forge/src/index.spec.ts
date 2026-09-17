import { describe, expect, it } from "vitest";

import actions from "@stealthscale/example-lib-actions/theme";
import surfaces from "@stealthscale/example-lib-surfaces/theme";
import { extendedRecipes, publishedRecipes, violations } from "@stealthscale/testing-theme";
import foundation from "@stealthscale/theme/theme";

import { forge } from "#index.ts";

const published = publishedRecipes(actions, surfaces);

describe("forge", () => {
  it("keeps the theme contract and clears every contrast pair in both modes", () => {
    expect(
      violations(forge, {
        at: import.meta.dirname,
        base: foundation,
        recipes: published,
      }),
    ).toStrictEqual([]);
  });

  it("names itself as a page writes the attribute", () => {
    expect(forge.name).toBe("forge");
  });

  it("extends the button and the card and nothing else", () => {
    expect(extendedRecipes(forge)).toStrictEqual(["button", "card"]);
  });

  it("reports each extension under a key no package publishes", () => {
    expect(violations(forge, { base: foundation, recipes: [] })).toStrictEqual([
      "contract.extensions: forge extends button, which no package publishes",
      "contract.extensions: forge extends card, which no package publishes",
    ]);
  });
});
