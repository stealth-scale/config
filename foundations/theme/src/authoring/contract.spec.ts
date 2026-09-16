import { describe, expect, expectTypeOf, it } from "vitest";

import {
  BACKGROUNDS,
  BORDERS,
  contract,
  FOREGROUNDS,
  type HuePalette,
  HUES,
  type Moded,
  MODES,
  type PaletteRoles,
  PALETTES,
  ROLES,
  STATUSES,
  type ThemeTokens,
} from "#authoring/contract.ts";

describe("contract", () => {
  it("lists twelve roles with the dotted ones nested under their group", () => {
    expect(ROLES).toHaveLength(12);
    expect(ROLES).toContain("border.hover");

    expectTypeOf<PaletteRoles<string>["border"]>().toEqualTypeOf<
      Record<"DEFAULT", string> & Record<"hover", string>
    >();
    expectTypeOf<PaletteRoles<string>["bg"]>().toEqualTypeOf<string>();
  });

  it("lists the two modes with the base mode first", () => {
    expect(MODES).toStrictEqual(["base", "_dark"]);

    expectTypeOf<HuePalette["solid"]["hover"]>().toEqualTypeOf<Moded>();
    expectTypeOf<{ bg: Moded }>().not.toExtend<HuePalette>();
  });

  it("lists eleven hues and eight palettes and requires each of a root theme", () => {
    expect(HUES).toHaveLength(11);
    expect(PALETTES).toHaveLength(8);
    expect(PALETTES).toStrictEqual(expect.arrayContaining([...STATUSES]));

    expectTypeOf<ThemeTokens["colors"]>().toHaveProperty("indigo");
    expectTypeOf<ThemeTokens["colors"]>().toHaveProperty("primary");
    expectTypeOf<ThemeTokens["colors"]>().toHaveProperty("fg");
  });

  it("names the group's own value DEFAULT in every family", () => {
    expect(BACKGROUNDS).toContain("DEFAULT");
    expect(FOREGROUNDS).toContain("DEFAULT");
    expect(BORDERS).toContain("DEFAULT");
  });

  it("returns the variant it was handed", () => {
    const variant = { semanticTokens: {} as ThemeTokens, tokens: {} };

    expect(contract(variant)).toBe(variant);
  });
});
