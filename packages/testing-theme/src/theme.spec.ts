import { describe, expect, it } from "vitest";

import { defineTheme } from "@stealthscale/theme/authoring";
import foundation from "@stealthscale/theme/theme";

import { foundationTheme, paletteTheme } from "#theme.fixtures.ts";
import { extendedRecipes, fontsOf, palettesOf, resolved } from "#theme.ts";

describe("theme", () => {
  it("reads a color written outright in one mode", () => {
    expect(resolved(paletteTheme(), { value: { _dark: "b", base: "a" } }, "base")).toBe("a");
  });

  it("follows a reference to a step of the theme's own ramp", () => {
    const value = resolved(paletteTheme(), { value: "{colors.primary.500}" }, "base");

    expect(value).toBe("oklch(58.0% 0.1400 262.0)");
  });

  it("follows a reference through a role to a step", () => {
    const theme = paletteTheme();

    expect(resolved(theme, { value: "{colors.primary.solid}" }, "base")).toBe(
      "oklch(37.0% 0.1260 262.0)",
    );
    expect(resolved(theme, { value: "{colors.primary.solid.hover}" }, "_dark")).toBe(
      "oklch(80.0% 0.1092 262.0)",
    );
  });

  it("follows a reference into the base preset when the theme leaves the scale alone", () => {
    const value = resolved(paletteTheme(), { value: "{colors.red.600}" }, "base", {
      base: foundation,
    });

    expect(value).toMatch(/^oklch\(/u);
  });

  it("follows a reference into the base preset's semantic tokens", () => {
    const value = resolved(paletteTheme(), { value: "{colors.bg.panel}" }, "_dark", {
      base: foundation,
    });

    expect(value).toMatch(/^oklch\(/u);
  });

  it("returns undefined where the reference names a step nothing defines", () => {
    expect(resolved(paletteTheme(), { value: "{colors.primary.999}" }, "base")).toBeUndefined();
    expect(resolved(paletteTheme(), { value: "{colors.red.600}" }, "base")).toBeUndefined();
  });

  it("returns undefined where two references name each other", () => {
    const theme = paletteTheme({
      contrast: { value: "{colors.primary.solid}" },
      solid: { value: "{colors.primary.contrast}" },
    });

    expect(resolved(theme, { value: "{colors.primary.solid}" }, "base")).toBeUndefined();
  });

  it("returns undefined where a reference names itself", () => {
    const theme = paletteTheme({ solid: { value: "{colors.primary.solid}" } });

    expect(resolved(theme, { value: "{colors.primary.solid}" }, "base")).toBeUndefined();
  });

  it("returns undefined where the mode was never stated", () => {
    expect(resolved(paletteTheme(), { value: { base: "a" } }, "_dark")).toBeUndefined();
  });

  it("returns undefined where the reference names another category", () => {
    expect(resolved(paletteTheme(), { value: "{radii.l2}" }, "base")).toBeUndefined();
    expect(resolved(paletteTheme(), { value: "{colors}" }, "base")).toBeUndefined();
  });

  it("reads one string in either mode", () => {
    expect(resolved(paletteTheme(), { value: "{colors.primary.500}" }, "_dark")).toBe(
      "oklch(58.0% 0.1400 262.0)",
    );
  });

  it("lists every group with a solid fill as a palette", () => {
    expect(palettesOf(paletteTheme())).toStrictEqual(["primary"]);
    expect(palettesOf(foundationTheme())).toHaveLength(19);
    expect(palettesOf(foundationTheme())).not.toContain("bg");
  });

  it("lists no palette for a theme that states no color", () => {
    expect(palettesOf({ ...paletteTheme(), variant: {} })).toStrictEqual([]);
  });

  it("lists the recipe keys a theme's own preset extends", () => {
    const theme = defineTheme({
      extends: foundationTheme(),
      name: "abyss",
      recipes: { button: { base: {} } },
      slotRecipes: { dialog: { base: {} } },
    });

    expect(extendedRecipes(theme)).toStrictEqual(["button", "dialog"]);
    expect(extendedRecipes(paletteTheme())).toStrictEqual([]);
  });

  it("lists the font packages a theme names sorted", () => {
    expect(fontsOf({ ...paletteTheme(), fonts: ["@f/mono", "@f/body"] })).toStrictEqual([
      "@f/body",
      "@f/mono",
    ]);
  });
});
