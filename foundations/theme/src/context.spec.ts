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
  variants: { size: { lg: { content: { padding: "8" } }, md: { content: { padding: "4" } } } },
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

    expect(container.firstElementChild?.className).toBe("button button--solid");
  });

  it("stamps the recipe's name on the element it binds", () => {
    const Button = createRecipeContext(button).withContext("button");
    const { container } = render(createElement(Button, null, "Go"));

    expect(container.querySelector("button")?.dataset["recipe"]).toBe("button");
  });

  it("draws the class of the variant a caller picks", () => {
    const Button = createRecipeContext(button).withContext("button");
    const { container } = render(createElement(Button, { variant: "ghost" }, "Go"));

    expect(container.firstElementChild?.className).toBe("button button--ghost");
  });

  it("returns the three factories a compound component is built from", () => {
    const bound = createSlotRecipeContext(dialog);

    expect(bound.withProvider).toBeTypeOf("function");
    expect(bound.withContext).toBeTypeOf("function");
    expect(bound.withRootProvider).toBeTypeOf("function");
  });

  it("draws a variant's class on the slot the value styles and on no other", () => {
    const { withContext, withProvider } = createSlotRecipeContext(dialog);
    const Content = withProvider("section", "content");
    const Title = withContext("h2", "title");
    const { container } = render(
      createElement(Content, { size: "lg" }, createElement(Title, null, "Hello")),
    );

    expect(container.firstElementChild?.className).toBe("dialog__content dialog__content--lg");
    expect(container.querySelector("h2")?.className).toBe("dialog__title");
  });

  it("stamps the recipe's name on the part that provides the variants", () => {
    const { withContext, withProvider } = createSlotRecipeContext(dialog);
    const Content = withProvider("section", "content");
    const Title = withContext("h2", "title");
    const { container } = render(createElement(Content, null, createElement(Title, null, "Hello")));

    expect(container.querySelector("section")?.dataset["recipe"]).toBe("dialog");
    expect(container.querySelector("h2")?.dataset["recipe"]).toBeUndefined();
  });

  it("writes each part's slot class and no slot attribute", () => {
    const { withContext, withProvider } = createSlotRecipeContext(dialog);
    const Content = withProvider("section", "content");
    const Title = withContext("h2", "title");
    const { container } = render(createElement(Content, null, createElement(Title, null, "Hello")));

    expect(container.querySelector("section")?.classList).toContain("dialog__content");
    expect(container.querySelector("section")?.dataset["slot"]).toBeUndefined();
    expect(container.querySelector("h2")?.classList).toContain("dialog__title");
    expect(container.querySelector("h2")?.dataset["slot"]).toBeUndefined();
  });

  it("stamps the recipe's name on a root provider that draws no slot of its own", () => {
    const { withRootProvider } = createSlotRecipeContext(dialog);
    const Root = withRootProvider("div");
    const { container } = render(createElement(Root, null, "Hello"));

    expect(container.querySelector("div")?.dataset["recipe"]).toBe("dialog");
  });

  it("keeps a default prop the caller states beside the recipe's name", () => {
    const { withProvider } = createSlotRecipeContext(dialog);
    const Content = withProvider("section", "content", { defaultProps: { role: "note" } });
    const { container } = render(createElement(Content, null, "Hello"));

    expect(container.querySelector("section")?.getAttribute("role")).toBe("note");
    expect(container.querySelector("section")?.dataset["recipe"]).toBe("dialog");
  });

  it("binds a recipe with no variants and no defaults", () => {
    const Tag = createRecipeContext(defineRecipe({ className: "tag" })).withContext("span");
    const { container } = render(createElement(Tag, null, "New"));

    expect(container.firstElementChild?.className).toBe("tag");
  });

  it("draws the class of a compound whose selection matches", () => {
    const Button = createRecipeContext(
      defineRecipe({
        className: "button",
        compoundVariants: [{ css: { fontWeight: "bold" }, variant: "solid" }],
        variants: { variant: { ghost: {}, solid: {} } },
      }),
    ).withContext("button");
    const solid = render(createElement(Button, { variant: "solid" }, "Go"));
    const ghost = render(createElement(Button, { variant: "ghost" }, "Go"));

    expect(solid.container.firstElementChild?.className).toBe(
      "button button--solid button--compound__variant-solid",
    );
    expect(ghost.container.firstElementChild?.className).toBe("button button--ghost");
  });

  it("binds a slot recipe with no variants and no defaults", () => {
    const Root = createSlotRecipeContext(
      defineSlotRecipe({ className: "card", slots: ["root"] }),
    ).withProvider("div", "root");
    const { container } = render(createElement(Root, null, "Body"));

    expect(container.firstElementChild?.className).toBe("card__root");
  });

  it("draws a compound's class without the class of a value it matches on that styles no slot", () => {
    const { withContext, withProvider } = createSlotRecipeContext(
      defineSlotRecipe({
        className: "card",
        compoundVariants: [
          { css: { title: { fontWeight: "bold" } }, name: "loud", size: ["lg", "md"] },
        ],
        slots: ["root", "title"],
        variants: { size: { lg: {}, md: {} } },
      }),
    );
    const Root = withProvider("div", "root");
    const Title = withContext("h2", "title");
    const { container } = render(
      createElement(Root, { size: "md" }, createElement(Title, null, "Hello")),
    );

    expect(container.firstElementChild?.className).toBe("card__root");
    expect(container.querySelector("h2")?.className).toBe("card__title card__title--loud");
  });

  it("draws no compound class for a slot compound that carries no name", () => {
    const Root = createSlotRecipeContext({
      className: "card",
      compoundVariants: [{ css: { root: { fontWeight: "bold" } }, size: "lg" }],
      slots: ["root"],
      variants: { size: { lg: {}, md: {} } },
    }).withProvider("div", "root");
    const { container } = render(createElement(Root, { size: "lg" }, "Body"));

    expect(container.firstElementChild?.className).toBe("card__root");
  });

  it("draws the class of a slot compound on the slot it styles and on no other", () => {
    const { withContext, withProvider } = createSlotRecipeContext(
      defineSlotRecipe({
        className: "card",
        compoundVariants: [{ css: { title: { fontWeight: "bold" } }, size: "lg" }],
        slots: ["root", "title"],
        variants: { size: { lg: {}, md: {} } },
      }),
    );
    const Root = withProvider("div", "root");
    const Title = withContext("h2", "title");
    const { container } = render(
      createElement(Root, { size: "lg" }, createElement(Title, null, "Hello")),
    );

    expect(container.firstElementChild?.className).toBe("card__root");
    expect(container.querySelector("h2")?.className).toBe(
      "card__title card__title--compound__size-lg",
    );
  });
});
