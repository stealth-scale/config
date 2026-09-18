import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClasses, slotVariantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#search-input/context.ts";

describe("context", () => {
  it("draws the root's slot class on the element it binds", () => {
    const Root = withProvider("div", "root");
    const { container } = render(createElement(Root));

    expect(slotClasses(container, "search-input", "root")).toContain("search-input__root");
  });

  it("hands the root's size to a part below it", () => {
    const Root = withProvider("div", "root");
    const Clear = withContext("button", "clear");
    const { container } = render(createElement(Root, { size: "lg" }, createElement(Clear)));

    expect(slotClasses(container, "search-input", "clear")).toContain(
      slotVariantClass("search-input", "clear", "size", "lg"),
    );
  });
});
