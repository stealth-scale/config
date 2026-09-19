import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClass, slotClasses, variantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#page/context.ts";

describe("context", () => {
  it("draws the slot's class on an element it binds", () => {
    const Columned = withProvider("div", "root");
    const Banded = withContext("header", "header");
    const { container } = render(createElement(Columned, null, createElement(Banded)));

    expect(slotClasses(container, "page", "header")).toContain(slotClass("page", "header"));
  });

  it("hands the column's variants to a band below it", () => {
    const Columned = withProvider("div", "root");
    const Banded = withContext("header", "header");
    const { container } = render(createElement(Columned, { size: "lg" }, createElement(Banded)));

    expect(slotClasses(container, "page", "header")).toContain(
      variantClass(slotClass("page", "header"), "size", "lg"),
    );
  });
});
