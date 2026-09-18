import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClasses, slotVariantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#grid/context.ts";

describe("context", () => {
  it("draws the root's slot class on the element it binds", () => {
    const Root = withProvider("div", "root");
    const { container } = render(createElement(Root, null, "One"));

    expect(slotClasses(container, "grid", "root")).toContain("grid__root");
  });

  it("hands the root's variants to an entry below it", () => {
    const Root = withProvider("div", "root");
    const Item = withContext("div", "item");
    const { container } = render(
      createElement(Root, { span: "2" }, createElement(Item, null, "One")),
    );

    expect(slotClasses(container, "grid", "item")).toContain(
      slotVariantClass("grid", "item", "span", "2"),
    );
  });
});
