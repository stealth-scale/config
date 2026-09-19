import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClass, slotClasses, variantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#toolbar/context.ts";

describe("context", () => {
  it("draws the slot's class on an element it binds", () => {
    const Rowed = withProvider("div", "root");
    const Banded = withContext("div", "start");
    const { container } = render(createElement(Rowed, null, createElement(Banded)));

    expect(slotClasses(container, "toolbar", "start")).toContain(slotClass("toolbar", "start"));
  });

  it("hands the row's variants to a band below it", () => {
    const Rowed = withProvider("div", "root");
    const Ruled = withContext("div", "separator");
    const { container } = render(createElement(Rowed, { size: "lg" }, createElement(Ruled)));

    expect(slotClasses(container, "toolbar", "separator")).toContain(
      variantClass(slotClass("toolbar", "separator"), "size", "lg"),
    );
  });
});
