import { describe, expect, it } from "vitest";

import { recipeClass, slotClass, slotVariantClass, variantClass } from "#classes.ts";

describe("classes", () => {
  it("writes the base class as the class name unchanged", () => {
    expect(recipeClass("button")).toBe("button");
  });

  it("writes a variant's class from the axis and the value", () => {
    expect(variantClass("button", "variant", "solid")).toBe("button--variant_solid");
  });

  it("writes a boolean variant's class", () => {
    expect(variantClass("button", "loading", true)).toBe("button--loading_true");
  });

  it("writes a numeric variant's class", () => {
    expect(variantClass("stack", "gap", 4)).toBe("stack--gap_4");
  });

  it("writes a slot's class from the class name and the slot", () => {
    expect(slotClass("dialog", "content")).toBe("dialog__content");
  });

  it("writes a slot variant's class on the slot", () => {
    expect(slotVariantClass("dialog", "content", "size", "lg")).toBe("dialog__content--size_lg");
  });
});
