import { describe, expect, it } from "vitest";

import {
  controlSizes,
  defineRecipe,
  defineSlotRecipe,
  interactive,
  lookVariants,
  stack,
  statusVariants,
} from "@stealthscale/theme/authoring";

import { recipeViolations } from "#recipe-checks.ts";

const button = defineRecipe({
  base: { ...interactive(), ...stack({ direction: "row", gap: "gap.sm" }) },
  className: "button",
  defaultVariants: { size: "md", variant: "solid" },
  variants: {
    size: controlSizes(["xs", "sm", "md", "lg", "xl"]),
    status: statusVariants(),
    variant: lookVariants(["solid", "subtle", "surface", "outline", "ghost", "plain"]),
  },
});

describe("recipeViolations", () => {
  it("passes a recipe built from the helpers", () => {
    expect(recipeViolations(button)).toStrictEqual([]);
  });

  it("reports a class name that is not kebab case", () => {
    expect(recipeViolations({ className: "Button" })).toStrictEqual([
      "recipe.className: Button is not a class name in kebab case",
    ]);
  });

  it.each([
    ["#fff", "writes the color #fff"],
    ["oklch(50% 0.1 200)", "writes the color oklch(50% 0.1 200)"],
    ["{colors.blue.500}", "references {colors.blue.500}"],
    ["blue.500", "names the ramp step blue.500"],
    ["blue.solid", "names the hue blue.solid"],
    ["red", "names the hue red"],
    ["white", "names white, which is not a semantic color token"],
    ["fg.mutd", "names fg.mutd, which is not a semantic color token"],
    ["colorPalette.nope", "reads colorPalette.nope, which is not a role of the palette"],
  ])("reports %s as a color a theme cannot move", (value, fault) => {
    expect(recipeViolations({ base: { color: value }, className: "x" })).toStrictEqual([
      `recipe.colors: x ${fault} at base.color`,
    ]);
  });

  it.each([
    "fg",
    "fg.muted/50",
    "colorPalette.solid.hover",
    "primary.fg",
    "transparent",
    "var(--ink)",
  ])("passes %s as a color", (value) => {
    expect(recipeViolations({ base: { background: value }, className: "x" })).toStrictEqual([]);
  });

  it("reports a palette that is a hue rather than an intent", () => {
    expect(recipeViolations({ base: { colorPalette: "blue" }, className: "x" })).toStrictEqual([
      "recipe.colors: x points colorPalette at blue at base.colorPalette, and a recipe names an intent",
    ]);
    expect(recipeViolations({ base: { colorPalette: "error" }, className: "x" })).toStrictEqual([]);
  });

  it.each([
    ["textStyle", "lable.md", "textStyles"],
    ["layerStyle", "fill.sold", "layerStyles"],
    ["animationStyle", "fade.inn", "animationStyles"],
    ["gap", "gap.smal", "spacing"],
    ["height", "controll.md", "sizes"],
    ["boxShadow", "shadows.nope", "shadows"],
  ])("reports %s set to %s as no %s token", (property, value, category) => {
    expect(recipeViolations({ base: { [property]: value }, className: "x" })).toStrictEqual([
      `recipe.tokens: x names ${value}, which is not a ${category} token at base.${property}`,
    ]);
  });

  it("reports a token function naming a size nothing defines", () => {
    expect(
      recipeViolations({ base: { flexBasis: "token(sizes.nope, nope)" }, className: "x" }),
    ).toStrictEqual([
      "recipe.tokens: x names token(sizes.nope, nope), which is not a sizes token at base.flexBasis",
    ]);
    expect(
      recipeViolations({ base: { flexBasis: "token(sizes.md, md)" }, className: "x" }),
    ).toStrictEqual([]);
  });

  it("reads a token function inside a calculation", () => {
    expect(
      recipeViolations({
        base: { flexBasis: "calc((token(sizes.nope, nope) - 100%) * 999)" },
        className: "x",
      }),
    ).toStrictEqual([
      "recipe.tokens: x names calc((token(sizes.nope, nope) - 100%) * 999), which is not a sizes token at base.flexBasis",
    ]);
  });

  it("passes a value that is not a token on a property that takes a keyword", () => {
    expect(
      recipeViolations({
        base: { boxShadow: "none", height: "auto", width: "100%" },
        className: "x",
      }),
    ).toStrictEqual([]);
  });

  it("reports a condition nothing defines", () => {
    expect(recipeViolations({ base: { _hovr: { color: "fg" } }, className: "x" })).toStrictEqual([
      "recipe.conditions: x nests under _hovr at base._hovr, which is not a condition",
    ]);
  });

  it("reports a length in a unit a theme cannot move", () => {
    expect(recipeViolations({ base: { paddingInline: "4px" }, className: "x" })).toStrictEqual([
      "recipe.lengths: x sets paddingInline to 4px at base.paddingInline, a length in px, rem or pt",
    ]);
    expect(recipeViolations({ base: { inset: "calc(1rem + 2%)" }, className: "x" })).toHaveLength(
      1,
    );
  });

  it("passes a length on a property the specification allows one on", () => {
    expect(
      recipeViolations(
        { base: { paddingInline: "4px" }, className: "x" },
        { lengths: ["paddingInline"] },
      ),
    ).toStrictEqual([]);
  });

  it("passes a length in a unit that scales", () => {
    expect(
      recipeViolations({ base: { inset: "0", minHeight: "100dvh", width: "50%" }, className: "x" }),
    ).toStrictEqual([]);
  });

  it("reports a color mode the recipe switches on", () => {
    expect(recipeViolations({ base: { _dark: { color: "fg" } }, className: "x" })).toStrictEqual([
      "recipe.modes: x switches on the color mode at base._dark",
    ]);
  });

  it("reports a slot the anatomy stamps no part for and a part no slot styles", () => {
    const dialog = defineSlotRecipe({ className: "dialog", slots: ["content", "extra"] });

    expect(recipeViolations(dialog, { parts: ["content", "title"] })).toStrictEqual([
      "recipe.slots: dialog styles extra, which the anatomy stamps no part for",
      "recipe.slots: dialog styles no slot for the part title",
    ]);
  });

  it("reports every part when the recipe styles no slot", () => {
    expect(recipeViolations({ className: "x" }, { parts: ["root"] })).toStrictEqual([
      "recipe.slots: x styles no slot for the part root",
    ]);
  });

  it("checks the tokens against the preset it is handed", () => {
    expect(
      recipeViolations(
        { base: { color: "fg", textStyle: "label.md" }, className: "x" },
        { preset: { name: "bare" } },
      ),
    ).toStrictEqual([
      "recipe.colors: x names fg, which is not a semantic color token at base.color",
      "recipe.tokens: x names label.md, which is not a textStyles token at base.textStyle",
    ]);
  });

  it("passes over a compound variant that is not an object", () => {
    expect(recipeViolations({ className: "x", compoundVariants: [null] })).toStrictEqual([]);
  });

  it("reports the subtle ink written as a text color", () => {
    expect(recipeViolations({ base: { color: "fg.subtle" }, className: "x" })).toStrictEqual([
      "recipe.subtle: x sets color to fg.subtle at base.color, which clears the boundary ratio and not the text ratio",
    ]);
  });

  it("leaves out a check skipped with a reason", () => {
    expect(
      recipeViolations(
        { base: { color: "#fff" }, className: "x" },
        { skip: { "recipe.colors": "a reason" } },
      ),
    ).toStrictEqual([]);
  });

  it("reports a skip that gives no reason", () => {
    expect(recipeViolations({ className: "x" }, { skip: { "recipe.colors": " " } })).toStrictEqual([
      "skip of recipe.colors gives no reason",
    ]);
  });
});
