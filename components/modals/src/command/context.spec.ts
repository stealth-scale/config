import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClass, slotClasses, variantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#command/context.ts";

describe("context", () => {
  it("draws the slot's class on an element it binds", () => {
    const Panelled = withProvider("div", "root");
    const Banded = withContext("div", "control");
    const { container } = render(createElement(Panelled, null, createElement(Banded)));

    expect(slotClasses(container, "command", "control")).toContain(slotClass("command", "control"));
  });

  it("hands the panel's variants to a band below it", () => {
    const Panelled = withProvider("div", "root");
    const Banded = withContext("div", "control");
    const { container } = render(createElement(Panelled, { size: "lg" }, createElement(Banded)));

    expect(slotClasses(container, "command", "control")).toContain(
      variantClass(slotClass("command", "control"), "size", "lg"),
    );
  });
});
