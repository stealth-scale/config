import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClasses, slotVariantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#collapsible/context.ts";

describe("context", () => {
  it("draws the root's slot class on the element it binds", () => {
    const Root = withProvider("div", "root");
    const { container } = render(createElement(Root));

    expect(slotClasses(container, "collapsible", "root")).toContain("collapsible__root");
  });

  it("hands the root's variants to a part below it", () => {
    const Root = withProvider("div", "root");
    const Trigger = withContext("button", "trigger");
    const { container } = render(createElement(Root, { size: "lg" }, createElement(Trigger)));

    expect(slotClasses(container, "collapsible", "trigger")).toContain(
      slotVariantClass("collapsible", "trigger", "size", "lg"),
    );
  });
});
