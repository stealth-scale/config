import { describe, expect, it } from "vitest";

import { defineTheme, type Theme } from "#authoring/theme.ts";
import { semanticTokens } from "#preset/semantic-tokens/index.ts";

function root(): Theme {
  return defineTheme({
    fonts: ["@f/base"],
    name: "fathom",
    semanticTokens,
    tokens: { colors: { gray: { 500: { value: "#808080" } } } },
  });
}

describe("defineTheme", () => {
  it("keeps the name the theme is switched by", () => {
    expect(defineTheme({ name: "fathom", semanticTokens }).name).toBe("fathom");
  });

  it("names no font package when the theme names none", () => {
    expect(defineTheme({ name: "fathom", semanticTokens }).fonts).toStrictEqual([]);
  });

  it("names the font packages the theme named", () => {
    expect(root().fonts).toStrictEqual(["@f/base"]);
  });

  it("names the preset after the theme", () => {
    expect(root().preset.name).toBe("@stealthscale/theme-fathom");
  });

  it("puts every value under extend", () => {
    const { preset } = root();

    expect(preset.theme?.extend?.semanticTokens).toBe(semanticTokens);
    expect(preset.theme?.semanticTokens).toBeUndefined();
  });

  it("carries a recipe extension into the preset", () => {
    const theme = defineTheme({
      name: "fathom",
      recipes: { button: { variants: { variant: { solid: { letterSpacing: "wide" } } } } },
      semanticTokens,
    });

    expect(Object.keys(theme.preset.theme?.extend?.recipes ?? {})).toStrictEqual(["button"]);
  });

  it("carries a slot recipe extension under its own key", () => {
    const theme = defineTheme({
      name: "fathom",
      semanticTokens,
      slotRecipes: { dialog: { base: { content: { boxShadow: "lg" } } } },
    });

    expect(Object.keys(theme.preset.theme?.extend?.slotRecipes ?? {})).toStrictEqual(["dialog"]);
  });

  it("leaves recipe extensions out of the variant", () => {
    const theme = defineTheme({
      name: "fathom",
      recipes: { button: { base: { fontWeight: "bold" } } },
      semanticTokens,
    });

    expect(Reflect.get(theme.variant, "recipes")).toBeUndefined();
  });

  it("carries the compositions into the preset and not the variant", () => {
    const theme = defineTheme({
      animationStyles: { pop: { value: { animationName: "scale-in" } } },
      layerStyles: { card: { value: { background: "bg.panel" } } },
      name: "folio",
      semanticTokens,
      textStyles: { md: { value: { fontSize: "1.0625rem" } } },
    });

    expect(Object.keys(theme.preset.theme?.extend ?? {})).toStrictEqual([
      "animationStyles",
      "layerStyles",
      "semanticTokens",
      "textStyles",
    ]);
    expect(Reflect.get(theme.variant, "textStyles")).toBeUndefined();
  });

  it("carries a hosted face and a global style into the preset", () => {
    const theme = defineTheme({
      fontface: { Acme: [{ src: "url(acme.woff2)" }] },
      globalCss: { body: { letterSpacing: "wide" } },
      name: "fathom",
      semanticTokens,
    });

    expect(theme.preset.globalFontface).toBeDefined();
    expect(theme.preset.globalCss).toBeDefined();
  });

  it("states neither a face nor a global style when the theme states neither", () => {
    const { preset } = defineTheme({ name: "fathom", semanticTokens });

    expect(preset.globalFontface).toBeUndefined();
    expect(preset.globalCss).toBeUndefined();
  });

  it("carries the tokens and the semantic tokens into the variant", () => {
    const { variant } = root();

    expect(variant.semanticTokens).toBe(semanticTokens);
    expect(variant.tokens?.colors?.["gray"]).toStrictEqual({ 500: { value: "#808080" } });
  });

  it("states empty tokens in the variant when the theme states none", () => {
    expect(defineTheme({ name: "fathom", semanticTokens }).variant.tokens).toStrictEqual({});
  });

  it("nests the parent's preset under a derived theme", () => {
    const parent = root();

    expect(defineTheme({ extends: parent, name: "abyss" }).preset.presets).toStrictEqual([
      parent.preset,
    ]);
  });

  it("keeps a derived theme's own name", () => {
    expect(defineTheme({ extends: root(), name: "abyss" }).name).toBe("abyss");
  });

  it("names the parent's font packages beside a derived theme's own once each", () => {
    const theme = defineTheme({ extends: root(), fonts: ["@f/base", "@f/own"], name: "abyss" });

    expect(theme.fonts).toStrictEqual(["@f/base", "@f/own"]);
  });

  it("inherits every variant value a derived theme leaves out", () => {
    const { variant } = defineTheme({ extends: root(), name: "abyss" });

    expect(variant.semanticTokens?.colors?.["primary"]).toBeDefined();
    expect(variant.tokens?.colors?.["gray"]).toStrictEqual({ 500: { value: "#808080" } });
  });

  it("merges a derived theme's variant over its parent's key by key", () => {
    const { variant } = defineTheme({
      extends: root(),
      name: "abyss",
      tokens: { colors: { gray: { 500: { value: "#ffffff" } } } },
    });

    expect(variant.tokens?.colors?.["gray"]).toStrictEqual({ 500: { value: "#ffffff" } });
    expect(variant.semanticTokens?.colors?.["primary"]).toBeDefined();
  });

  it("carries a derived theme's semantic tokens into its variant", () => {
    const { variant } = defineTheme({
      extends: root(),
      name: "abyss",
      semanticTokens: { radii: { l3: { value: "1rem" } } },
    });

    expect(variant.semanticTokens?.radii?.["l3"]).toStrictEqual({ value: "1rem" });
    expect(variant.semanticTokens?.radii?.["l1"]).toBeDefined();
  });

  it("carries a derived theme's recipe extensions in its own preset", () => {
    const theme = defineTheme({
      extends: root(),
      name: "abyss",
      recipes: { button: { base: { fontWeight: "bold" } } },
    });

    expect(Object.keys(theme.preset.theme?.extend?.recipes ?? {})).toStrictEqual(["button"]);
  });

  it("refuses a compound matched on a value a class name cannot carry", () => {
    const written = (): Theme =>
      defineTheme({
        extends: root(),
        name: "abyss",
        recipes: {
          button: { compoundVariants: [{ css: { fontWeight: "bold" }, size: { color: "fg" } }] },
        },
      });

    expect(written).toThrow(
      "button is extended with a compound matched on a value a class name cannot carry",
    );
  });

  it("takes a compound whose every value a class name carries", () => {
    const theme = defineTheme({
      extends: root(),
      name: "abyss",
      slotRecipes: {
        card: { compoundVariants: [{ css: { root: { fontWeight: "bold" } }, size: "lg" }] },
      },
    });

    expect(Object.keys(theme.preset.theme?.extend?.slotRecipes ?? {})).toStrictEqual(["card"]);
  });
});
