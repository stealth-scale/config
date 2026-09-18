import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClass, slotClasses, variantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#textarea/context.ts";

describe("context", () => {
  it("draws the slot's class on an element it binds", () => {
    const Box = withProvider("div", "root");
    const Typed = withContext("textarea", "control");
    const { container } = render(createElement(Box, null, createElement(Typed)));

    expect(slotClasses(container, "textarea", "control")).toContain(
      slotClass("textarea", "control"),
    );
  });

  it("hands the root's variants to the control below it", () => {
    const Box = withProvider("div", "root");
    const Typed = withContext("textarea", "control");
    const { container } = render(createElement(Box, { grip: "none" }, createElement(Typed)));

    expect(slotClasses(container, "textarea", "control")).toContain(
      variantClass(slotClass("textarea", "control"), "grip", "none"),
    );
  });
});
