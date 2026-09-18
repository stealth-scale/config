import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClasses, slotVariantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#roving-focus/context.ts";

describe("context", () => {
  it("draws the root's slot class on the element it binds", () => {
    const Root = withProvider("div", "root");
    const { container } = render(createElement(Root, null, "One"));

    expect(slotClasses(container, "roving-focus", "root")).toContain("roving-focus__root");
  });

  it("hands the root's orientation to no item because the item states none", () => {
    const Root = withProvider("div", "root");
    const Item = withContext("div", "item");
    const { container } = render(
      createElement(Root, { orientation: "vertical" }, createElement(Item, null, "One")),
    );

    expect(slotClasses(container, "roving-focus", "root")).toContain(
      slotVariantClass("roving-focus", "root", "orientation", "vertical"),
    );
    expect(slotClasses(container, "roving-focus", "item")).toStrictEqual(["roving-focus__item"]);
  });
});
