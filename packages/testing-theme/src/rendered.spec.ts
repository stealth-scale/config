import { describe, expect, it } from "vitest";

import { classesOf, recipeClasses, recipeElement, slotClasses, slotElement } from "#rendered.ts";

function drawn(html: string): HTMLElement {
  const container = document.createElement("div");

  container.innerHTML = html;

  return container;
}

describe("rendered", () => {
  it("finds the element a recipe was applied to", () => {
    const container = drawn('<button data-recipe="button" class="button">Save</button>');

    expect(recipeElement(container, "button").tagName).toBe("BUTTON");
  });

  it("throws naming the recipe it could not find", () => {
    expect(() => recipeElement(drawn("<div></div>"), "button")).toThrow(/data-recipe="button"/u);
  });

  it("finds the element one slot was applied to", () => {
    const container = drawn('<div data-part="content" class="dialog__content"></div>');

    expect(slotElement(container, "content").className).toBe("dialog__content");
  });

  it("finds a slot named in camel case by the kebab-case part its anatomy stamps", () => {
    const container = drawn('<div data-part="item-indicator" class="menu__itemIndicator"></div>');

    expect(slotElement(container, "itemIndicator").className).toBe("menu__itemIndicator");
  });

  it("throws naming the part it could not find", () => {
    expect(() => slotElement(drawn("<div></div>"), "content")).toThrow(/data-part="content"/u);
  });

  it("lists every class an element carries sorted", () => {
    expect(classesOf(drawn('<i class="z a m"></i>').children[0] as Element)).toStrictEqual([
      "a",
      "m",
      "z",
    ]);
    expect(classesOf(drawn("<i></i>").children[0] as Element)).toStrictEqual([]);
  });

  it("lists the classes the element carrying a recipe was given", () => {
    const container = drawn(
      '<button data-recipe="button" class="button button--variant_solid"></button>',
    );

    expect(recipeClasses(container, "button")).toStrictEqual(["button", "button--variant_solid"]);
  });

  it("lists the classes one slot was given", () => {
    const container = drawn(
      '<div data-part="content" class="dialog__content dialog__content--size_lg"></div>',
    );

    expect(slotClasses(container, "content")).toStrictEqual([
      "dialog__content",
      "dialog__content--size_lg",
    ]);
  });
});
