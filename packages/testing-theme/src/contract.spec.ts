import { describe, expect, it } from "vitest";

import { withScratchWorkspace } from "@stealthscale/testing";
import { defineRecipe, defineTheme } from "@stealthscale/theme/authoring";
import foundation from "@stealthscale/theme/theme";

import { compounds, extensions, listed, modes, references, roles, styles } from "#contract.ts";
import { foundationTheme, paletteTheme } from "#theme.fixtures.ts";

const EXTENSION = "export const extension = { base: {} };\n";

const button = defineRecipe({
  className: "button",
  compoundVariants: [{ css: {}, size: "lg", variant: "solid" }],
  variants: { size: { lg: {}, sm: {} }, variant: { ghost: {}, solid: {} } },
});

describe("contract", () => {
  it("passes the foundation on every check", () => {
    const theme = foundationTheme();

    expect(roles(theme)).toStrictEqual([]);
    expect(modes(theme)).toStrictEqual([]);
    expect(references(theme, {})).toStrictEqual([]);
    expect(extensions(theme, [])).toStrictEqual([]);
    expect(styles(theme)).toStrictEqual([]);
  });

  it("reports a role a palette leaves out", () => {
    const theme = paletteTheme({ focusRing: undefined, solid: { DEFAULT: { value: "x" } } });

    expect(roles(theme)).toStrictEqual([
      "audited primary.solid.hover is not stated",
      "audited primary.focusRing is not stated",
    ]);
  });

  it("reports a member a family leaves out", () => {
    const theme = {
      ...paletteTheme(),
      variant: { semanticTokens: { colors: { fg: { DEFAULT: { value: "x" } } } } },
    };

    expect(roles(theme)).toHaveLength(9);
    expect(roles(theme)[0]).toBe("audited fg.muted is not stated");
  });

  it("reports a color stated in one mode and not the other", () => {
    expect(modes(paletteTheme({ solid: { value: { base: "x" } } }))).toStrictEqual([
      "audited primary.solid is not stated in _dark",
    ]);
  });

  it("passes a color stated once and a reference", () => {
    expect(modes(paletteTheme({ solid: { value: "x" } }))).toStrictEqual([]);
  });

  it("reports a reference that points at a step nothing defines", () => {
    const theme = paletteTheme({ solid: { value: { _dark: "x", base: "{colors.primary.999}" } } });

    expect(references(theme, {})).toStrictEqual([
      "audited primary.solid in base names {colors.primary.999}, which nothing defines",
    ]);
  });

  it("resolves a reference through the base preset", () => {
    const theme = paletteTheme({ solid: { value: "{colors.red.600}" } });

    expect(references(theme, {})).toHaveLength(2);
    expect(references(theme, { base: foundation })).toStrictEqual([]);
  });

  it("reports an extension naming a key no package publishes", () => {
    const theme = defineTheme({
      extends: foundationTheme(),
      name: "abyss",
      recipes: { buton: { base: {} } },
    });

    expect(extensions(theme, ["button"])).toStrictEqual([
      "abyss extends buton, which no package publishes",
    ]);
    expect(extensions(theme)).toStrictEqual([]);
  });

  it("reports an extension naming a key the component owns", () => {
    const theme = defineTheme({
      extends: foundationTheme(),
      name: "abyss",
      slotRecipes: { dialog: { base: {} } },
    });
    const extension = theme.preset.theme?.extend?.slotRecipes?.["dialog"];

    Object.assign(extension ?? {}, { className: "dialog", slots: ["content"] });

    expect(extensions(theme, ["dialog"])).toStrictEqual([
      "abyss extends dialog with className, which the component owns",
      "abyss extends dialog with slots, which the component owns",
    ]);
  });

  it("passes a compound for a selection the recipe declares", () => {
    const theme = defineTheme({
      extends: foundationTheme(),
      name: "abyss",
      recipes: {
        button: { compoundVariants: [{ css: {}, size: "lg", variant: "solid" }] },
        dialog: { compoundVariants: [{ css: {}, open: true }] },
        input: { base: {} },
      },
    });

    expect(compounds(theme, { button, input: { className: "input" } })).toStrictEqual([]);
  });

  it("reports a compound for a selection the recipe does not declare", () => {
    const theme = defineTheme({
      extends: foundationTheme(),
      name: "abyss",
      recipes: { button: { compoundVariants: [{ css: {}, size: "sm", variant: "solid" }] } },
    });

    expect(compounds(theme, { button })).toStrictEqual([
      "abyss extends button with a compound for size-sm__variant-solid, which the recipe does not declare",
    ]);
  });

  it("reports a compound matched on a value a class name cannot carry", () => {
    const theme = defineTheme({
      extends: foundationTheme(),
      name: "abyss",
      recipes: { button: { compoundVariants: [{ css: {}, size: { color: "fg" } }] } },
    });
    const recipe = { ...button, compoundVariants: [null] };

    expect(compounds(theme, { button: recipe })).toStrictEqual([
      "abyss extends button with a compound matched on a value a class name cannot carry",
    ]);
  });

  it("reports an extension file the theme does not list", () => {
    const theme = defineTheme({
      extends: foundationTheme(),
      name: "abyss",
      recipes: { button: { base: {} } },
    });
    const found = withScratchWorkspace(
      { "src/recipes/button.ts": EXTENSION, "src/slot-recipes/dialog.ts": EXTENSION },
      (workspace) => listed(theme, workspace.path("src")),
    );

    expect(found).toStrictEqual(["abyss does not list slot-recipes/dialog.ts"]);
  });

  it("reports a source directory that is absent", () => {
    expect(listed(paletteTheme(), "/nowhere")).toStrictEqual([
      "audited has no source directory at /nowhere",
    ]);
  });

  it("reports a style that states nothing and a text style without a size", () => {
    const theme = defineTheme({
      extends: foundationTheme(),
      layerStyles: { card: { value: {} } },
      name: "abyss",
      textStyles: { hero: { value: { fontWeight: "bold" } } },
    });

    expect(styles(theme)).toStrictEqual([
      "abyss layerStyles.card states nothing",
      "abyss textStyles.hero states no fontSize",
    ]);
  });
});
