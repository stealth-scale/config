import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClasses, variantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#input-group/context.ts";

describe("context", () => {
  it("draws the slot's class on an element it binds", () => {
    const Box = withProvider("div", "root");
    const Mark = withContext("div", "start");
    const { container } = render(createElement(Box, null, createElement(Mark, null, "€")));

    expect(slotClasses(container, "input-group", "start")).toContain("input-group__start");
  });

  it("hands the root's variants to a part below it", () => {
    const Box = withProvider("div", "root");
    const Mark = withContext("div", "start");
    const { container } = render(
      createElement(Box, { size: "lg" }, createElement(Mark, null, "€")),
    );

    expect(slotClasses(container, "input-group", "start")).toContain(
      variantClass("input-group__start", "size", "lg"),
    );
  });
});
