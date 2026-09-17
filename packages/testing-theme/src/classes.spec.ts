import { describe, expect, it } from "vitest";

import { compoundClass, recipeClass, slotClass, slotVariantClass, variantClass } from "#classes.ts";

describe("classes", () => {
  it("writes the base class as the class name unchanged", () => {
    expect(recipeClass("button")).toBe("button");
  });

  it("writes a variant's class from the class name and the value", () => {
    expect(variantClass("button", "variant", "solid")).toBe("button--solid");
  });

  it("writes a boolean variant's class from the axis at true and nothing at false", () => {
    expect(variantClass("button", "loading", true)).toBe("button--loading");
    expect(variantClass("button", "loading", false)).toBe("");
  });

  it("writes a numeric variant's class", () => {
    expect(variantClass("stack", "gap", 4)).toBe("stack--4");
  });

  it("writes a slot's class from the class name and the slot", () => {
    expect(slotClass("dialog", "content")).toBe("dialog__content");
  });

  it("writes a slot variant's class on the slot", () => {
    expect(slotVariantClass("dialog", "content", "size", "lg")).toBe("dialog__content--lg");
  });

  it("writes a compound's class from the name its recipe gave it", () => {
    expect(compoundClass("button", "hero")).toBe("button--hero");
  });
});
