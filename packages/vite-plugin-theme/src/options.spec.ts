import { describe, expect, it } from "vitest";

import {
  layerDeclaration,
  layerPattern,
  resolveOptions,
  SEPARATOR,
  THEME_ATTRIBUTE,
} from "#options.ts";

describe("options", () => {
  it("names the attribute a theme is switched under without naming the compiler", () => {
    expect(THEME_ATTRIBUTE).toBe("data-theme");
  });

  it("separates an axis from its value with the compiler's underscore", () => {
    expect(SEPARATOR).toBe("_");
  });

  it("fills in every default when nothing is stated", () => {
    expect(resolveOptions()).toStrictEqual({
      include: ["src/**/*.{ts,tsx}"],
      layers: {
        base: "base",
        recipes: "recipes",
        reset: "reset",
        tokens: "tokens",
        utilities: "utilities",
      },
      stylesheet: "@stealthscale/theme/styles.css",
      systemPackage: "@stealthscale/theme",
    });
  });

  it("keeps the globs a repository states", () => {
    expect(resolveOptions({ include: ["app/**/*.tsx"] }).include).toStrictEqual(["app/**/*.tsx"]);
  });

  it("renames one layer over the default names", () => {
    expect(resolveOptions({ layers: { reset: "acme-reset" } }).layers).toStrictEqual({
      base: "base",
      recipes: "recipes",
      reset: "acme-reset",
      tokens: "tokens",
      utilities: "utilities",
    });
  });

  it("derives the stylesheet specifier from the system package", () => {
    expect(resolveOptions({ systemPackage: "@acme/design" }).stylesheet).toBe(
      "@acme/design/styles.css",
    );
  });

  it("declares the layers in the order the compiler writes them", () => {
    expect(layerDeclaration(resolveOptions().layers)).toBe(
      "@layer reset, base, tokens, recipes, utilities;",
    );
  });

  it("declares a renamed layer under its new name", () => {
    expect(layerDeclaration(resolveOptions({ layers: { tokens: "vars" } }).layers)).toBe(
      "@layer reset, base, vars, recipes, utilities;",
    );
  });

  it("recognises the declaration however its commas are spaced", () => {
    const pattern = layerPattern(resolveOptions().layers);

    expect(pattern.test("@layer reset, base, tokens, recipes, utilities;")).toBe(true);
    expect(pattern.test("@layer reset,base,tokens,recipes,utilities;")).toBe(true);
    expect(pattern.test("@layer reset , base , tokens , recipes , utilities ;")).toBe(true);
    expect(pattern.test("@layer reset, base, tokens, recipes;")).toBe(false);
  });

  it("recognises a renamed layer by its new name and by no other", () => {
    const pattern = layerPattern(resolveOptions({ layers: { tokens: "acme.vars" } }).layers);

    expect(pattern.test("@layer reset, base, acme.vars, recipes, utilities;")).toBe(true);
    expect(pattern.test("@layer reset, base, acmeXvars, recipes, utilities;")).toBe(false);
    expect(pattern.test("@layer reset, base, tokens, recipes, utilities;")).toBe(false);
  });
});
