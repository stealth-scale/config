import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { defineRecipe, defineSlotRecipe } from "#authoring/recipe.ts";
import { createRecipeContext, createSlotRecipeContext } from "#context.ts";

const button = defineRecipe({
  className: "button",
  defaultVariants: { variant: "solid" },
  variants: { variant: { ghost: {}, solid: {} } },
});

const dialog = defineSlotRecipe({
  className: "dialog",
  defaultVariants: { size: "md" },
  slots: ["content", "title"],
  variants: { size: { lg: {}, md: {} } },
});

describe("createRecipeContext", () => {
  it("returns the element factory and the provider", () => {
    const bound = createRecipeContext(button);

    expect(bound.withContext).toBeTypeOf("function");
    expect(bound.PropsProvider).toBeDefined();
    expect(bound.usePropsContext).toBeTypeOf("function");
  });

  it("draws the recipe's class and the default variant's class", () => {
    const Button = createRecipeContext(button).withContext("button");
    const { container } = render(createElement(Button, null, "Go"));

    expect(container.firstElementChild?.className).toBe("button button--variant_solid");
  });

  it("draws the class of the variant a caller picks", () => {
    const Button = createRecipeContext(button).withContext("button");
    const { container } = render(createElement(Button, { variant: "ghost" }, "Go"));

    expect(container.firstElementChild?.className).toBe("button button--variant_ghost");
  });

  it("returns the three factories a compound component is built from", () => {
    const bound = createSlotRecipeContext(dialog);

    expect(bound.withProvider).toBeTypeOf("function");
    expect(bound.withContext).toBeTypeOf("function");
    expect(bound.withRootProvider).toBeTypeOf("function");
  });

  it("draws each slot's class under the provider", () => {
    const { withContext, withProvider } = createSlotRecipeContext(dialog);
    const Content = withProvider("section", "content");
    const Title = withContext("h2", "title");
    const { container } = render(
      createElement(Content, { size: "lg" }, createElement(Title, null, "Hello")),
    );

    expect(container.firstElementChild?.className).toBe("dialog__content dialog__content--size_lg");
    expect(container.querySelector("h2")?.className).toBe("dialog__title dialog__title--size_lg");
  });

  it("binds a recipe with no variants and no defaults", () => {
    const Tag = createRecipeContext(defineRecipe({ className: "tag" })).withContext("span");
    const { container } = render(createElement(Tag, null, "New"));

    expect(container.firstElementChild?.className).toBe("tag");
  });

  it("carries the compound variants into the runtime recipe", () => {
    const Button = createRecipeContext(
      defineRecipe({
        className: "button",
        compoundVariants: [{ css: { fontWeight: "bold" }, variant: "solid" }],
        variants: { variant: { solid: {} } },
      }),
    ).withContext("button");
    const { container } = render(createElement(Button, { variant: "solid" }, "Go"));

    expect(container.firstElementChild?.className).toContain("button--variant_solid");
  });

  it("binds a slot recipe with no variants and no defaults", () => {
    const Root = createSlotRecipeContext(
      defineSlotRecipe({ className: "card", slots: ["root"] }),
    ).withProvider("div", "root");
    const { container } = render(createElement(Root, null, "Body"));

    expect(container.firstElementChild?.className).toBe("card__root");
  });

  it("carries the compound variants into the runtime slot recipe", () => {
    const Root = createSlotRecipeContext(
      defineSlotRecipe({
        className: "card",
        compoundVariants: [{ css: { root: { fontWeight: "bold" } }, size: "lg" }],
        slots: ["root"],
        variants: { size: { lg: {} } },
      }),
    ).withProvider("div", "root");
    const { container } = render(createElement(Root, { size: "lg" }, "Body"));

    expect(container.firstElementChild?.className).toContain("card__root--size_lg");
  });
});
