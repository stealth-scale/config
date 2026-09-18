import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClasses, variantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#alert/context.ts";

describe("context", () => {
  it("draws the slot's class on an element it binds", () => {
    const Box = withProvider("div", "root");
    const Band = withContext("div", "content");
    const { container } = render(createElement(Box, null, createElement(Band, null, "a word")));

    expect(slotClasses(container, "alert", "content")).toContain("alert__content");
  });

  it("hands the root's variants to a part below it", () => {
    const Box = withProvider("div", "root");
    const Band = withContext("div", "content");
    const { container } = render(
      createElement(Box, { size: "lg" }, createElement(Band, null, "a word")),
    );

    expect(slotClasses(container, "alert", "root")).toContain(
      variantClass("alert__root", "size", "lg"),
    );
  });
});
