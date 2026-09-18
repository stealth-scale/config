import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClass, slotClasses, variantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#field/context.ts";

describe("context", () => {
  it("draws the slot's class on an element it binds", () => {
    const Box = withProvider("div", "root");
    const Words = withContext("p", "helperText");
    const { container } = render(createElement(Box, null, createElement(Words, null, "A format")));

    expect(slotClasses(container, "field", "helperText")).toContain(
      slotClass("field", "helperText"),
    );
  });

  it("writes a slot's name in kebab case", () => {
    expect(slotClass("field", "helperText")).toBe("field__helper-text");
  });

  it("hands the root's variants to a part below it", () => {
    const Box = withProvider("div", "root");
    const Words = withContext("p", "helperText");
    const { container } = render(
      createElement(Box, { size: "lg" }, createElement(Words, null, "A format")),
    );

    expect(slotClasses(container, "field", "helperText")).toContain(
      variantClass(slotClass("field", "helperText"), "size", "lg"),
    );
  });
});
